import Section from "../layout/Section.js";

function Strong(children) {
    return { tag: "strong", className: "text-blue-600", children }
}

function Text(children) {
    return { tag: 'p', className: "text-lg leading-relaxed text-gray-800 text-justify indent-8 mb-4", children }
}

function Indent(children) {
    return { tag: 'p', className: "indent-8", children }
}

export default function SectionImportanciaDaParticipacao(index, id, title) {
    return Section(index, id, title, [
        {
            tag: 'div',
            className: "bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 space-y-4 text-lg leading-relaxed text-gray-800 text-justify",
            children: [
            Indent([
                "A participação dos trabalhadores é fundamental para a qualidade e confiabilidade da Avaliação Ergonômica Preliminar (AEP). Como o ",
                Strong("COPSOQ II"),
                " baseia-se na percepção dos trabalhadores, o engajamento dos participantes garante resultados mais precisos e representativos das condições reais de trabalho."
            ]),
            Indent([
                "Conforme o Guia do MTE, é essencial assegurar ",
                Strong("anonimato, confidencialidade e comunicação transparente"),
                ", promovendo um ambiente de confiança que favoreça respostas fidedignas."
            ]),
            Indent("A participação também é indispensável nas etapas do GRO, contribuindo para a identificação de perigos, avaliação dos riscos e definição de medidas de prevenção."),
            ]
        }
    ]);
}

