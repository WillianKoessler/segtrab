import Section from "../layout/Section.js";
import cn from "../lib/cn.js";

const transpose = arr => arr?.at(0)?.map((_, colIndex) => arr?.map(row => row[colIndex])) || [];
const sum = (arr, condition = null, start = 0) => arr.reduce((t, v) => t + ((typeof condition === "function" ? condition(v) : condition) && v), start);


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

const selectPerguntas = (state) => {
    const perguntas = state.perguntas;
    if (!perguntas.length) return [];
    return state.perguntas.map(pergunta => pergunta);
}

const selectCargos = (state) => {
    const cargos = state.cargos;
    if (!cargos.length) return [];
    return state.cargos.map(cargo => cargo);
}

const getRiskSettings = hasRisk => {
    return {
        has: hasRisk,
        yesNo: !hasRisk ? 'Não' : 'Sim',
        withWithout: !hasRisk ? 'Sem' : 'Com',
        label: !hasRisk ? 'Bom' : 'Ruim',
        colorName: !hasRisk ? "Verde" : "Vermelha",
        colorZone: !hasRisk ? 'green' : 'red',
        colorBg: !hasRisk ? 'bg-green-400' : 'bg-red-400',
        colorText: !hasRisk ? 'text-green-500' : 'text-red-500',
        colorBorder: !hasRisk ? 'border-green-50' : 'border-red-50',
        level: !hasRisk ? "Baixo" : "Alto",
    }
}


function QuadroMediaGeral() {
    const perguntas = KDOM.useSelector(s => s.perguntas);
    const cargos = KDOM.useSelector(s => s.cargos);

    const perguntasResponses = transpose(cargos.map(cargo => cargo.responses));
    const avgAll = KDOM.useSelector(selectReportAverage);

    function PerguntaItem(pergunta, perguntaIndex) {
        const responses = perguntasResponses?.at(perguntaIndex);
        const avg = sum(responses, value => value > pergunta.threshold) / (responses.length || 1);
        const risk = getRiskSettings(responses.filter(response => response > pergunta.threshold).length !== 0);

        return {
            tag: 'a', className: 'w-full mb-1', href: `#pergunta_${perguntaIndex + 1}`, children: [
                {
                    tag: 'div', className: "flex justify-between items-center", children: [
                        { tag: 'span', className: "text-gray-700 font-medium", children: pergunta.risco },
                        { tag: 'span', className: "text-sm font-semibold text-gray-600", children: `${avg.toFixed(2)}%` }
                    ]
                },
                {
                    tag: 'div', className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden", children: [
                        { tag: 'div', className: cn("h-full transition-all duration-300", getRiskSettings(true).colorBg), style: `width: ${avg}%` }
                    ]
                }
            ]
        };
    }

    function Label(label, hasRisk) {
        const risk = getRiskSettings(hasRisk);
        return {
            tag: 'div', className: `bg-${risk.colorZone}-50 p-4 rounded-lg border border-black`, children: [
                {
                    tag: 'div', className: `flex items-center gap-x-2 mb-2 text-${risk.colorZone}-800`, children: [
                        { tag: 'div', className: cn("w-4 h-4 rounded", risk.colorBg) },
                        { tag: 'span', className: "font-semibold", children: `Zona ${risk.colorName} ` },
                        { tag: 'span', className: "font-thin text-sm", children: hasRisk ? "Risco Encontrado" : "Não há Risco" },
                    ]
                },
                { tag: 'p', className: `text-${risk.colorZone}-700`, children: label }
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
            {
                tag: 'div', className: "flex flex-row justify-evenly w-full text-sm mb-2 gap-4 print:text-xs", children: [
                    Label('Boa percepção, manutenção recomendada.', false),
                    Label('Risco elevado, ação corretiva imediata.', true),
                ]
            },
        ],
    };
}

