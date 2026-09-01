<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

class WebApplicationFirewall
{
    private const CACHE_PREFIX = 'waf:';
    private const BLOCKLIST_KEY = 'waf:blocklist';
    private const LAST_SYNC_KEY = 'waf:last_sync';
    private const DIRTY_KEY = 'waf:dirty';

    public function handle(Request $request, Closure $next): Response
    {
        $ip = (string) $request->ip();

        if (!config('waf.enabled') || $ip === '' || $this->isAllowlisted($ip))
            return $next($request);

        $now = time();
        
        if ($this->isBlocked($ip, $now))
            abort(403);

        $signals = $this->scoreRequest($request);

        if ($signals['score'] > 0) {
            $this->bumpScore($ip, $signals['score'], $signals['reason']);

            $currentScore = $this->getScore($ip);

            if ($currentScore >= config('waf.score.threshold'))
                $this->blockIp($ip, $signals['reason'] ?? 'behavioral_threshold');
        }

        $this->bumpHitWindow($ip);

        $response = $next($request);

        $httpCode = $response->getStatusCode();
        $scoredCodes = config('waf.weights.http_codes');
        if (array_key_exists($httpCode, $scoredCodes))
            $this->bumpScore($ip, $scoredCodes[$httpCode], (string)$httpCode);

        if ($httpCode === 404 || $signals['dirty'])
            $this->maybeSyncHtaccess();

        return $response;
    }

    private function scoreRequest(Request $request): array
    {
        $score = 0;
        $reasons = [];
        $dirty = false;

        $ua = strtolower((string) $request->userAgent());
        foreach (config('waf.rules.user_agent') as $needle => $points) {
            if ($ua !== '' && str_contains($ua, $needle)) {
                $score += $points;
                $reasons[] = "ua:$needle";
                $dirty = true;
            }
        }

        $path = '/' . ltrim($request->path(), '/');
        foreach (config('waf.rules.path') as $needle => $points) {
            if (str_contains(strtolower($path), $needle)) {
                $score += $points;
                $reasons[] = "path:$needle";
                $dirty = true;
            }
        }

        $query = strtolower((string) $request->getQueryString());
        foreach (config('waf.rules.query') as $needle => $points) {
            if ($query !== '' && str_contains($query, $needle)) {
                $score += $points;
                $reasons[] = "q:$needle";
                $dirty = true;
            }
        }

        $hits = $this->getHitWindowCount($request->ip() ?? '');
        if ($hits >= config('waf.traffic.hit_threshold')) {
            $score += 15;
            $reasons[] = 'burst';
            $dirty = true;
        }

        return [
            'score' => $score,
            'reason' => $reasons ? implode(',', $reasons) : null,
            'dirty' => $dirty,
        ];
    }

    private function isAllowlisted(string $ip): bool
    {
        return in_array($ip, config('waf.allowlist'), true);
    }

    private function isBlocked(string $ip, int $now): bool
    {
        $blocklist = Cache::get(self::BLOCKLIST_KEY, []);

        if (!is_array($blocklist) || !isset($blocklist[$ip]))
            return false;

        $entry = $blocklist[$ip];

        if (!is_array($entry) || !isset($entry['expires_at']))
            return false;

        if ((int) $entry['expires_at'] < $now) {
            unset($blocklist[$ip]);
            Cache::put(self::BLOCKLIST_KEY, $blocklist, now()->addDays(2));
            return false;
        }

        return true;
    }

    private function blockIp(string $ip, string $reason = 'behavioral_threshold'): void
    {
        $blocklist = Cache::get(self::BLOCKLIST_KEY, []);
        if (!is_array($blocklist))
            $blocklist = [];

        $blocklist[$ip] = [
            'reason' => $reason,
            'score' => $this->getScore($ip),
            'blocked_at' => time(),
            'expires_at' => time() + config('waf.block.ttl_seconds'),
        ];

        Cache::put(self::BLOCKLIST_KEY, $blocklist, now()->addDays(2));
        Cache::put(self::DIRTY_KEY, 1, now()->addHours(6));
        $this->maybeSyncHtaccess();
    }

    private function bumpScore(string $ip, int $points, ?string $reason = null): void
    {
        $key = $this->scoreKey($ip);
        $current = (int) Cache::get($key, 0);
        $updated = $current + $points;
        $score_ttl = config('waf.score.ttl_seconds');

        Cache::put($key, $updated, now()->addSeconds($score_ttl));

        if ($reason !== null)
            Cache::put($this->reasonKey($ip), $reason, now()->addSeconds($score_ttl));

        if ($updated >= config('waf.score.threshold'))
            Cache::put(self::DIRTY_KEY, 1, now()->addHours(6));
    }

