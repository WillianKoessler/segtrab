import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ScrollArea } from "#components/ui/scroll-area";
import { Toaster } from "sonner";
import { useTheme } from "../../../js/contexts/theme-context";

export function DashboardLayout() {
    const { resolvedTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className="h-screen bg-muted/30 flex w-full overflow-hidden">
                <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
                <div className="flex min-w-0 flex-1 flex-col">
                    <Topbar sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(open => !open)} />
                    <ScrollArea className="w-full min-h-0 flex-1 p-4 md:p-6 bg-background">
                        <Outlet />
                    </ScrollArea>
                </div>
            </div>
            <Toaster richColors theme={resolvedTheme} />
        </>
    );
}