@props(['name', 'title' => null])

<dialog data-modal="{{ $name }}" class="backdrop:bg-black/50 fixed top-[50%] translate-y-[-50%] mx-auto">
    <div class="p-2 m-0 text-black dark:text-white bg-white dark:bg-slate-950 border border-black/50 dark:border-white/50">
        @if ($title)
            <div class="flex flex-nowrap items-center justify-between">
                <h2 class="m-0">{{ $title }}</h2>
                <button data-modal-close type="button" class="border-none bg-none text-lg cursor-pointer" aria-label="Close">
                    <x-icons.x-mark />
                </button>
            </div>
            <div class="w-full h-px bg-black/50 dark:bg-white/50 my-1"></div>
        @endif

        <div {{ $attributes->twMerge('', $class ?? '') }}>
            {{ $slot }}
        </div>
    </div>
</dialog>

@pushOnce('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
                trigger.addEventListener('click', e => {
                    const modalId = trigger.dataset.modalTrigger;
                    document.querySelectorAll(`[data-modal="${modalId}"]`).forEach(dialog => dialog.showModal());
                });
            });
            document.querySelectorAll('[data-modal]').forEach(dialog => {
                dialog.addEventListener('click', e => {
                    if (dialog && dialog.open && !Array.from(dialog.children).some(child => child.contains(e.target)))
                        dialog.close();
                });
                dialog.querySelectorAll('[data-modal-close]').forEach(closeBtn =>
                    closeBtn.addEventListener('click', e =>
                        e.target.closest('[data-modal]')?.close()
                    )
                )
            });
        });
    </script>
@endPushOnce
