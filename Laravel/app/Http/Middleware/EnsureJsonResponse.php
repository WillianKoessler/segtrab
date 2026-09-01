<?php // app/Http/Middleware/EnsureJsonResponse.php

namespace App\Http\Middleware;

use Illuminate\Http\JsonResponse;

class EnsureJsonResponse
{
    /**
     * Handles the request
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return \Illuminate\Http\Response
     */
    public function handle($request, $next)
    {
        $request->headers->set('Accept', 'application/json');

        $response = $next($request);

        if (!($response instanceof JsonResponse) && str_contains((string)$response->headers->get('Content-Type'), 'text/html')) {
            return response()->json([
                'status' => $response->getStatusCode(),
                'data' => $response->getContent()
            ]);
        }

        return $response;
    }
}
