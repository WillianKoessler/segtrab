import Section from "../layout/Section.js";

function Strong(children) {
    return { tag: "strong", className: "text-blue-600", children }
}

function Text(children) {
    return { tag: 'p', className: "text-lg leading-relaxed text-gray-800 text-justify indent-8 mb-4", children }
}

export default function SectionObjetivo(index, id, title) {
    return Section(index, id, title, [
        {
            tag: 'div',
            className: "bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600",
            children: [
                Text([
                    "Esta ",
                    Strong("Avaliação Ergonômica Preliminar (AEP)"),
                    " tem como objetivo identificar e analisar de forma técnica os ",
                    Strong("fatores de riscos psicossociais presentes no ambiente laboral"),
                    ", que podem contribuir para o estresse ocupacional e impactar a saúde, o bem-estar e a produtividade dos trabalhadores.",
                ]),
                Text([
                    "Este relatório está em ",
                    Strong("estrita conformidade com a NR-17 e NR-1 (GRO e PGR)"),
                    ", atendendo ao ",
                    Strong("Guia de Informações sobre Fatores de Riscos Psicossociais Relacionados ao Trabalho (MTE) e COPSOQ II Versão Curta"),
                    ", garantindo alinhamento com as melhores práticas nacionais e internacionais em saúde e segurança do trabalho."
                ]),
                Text([
                    "Os resultados subsidiam a priorização de medidas de controle, elaboração de planos de ação e integração ao ",
                    Strong("PGR"),
                    ", podendo indicar a necessidade de aprofundamento por meio de ",
                    Strong("Análise Ergonômica do Trabalho (AET)"),
                    "."
                ]),
                Text("Dessa forma, a avaliação contribui para a promoção de ambientes de trabalho mais seguros, saudáveis e produtivos.")
            ]
        }
    ]);
}