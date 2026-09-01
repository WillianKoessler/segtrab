// import Button from "../components/Button.js";

// function Panel(closeCallback) {
//     const CloseBtn = () => {
//         return {
//             tag: 'button',
//             className: 'size-6 border border-black rounded-lg',
//             children: 'x',
//             onclick: closeCallback
//         }
//     };

//     const SectionItem = (label, input) => {
//         return () => {
//             return {
//                 tag: 'div',
//                 className: "flex flex-row justify-even items-center gap-3 m-2",
//                 children: [
//                     {
//                         tag: 'span',
//                         className: 'text-sm',
//                         children: label
//                     },
//                     {
//                         tag: 'input',
//                         className: '',
//                         ...input
//                     }
//                 ]
//             }
//         }
//     };

//     const Section = (title, children) => {
//         return () => {
//             return {
//                 tag: 'div',
//                 className: "rounded-lg w-full bg-black/10",
//                 children: [
//                     {
//                         tag: 'span',
//                         className: "uppercase px-2 font-semibold",
//                         children: title
//                     },
//                     ...children
//                 ]
//             }
//         }
//     };

//     return {
//         tag: 'div',
//         className: 'w-screen h-screen flex justify-center items-center bg-black/50',
//         children: [{
//             tag: 'div',
//             className: "bg-white rounded-lg flex flex-col justify-between items-end p-2",
//             children: [
//                 CloseBtn,
//                 Section("Empresa", [
//                     SectionItem("Razão Social", { type: "text", onchange: console.log })
//                 ])
//             ]
//         }]
//     }
// }

// export default function ControlPanel() {
//     const [open, setOpen] = KDOM.useState(false);

//     return {
//         tag: 'div',
//         className: 'print:hidden fixed top-0 left-0',
//         children: [
//             open
//                 ? () => Panel(() => setOpen(false))
//                 : Button({
//                     onclick: event => setOpen(true),
//                     children: "Painel de Controle"
//                 }),
//         ]
//     }
// }



const DEFAULT_TITLE = "Control Panel";

function isPlainObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

function pathToLabel(path) {
    return String(path)
        .replace(/./g, " ")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^\w/, (m) => m.toUpperCase());
}

function getIn(obj, path) {
    if (!path) return obj;
    const parts = Array.isArray(path) ? path : String(path).split(".");
    let cur = obj;
    for (const part of parts) {
        if (cur == null) return undefined;
        cur = cur[part];
    }
    return cur;
}

function setIn(obj, path, value) {
    const parts = Array.isArray(path) ? path : String(path).split(".");
    if (parts.length === 0) return value;
    const root = Array.isArray(obj) ? obj.slice() : { ...(obj || {}) };
    let cur = root;
    for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        const next = cur[key];
        cur[key] = Array.isArray(next) ? next.slice() : isPlainObject(next) ? { ...next } : {};
        cur = cur[key];
    }
    cur[parts[parts.length - 1]] = value;
    return root;
}

function flattenState(state, prefix = "", out = []) {
    if (!isPlainObject(state)) return out;
    for (const [key, value] of Object.entries(state)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (isPlainObject(value)) flattenState(value, path, out);
        else out.push({ path, value });
    }
    return out;
}

function coerceFromInput(raw, kind, previousValue) {
    if (kind === "boolean") return !!raw;
    if (kind === "number") {
        if (raw === "" || raw == null) return 0;
        const n = Number(raw);
        return Number.isNaN(n) ? (typeof previousValue === "number" ? previousValue : 0) : n;
    }
    if (kind === "json") {
        try {
            return JSON.parse(raw);
        } catch {
            return previousValue;
        }
    }
    return raw;
}

function inferKind(value) {
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") {
        if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim())) return "color";
        if (value.length > 80 || /[\n\r\t]/.test(value)) return "textarea";
        return "text";
    }
    if (value == null) return "text";
    return "json";
}

function inputClass(kind) {
    const base =
        "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30";
    if (kind === "textarea") return `${base} min-h-24 resize-y`;
    return base;
}

