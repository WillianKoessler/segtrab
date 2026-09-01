<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Services\Captcha;

class SessionAuthenticationController extends Controller
{
    public function login(Request $request)
    {
        $rules = [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ];
        $captcha = app(Captcha::class)->rule();

        if ($captcha)
            $rules += $captcha;

        $credentials = $request->validate($rules);

        $attempt = ['email' => $credentials['email'], 'password' => $credentials['password'], 'is_active' => true];

        try {
            if (!Auth::attempt($attempt, $request->boolean('remember')))
                return back()->withErrors(['error' => __('auth.failed')]);

            $request->session()->regenerate();

            return redirect()->intended(route('home'));
        } catch (\Throwable $exc) {
            return back()->withErrors(['error' => __($exc->getMessage())]);
        }
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['status' => 'success']);
    }
}
