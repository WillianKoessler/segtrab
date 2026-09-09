const select = property => {
    return state => {
        const value = state[property];
        if (!value) return null;
        return value;
    };
}

export default function SectionCoverPage() {
    const razao_social = KDOM.useSelector(select('razao_social'));
    const cnpj = KDOM.useSelector(select('cnpj'));

    return {
        tag: 'div', className: 'flex flex-row flex-nowrap mx-auto h-screen break-inside-avoid-page', children: [
            {
                tag: 'div', className: 'flex flex-col justify-evenly items-center text-center p-4', children: [
                    { tag: 'span', className: 'text-5xl font-bold text-blue-800', children: "Avaliação Ergonômica Preliminar (AEP)" },
                    { tag: 'span', className: 'text-2xl font-semibold text-blue-600', children: "Relatório de Fatores de Riscos Psicossociais Relacionados ao Trabalho (FRPRT)" },
                    { tag: 'img', className: "w-1/2", src: "/assets/img/logo.png" },
                    { tag: 'p', className: 'text-xl text-gray-600', children: [razao_social, { tag: 'br' }, cnpj] },
                ]
            },
            { tag: 'img', className: "h-screen", src: "/assets/img/capa-aep.jpg" },
        ]
    }
}