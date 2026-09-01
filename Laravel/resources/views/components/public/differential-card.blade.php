@props(['title', 'description', 'icon' => ''])

<div {{ $attributes->merge(['class' => 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg']) }}>
@if(!empty($icon))
    <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl font-bold text-teal-800">
        {{ $icon }}
    </div>
@endif
@if(!empty($title))
    <h3 class="text-lg font-semibold text-slate-900">{{ $title }}</h3>
@endif
@if(!empty($description))
    <p class="mt-3 text-sm leading-7 text-slate-600">{{ $description }}</p>
@endif
</div>