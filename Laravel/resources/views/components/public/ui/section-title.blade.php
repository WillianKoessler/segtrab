@props(['eyebrow' => null, 'title' => '', 'description' => null, 'align' => 'left', 'class'=>""])

@php
    $alignClass = $align === 'center' ? 'mx-auto text-center' : 'text-left';
@endphp

<div {{ $attributes->twMerge($alignClass, "mb-8 max-w-3xl", $class) }}>
    <x-public.ui.pill content="{{ $eyebrow }}" />

    <h2 class="text-3xl font-bold tracking-tight md:text-4xl">{{ $title }}</h2>

    @if(!empty($description))
        <p class="mt-4 text-base leading-7 md:text-lg">{{ $description }}</p>
    @endif
</div>