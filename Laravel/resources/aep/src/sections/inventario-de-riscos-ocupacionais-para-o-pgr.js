import Section from "../layout/Section.js";
import cn from "../lib/cn.js";

function Text({ text, className }) {
    return {
        tag: 'div',
        className: cn("text-base text-gray-800 text-justify indent-8", className),
        style: "text-align: justify; text-indent: 2em;",
        children: text
    }
}

function Table() {
    const perguntas = KDOM.useSelector(s => s.perguntas);
    
    function Header() {
        return {
            tag: 'thead',
            children: {
                tag: 'tr',
                className: "bg-blue-600 text-white",
                children: [
                    { tag: "th", className: "border border-gray-300 px-3 py-2 print:px-1 text-left", children: "DOMÍNIO" },
                    { tag: "th", className: "border border-gray-300 px-1 py-2 text-center w-12", children: "%" },
                    { tag: "th", className: "border border-gray-300 px-3 py-2 print:px-1 text-left", children: "AGENTE NOCIVO" },
                    { tag: "th", className: "border border-gray-300 px-3 py-2 print:px-1 text-left", children: "POSSÍVEIS DANOS" },
                    { tag: "th", className: "border border-gray-300 px-3 py-2 print:px-1 text-center", children: "PROBABILIDADE (1 a 5)" },
                    { tag: "th", className: "border border-gray-300 px-3 py-2 print:px-1 text-center", children: "SEVERIDADE (1 a 5)" },
                    { tag: "th", className: "border border-gray-300 px-3 py-2 print:px-1 text-center", children: "NÍVEL DE RISCO" },
                ]
            }
        }
    }
    function Body() {

    }
    return {
        tag: 'table',
        className: "w-full border-collapse border border-gray-300 text-sm print:text-xs",
        children: [Header, Body]
    }
}

export default function SectionInventarioDeRiscosOcupacionaisParaOPGR(index, id, title) {
    return Section(index, id, title, [
        Text({ className: "mb-4", text: "Os domínios avaliados foram incorporados ao Inventário de Riscos Ocupacionais, permitindo a identificação dos fatores psicossociais relevantes no ambiente de trabalho e subsidiando a elaboração do Plano de Ação do PGR, no qual é definido o monitoramento necessário para a mitigação dos riscos identificados." }),
        Text({ text: "Ressalta-se que os resultados obtidos refletem a percepção dos trabalhadores no momento da avaliação e devem ser monitorados periodicamente, conforme o ciclo de melhoria contínua do Gerenciamento de Riscos Ocupacionais (GRO), garantindo a atualização das informações e a efetividade das medidas preventivas adotadas pela organização." }),
        {
            tag: 'div',
            className: 'mt-6',
            children: [
                { tag: 'h3', className: "text-lg font-bold text-gray-900 mb-4", children: "Apuração dos Resultados" },
                { tag: 'div', className: "print-safe-block print-wide-table-container overflow-x-auto print:overflow-visible mt-6", children: Table }
            ]
        }
    ]);
}