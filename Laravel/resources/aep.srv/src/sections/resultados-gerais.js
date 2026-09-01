import Section from "../layout/Section.js";
import Input from "../components/Input.js";
import cn from "../lib/cn.js";

const average = (nums) => {
    if (!Array.isArray(nums) || nums.length === 0) return 0;
    return nums.reduce((sum, n) => sum + Number(n || 0), 0) / nums.length;
}

const cargoAverage = (cargo) => {
    return average(cargo.responses);
}

const selectCargoAverages = (state) => {
    return state.cargos.map(cargo => {
        return {
            name: cargo.name,
            average: cargoAverage(cargo)
        }
    });
}

const selectReportAverage = (state) => {
    const avgs = selectCargoAverages(state);
    return avgs.length
        ? avgs.reduce((sum, c) => sum + c.average, 0) / avgs.length
        : 0;
}

const selectQuestionAverages = (state) => {
    const cargos = state.cargos;
    if (!cargos.length) return [];
    return state.cargos[0].responses.map((_, i) =>
        cargos.reduce((sum, cargo) => sum + cargo.responses[i], 0) / cargos.length
    );
}

const getRiskLevel = (percent, limit) => {
    const states = [
        {
            threshold: v => v < limit,
            label: 'Bom',
            colorName: "Verde",
            colorZone: 'green',
            colorBg: 'bg-green-400',
            colorText: 'text-green-500',
            colorBorder: 'border-green-50',
            level: "Baixo",
        },
        {
            threshold: v => v == limit,
            label: 'Atenção',
            colorName: "Amarela",
            colorZone: 'yellow',
            colorBg: 'bg-yellow-300',
            colorText: 'text-yellow-400',
            colorBorder: 'border-yellow-40',
            level: "Moderado",
        },
        {
            threshold: v => v > limit,
            label: 'Ruim',
            colorName: "Vermelha",
            colorZone: 'red',
            colorBg: 'bg-red-400',
            colorText: 'text-red-500',
            colorBorder: 'border-red-50',
            level: "Alto",
        }
    ]
    const result = states.filter(state => state.threshold(percent)).map(state => { delete state.threshold; return state; });
    if (result.length !== 1)
        throw new Error("Unknown State");
    return result[0];
}

function QuadroMediaGeral() {
    const perguntas = KDOM.useSelector(s => s.perguntas);
    const perguntasAvgs = KDOM.useSelector(selectQuestionAverages);
    const avgAll = KDOM.useSelector(selectReportAverage);

    function PerguntaItem(pergunta, perguntaIndex) {
        const avg = perguntasAvgs[perguntaIndex]?.toFixed(2);
        const perguntaLevel = getRiskLevel(avg, pergunta.threshold);
        return {
            tag: 'div', className: 'w-full mb-1', children: [
                {
                    tag: 'div', className: "flex justify-between items-center", children: [
                        { tag: 'span', className: "text-gray-700 font-medium", children: pergunta.risco },
                        { tag: 'span', className: "text-sm font-semibold text-gray-600", children: `${avg}%` }
                    ]
                },
                {
                    tag: 'div', className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden", children: [
                        { tag: 'div', className: cn("h-full transition-all duration-300", perguntaLevel.colorBg), style: `width: ${avg}%` }
                    ]
                }
            ]
        };
    }

    function Labels() {
        const LabelItem = (label, range) => {
            const level = getRiskLevel(range, 50);
            return {
                tag: 'div', className: `bg-${level.colorZone}-50 p-4 rounded-lg border border-${level.colorZone}-200`, children: [
                    {
                        tag: 'div', className: "flex items-center gap-x-2 mb-2", children: [
                            { tag: 'div', className: cn("w-4 h-4 rounded", level.colorBg) },
                            { tag: 'span', className: `font-semibold text-${level.colorZone}-800`, children: `Zona ${level.colorName} ` },
                        ]
                    },
                    { tag: 'p', className: `text-${level.colorZone}-700`, children: label }
                ]
            }
        }
        return {
            tag: 'div',
            className: "grid grid-cols-3 gap-3 mt-6 col-span-2 print:text-xs",
            children: [
                LabelItem('Boa percepção, manutenção recomendada.', 0),
                LabelItem('Atenção: possível risco psicossocial: revisar prática.', 50),
                LabelItem('Risco elevado: ação corretiva imediata.', 100),
            ]
        }
    }

    return {
        tag: 'div',
        className: "bg-white rounded-lg shadow-lg border-2 border-blue-200 -mt-2 px-6 py-1 flex flex-col items-center justify-center gap-2 break-inside-avoid-page",
        children: [
            {
                tag: 'div',
                className: "flex flex-col items-center justify-center w-full",
                children: [
                    { tag: 'div', className: "text-xl font-semibold text-gray-700 mb-3 text-center", children: "Média Geral da Empresa" },
                    { tag: 'div', className: "text-4xl sm:text-6xl font-extrabold select-none pointer-events-none leading-none", children: avgAll.toFixed(2) + "%" },
                ]
            },
            { tag: "div", className: "flex flex-col w-full text-sm", children: perguntas.map(PerguntaItem) },
            { tag: 'div', className: "flex flex-row text-sm", children: Labels },
        ],
    };
}

