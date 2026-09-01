<?php

return [

    /*
    |--------------------------------------------------------------------------
    | WAF Global Toggle
    |--------------------------------------------------------------------------
    |
    | Controls whether the Web Application Firewall is active.
    | When disabled, your middleware can skip all inspection and allow
    | requests to proceed normally.
    |
    | Usage:
    |   config('waf.enabled')
    |
    */

    'enabled' => false,

    /*
    |--------------------------------------------------------------------------
    | IP Allowlist
    |--------------------------------------------------------------------------
    |
    | These IP addresses are exempt from WAF checks.
    | This is useful for local development, trusted admin networks,
    | health checks, or internal services.
    |
    | Usage:
    |   config('waf.allowlist')
    |
    | Notes:
    | - Keep this list as small as possible.
    | - Use exact IP strings, since the middleware checks them directly.
    |
    */

    'allowlist' => [
        '127.0.0.1',
        '::1',
    ],

    /*
    |--------------------------------------------------------------------------
    | Scoring Rules
    |--------------------------------------------------------------------------
    |
    | The WAF assigns points to suspicious activity.
    | Each request may accumulate score from user-agent patterns, path
    | probing, query-string signatures, and burst behavior.
    |
    | Once the score reaches the threshold, the IP is blocked.
    |
    | Usage:
    |   config('waf.score.threshold')
    |   config('waf.score.ttl_seconds')
    |
    */

    'score' => [
        /*
        |----------------------------------------------------------------------
        | Block Threshold
        |----------------------------------------------------------------------
        |
        | The minimum score required before an IP is blocked.
        | Higher values make the firewall less aggressive.
        | Lower values block suspicious clients faster.
        |
        */

        'threshold' => 40,

        /*
        |----------------------------------------------------------------------
        | Score Time To Live
        |----------------------------------------------------------------------
        |
        | How long a request score remains active in cache.
        | After this duration, old scoring data expires automatically.
        |
        | This prevents a client from being punished forever for older events.
        |
        */

        'ttl_seconds' => 21_600, // 6 hours
    ],

    /*
    |--------------------------------------------------------------------------
    | Block Rules
    |--------------------------------------------------------------------------
    |
    | Controls how long a blocked IP remains blocked.
    | The middleware stores the block entry in cache and expires it after
    | this duration.
    |
    | Usage:
    |   config('waf.block.ttl_seconds')
    |
    */

    'block' => [
        /*
        |----------------------------------------------------------------------
        | Block Time To Live
        |----------------------------------------------------------------------
        |
        | How long the IP stays on the blocklist before the entry expires.
        | A longer value makes the WAF more strict.
        | A shorter value gives clients a faster chance to recover.
        |
        */

        'ttl_seconds' => 86_400, // 24 hours
    ],

    /*
    |--------------------------------------------------------------------------
    | Traffic Burst Detection
    |--------------------------------------------------------------------------
    |
    | Helps the WAF detect rapid-fire request patterns from the same IP.
    | This is useful for abuse, scanners, brute force behavior, and bots.
    |
    | The middleware counts requests per IP in the given window and
    | adds extra score if the threshold is exceeded.
    |
    | Usage:
    |   config('waf.traffic.hit_window_seconds')
    |   config('waf.traffic.hit_threshold')
    |
    */

    'traffic' => [
        /*
        |----------------------------------------------------------------------
        | Hit Window Seconds
        |----------------------------------------------------------------------
        |
        | Time window used to count requests per IP.
        | Example: 300 seconds means "count requests in the last 5 minutes".
        |
        */

        'hit_window_seconds' => 300,

        /*
        |----------------------------------------------------------------------
        | Hit Threshold
        |----------------------------------------------------------------------
        |
        | Number of requests from the same IP allowed during the hit window
        | before burst scoring is applied.
        |
        */

        'hit_threshold' => 120,
    ],

    /*
    |--------------------------------------------------------------------------
    | Sync Settings
    |--------------------------------------------------------------------------
    |
    | Defines how often the WAF may rewrite the managed block section in
    | the .htaccess file.
    |
    | The middleware uses these settings to avoid rewriting too frequently
    | when many suspicious requests arrive at once.
    |
    | Usage:
    |   config('waf.sync.interval_seconds')
    |   config('waf.sync.managed_begin')
    |   config('waf.sync.managed_end')
    |
    */

    'sync' => [
        /*
        |----------------------------------------------------------------------
        | Sync Interval Seconds
        |----------------------------------------------------------------------
        |
        | Minimum time between filesystem sync attempts.
        | Prevents repeated .htaccess writes in a short period.
        |
        */

        'interval_seconds' => 1,

        /*
        |----------------------------------------------------------------------
        | Managed Block Markers
        |----------------------------------------------------------------------
        |
        | These markers surround the section controlled by the WAF.
        | The middleware will replace only the content between these markers.
        |
        | Keep them stable so the merge logic can find the managed block.
        |
        */

        'managed_begin' => '# BEGIN LARAVEL WAF',
        'managed_end'   => '# END LARAVEL WAF',
    ],

    /*
    |--------------------------------------------------------------------------
    | Detection Rules
    |--------------------------------------------------------------------------
    |
    | These signature lists define what the WAF considers suspicious.
    | Each entry maps a pattern to a score weight.
    |
    | The middleware scans:
    | - User-Agent header
    | - Request path
    | - Query string
    |
    | If a pattern is found, its score is added to the request total.
    |
    | Usage:
    |   config('waf.rules.user_agent')
    |   config('waf.rules.path')
    |   config('waf.rules.query')
    |
    */

    'rules' => [

        /*
        |----------------------------------------------------------------------
        | User-Agent Signatures
        |----------------------------------------------------------------------
        |
        | Known scanners, probes, and automated tools.
        | The middleware looks for these strings inside the User-Agent header.
        |
        | Lower scores usually mean "suspicious but not certain".
        | Higher scores mean "very likely automated scanning".
        |
        */

        'user_agent' => [
            'sqlmap' => 20,
            'nikto' => 18,
            'acunetix' => 18,
            'masscan' => 18,
            'nmap' => 10,
            'wpscan' => 15,
            'tlm-audit-scanner' => 25,
        ],

        /*
        |----------------------------------------------------------------------
        | Path Signatures
        |----------------------------------------------------------------------
        |
        | Common probing paths used to find vulnerable apps, admin panels,
        | exposed files, debug endpoints, and sensitive directories.
        |
        | The middleware checks the request path against these values.
        |
        */

        'path' => [
            '/wp-admin' => 20,
            '/wp-login.php' => 20,
            '/xmlrpc.php' => 20,
            '/phpmyadmin' => 25,
            '/pma' => 20,
            '/.env' => 30,
            '/vendor/' => 12,
            '/_ignition' => 12,
            '/storage/logs' => 12,
        ],

        /*
        |----------------------------------------------------------------------
        | Query String Signatures
        |----------------------------------------------------------------------
        |
        | Common injection payload fragments or attack indicators found in
        | the URL query string.
        |
        | The middleware reads the query string, normalizes it to lowercase,
        | and searches for these fragments.
        |
        */

        'query' => [
            'union select' => 20,
            'sleep(' => 18,
            'benchmark(' => 18,
            'or 1=1' => 18,
            '<script' => 18,
            '../' => 15,
            '%2e%2e%2f' => 15,
            'base64_decode' => 15,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Rewrite Rules
    |--------------------------------------------------------------------------
    |
    | These rules are written into the managed .htaccess block.
    | They give Apache an additional layer of blocking for known bad paths
    | and user-agent patterns, even before the request reaches Laravel.
    |
    | Usage:
    |   config('waf.rewrite.static_rules')
    |
    */

    'rewrite' => [
        'static_rules' => [
            'RewriteCond %{REQUEST_URI} ^/wp-admin [NC,OR]',
            'RewriteCond %{REQUEST_URI} ^/wp-login\.php [NC,OR]',
            'RewriteCond %{REQUEST_URI} ^/xmlrpc\.php [NC,OR]',
            'RewriteCond %{REQUEST_URI} ^/phpmyadmin [NC,OR]',
            'RewriteCond %{REQUEST_URI} ^/\.env [NC]',
            'RewriteRule .* - [F,L]',
            'RewriteCond %{HTTP_USER_AGENT} (sqlmap|nikto|acunetix|masscan|nmap|wpscan|TLM-Audit-Scanner) [NC]',
            'RewriteRule .* - [F,L]',
            "",
            "<IfModule mod_negotiation.c>",
            "   Options -MultiViews -Indexes",
            "</IfModule>",
            "",
            "# Handle Authorization Header",
            "RewriteCond %{HTTP:Authorization} .",
            "RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]",
            "",
            "# Handle X-XSRF-Token Header",
            "RewriteCond %{HTTP:x-xsrf-token} .",
            "RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]",
            "",
            "# Redirect Trailing Slashes If Not A Folder...",
            "RewriteCond %{REQUEST_FILENAME} !-d",
            "RewriteCond %{REQUEST_URI} (.+)/$",
            "RewriteRule ^ %1 [L,R=301]",
            "",
            "# Send Requests To Front Controller...",
            "RewriteCond %{REQUEST_FILENAME} !-d",
            "RewriteCond %{REQUEST_FILENAME} !-f",
            "RewriteRule ^ index.php [L]",
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Optional Extra Weights
    |--------------------------------------------------------------------------
    |
    | These values are not required, but they make tuning easier.
    | They let you adjust generic behavior without changing code.
    |
    | Usage examples:
    |   config('waf.weights.burst')
    |   config('waf.weights.found_404')
    |
    */

    'weights' => [
        'burst' => 15,
        'http_codes' => [
            404 => 1,
        ],
    ],
];
