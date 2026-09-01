import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "@/contexts/theme-context";
import AppRouter from "./router";
import { TooltipProvider } from "#components/ui/tooltip";

export default function App() {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <TooltipProvider>
                    <AppRouter />
                </TooltipProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}