import Section from "../layout/Section.js";

function formatDate(date) {
    if(typeof date === "string")
        date = new Date(date);
    return new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function Strong(children) {
    return { tag: 'b', children }
}

function Signature(nome, cargo, empresa, responsabilidade) {
    return {
        tag: 'div', className: "flex-1 min-w-0 w-full max-w-[300px] flex flex-col items-center", children: [
            { tag: 'div', className: "w-full border-b-2 border-black mb-2 mt-8" },
            { tag: 'div', className: "text-base font-semibold text-gray-900 text-center", children: nome },
            { tag: 'div', className: "text-sm text-gray-700 text-center", children: cargo },
            { tag: 'div', className: "text-sm text-gray-700 text-center", children: empresa },
            { tag: 'div', className: "text-sm text-gray-900 font-bold mt-1 text-center", children: responsabilidade },
        ]
    }
}

export default function SectionResponsabilidades(index, id, title) {
    const dataAvaliacao = KDOM.useSelector(s => s.dataAvaliacao);
    const razao_social = KDOM.useSelector(s => s.razao_social);

    return Section(index, id, title, [
        { tag: 'div', className: "text-lg font-semibold text-gray-800 mb-32", children: formatDate(dataAvaliacao) },
        {
            tag: 'div', className: "flex flex-col md:flex-row print:flex-row justify-center items-start gap-8 md:gap-16 w-full mb-8", children: [
                Signature("Representante Legal", "Segtrab Saúde", "Responsável pela avaliação"),
                Signature("Representante Legal", razao_social, "Responsável pela aprovação"),
            ]
        },
        {
            tag: 'div', className: "text-base text-gray-800 mb-4 text-justify indent-8", style: "text-align: justify; text-indent: 2em;", children: [
                Strong("Ressalta-se que a responsabilidade pela implementação, monitoramento e acompanhamento das ações corretivas e preventivas recomendadas neste relatório é integralmente da empresa"),
                ", conforme estabelece a NR-1 (item 1.5.3.1) e o ",
                Strong("Programa de Gerenciamento de Riscos (PGR)"),
                ", cabendo à organização avaliar a aplicabilidade das medidas no contexto de suas operações, garantindo a conformidade com as normas regulamentadoras vigentes e as melhores práticas de saúde, segurança e ergonomia ocupacional."
            ]
        },
        {
            tag: 'div', className: "text-base text-gray-800 text-justify indent-8", style: "text-align: justify; text-indent: 2em;", children: [
                "Este relatório, elaborado com rigor técnico e em conformidade com a ",
                Strong("NR-1, NR-17 e o Guia de Fatores de Riscos Psicossociais Relacionados ao Trabalho"),
                ", visa subsidiar a gestão da empresa na tomada de decisões informadas, mantendo rastreabilidade e evidências técnicas para auditorias, fiscalizações e processos de melhoria contínua do sistema de gestão de SST."
            ]
        }
    ]);
}