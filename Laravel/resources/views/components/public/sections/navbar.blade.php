@props([
    'title' => null,
    'buttons' => [],
    'logo' => null,
    'description' => null,
])

@php
    $buttons[] = [
        'attrs' => [
            'data-modal-trigger' => 'navbar-menu-sistema',
            'size' => 'lg',
        ],
        'slot' => 'Acessar Sistema',
    ];

    $buttons[] = [
        'attrs' => [
            'data-modal-trigger' => 'navbar-menu-agendamento',
            'size' => 'lg',
        ],
        'slot' => 'Agendamento',
    ];
@endphp

<div class="h-25!"></div>
<header id="navbar" class="fixed top-0 left-0 right-0 min-h-25! z-50 border-b border-black/10 dark:border-white/10 dark:bg-slate-950/80 backdrop-blur bg-slate-300 dark:bg-slate-900">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <a href="#inicio" class="flex items-center gap-3">
            @if ($logo)
                <img class="max-h-16 object-cover" alt="logo" src="{{ $logo }}" />
            @else
                <div class="leading-tight">
                    <p class="text-lg font-semibold">Segtrab Saúde</p>
                    <p class="text-xs text-white/60">Medicina, Segurança do Trabalho e Clínica Multidisciplinar</p>
                </div>
            @endif
        </a>

        <div class="flex flex-row flex-nowrap justify-center items-center gap-3">
            <div class="hidden md:flex items-center gap-2 md:gap-3">
                @foreach ($buttons as $button)
                    @if (!empty($button))
                        @php
                            $predef = [];
                            $attrs = array_merge($predef, $button['attrs'] ?? []);
                        @endphp
                        <x-public.ui.button :attrs="$attrs">
                            {{ $button['slot'] }}
                        </x-public.ui.button>
                    @endif
                @endforeach
            </div>

            <div class="relative md:hidden">
                <x-public.ui.button id="navbar-menu" aria-expanded="false" aria-controls="navbar-menu-panel">
                    <x-icons.menu />
                </x-public.ui.button>
            </div>
        </div>
    </div>

    <div id="navbar-menu-panel" class="flex flex-col w-full shadow-xl overflow-hidden max-h-0 transition-all duration-1000 ease-in-out">
        @foreach ($buttons as $button)
            @if (!empty($button))
                @php
                    $predef = [
                        'class' => 'w-full text-center rounded-none text-black dark:text-white',
                        'variant' => 'ghost',
                    ];
                    $attrs = array_merge($predef, $button['attrs'] ?? []);
                @endphp
                <x-public.ui.button :attrs="$attrs">
                    {{ $button['slot'] }}
                </x-public.ui.button>
            @endif
        @endforeach
    </div>

    <x-public.ui.modal name="navbar-menu-sistema" class="flex flex-col gap-3">
        <h2>Selecione o tipo de atendimento</h2>
        <x-public.ui.spacer class="my-1" />
        <x-public.ui.button target="_blank" href="https://core.sistemaeso.com.br/license/lobby">Sou Empresa</x-public.ui.button>
        <x-public.ui.button target="_blank" href="https://medicaloffice.com.br/sistema">Sou Paciente</x-public.ui.button>
    </x-public.ui.modal>

    <x-public.ui.modal name="navbar-menu-agendamento" class="flex flex-col gap-3">
        <h2>Selecione o tipo de agendamento</h2>
        <x-public.ui.spacer class="my-1" />
        <x-public.ui.button target="_blank" href="https://core.sistemaeso.com.br/license/lobby">Sou Empresa</x-public.ui.button>
        <x-public.ui.button target="_blank" href="https://medicaloffice.com.br/sistema/api/agendamento/segtrab_saude">Sou Paciente</x-public.ui.button>
    </x-public.ui.modal>
</header>

@pushOnce('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('navbar-menu-')?.showModal();
            const toggle = document.getElementById("navbar-menu");
            const panel = document.getElementById("navbar-menu-panel");

            if (!toggle || !panel) return;

            const openPanel = () => {
                panel.classList.remove('max-h-0');
                panel.classList.add('max-h-[300px]');
                toggle.setAttribute('aria-expanded', 'true');
            };

            const closePanel = () => {
                panel.classList.remove('max-h-[300px]');
                panel.classList.add('max-h-0');
                toggle.setAttribute('aria-expanded', 'false');
            };

            toggle.addEventListener('click', e => {
                e.stopPropagation();
                const isOpen = toggle.getAttribute('aria-expanded') === 'true';
                if (isOpen) closePanel();
                else openPanel();
            });

            document.addEventListener('click', () => {
                closePanel();
            });
        });
    </script>
@endPushOnce
