<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class DetectDevRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        define('APP_DEVMODE', str_starts_with($host, 'dev.'));
        if(APP_DEVMODE) {
            Config::set('database.default', "segdev");
            DB::setDefaultConnection("segdev");
        }
        return $next($request);
    }
}
