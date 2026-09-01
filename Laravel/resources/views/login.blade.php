{{-- resources/views/auth/login.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <title>Segsys | Login</title>
    @vite(['resources/css/styles.css'])
    <link rel="preconnect" href="https://challenges.cloudflare.com" />
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>

<body>
    <div class="flex min-h-screen items-center justify-between flex-col bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100 from-slate-50 via-slate-100 to-indigo-50 text-slate-900">
            <div class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] grid w-full max-w-5xl overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl md:grid-cols-2">
                {{-- Left panel --}}
                <div class="flex flex-col justify-evenly bg-gradient-to-br dark:from-slate-900 dark:via-emerald-950 dark:to-teal-900 from-slate-100 via-emerald-50 to-teal-100 p-10 md:p-12">
                    <div>
                        <div class="flex items-start gap-4">
                            <div>
                                <img src="{{ asset('assets/img/logo.png') }}" alt="SegSys" class="aspect-original w-1/2 mx-auto" />
                                <p class="mt-2 text-sm font-medium text-emerald-800/90 dark:text-emerald-200/90 sm:text-base">
                                    Plataforma corporativa para gestão de SST
                                </p>
                            </div>
                        </div>

                        <p class="mt-8 max-w-md text-sm leading-6 text-slate-800/85 dark:text-slate-200/85 sm:text-base">
                            Gerencie treinamentos, exames ocupacionais, EPIs, inspeções e registros de segurança com acesso
                            protegido e organizado.
                        </p>
                    </div>

                    <div class="space-y-3 text-sm text-slate-800/85 dark:text-slate-200/85">
                        <div class="flex items-center gap-3">
                            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600/15 dark:bg-emerald-400/15 text-emerald-800 dark:text-emerald-200">✓</span>
                            Controle de treinamentos e reciclagens
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600/15 dark:bg-emerald-400/15 text-emerald-800 dark:text-emerald-200">✓</span>
                            Gestão de EPIs e entregas
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600/15 dark:bg-emerald-400/15 text-emerald-800 dark:text-emerald-200">✓</span>
                            Registros de inspeções e conformidade
                        </div>
                    </div>
                </div>
                {{-- Right panel --}}
                <div class="bg-slate-50/75 dark:bg-slate-950/75 p-8 sm:p-10 md:p-12">
                    <div class="mb-8">
                        <h2 class="mt-5 text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl font-sans">
                            SISTEMA SEGSYS
                        </h2>

                        <p class="mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                            Acesse sua conta para gerenciar processos de segurança do trabalho, conformidade e registros
                            operacionais.
                        </p>
                    </div>

                    @if (session('status'))
                        <div class="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                            {{ session('status') }}
                        </div>
                    @endif

                    @if ($errors->any())
                        <div class="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                            {{ $errors->first() }}
                        </div>
                    @endif

                    <form method="POST" action="{{ url('/login') }}" class="space-y-5">
                        @csrf

                        <div>
                            <label for="email" class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Email
                            </label>
                            <input id="email" name="email" type="email" autocomplete="email" value="{{ old('email') }}" required autofocus class="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-600 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-600/30 dark:focus:ring-cyan-400/30" placeholder="seu.nome@empresa.com" />
                        </div>

                        <div>
                            <label for="password" class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Senha
                            </label>
                            <input id="password" name="password" type="password" autocomplete="current-password" required class="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-600 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-600/30 dark:focus:ring-cyan-400/30" placeholder="••••••••" />
                        </div>

                        {{ app(\App\Services\Captcha::class)->render() }}

                        <div class="flex flex-col gap-3 pt-2 sm:flex-row">
                            <button type="submit" class="inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 dark:bg-cyan-400 px-5 py-3.5 font-semibold text-slate-50 dark:text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 dark:hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-700/50 dark:focus:ring-cyan-300/50">
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        <footer class="fixed bottom-0 flex justify-center items-center gap-5 my-6 text-center text-sm text-slate-500" id="footer">
            <x-public.ui.theme />
            <div>© {{ date('Y') }} Segtrab Saúde. Todos os direitos reservados.</div>
        </footer>
        @stack('scripts')
    </div>
</body>

</html>
