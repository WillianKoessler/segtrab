function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}

export default function Input({
    className = "",
    label,
    hint,
    error,
    id,
    type = "text",
    children, // ignorado de propósito, mantido para compatibilidade
    ...props
} = {}) {
    const inputId = id || props.name;

    const inputNode = {
        tag: "input",
        id: inputId,
        type,
        className: cx(
            "flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
            "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500" : "",
            className,
        ),
        ...props,
    };

    if (!label && !hint && !error) return inputNode;

    return {
        tag: "div",
        className: "space-y-1.5",
        children: [
            label
                ? {
                    tag: "label",
                    htmlFor: inputId,
                    className: "block text-sm font-medium text-slate-700",
                    children: [label],
                }
                : null,
            inputNode,
            error
                ? {
                    tag: "p",
                    className: "text-xs text-red-600",
                    children: [error],
                }
                : hint
                    ? {
                        tag: "p",
                        className: "text-xs text-slate-500",
                        children: [hint],
                    }
                    : null,
        ].filter(Boolean),
    };
}