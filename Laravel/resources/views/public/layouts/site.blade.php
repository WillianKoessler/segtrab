<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <title>Segtrab Saúde</title>
    <meta name="description" content="Medicina do Trabalho, Segurança do Trabalho e clínica multidisciplinar em Rio das Ostras.">
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/styles.css'])
    @else
        <x-tailwindcss />
    @endif
    @stack('styles')
    <script>
        var target = {};
    </script>
</head>

<body>
    <div id="inicio"></div>

    @yield('navbar')

    <main id="content">
        @yield('content')
    </main>

    <footer class="py-8 text-center text-sm text-slate-500" id="footer">
        @yield('footer')
        <div class="flex justify-center items-center gap-5">
            <x-public.ui.theme />
            <div>© {{ date('Y') }} Segtrab Saúde. Todos os direitos reservados.</div>
        </div>
    </footer>

    @stack('scripts')
</body>

</html>