function QuadroPerguntas() {
    const perguntas = KDOM.useSelector(selectPerguntas);
    const cargos = KDOM.useSelector(selectCargos);
    const perguntasResponses = transpose(cargos.map(cargo => cargo.responses));

    function Pergunta(pergunta, perguntaIndex) {
        const responses = perguntasResponses?.at(perguntaIndex);
        const risk = getRiskSettings(responses?.filter(response => response > pergunta.threshold).length !== 0);

        function Cabecalho() {
            return {
                tag: 'div',
                className: "w-full px-6 gap-y-8",
                children: [
                    {
                        tag: 'div',
                        className: "w-full px-6",
                        children: [
                            { tag: 'div', className: 'text-black font-bold', children: "Pergunta:" },
                            { tag: 'div', className: 'text-gray-700 font-normal', children: pergunta.pergunta }
                        ],
                    }
                ]
            }
        }

        function Porcentagens() {
            function Cargo(cargo, cargoIndex) {
                const cargoRisk = getRiskSettings(cargo.responses[perguntaIndex] > pergunta.threshold);
                return {
                    tag: "div", className: "flex items-center gap-4 text-gray-700", children: [
                        { tag: "div", className: "w-2/5 text-right text-sm", children: { tag: "span", className: "block", children: cargo.name } },
                        // { tag: "span", className: "w-[70px] text-center font-semibold bg-gray-100 rounded-lg", children: `${perguntasResponses[perguntaIndex][cargoIndex].toFixed(2)}%` },
                        { tag: "span", className: "w-[70px] text-center font-semibold bg-gray-100 rounded-lg", children: `${cargo.responses[perguntaIndex].toFixed(2)}%` },
                        {
                            tag: "div", className: "flex-1", children:
                            {
                                tag: "div", className: "relative h-8 bg-gray-100 rounded font-semibold", children: {
                                    tag: "div", className: `absolute left-0 top-0 h-8 rounded flex items-center ${cargoRisk.colorBg}`, style: `width: ${cargo.responses[perguntaIndex].toFixed(2)}%;`, children: [
                                        { tag: "span", className: "ml-2 uppercase whitespace-nowrap", children: `${cargoRisk.withWithout} RISCO` }
                                    ]
                                }
                            }
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

        function Perigos() {
            const resultadoSrc = [
                ["Trivial", "Trivial", "Tolerável", "Moderado", "Moderado",],
                ["Trivial", "Tolerável", "Moderado", "Moderado", "Substancial",],
                ["Trivial", "Tolerável", "Moderado", "Substancial", "Intolerável",],
                ["Tolerável", "Tolerável", "Moderado", "Substancial", "Intolerável",],
                ["Tolerável", "Moderado", "Substancial", "Intolerável", "Intolerável",],
            ];
            const certezaSrc = {
                "Trivial": ["Nenhuma ação é necessária", "Nenhuma informação adicional é necessária", "Nenhuma informação adicional é necessária"],
                "Tolerável": ["Nenhum controle adicional é necessário", "Informação adicional necessária", "Informação adicional necessária"],
                "Moderado": ["Controle adicional se for possível e viável", "Informação adicional necessária", "Informação adicional necessária"],
                "Substancial": ["Controle necessário", "Controle e informação adicional necessários", "Controle e informação adicional necessários"],
                "Intolerável": ["Ação imediata ou interrupção da atividade", "Controle e informação adicional necessários", "Controle e informação adicional necessários"],
            }

            const [resultado, setResultado] = KDOM.useState(risk.has ? [5, 3] : [3, 1]);
            const [selectedResult, setSelectedResult] = KDOM.useState(risk.has ? resultadoSrc[4][2] : resultadoSrc[2][0]);
            const [certeza, setCerteza] = KDOM.useState(0);

            const handleChange = (event, id) => {
                let r = resultado;
                r[id] = Number(event.currentTarget.value);
                setResultado(r);
                setSelectedResult(resultadoSrc[resultado[0] - 1][resultado[1] - 1]);
            }


            function Field(label, className, children) {
                return {
                    tag: 'div',
                    className: cn('inline-flex flex-col mx-auto', className),
                    children: [
                        {
                            tag: 'span',
                            className: "uppercase",
                            style: { fontSize: '0.625rem', lineHeight: '0.75rem' },
                            children: label
                        },
                        children,
                    ]
                }
            }

            const defaultClass = "bg-white border border-gray-500 resize-none rounded-lg print:border-none print:bg-transparent py-1 px-2";

            return {
                tag: 'div',
                className: 'flex flex-col items-center justify-evenly bg-gray-200 rounded-lg w-full p-2 mb-4 gap-2',
                children: [
                    {
                        tag: 'div',
                        className: "flex flex-row gap-2 w-full",
                        children: [
                            Field("Perigos / Fontes Geradoras / Circunstâncias", "w-full", {
                                tag: 'textarea',
                                className: cn(defaultClass, 'text-sm'),
                                placeholder: risk.has ? pergunta.risco : "",
                            }),
                            Field("Possíveis Danos à Saúde", "w-full", {
                                tag: 'textarea',
                                className: cn(defaultClass, 'text-sm'),
                                placeholder: risk.has ? "Estresse, ansiedade, burnout" : "",
                            }),
                        ]
                    },
                    {
                        tag: 'div',
                        className: "flex w-full",
                        children: [
                            Field("Probabilidade", 'mx-2 justify-center items-center', {
                                tag: 'input', type: "number", style: { fieldSizing: 'content' }, min: 1, max: 5, onchange: e => handleChange(e, 0),
                                className: cn(defaultClass, 'text-center w-fit'),
                                value: resultado[0]
                            }),
                            Field("Severidade", 'mx-2 justify-center items-center', {
                                tag: 'input', type: "number", style: { fieldSizing: 'content' }, min: 1, max: 5, onchange: e => handleChange(e, 1),
                                className: cn(defaultClass, 'text-center w-fit'),
                                value: resultado[1]
                            }),
                            Field("Resultado", 'mx-2 flex-grow justify-center items-center', {
                                tag: 'input',
                                className: cn(defaultClass, "w-fit text-center"),
                                style: { fieldSizing: 'content' },
                                onchange: e => setResultado(e.currentTarget.value),
                                placeholder: selectedResult  //risk.has ? "Substancial" : "Trivial"
                            }),
                            Field("Medida Recomendada", 'mx-2 flex-grow justify-center items-center', {
                                tag: 'input',
                                className: cn(defaultClass, "text-center"),
                                style: { fieldSizing: 'content' },
                                placeholder: certezaSrc[selectedResult][0]//risk.has ? "Controle Necessário" : "Nenhuma ação é necessária"
                            }),
                        ]
                    }
                ]
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
                    const component = () => Medida({ medida: value, enabled_by_default: true });
                    const novasMedidas = medidas.concat(component);
                    setMedidas(novasMedidas);
                }

                return show
                    ? {
                        tag: 'div',
                        className: "mt-3 print:hidden flex items-center gap-2",
                        children: [
                            { tag: 'input', oninput: event => inputRef.current = event.currentTarget.value, type: 'text', placeholder: "Descreva a medida a ser adicionada...", className: "flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white", value: "" },
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
                    { header: "Responsável", type: "text" },
                    { header: "Data de Implantação", type: "text", placeholder: "___/___/______" },
                    { header: "A Fazer", type: "checkbox" },
                    { header: "Fazendo", type: "checkbox" },
                    { header: "Adiado", type: "checkbox" },
                    { header: "Concluído", type: "checkbox" },
                    { header: "Concluído em", type: "text", placeholder: "___/___/______" },
                ];

                return {
                    tag: 'table',
                    className: 'w-full text-xs border border-gray-300 rounded text-sm print:border-black mt-7',
                    children: [
                        {
                            tag: 'thead',
                            children: [{
                                tag: 'tr',
                                className: "bg-gray-100 text-center",
                                children: tableData.map(value => {
                                    return { tag: 'th', className: "px-2 py-1 border-none", children: value.header }
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
                                        className: "border border-gray-300 px-2 py-1 print:border-black bg-white text-center",
                                        children: [{
                                            tag: 'input',
                                            type: value.type,
                                            className: value.type === 'text'
                                                ? "w-full rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400 text-center"
                                                : "w-4 h-4 align-middle",
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
                            ` Risco ${risk.level}`
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
            className: cn("mb-8 rounded-xl shadow-lg border-2 border-gray-200 bg-white", perguntaIndex === 0 ? "" : "break-inside-avoid-page"),
            children: [
                {
                    tag: 'div', id: `pergunta_${perguntaIndex + 1}`, className: "px-6 py-4 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100", children: [
                        { tag: 'h4', className: "text-xl font-bold uppercase tracking-wide text-gray-800", children: pergunta.risco }
                    ]
                },
                {
                    tag: 'div',
                    className: "p-6 print:pb-0 gap-y-12",
                    children: [
                        Cabecalho,
                        Porcentagens,
                        Perigos,
                        PlanoDeAcao
                    ]
                }
            ]
        }
    }

    return {
        tag: 'div',
        className: "mb-8 mt-8 print-chart-container max-w-5xl mx-auto px-2 sm:px-4",
        children: perguntas.map(Pergunta)
    }
}

export default function SectionResultadosGerais(index, id, title) {
    return Section(index, id, title, [/* QuadroMediaGeral, */QuadroPerguntas]);
}