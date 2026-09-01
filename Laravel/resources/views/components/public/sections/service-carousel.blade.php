@props(['cards' => []])

<x-public.ui.section id="servicos" class="mx-auto">
    <x-public.ui.section-title
                               eyebrow="Serviços"
                               title="Soluções em saúde e segurança para apoiar a operação da sua empresa." />

    <div data-carousel class="my-8 w-full flex justify-center items-stretch rounded-2xl text-black/75 dark:text-white/75">
        <div data-carousel-prev class="w-30 hidden md:flex items-center justify-center hover:text-black dark:hover:text-white transition ease-in-out">
            <x-icons.chevron-left class="size-8!" />
        </div>
        <div data-carousel-track class="flex gap-6 overflow-x-auto overflow-y-hidden touch-pan-y scroll-smooth md:px-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            @foreach ($cards as $card)
                <div data-carousel-card class="min-w-[200px] md:min-w-[300px] snap-center rounded-2xl py-4 px-2 md:px-6 border border-slate-200 dark:border-slate-800 bg-slate-950/20 text-emerald-900 transition transition ease-in-out">
                    <span class="text-sm font-semibold">{!! $card['label'] !!}</span>

                    <h3 class="mt-5 text-xl font-semibold text-black/75 dark:text-white/75">{!! $card['title'] !!}</h3>
                    <p class="mt-3 text-sm leading-6 text-black/75 dark:text-white/75">{!! $card['description'] !!}</p>

                    <a href="{{ $card['target-href'] }}" class="mt-6 inline-flex text-sm font-medium hover:text-emerald-800">
                        {!! $card['target-text'] !!}
                    </a>
                </div>
            @endforeach
        </div>
        <div data-carousel-next class="w-30 hidden md:flex items-center justify-center hover:text-black dark:hover:text-white transition ease-in-out">
            <x-icons.chevron-right class="size-8!" />
        </div>
    </div>
</x-public.ui.section>

@pushOnce('scripts')
    <script>
        var event = null;
        document.addEventListener('DOMContentLoaded', function() {
            const getStep = track => {
                const card = track.querySelector('[data-carousel-card]');
                if (!card) return 320;

                const styles = window.getComputedStyle(track);
                const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;

                return card.getBoundingClientRect().width + gap;
            };

            const startMove = (event, params) => {
                params.isDragging = true;
                params.startX = ((event?.touches && event.touches[0]) || event).pageX;
                params.startScrollLeft = params.track.scrollLeft;
                params.track.classList.remove('scroll-smooth', 'snap-mandatory', 'snap-x');
            };

            const computeMove = (event, params) => {
                if (!params.isDragging) return;
                const currentX = ((event?.touches && event.touches[0]) || event).pageX;
                const distance = currentX - params.startX;
                params.track.scrollLeft = params.startScrollLeft - distance;
            };

            const stopMove = (event, params) => {
                if (!params.isDragging) return;
                params.isDragging = false;
                params.track.classList.add('scroll-smooth', 'snap-mandatory', 'snap-x');
            }

            const hookEvent = (params, eventName, eventHandler, earlyOutCondition = null) => {
                params.track.addEventListener(eventName, event => {
                    if (earlyOutCondition && earlyOutCondition(event)) return;
                    eventHandler(event, params);
                }, {
                    passive: true
                });
            }

            document.querySelectorAll('[data-carousel]').forEach(function(root) {
                const track = root.querySelector('[data-carousel-track]');
                if (!track) return;

                root.querySelector('[data-carousel-prev]')?.addEventListener('click', e => {
                    track.scrollBy({
                        left: -getStep(track),
                        behavior: 'smooth'
                    });
                });

                root.querySelector('[data-carousel-next]')?.addEventListener('click', e => {
                    track.scrollBy({
                        left: getStep(track),
                        behavior: 'smooth'
                    });
                });

                const trackParams = {
                    isDragging: false,
                    startX: 0,
                    startScrollLeft: 0,
                    track
                };

                hookEvent(trackParams, 'mousedown', startMove, e => e.button !== 0);
                hookEvent(trackParams, 'mousemove', computeMove, e => e.button !== 0);
                hookEvent(trackParams, 'mouseup', stopMove, e => e.button !== 0);
                hookEvent(trackParams, 'touchstart', startMove, e => e.touches.length !== 1);
                hookEvent(trackParams, 'touchmove', computeMove, e => !trackParams.isDragging || e.touches.length !== 1);
                hookEvent(trackParams, 'touchend', stopMove, e => !trackParams.isDragging);
                hookEvent(trackParams, 'touchcancel', stopMove);
            });
        });
    </script>
@endPushOnce
