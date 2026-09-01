@props(['phone' => 'DDDNUMERO', 'cards' => []])

<x-public.ui.section class="bg-slate-200 dark:bg-slate-950 dark:text-white relative w-full rounded-none">
    <div class="mx-auto md:max-w-7xl px-0 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row gap-12 lg:items-center">
            <div class="w-full md:w-1/2">
                <h1 class="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                    Cuidamos da saúde e da segurança do trabalho com agilidade, acolhimento e conformidade.
                </h1>

                <p class="mt-6 text-lg leading-8 text-black/75 dark:text-white/75">
                    Atendimento em Medicina do Trabalho pela manhã, clínica multidisciplinar à tarde e suporte de
                    engenharia em Segurança do Trabalho para apoiar sua empresa nas exigências técnicas e legais.
                </p>

                <div class="mt-8 flex flex-wrap gap-3">
                    <a href="https://wa.me/55{{ $phone }}" class="inline-flex items-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                        Falar com a equipe
                    </a>
                    <a href="#servicos" class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                        Ver serviços
                    </a>
                </div>

                <div class="mt-10 grid gap-4 sm:grid-cols-3">
                    <x-public.ui.card title="Atendimento" desc="Humanizado e ágil" />
                    <x-public.ui.card title="Estrutura" desc="Saúde + engenharia" />
                    <x-public.ui.card title="Foco" desc="Conformidade e cuidado" />
                </div>
            </div>

            @if (!empty($cards))
                <div data-hero-carousel data-hero-carousel-seconds='5' class="w-full md:w-1/2 overflow-hidden relative h-full">
                    @foreach ($cards as $index => $card)
                        <div class="{{ $index === 0 ? 'relative opacity-100' : 'absolute opacity-0 inset-0' }} transition duration-1000 ease-in-out" data-hero-carousel-item>
                            <div class="overflow-hidden rounded-xl h-[400px] mb-2 relative">
                                <img class="size-full object-cover object-center" alt="{{ $card['image']['alt'] }}" src="{{ $card['image']['url'] }}" />
                                <div data-hero-carousel-progress class="absolute bottom-0 left-0 w-0 h-1 bg-white/50 dark:bg-black/50"></div>
                            </div>
                            <div class="flex flex-row flex-wrap gap-4 p-6 rounded-xl shadow-2xl shadow-black/20 border border-white/10 bg-white/5">
                                @foreach ($card['tags'] as $tag)
                                    <x-public.ui.card title="{{ $tag['title'] }}" desc="{{ $tag['desc'] }}" class="flex-grow" />
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</x-public.ui.section>

@pushOnce('scripts')
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll('[data-hero-carousel]').forEach(root => {
                const seconds = Number(root.dataset.heroCarouselSeconds || 5);

                const items = Array.from(root.querySelectorAll('[data-hero-carousel-item]'));
                if (!items.length) return;

                const durationMs = seconds * 1000;
                let active = 0;

                const showItem = index => {
                    const Bar = {
                        start: bar => {
                            bar.style.transitionProperty = "width";
                            bar.style.transitionDuration = `${seconds}s`;
                            bar.style.transitionTimingFunction = 'linear';
                            bar.style.width = '0%';
                            requestAnimationFrame(() => {
                                bar.style.width = '100%';
                            });
                        },

                        reset: bar => {
                            bar.style.transitionProperty = 'none';
                            bar.style.width = '0%';
                        },
                    };

                    items.forEach((item, i) => {
                        // const bars = Array.from(item.querySelectorAll('[data-hero-carousel-progress]'));
                        const bar = item.querySelector('[data-hero-carousel-progress]') 

                        if (i === index) {
                            item.classList.remove('absolute', 'inset-0', 'opacity-0');
                            item.classList.add('relative', 'opacity-100');

                            // if (bars.length) {
                            //     bars.forEach(bar => {});
                            // }

                            if (bar) Bar.start(bar);
                        } else {
                            item.classList.add('absolute', 'inset-0', 'opacity-0');
                            item.classList.remove('relative', 'opacity-100');

                            // if (bars.length) {
                            //     bars.forEach(bar => {});
                            // }

                            if (bar) Bar.reset(bar);
                        }
                    });
                }

                showItem(active);

                setInterval(() => {
                    active = (active + 1) % items.length;
                    showItem(active)
                }, durationMs);
            });
        });
    </script>
@endPushOnce
