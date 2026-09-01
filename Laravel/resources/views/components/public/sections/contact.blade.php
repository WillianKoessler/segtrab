@props(['contacts'])

<x-public.ui.section id="contato">
    <x-public.ui.section-title eyebrow="Agendamento" title="Facilite o contato com seus pacientes e empresas"
                               description="Seção pronta para futura integração com formulário, WhatsApp, telefone ou sistema interno." />

    <div class="flex flex-wrap gap-3">
        @if (isset($contacts['phone']))
            <x-public.ui.button target="_blank" href="https://wa.me/55{{ $contacts['phone'] }}" variant="primary" size="lg">
                Agendar via WhatsApp
            </x-public.ui.button>
        @endif

        @if (isset($contacts['email']))
            <x-public.ui.button href="mailto:{{ $contacts['email'] }}" variant="outline" size="lg">
                Enviar e-mail
            </x-public.ui.button>
        @endif
    </div>
    <a href="https://wa.me/55{{ $contacts['phone'] }}" target="_blank" class="p-0 fixed right-8 bottom-8 size-16 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur flex items-center justify-center">
        <img class="size-12" src="{{ asset('assets/img/icon_wpp_colored.png') }}" />
    </a>
</x-public.ui.section>