function FieldEditor({ label, path, value, onChange, onReset }) {
    const kind = inferKind(value);
    const displayed =
        kind === "json"
            ? (() => {
                try {
                    return JSON.stringify(value, null, 2);
                } catch {
                    return String(value);
                }
            })()
            : value == null
                ? ""
                : String(value);

    const common = {
        className: inputClass(kind),
        "data-path": path,
    };

    let control;
    if (kind === "boolean") {
        control = {
            tag: "label",
            className:
                "inline-flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100",
            children: [
                {
                    tag: "input",
                    type: "checkbox",
                    checked: !!value,
                    onChange: (e) => onChange(path, "boolean", e.target.checked, value),
                    className: "h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500",
                },
                { tag: "span", children: [value ? "Ativo" : "Inativo"] },
            ],
        };
    } else if (kind === "textarea") {
        control = {
            tag: "textarea",
            ...common,
            value: displayed,
            rows: 4,
            onInput: (e) => onChange(path, "textarea", e.target.value, value),
        };
    } else if (kind === "number") {
        control = {
            tag: "input",
            ...common,
            type: "number",
            value: value ?? 0,
            onInput: (e) => onChange(path, "number", e.target.value, value),
        };
    } else if (kind === "color") {
        control = {
            tag: "div",
            className: "flex items-center gap-2",
            children: [
                {
                    tag: "input",
                    className:
                        "h-10 w-14 cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-1",
                    type: "color",
                    value: value,
                    onInput: (e) => onChange(path, "text", e.target.value, value),
                },
                {
                    tag: "input",
                    ...common,
                    value: value,
                    onInput: (e) => onChange(path, "text", e.target.value, value),
                },
            ],
        };
    } else {
        control = {
            tag: "input",
            ...common,
            type: "text",
            value: displayed,
            onInput: (e) => onChange(path, kind === "json" ? "json" : "text", e.target.value, value),
        };
    }

    return {
        tag: "div",
        className: "space-y-1.5",
        children: [
            {
                tag: "div",
                className: "flex items-center justify-between gap-3",
                children: [
                    {
                        tag: "label",
                        className: "text-xs font-medium uppercase tracking-wide text-slate-400",
                        children: [label],
                    },
                    {
                        tag: "button",
                        type: "button",
                        className:
                            "rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200",
                        onClick: () => onReset(path),
                        children: ["Reset"],
                    },
                ],
            },
            control,
        ],
    };
}

