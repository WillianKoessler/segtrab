@props([
    'title',
    'desc',
    'class' => '',
    'variant' => '',
    'icon' => '',
    //
])

@php
    $props = compact('title', 'desc', 'icon');

    $variants = [
        'cardlet' => [
            'wrapper' => 'bg-slate-950/20 rounded-2xl border border-white/10 bg-black/20 p-4',
            'icon' => '',
            'title' => 'text-sm text-slate-500',
            'desc' => 'mt-1 text-lg font-semibold',
        ],
        'normal' => [
            'wrapper' => 'bg-slate-950/20 rounded-3xl border border-slate-200 dark:border-slate-800 px-6 py-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
            'icon' => 'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl font-bold text-teal-800',
            'title' => 'text-lg font-semibold text-slate-700 dark:text-slate-300',
            'desc' => 'mt-3 text-sm leading-7 text-slate-600 dark: text-slate-200',
        ],
        'normal-inverted' => [
            'wrapper' => 'bg-slate-950/20 rounded-3xl border dark:border-slate-200 border-slate-800 px-6 py-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
            'icon' => 'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl font-bold text-teal-800',
            'title' => 'text-lg font-semibold text-slate-200 dark:text-slate-900',
            'desc' => 'mt-3 text-sm leading-7 text-slate-200 dark:text-slate-600',
        ],
    ];

    $tags = [
        'icon' => 'div',
        'title' => 'h3',
        'desc' => 'p',
    ];

    $variant = $variants[$variant] ?? $variants['cardlet'];
@endphp

<div {{ $attributes->twMerge($variant['wrapper'], $class) }}>
    @foreach ($tags as $param => $tag)
        @if (!empty($props[$param]))
            <{!! $tag !!} class="{{ $variant[$param] }}">
                {{ $props[$param] }}
            </{!! $tag !!}>
        @endif
    @endforeach
</div>
