<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {{-- <meta name="csrf-token" content="{{ csrf_token() }}"> --}}
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

    <title>Segsys</title>

    <!-- Styles / Scripts -->
    @viteReactRefresh
    @vite(['resources/segsys/main.jsx'])
</head>

<body>
    <div id="root">
        <style>
            body {
                overflow: hidden;
                display: flex;
                align-items: center;
                height: 99.9vh;
                background: #00000080;
            }

            #root {
                margin-left: auto;
                margin-right: auto;
                width: 30px;
                height: 30px;
                border-radius: 100%;
                {{-- border-top: 1px solid black; --}}
                {{-- border-left: 1px solid gray; --}}
                border-bottom: 1px solid white;
                {{-- border-right: 1px solid gray; --}}
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }

                100% {
                    transform: rotate(360deg);
                }
            }
        </style>
    </div>
</body>

</html>
