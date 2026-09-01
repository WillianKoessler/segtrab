import cn from "../lib/cn.js";

function toChildren(children) {
    if (children === null || children === undefined || children === false) return [];
    return Array.isArray(children) ? children : [children];
}

export function Table({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "div",
        className: cn("w-full overflow-x-auto", className),
        children: [
            {
                tag: "table",
                className: cn(
                    "w-full caption-bottom border-collapse text-sm",
                    props.tableClassName,
                ),
                ...props,
                children: toChildren(children),
            },
        ],
    };
}

export function TableCaption({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "caption",
        className: cn("mt-4 text-sm text-slate-500", className),
        ...props,
        children: toChildren(children),
    };
}

export function TableHead({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "thead",
        className: cn("border-b border-slate-200 bg-slate-50", className),
        ...props,
        children: toChildren(children),
    };
}

export function TableBody({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "tbody",
        className: cn("divide-y divide-slate-200", className),
        ...props,
        children: toChildren(children),
    };
}

export function TableRow({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "tr",
        className: cn(
            "transition-colors hover:bg-slate-50",
            className,
        ),
        ...props,
        children: toChildren(children),
    };
}

export function TableHeadCell({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "th",
        scope: props.scope || "col",
        className: cn(
            `px-4 py-3 text-${props?.align || "center"} align-middle text-xs font-semibold uppercase tracking-wide text-slate-600`,
            className,
        ),
        ...props,
        children: toChildren(children),
    };
}

export function TableCell({
    className = "",
    children,
    ...props
} = {}) {
    return {
        tag: "td",
        className: cn("px-4 py-3 align-middle text-slate-700", className),
        ...props,
        children: toChildren(children),
    };
}