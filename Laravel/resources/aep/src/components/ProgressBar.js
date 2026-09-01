function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export default function ProgressBar({
    value = 0,
    max = 100,
    label,
    showValue = true,
    className = "",
    barClassName = "",
    trackClassName = "",
    ...props
} = {}) {
    const safeMax = max > 0 ? max : 100;
    const percent = clamp((Number(value) / safeMax) * 100, 0, 100);
    const formattedValue = Math.round(percent);

    return {
        tag: "div",
        className: cx("w-full space-y-2", className),
        children: [
            label || showValue
                ? {
                    tag: "div",
                    className: "flex items-center justify-between gap-3",
                    children: [
                        label
                            ? {
                                tag: "span",
                                className: "text-sm font-medium text-slate-700",
                                children: [label],
                            }
                            : null,
                        showValue
                            ? {
                                tag: "span",
                                className: "text-sm font-semibold text-slate-500",
                                children: [`${formattedValue}%`],
                            }
                            : null,
                    ].filter(Boolean),
                }
                : null,
            {
                tag: "div",
                role: "progressbar",
                "aria-valuemin": 0,
                "aria-valuemax": safeMax,
                "aria-valuenow": Number(value),
                className: cx(
                    "h-3 w-full overflow-hidden rounded-full bg-slate-200",
                    trackClassName,
                ),
                ...props,
                children: [
                    {
                        tag: "div",
                        className: cx(
                            "h-full rounded-full bg-blue-600 transition-[width] duration-300 ease-out",
                            barClassName,
                        ),
                        style: {
                            width: `${percent}%`,
                        },
                    },
                ],
            },
        ].filter(Boolean),
    };
}