function ControlPanelContent(props) {
    const K = globalThis.KDOM;
    const storeRef = props.store || props.storeRef || props.ref;
    const [storeState, dispatch] = K.useStoreState(storeRef);
    const [draft, setDraft] = K.useState(() => storeState || {});
    const [search, setSearch] = K.useState("");
    const [status, setStatus] = K.useState("Pronto");
    const panelRef = K.useRef(null);

    K.useEffect(() => {
        setDraft(storeState || {});
    }, [storeState]);

    K.useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape" && props.open !== false && typeof props.onClose === "function") {
                props.onClose();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [props.open, props.onClose]);

    const entries = flattenState(draft);
    const filtered = search
        ? entries.filter(({ path, value }) => {
            const hay = `${path} ${String(value ?? "")}`.toLowerCase();
            return hay.includes(search.toLowerCase());
        })
        : entries;

    function updateField(path, kind, raw, previousValue) {
        const nextValue = coerceFromInput(raw, kind, previousValue);
        setDraft((current) => setIn(current, path, nextValue));
        setStatus(`Alterado: ${path}`);
    }

    function resetField(path) {
        const original = getIn(storeState, path);
        setDraft((current) => setIn(current, path, original));
        setStatus(`Resetado: ${path}`);
    }

    function applyChanges() {
        if (!dispatch) return;
        dispatch({
            type: props.actionType || "@@control-panel/merge",
            payload: draft,
            meta: { source: "control-panel" },
        });
        if (typeof props.onApply === "function") props.onApply(draft);
        setStatus("Aplicado à store");
    }

    function restoreAll() {
        setDraft(storeState || {});
        setStatus("Rascunho restaurado");
    }

    const title = props.title || DEFAULT_TITLE;
    const subtitle = props.subtitle || "Edite valores da store em tempo real.";
    const isOpen = props.open !== false;

    return {
        tag: "div",
        ref: panelRef,
        className:
            "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm",
        onMouseDown: (e) => {
            if (e.target === e.currentTarget && typeof props.onClose === "function") props.onClose();
        },
        children: [
            {
                tag: "div",
                className:
                    "w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40",
                children: [
                    {
                        tag: "div",
                        className:
                            "flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4",
                        children: [
                            {
                                tag: "div",
                                className: "space-y-1",
                                children: [
                                    { tag: "h2", className: "text-lg font-semibold text-white", children: [title] },
                                    {
                                        tag: "p",
                                        className: "text-sm text-slate-400",
                                        children: [subtitle],
                                    },
                                ],
                            },
                            {
                                tag: "button",
                                type: "button",
                                className:
                                    "rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800",
                                onClick: () => typeof props.onClose === "function" && props.onClose(),
                                children: ["Fechar"],
                            },
                        ],
                    },
                    {
                        tag: "div",
                        className: "grid gap-0 lg:grid-cols-[1.25fr_0.75fr]",
                        children: [
                            {
                                tag: "div",
                                className: "border-b border-slate-800 p-5 lg:border-b-0 lg:border-r",
                                children: [
                                    {
                                        tag: "div",
                                        className: "mb-4 flex flex-wrap items-center gap-3",
                                        children: [
                                            {
                                                tag: "div",
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    {
                                                        tag: "input",
                                                        className: inputClass("text"),
                                                        type: "search",
                                                        placeholder: "Buscar campo...",
                                                        value: search,
                                                        onInput: (e) => setSearch(e.target.value),
                                                    },
                                                ],
                                            },
                                            {
                                                tag: "button",
                                                type: "button",
                                                className:
                                                    "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800",
                                                onClick: restoreAll,
                                                children: ["Restaurar"],
                                            },
                                            {
                                                tag: "button",
                                                type: "button",
                                                className:
                                                    "rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-500",
                                                onClick: applyChanges,
                                                children: ["Aplicar"],
                                            },
                                        ],
                                    },
                                    {
                                        tag: "div",
                                        className: "max-h-[60vh] space-y-4 overflow-auto pr-1",
                                        children:
                                            filtered.length > 0
                                                ? filtered.map(({ path, value }) =>
                                                    FieldEditor({
                                                        label: pathToLabel(path),
                                                        path,
                                                        value,
                                                        onChange: updateField,
                                                        onReset: resetField,
                                                    })
                                                )
                                                : [
                                                    {
                                                        tag: "div",
                                                        className:
                                                            "rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400",
                                                        children: ["Nenhum campo encontrado."],
                                                    },
                                                ],
                                    },
                                ],
                            },
                            {
                                tag: "div",
                                className: "space-y-4 p-5",
                                children: [
                                    {
                                        tag: "div",
                                        className: "rounded-xl border border-slate-800 bg-slate-950 p-4",
                                        children: [
                                            {
                                                tag: "div",
                                                className: "text-xs font-medium uppercase tracking-wide text-slate-400",
                                                children: ["Status"],
                                            },
                                            {
                                                tag: "div",
                                                className: "mt-2 text-sm text-slate-100",
                                                children: [status],
                                            },
                                        ],
                                    },
                                    {
                                        tag: "div",
                                        className: "rounded-xl border border-slate-800 bg-slate-950 p-4",
                                        children: [
                                            {
                                                tag: "div",
                                                className: "text-xs font-medium uppercase tracking-wide text-slate-400",
                                                children: ["Store"],
                                            },
                                            {
                                                tag: "pre",
                                                className:
                                                    "mt-2 max-h-[48vh] overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-slate-300",
                                                children: [
                                                    (() => {
                                                        try {
                                                            return JSON.stringify(draft, null, 2);
                                                        } catch {
                                                            return String(draft);
                                                        }
                                                    })(),
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            !isOpen
                ? {
                    tag: "div",
                    className: "hidden",
                }
                : null,
        ].filter(Boolean),
    };
}

export function ControlPanelButton(props = {}) {
    const [open, setOpen] = globalThis.KDOM.useState(!!props.defaultOpen);
    return {
        tag: "div",
        children: [
            {
                tag: "button",
                type: "button",
                className:
                    props.buttonClassName ||
                    "fixed bottom-4 right-4 z-40 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500 active:scale-[0.98]",
                onClick: () => setOpen(true),
                children: [props.buttonLabel || "Abrir painel"],
            },
            open
                ? {
                    tag: ControlPanel,
                    open: true,
                    store: props.store,
                    storeRef: props.storeRef,
                    ref: props.ref,
                    title: props.title,
                    subtitle: props.subtitle,
                    actionType: props.actionType,
                    onApply: props.onApply,
                    onClose: () => setOpen(false),
                }
                : null,
        ],
    };
}

export function ControlPanel(props = {}) {
    return ControlPanelContent(props);
}
