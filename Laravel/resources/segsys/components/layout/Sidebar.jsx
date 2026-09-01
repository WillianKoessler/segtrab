import { NavLink, useLocation } from "react-router";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react";
import routes from "../../routes";
import { X } from "lucide-react";

export default function Sidebar({ open = false, onOpenChange }) {
    const location = useLocation();

    useEffect(() => {
        onOpenChange?.(false);
    }, [location.pathname, onOpenChange]);

    useEffect(() => {
        if (!open)
            return;

        const handleKeyDown = event => {
            if (event.key === "Escape")
                onOpenChange?.(false);
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    return (
        <>
            {open && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => onOpenChange?.(false)} />}

            <aside
                id="mobile-sidebar"
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-full w-60 -translate-x-full flex-col border-r bg-background shadow-xl transition-transform duration-200 ease-in-out md:static md:z-auto md:h-auto md:translate-x-0 md:shadow-none",
                    open && "translate-x-0"
                )}
            >
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        aria-label="Close navigation"
                        className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
                        onClick={() => onOpenChange?.(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <img src="/assets/img/logo.svg" className="p-4" />

                <Separator />

                <ScrollArea className="flex-1 p-3">
                    <nav className="grid gap-1">
                        {routes.filter(route => route.extra.icon).map(route => {
                            const Icon = route.extra.icon;

                            return (
                                <NavLink
                                    key={route.path}
                                    to={route.path}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-3 rounded-md mx-3 my-1 px-3 py-2 text-sm transition-colors",
                                            isActive
                                                ? "bg-accent text-accent-foreground font-medium"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        )
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{route.title}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </ScrollArea>
            </aside>
        </>
    );
}