function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}

function toChildren(children) {
    if (children === null || children === undefined || children === false) return [];
    return Array.isArray(children) ? children : [children];
}

export function Card({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "div",
        className: cx(
            "rounded-2xl border border-slate-200 bg-white shadow-sm",
            className,
        ),
        ...props,
        children: toChildren(children),
    };
}

export function CardHeader({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "div",
        className: cx("flex flex-col gap-1.5 p-6", className),
        ...props,
        children: toChildren(children),
    };
}

export function CardTitle({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "h3",
        className: cx("text-lg font-semibold tracking-tight text-slate-900", className),
        ...props,
        children: toChildren(children),
    };
}

export function CardDescription({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "p",
        className: cx("text-sm text-slate-500", className),
        ...props,
        children: toChildren(children),
    };
}

export function CardContent({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "div",
        className: cx("px-6 pb-6 pt-0", className),
        ...props,
        children: toChildren(children),
    };
}

export function CardFooter({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "div",
        className: cx("flex items-center p-6 pt-0", className),
        ...props,
        children: toChildren(children),
    };
}