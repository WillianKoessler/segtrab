@php
    $sentences = [
        'Organização de rotinas ocupacionais com foco em agilidade e precisão.',
        'Atendimento clínico multidisciplinar com estrutura acolhedora e profissional.',
        'Suporte em engenharia e segurança do trabalho para adequação às normas vigentes',
        //
    ];
@endphp

<x-public.ui.section id="sobre" class="grid gap-6 lg:grid-cols-2">
    <div class="rounded-none sm:rounded-[2rem] bg-none sm:bg-slate-950/20 md:border border-slate-400 dark:border-slate-900 py-4 md:p-8 shadow-sm text-slate-800 dark:text-slate-200">
        <x-public.ui.section-title
                                   class=""
                                   eyebrow="Sobre a empresa"
                                   title="Uma clínica pensada para empresas e pacientes que valorizam estrutura, responsabilidade e confiança" />

        <p>
            A Segtrab Saúde atua de forma integrada, organizando rotinas em medicina do trabalho pela manhã, clínica multidisciplinar à tarde e engenharia no segundo andar.
        </p>

        <p class="text-base leading-8">
            Com atuação consolidada em Rio das Ostras, a empresa acompanha cada cliente com atenção técnica e visão de
            longo prazo, oferecendo suporte para adequações legais, processos internos e cuidado com a saúde
            ocupacional.
        </p>

        <ul class="mt-6 grid gap-4">
            @foreach ($sentences as $sentence)
                <li class="flex gap-3">
                    <x-icons.check class="mt-1 text-teal-700 size-4" />
                    <span>{{ $sentence }}</span>
                </li>
            @endforeach
        </ul>
    </div>

    <aside class="rounded-none sm:rounded-[2rem] bg-none sm:bg-slate-950/20 md:p-8 shadow-sm md:border border-slate-400 dark:border-slate-900 dark:text-slate-50 text-slate-900">
        <x-public.ui.section-title eyebrow="Estrutura" title="Organização por áreas" description="Operação clara, com setores distribuídos para facilitar atendimento, orientação e acompanhamento." />
        <div class="grid gap-4">
            <x-public.ui.card class="border-none" title="Primeiro Andar - Manhã" desc="Medicina do Trabalho e atividades" variant="normal" />
            <x-public.ui.card class="border-none" title="Primeiro Andar - Tarde" desc="Clínica multidisciplinar com atendimento amplo." variant="normal" />
            <x-public.ui.card class="border-none" title="Segundo Andar" desc="Engenharia voltada à Segurança do Trabalho" variant="normal" />
        </div>
    </aside>
</x-public.ui.section>
