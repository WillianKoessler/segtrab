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

export default function SectionMetodologia(index, id, title) {
    return Section(index, id, title, [
        {
            tag: 'div',
            className: "bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 space-y-4 text-lg leading-relaxed text-gray-800 text-justify",
            children: [
                Indent([
                    "Para a realização desta Avaliação Ergonômica Preliminar (AEP), foi utilizado o instrumento ",
                    Strong("COPSOQ II (versão curta)"),
                    ", questionário psicométrico internacionalmente validado, adequado à identificação de fatores de risco psicossociais relacionados ao trabalho, conforme diretrizes da NR-01 e NR-17."
                ]),
                Indent("O instrumento possibilita a análise estruturada das condições de trabalho, contemplando domínios como demandas laborais, autonomia, relações interpessoais, organização do trabalho, liderança, conflito trabalho-vida, segurança no emprego e saúde e bem-estar."),
                Indent([
                    "A coleta de dados foi realizada por meio de questionário estruturado com ",
                    Strong("escala Likert de 5 pontos"),
                    ", garantindo participação voluntária, anonimato e confidencialidade."
                ]),
                {
                    tag: 'div',
                    className: "bg-white border-l-4 border-blue-600 p-5 my-2 rounded-lg",
                    children: [
                        { tag: 'p', className: "font-bold text-gray-900 mb-3", children: "Os dados coletados foram tratados estatisticamente, incluindo:" },
                        {
                            tag: 'ul', className: "list-disc pl-6 space-y-2 text-gray-800 text-base", children: [
                                { tag: "li", children: "Padronização das respostas." },
                                { tag: "li", children: "Ajustes de consistência, com inversão quando necessário." },
                                { tag: "li", children: "Cálculo de médias por dimensão e domínio." },
                                { tag: "li", children: "Consolidação dos resultados em indicadores quantitativos." },
                            ]
                        }
                    ]
                },
                Indent([
                    "A metodologia adotada está alinhada ao processo do ",
                    Strong("GRO"),
                    ", contemplando identificação de perigos, avaliação e classificação dos riscos e apoio à melhoria contínua das condições de trabalho."
                ])
            ]
        }
    ]);
}

