<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpFoundation\Response;

if (!defined('LARAVEL_DIR'))
    define('LARAVEL_DIR', __DIR__ . '/..');

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;

if (!function_exists('ExceptionJsonSerializer')) {
    /**
     * Serializes an exception as a JSON API response.
     *
     * @param Throwable $e
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|null
     */
    function ExceptionJsonSerializer(Throwable $e, $request)
    {
        if (!$request->is('api/*'))
            return null;

        $basePath = app()->basePath();
        $basePath = json_encode($basePath);
        $basePath = substr($basePath, 1, strlen($basePath) - 2) . '\\\\';
        $trace = json_encode($e->getTrace());
        $trace = str_replace($basePath, '', $trace);

        $content = ['status' => 'failed'];

        if ($e instanceof ValidationException) {
            $content['data'] = $e->errors();
            return response()->json($content, $e->status, options: JSON_PRETTY_PRINT);
        }

        if ($e instanceof AuthorizationException) {
            $content['data'] = __('auth.unauthorized');
            return response()->json($content, 403, options: JSON_PRETTY_PRINT);
        }

        if (config('app.debug')) {
            $content['data'] = $e->getMessage();
            $content['trace'] = json_decode($trace, true);
        } else {
            $content['data'] = ($e instanceof HttpExceptionInterface)
                ? Response::$statusTexts[$e->getStatusCode()]
                : __('errors.unexpected');
        }

        $status = $e instanceof HttpExceptionInterface
            ? $e->getStatusCode()
            : 500;

        return response()->json($content, $status, options: JSON_PRETTY_PRINT);
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: LARAVEL_DIR . '/routes/web.php',
        api: LARAVEL_DIR . '/routes/api.php',
        commands: LARAVEL_DIR . '/routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->prepend(\App\Http\Middleware\WebApplicationFirewall::class);
        $middleware->append(\App\Http\Middleware\DetectDevRequest::class);
        $middleware->alias([
            'api-json' => \App\Http\Middleware\EnsureJsonResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render("ExceptionJsonSerializer");
    })->create()->usePublicPath(LARAVEL_DIR . '/../public_html');
