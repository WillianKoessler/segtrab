@props(['content' => ''])

@if(!empty($content))
    <div class="mb-4 inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
        {!! $content !!}
    </div>
@endif
