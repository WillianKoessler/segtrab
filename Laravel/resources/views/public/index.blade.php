@extends('public.layouts.site')

@php
    $contacts = [
        'phone' => '22997469071',
        'email' => 'medicina@segtrab.com.br',
    ];

    $services = [
        [
            'title' => 'Medicina do Trabalho',
            'description' => 'Atendimento ocupacional com foco em exames, acompanhamento e orientação para empresas.',
            'label' => 'Saúde Ocupacional',
            'target-href' => '#',
            'target-text' => 'Saiba mais &rarr;',
        ],
        [
            'title' => 'Clínica Multidisciplinar',
            'description' => 'Estrutura para atendimentos em diferentes especialidades durante o período da tarde.',
            'label' => 'Atendimento Clínico',
            'target-href' => '#',
            'target-text' => 'Saiba mais &rarr;',
        ],
        [
            'title' => 'Segurança do Trabalho',
            'description' => 'Suporte técnico para prevenção, adequação e gestão de riscos no ambiente de trabalho.',
            'label' => 'Engenharia',
            'target-href' => '#',
            'target-text' => 'Saiba mais &rarr;',
        ],
        [
            'title' => 'Adequação às NRs',
            'description' => 'Apoio para organizar processos e atender exigências legais e normativas aplicáveis.',
            'label' => 'Conformidade',
            'target-href' => '#',
            'target-text' => 'Saiba mais &rarr;',
        ],
        [
            'title' => 'Gestão de Documentos',
            'description' => 'Organização de laudos, registros e documentos essenciais para rotina empresarial.',
            'label' => 'Administrativo',
            'target-href' => '#',
            'target-text' => 'Saiba mais &rarr;',
        ],
    ];

    $hero_cards = [
        [
            'image' => [
                'url' => asset('assets/img/120615463-768x516.jpg'),
                'alt' => 'imagem institucional da Segtrab Saúde',
            ],
            'tags' => [
                [
                    'title' => 'Atuação',
                    'desc' => 'Medicina do Trabalho e Clínica',
                ],
                [
                    'title' => 'Suporte técnico',
                    'desc' => 'Segurança do Trabalho',
                ],
                [
                    'title' => 'Teste',
                    'desc' => 'descrição do teste',
                ],
            ],
        ],
        [
            'image' => [
                'url' => asset('assets/img/120615464-1024x576.png'),
                'alt' => 'Test image',
            ],
            'tags' => [
                [
                    'title' => 'Title',
                    'desc' => 'Description',
                ],
            ],
        ],
    ];
@endphp



@section('navbar')
    <x-public.sections.navbar logo="{{ asset('assets/img/logo.png') }}" />
@endsection

@section('content')
    <x-public.sections.hero :phone="$contacts['phone']" :cards="$hero_cards" />
    <x-public.sections.about />
    <x-public.sections.diffs />
    <x-public.sections.service-carousel :cards="$services" />
    <x-public.sections.contact :contacts="$contacts" />
@endsection
