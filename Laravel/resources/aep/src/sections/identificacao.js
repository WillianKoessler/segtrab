import Button from "../components/Button.js";
import Input from "../components/Input.js";
import Section from "../layout/Section.js";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../components/Table.js";

function parseDate(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
}

function formatDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

const resp_tecnicos = [
    {
        nome: "Filipe Silva Leite",
        formacao: "Eng. de Segurança do Trabalho",
        registro: "CREA: 1413179258"
    },
    {
        nome: "Glauber da Costa Milach",
        formacao: "Médico do Trabalho",
        registro: "CRM: 52301610"
    },
    {
        nome: "Lucia de Araújo Barbosa Rosas",
        formacao: "Psicóloga",
        registro: "CRP: RJ 05/54967"
    },
]

function ResponsaveisTecnicosTable() {
    return Table({
        children: [
            TableHead({
                children: [
                    TableHeadCell({ children: "Nome", align: "center" }),
                    TableHeadCell({ children: "Formação", align: "center" }),
                    TableHeadCell({ children: "Registro", align: "center" }),
                ]
            }),
            TableBody({
                children: resp_tecnicos.map(tec => TableRow({
                    children: [
                        TableCell({ className: 'print:p-0', children: { tag: 'input', className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm print:border-0 print:p-0", value: tec.nome } }),
                        TableCell({ className: 'print:p-0', children: { tag: 'input', className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm print:border-0 print:p-0", value: tec.formacao } }),
                        TableCell({ className: 'print:p-0', children: { tag: 'input', className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm print:border-0 print:p-0", value: tec.registro } }),
                    ]
                }))
            })
        ]
    })
}

function IdentificationItem({ id, display, specs }) {
    const spec = typeof specs === "string" ? { type: specs } : specs
    const dispatch = KDOM.useDispatch();
    const storedValue = KDOM.useSelector(s => s[id]);

    const inputType = spec.type === "date" ? "date" : spec.type === "number" ? "number" : "text";

    const inputValue =
        spec.type === "date"
            ? (storedValue instanceof Date ? formatDate(storedValue) : (typeof storedValue === "string" ? storedValue : ""))
            : (storedValue ?? "");

    const handleChange = (event) => {
        const raw = event.currentTarget.value;
        let payload = raw;

        switch (spec.type) {
            case "date":
                payload = raw ? parseDate(raw) : null;
                break;
            case "number":
                payload = raw === "" ? null : Number(raw);
                break;
            case "cnpj":
            default:
                payload = raw;
                break;
        }

        dispatch({ type: `set:${id}`, payload });
    }

    const cnpjMask = value => {
        value = value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d)/, "$1.$2");
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
        return value.slice(0, 18);
    }

    const { type: _ignoredType, defaultValue: _ignoredDefaultValue, ...inputProps } = spec;

    return {
        tag: "li",
        className: "flex flex-row items-center gap-3",
        children: [
            {
                tag: "span",
                className: "font-bold text-blue-700",
                children: `${display}:`
            },
            {
                tag: 'input',
                className: "rounded border border-blue-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400 print:p-0 print:text-gray-800 print:border-none bg-white print:bg-transparent",
                style: { fieldSizing: 'content' },
                type: inputType,
                value: inputValue,
                ...inputProps,
                oninput: spec.type === 'cnpj' ? (e) => e.target.value = cnpjMask(e.target.value) : null,
                onchange: handleChange
            }
        ]
    }
}

function HiddenData() {
    const cargos = KDOM.useSelector(s => s.cargos);
    const dispatch = KDOM.useDispatch();

    function AddControl() {
        const [show, setShow] = KDOM.useState(false);
        const inputRef = KDOM.useRef("");

        const handleSave = value => {
            dispatch({
                type: `add:cargos`,
                payload: value
            })
        }

        const handleInput = event => {
            inputRef.current = event.currentTarget.value;
        }

        const handleKeyPressed = event => {
            if (event.key === "Enter")
                handleSave(inputRef.current);
        }

        KDOM.useEffect(() => {
            if (show && inputRef.current) {
                inputRef.current.focus();
            }
        }, [show]);

        return show
            ? {
                tag: 'div',
                className: "mt-3 print:hidden flex items-center gap-2",
                children: [
                    { tag: 'input', ref: inputRef, onkeydown: handleKeyPressed, oninput: handleInput, type: 'text', placeholder: "Nome do Cargo", className: "bg-white flex-1 border border-gray-300 rounded px-3 py-2 text-sm", value: "" },
                    { tag: 'button', onclick: (event) => handleSave(inputRef.current), children: "Salvar", className: "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 rounded-md px-3 bg-blue-600 hover:bg-blue-700 text-white" },
                    { tag: 'button', onclick: () => setShow(false), children: "Cancelar", className: "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" },
                ]
            }
            : Button({
                variant: "primary",
                onclick: () => setShow(true),
                className: 'w-fit',
                children: "Adicionar Cargo"
            })
    }

    function CargoItem(cargo, index) {
        const storeData = () => {
            // cargo.responses.forEach((percent, perguntaIndex) => {
            //     dispatch({
            //         type: "update:pergunta",
            //         payload: {
            //             index: perguntaIndex,
            //             property: "currentPercent",
            //             value: percent
            //         }
            //     })
            // })
            dispatch({
                type: "set:cargos",
                payload: { index: index, value: cargo }
            });
        }

        const handleNameChange = e => { cargo.name = e.currentTarget.value; storeData() }
        const handleResponseChange = (responseIndex, value) => {
            cargo.responses[responseIndex] = Number(value);
            storeData();
        }
        const handleRemoval = () => {
            dispatch({
                type: 'rem:cargos',
                payload: cargo
            })
        }

        return {
            tag: 'div',
            className: 'flex flex-col rounded-lg border border-blue-300 p-2 gap-2',
            children: [
                {
                    tag: 'div',
                    className: "flex flex-row flex-nowrap justify-between",
                    children: [
                        {
                            tag: 'div',
                            className: "flex flex-row items-center gap-2 w-full",
                            children: [
                                { tag: 'span', children: "Cargo: " },
                                Input({
                                    onchange: handleNameChange,
                                    placeholder: "Nome do Cargo",
                                    value: cargo.name,
                                    className: "w-full"
                                })
                            ]
                        },
                        Button({ variant: "destructive", onclick: handleRemoval, children: "Remover" })
                    ]
                },
                {
                    tag: 'div',
                    className: "bg-gray-200 flex flex-row flex-wrap gap-2 rounded-lg p-2 border border-gray-300",
                    children: cargo.responses.map((response, i) => ({
                        tag: 'div',
                        className: 'flex flex-col gap-2 text-sm bg-gray-300 text-center rounded-lg',
                        children: [
                            { tag: 'span', children: `Q#${i + 1}` },
                            {
                                tag: 'input',
                                oninput: e => handleResponseChange(i, e.currentTarget.value),
                                type: 'number',
                                max: 100,
                                min: 0,
                                className: "w-12 text-sm text-center",
                                value: response
                            }
                        ]
                    }))
                }
            ]
        }
    }

    return {
        tag: 'div',
        className: "flex flex-col gap-4",
        children: [
            ...cargos.map((cargo, i) => { return () => CargoItem(cargo, i) }),
            AddControl
        ]
    }
}

export default function SectionIdentificacao(index, id, title) {
    return Section(index, id, title, [
        {
            tag: 'ul',
            className: "bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 space-y-3 text-sm sm:text-lg flex flex-col items-start",
            children: [
                { id: "razao_social", display: "Empresa", specs: "text" },
                { id: "cnpj", display: "CNPJ", specs: "cnpj" },
                { id: "address", display: "Endereço", specs: "text" },
                { id: "cnae", display: "CNAE do estabelecimento", specs: "text" },
                { id: "classe_risco", display: "Classe de risco", specs: { type: "number", min: 1, max: 4 } },
                { id: "num_avaliados", display: "Número de Trabalhadores Avaliados", specs: { type: "number", min: 1 } },
                { id: "dataAvaliacao", display: "Data da Avaliação", specs: { type: "date", defaultValue: (new Date(Date.now())).toLocaleDateString() } },
                { id: "reavaliacao", display: "Reavaliação Recomendada (meses)", specs: { type: "number", min: 1 } },
            ].map(props => () => IdentificationItem(props))
        },
        {
            tag: 'div',
            className: "print:hidden bg-gray-100 p-4 my-4 rounded-lg border-l-4 border-red-200 flex flex-col items-start",
            children: [
                { tag: 'span', className: "text-gray-400 text-lg", children: "Esta parte não aparecerá na impressão." },
                HiddenData,
            ]
        },
        {
            tag: 'div',
            className: "mb-12 mt-8",
            children: [
                {
                    tag: 'h3',
                    className: "text-2xl font-bold text-blue-800 mb-4",
                    children: `${index}.1 Responsáveis Técnicos pela Ferramenta de avaliação de FRPRT:`
                },
                ResponsaveisTecnicosTable
            ]
        },
    ]);
}