    private function getScore(string $ip): int
    {
        return (int) Cache::get($this->scoreKey($ip), 0);
    }

    private function bumpHitWindow(string $ip): void
    {
        if ($ip === '')
            return;

        $key = $this->hitKey($ip);
        $current = (int) Cache::get($key, 0);
        Cache::put($key, $current + 1, now()->addSeconds(config('waf.traffic.hit_window_seconds')));
    }

    private function getHitWindowCount(string $ip): int
    {
        if ($ip === '')
            return 0;

        return (int) Cache::get($this->hitKey($ip), 0);
    }

    private function maybeSyncHtaccess(): void
    {
        $dirty = (int) Cache::get(self::DIRTY_KEY, 0) === 1;
        $lastSync = (int) Cache::get(self::LAST_SYNC_KEY, 0);
        $now = time();

        if (! $dirty && ($now - $lastSync) < config('waf.sync.interval_seconds'))
            return;

        $lockPath = storage_path('app/waf/.sync.lock');
        $lockDir = dirname($lockPath);

        if (! File::exists($lockDir))
            File::makeDirectory($lockDir, 0755, true);

        $handle = fopen($lockPath, 'c+');

        if ($handle === false)
            return;

        try {
            if (! flock($handle, LOCK_EX | LOCK_NB))
                return;

            $blocklist = Cache::get(self::BLOCKLIST_KEY, []);
            if (!is_array($blocklist))
                $blocklist = [];

            $blocklist = $this->pruneExpiredBlocks($blocklist);

            Cache::put(self::BLOCKLIST_KEY, $blocklist, now()->addDays(2));

            $target = public_path('.htaccess');
            $current = File::exists($target) ? File::get($target) : '';
            $generated = $this->renderManagedBlock($blocklist);

            $updated = $this->mergeManagedBlock($current, $generated);

            $temp = $target . '.tmp';

            File::put($temp, $updated);

            @rename($temp, $target);

            Cache::put(self::LAST_SYNC_KEY, $now, now()->addDays(2));
            Cache::forget(self::DIRTY_KEY);
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    private function pruneExpiredBlocks(array $blocklist): array
    {
        $now = time();

        foreach ($blocklist as $ip => $entry)
            if (!is_array($entry) || !isset($entry['expires_at']) || (int) $entry['expires_at'] < $now)
                unset($blocklist[$ip]);

        return $blocklist;
    }

    private function renderManagedBlock(array $blocklist): string
    {
        $lines = [];
        $lines[] = config('waf.sync.managed_begin');
        $lines[] = '<IfModule mod_rewrite.c>';
        $lines[] = 'RewriteEngine On';

        foreach ($this->staticDenyRules() as $rule)
            $lines[] = $rule;

        foreach ($blocklist as $ip => $entry) {
            $safeIp = preg_quote((string) $ip, '/');
            $reason = isset($entry['reason']) ? (string) $entry['reason'] : 'blocked';
            $reason = preg_replace('/[^a-zA-Z0-9,_:-]/', '', $reason) ?: 'blocked';

            $lines[] = sprintf('# %s', $reason);
            $lines[] = sprintf('RewriteCond %%{REMOTE_ADDR} ^%s$', $safeIp);
            $lines[] = 'RewriteRule .* - [F,L]';
        }

        $lines[] = '</IfModule>';
        $lines[] = config('waf.sync.managed_end');

        return implode(PHP_EOL, $lines) . PHP_EOL;
    }

    private function staticDenyRules(): array
    {
        return config('waf.rewrite.static_rules');
    }

    private function mergeManagedBlock(string $current, string $generated): string
    {
        $begin = preg_quote(config('waf.sync.managed_begin'), '/');
        $end = preg_quote(config('waf.sync.managed_end'), '/');

        if (preg_match("/^.*?{$begin}.*?{$end}\\R?/ms", $current)) {
            $current = preg_replace(
                "/^.*?{$begin}.*?{$end}\\R?/ms",
                $generated,
                $current
            ) ?? $current;

            return $current;
        }

        $current = rtrim($current);

        if ($current !== '')
            $current .= PHP_EOL . PHP_EOL;

        return $current . $generated;
    }

    private function scoreKey(string $ip): string
    {
        return self::CACHE_PREFIX . 'score:' . $ip;
    }

    private function reasonKey(string $ip): string
    {
        return self::CACHE_PREFIX . 'reason:' . $ip;
    }

    private function hitKey(string $ip): string
    {
        return self::CACHE_PREFIX . 'hits:' . $ip;
    }
}
