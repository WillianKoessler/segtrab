@props(['attrs' => []])

@php
    $base = 'inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2';

    $variants = [
        'primary' => 'bg-teal-700 text-white hover:bg-teal-800 shadow-sm',
        'secondary' => 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
        'ghost' => 'bg-transparent text-slate-700 hover:bg-slate-100',
        'outline' => 'border border-slate-200 bg-white text-slate-800 hover:bg-teal-50 hover:border-teal-200',
    ];

    $sizes = [
        'sm' => 'px-3 py-2 text-sm',
        'md' => 'px-4 py-2.5 text-sm',
        'lg' => 'px-5 py-3 text-base',
    ];

    $variant = $variants[$attrs['variant'] ?? 'primary'] ?? $variants['primary'];
    $size = $sizes[$attrs['size'] ?? 'md'] ?? $sizes['md'];

    //$tag = array_key_exists('href', $attrs) ? 'a' : 'button';
    $tag = $attributes->has('href') ? 'a' : 'button';

    $htmlAttrs = collect($attrs)
        ->except(['variant', 'size', 'class'])
        ->all();

    $attributes = $attributes->merge($htmlAttrs);
@endphp

<{{ $tag }} {{ $attributes->twMerge("$base $variant $size " . $attributes->get('class')) }} {{ $attributes }}>
    {{ $slot }}
    </{{ $tag }}>
