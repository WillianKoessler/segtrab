{{-- resources/views/soon.blade.php --}}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <title>Segtrab Saúde</title>
    @vite(['resources/css/styles.css'])
</head>

<body class="h-screen bg-slate-900 text-slate-100 overflow-hidden flex justify-center items-center">
    <div class="flex flex-col justify-center items-center w-40">
        <img src="{{ asset('assets/img/logo.png') }}" alt="logo" class="aspect-original w-full" />
        <h3 class="font-semibold text-slate-300">Em Breve</h3>
    </div>
</body>

</html>
