<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Captcha;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class TokenAuthenticationController extends Controller
{
    public function login(Request $request)
    {
        $rules = [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];

        $captcha = app(Captcha::class)->rule();
        if ($captcha) {
            $rules += $captcha;
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'data' => $validator->errors(),
            ], 422);
        }

        $credentials = $validator->validated();

        $user = User::where('email', $credentials['email'])
            ->where('is_active', true)
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'status' => 'failed',
                'data' => [
                    'email' => [__('auth.failed')],
                ],
            ], 401);
        }

        $expirationMinutes = (int) config('sanctum.expiration', 120);
        $expiresAt = now()->addMinutes($expirationMinutes);

        $token = $user->createToken(
            'web',
            ['*'],
            $expiresAt
        );

        return response()->json([
            'token' => $token->plainTextToken,
            'token_type' => 'Bearer',
            'expires_at' => $expiresAt->toISOString(),
            'user' => $user,
        ]);
    }

    public function destroy(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json(['status' => 'success']);
    }
}