function QuadroPerguntas() {
    const perguntas = KDOM.useSelector(s => s.perguntas);
    const perguntasAvgs = KDOM.useSelector(selectQuestionAverages);
    const cargos = KDOM.useSelector(s => s.cargos);

    function Pergunta(pergunta, perguntaIndex) {
        const avg = perguntasAvgs[perguntaIndex]?.toFixed(2);
        const level = getRiskLevel(avg, pergunta.threshold);

        function Cabecalho() {
            function Label() {
                function LabelItem(label, level) {
                    level = getRiskLevel(level, 50);
                    return {
                        tag: 'div', className: "flex flex-row items-center gap-x-2", children: [
                            { tag: 'div', className: `w-4 h-4 rounded ${level.colorBg}` },
                            { tag: 'span', className: "text-xs text-gray-700", children: `${label} | ${level.label.toUpperCase()}` }
                        ]
                    }
                }
                return {
                    tag: 'div', className: "flex justify-center my-4 gap-x-4", children: [
                        LabelItem("NUNCA", 0),
                        LabelItem("ÀS VEZES", 50),
                        LabelItem("SEMPRE", 100),
                    ]
                }
            }

            return {
                tag: 'div',
                className: "w-full px-6 gap-y-8",
                children: [
                    {
                        tag: 'div',
                        className: "w-full px-6",
                        children: [
                            {
                                tag: 'div', children: [
                                    {
                                        tag: 'div', className: "flex justify-between items-center mb-1", children: [
                                            { tag: "span", className: "text-gray-700 font-bold", children: "Média Geral" },
                                            { tag: "span", className: "text-sm font-semibold text-gray-600", children: `${avg}%` },
                                        ]
                                    },
                                    {
                                        tag: 'div', className: "w-full h-3 bg-gray-200 rounded-full overflow-hidden", children: [
                                            { tag: 'div', className: `h-full transition-all duration-300 ${level.colorBg}`, style: `width: ${avg}%` }
                                        ]
                                    },
                                    { tag: 'div', className: `mx-auto w-fit py-2 px-4 rounded-full border-2 border-solid border-${level.colorZone}-500 text-${level.colorZone}-500 leading-none mt-3 text-sm font-semibold`, children: level.label },
                                    Label,
                                    { tag: 'div', className: 'mt-4 text-gray-800 font-bold', children: 'Pergunta:' },
                                    { tag: 'div', className: 'text-gray-700 font-normal', children: pergunta.pergunta },
                                ]
                            }
                        ]
                    }
                ]
            }
        }

        function Porcentagens() {
            function Cargo(cargo, cargoIndex) {
                const cargoLevel = getRiskLevel(cargo.responses[perguntaIndex], pergunta.threshold);
                return {
                    tag: "div", className: "flex items-center gap-4 text-gray-700", children: [
                        {
                            tag: "div", className: "w-2/5 text-right text-sm", children: [
                                { tag: "span", className: "block", children: cargo.name }
                            ]
                        },
                        {
                            tag: "div", className: "flex-1", children: [
                                {
                                    tag: "div", className: "relative h-8 bg-gray-100 rounded font-semibold", children: [
                                        {
                                            tag: "div", className: `absolute left-0 top-0 h-8 rounded flex items-center ${cargoLevel.colorBg}`, style: `width: ${cargo.responses[perguntaIndex].toFixed(2)}%;`, children: [
                                                { tag: "span", className: "ml-2", children: `${cargo.responses[perguntaIndex].toFixed(2)}%` },
                                                { tag: "span", className: "ml-2 uppercase", children: cargoLevel.label }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }

            return {
                tag: 'div',
                className: "print-safe-block mb-16 print:mb-0",
                children: [
                    {
                        tag: 'div',
                        className: "p-6 w-full flex flex-col gap-3",
                        children: cargos.map(Cargo)
                    }
                ]
            }
        }

        function Perigo() {
            return {
                tag: 'div',
                className: 'flex flex-col flex-items-center justify-center bg-gray-200 rounded-lg w-full p-2',
                children: (new Array(10)).fill(null).map(_ => ({
                    tag: 'div',
                    className: "w-full flex flex-row items-start justify-evenly",
                    children: [
                        {
                            tag: 'div',
                            className: 'flex flex-col',
                            children: [
                                {
                                    tag: 'textarea',
                                }
                            ]
                        },
                    ]
                }))
            }
        }

        function PlanoDeAcao() {
            const [medidas, setMedidas] = KDOM.useState(pergunta.acoes.map(acao => () => Medida({ medida: acao, enabled_by_default: false })));

            function Medida({ medida, enabled_by_default = true }) {
                const [enabled, setEnabled] = KDOM.useState(enabled_by_default);
                const container = KDOM.useRef(null);
                return {
                    tag: 'div', ref: container, className: cn("flex items-center gap-3 py-2 px-2", enabled ? "bg-white text-black" : "bg-gray-100 text-gray-400 print:hidden"), children: [
                        { tag: 'div', className: "flex-1", children: medida },
                        { tag: 'span', className: "hidden print:inline-block text-lg align-middle ml-2", children: "✔ " },
                        { tag: 'span', className: "text-xs print:hidden", children: enabled ? "Aplica" : "Não se aplica" },
                        {
                            tag: 'div', className: "print:hidden flex items-center gap-4", children: [
                                {
                                    tag: "button",
                                    type: "button",
                                    role: "switch",
                                    'aria-checked': String(enabled),
                                    'data-state': enabled ? "checked" : "unchecked",
                                    value: enabled ? "on" : "off",
                                    className: "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300",
                                    onclick: () => setEnabled(!enabled),
                                    children: [
                                        { tag: 'span', "data-state": enabled ? "checked" : "unchecked", className: "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" }
                                    ]
                                },
                                {
                                    tag: 'button',
                                    type: "button",
                                    className: "inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg",
                                    title: "Remover item temporário",
                                    children: "Remover",
                                    onclick: event => container.current.remove(),
                                }
                            ]
                        },
                    ]
                }
            }

            function AddControl() {
                const [show, setShow] = KDOM.useState(false);
                const inputRef = KDOM.useRef("");

                const handleSave = value => {
                    const component = () => Medida({ value });
                    const novasMedidas = medidas.concat(component);
                    setMedidas(novasMedidas);
                }

                return show
                    ? {
                        tag: 'div',
                        className: "mt-3 print:hidden flex items-center gap-2",
                        children: [
                            { tag: 'input', oninput: event => inputRef.current = event.currentTarget.value, type: 'text', placeholder: "Descreva a medida a ser adicionada...", className: "flex-1 border border-gray-300 rounded px-3 py-2 text-sm", value: "" },
                            { tag: 'button', onclick: () => handleSave(inputRef.current), children: "Salvar", className: "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 rounded-md px-3 bg-blue-600 hover:bg-blue-700 text-white" },
                            { tag: 'button', onclick: () => setShow(false), children: "Cancelar", className: "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" },
                        ]
                    }
                    : {
                        tag: 'button',
                        className: "mt-3 print:hidden flex items-center text-blue-700 hover:text-blue-800 font-medium",
                        type: "button",
                        onclick: () => setShow(true),
                        children: [
                            {
                                tag: 'svg', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2", 'stroke-linecap': "round", 'stroke-linejoin': "round", class: "lucide lucide-plus w-4 h-4 mr-1", children: [
                                    { tag: "path", d: "M5 12h14" },
                                    { tag: "path", d: "M12 5v14" },
                                ]
                            },
                            "Adicionar medida temporária"
                        ]
                    }
            }

            function DataQuando() {
                const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                const formatMesAno = data => `${meses[data.getMonth()]}/${data.getFullYear()}`;

                const dataAvaliacao = KDOM.useSelector(s => s.dataAvaliacao);
                const reavaliacao = KDOM.useSelector(s => s.reavaliacao);

                const inicio = new Date(dataAvaliacao);
                inicio.setMonth(inicio.getMonth() + 1);
                const final = new Date(inicio);
                final.setMonth(final.getMonth() + Number(reavaliacao) - 1);

                return {
                    tag: 'span',
                    className: 'inline font-normal',
                    children: `${formatMesAno(inicio)} à ${formatMesAno(final)}`
                }
            }

            function TabelaReponsavel() {
                const tableData = [
                    { header: "Responsável", type: "text", placeholder: "Nome do Responsável" },
                    { header: "Data de Implantação", type: "text", placeholder: "__/__/____" },
                    { header: "A Fazer", type: "checkbox" },
                    { header: "Fazendo", type: "checkbox" },
                    { header: "Adiado", type: "checkbox" },
                    { header: "Concluído", type: "checkbox" },
                    { header: "Concluído em", type: "text", placeholder: "__/__/____" },
                ];

                return {
                    tag: 'table',
                    className: 'w-full border border-gray-300 rounded text-sm print:border-black mt-7',
                    children: [
                        {
                            tag: 'thead',
                            children: [{
                                tag: 'tr',
                                className: "bg-gray-100",
                                children: tableData.map(value => {
                                    return { tag: 'th', className: "border border-gray-300 px-2 py-1 print:border-black", children: value.header }
                                })
                            }]
                        },
                        {
                            tag: 'tbody',
                            children: [{
                                tag: 'tr',
                                children: tableData.map((value, colIndex) => {
                                    return {
                                        tag: 'td',
                                        className: "border border-gray-300 px-2 py-1 print:border-black text-center bg-white",
                                        children: [{
                                            tag: 'input',
                                            type: value.type,
                                            className: value.type === 'text'
                                                ? "w-full border border-gray-300 rounded px-1 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                : "w-4 h-4 align-middle print:border-black",
                                            readonly: value.type === 'text' ? null : "",
                                            placeholder: value?.placeholder,
                                        }]
                                    }
                                })
                            }]
                        },
                    ]
                }
            }

            return {
                tag: 'div',
                className: "p-4 bg-yellow-100 text-sm mb-4",
                children: [
                    {
                        tag: 'div', className: "mb-2", children: [
                            { tag: 'b', children: "Ação Recomendada:" },
                            ` Risco ${level.level}`
                        ]
                    },
                    { tag: 'b', children: "Medidas de Prevenção/Controle:" },
                    {
                        tag: 'div', className: "w-full mt-1", children: [
                            { tag: 'div', className: "flex flex-col border border-gray-200 rounded overflow-hidden", children: medidas },
                            AddControl,
                        ]
                    },
                    {
                        tag: 'div', className: "mt-4", children: [
                            {
                                tag: 'div',
                                className: 'mb-2',
                                children: [
                                    { tag: 'span', className: 'block font-bold', children: "Quando" },
                                    { tag: 'span', className: 'font-semibold', children: "Aplicar em: " },
                                    DataQuando,
                                    TabelaReponsavel
                                ]
                            },
                        ]
                    }
                ]
            }
        }

        return {
            tag: 'div',
            className: "mb-8 rounded-xl shadow-lg border-2 border-gray-200 bg-white break-inside-avoid-page",
            children: [
                {
                    tag: 'div', className: "px-6 py-4 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100", children: [
                        { tag: 'h4', className: "text-xl font-bold uppercase tracking-wide text-gray-800", children: pergunta.risco }
                    ]
                },
                {
                    tag: 'div',
                    className: "p-6 print:pb-0 gap-y-12",
                    children: [
                        Cabecalho,
                        Porcentagens,
                        // Perigos,
                        PlanoDeAcao
                    ]
                }
            ]
        }
    }

    return {
        tag: 'div',
        className: "mb-8 mt-8 print-chart-container max-w-5xl mx-auto px-2 sm:px-4 break-before-page",
        children: perguntas.map(Pergunta)
    }
}

export default function SectionResultadosGerais(index, id, title) {
    return Section(index, id, title, [QuadroMediaGeral, QuadroPerguntas]);
}