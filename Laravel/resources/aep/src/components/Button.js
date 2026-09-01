const variantClasses = {
    default:
        "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900",
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
    secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
    ghost:
        "bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400",
    destructive:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
};

const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-base",
    icon: "h-10 w-10 p-0",
};

function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}

function toChildren(children) {
    if (children === null || children === undefined || children === false) return [];
    return Array.isArray(children) ? children : [children];
}

export default function Button({
    variant = "default",
    size = "md",
    className = "",
    type = "button",
    disabled = false,
    children,
    ...props
} = {}) {
    return {
        tag: "button",
        type,
        disabled,
        className: cx(
            "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            variantClasses[variant] || variantClasses.default,
            sizeClasses[size] || sizeClasses.md,
            className,
        ),
        ...props,
        children: toChildren(children),
    };
}