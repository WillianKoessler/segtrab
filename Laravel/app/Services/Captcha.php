<?php

namespace App\Services;

use RuntimeException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\HtmlString;

class Captcha
{
    /**
     * Retrieves the captcha validation rule.
     * 
     * @return array
     */
    public function rule()
    {
        $vendor = $this->vendor();
        return match ($vendor) {
            'cloudflare' => $this->cloudflareVerify(),
            default => throw new RuntimeException("Unknown vendor '$vendor'"),
        };
    }

    /**
     * Returns the captcha's HTML code
     * 
     * @return HtmlString
     */
    public function render() {
        $vendor = $this->vendor();
        return match($vendor) {
            'cloudflare' => $this->cloudflareRender(),
            default => throw new RuntimeException("Unknown vendor '$vendor'"),
        };
    }

    private function vendor()
    {
        $vendor = config('services.captcha.vendor');
        if (!$vendor)
            throw new RuntimeException("Captcha vendor missing");
        return $vendor;
    }

    private function cloudflareVerify()
    {
        return ['cf-turnstile-response' => ['required', function ($attribute, $value, $fail) {
            $url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

            $data = [
                'secret' => config('services.captcha.secret_key'),
                'response' => $value,
            ];

            $ip = request()?->ip();
            if ($ip) $data['remoteip'] = $ip;

            $response = Http::asForm()->post($url, $data);

            if($response->failed()) {
                report($response->toException());
                $fail(__('auth.captcha.error'));
                return;
            }

            $data = $response->json();

            if(!($data['success'] ?? false))
                $fail(__('auth.captcha.fail'));
        }]];
    }

    private function cloudflareRender()
    {
        $siteKey = config('services.captcha.site_key');
        return new HtmlString("<div class='cf-turnstile' data-sitekey='$siteKey'></div>");
    }
}
