@props(['id' => null, 'class' => ''])

<section
         @if ($id) id="{{ $id }}" @endif
         {{ $attributes->twMerge('mx-auto w-[min(1180px,calc(100%-2rem))] mb-8 rounded-3xl p-4', $class) }}>
    {{ $slot }}
</section>
