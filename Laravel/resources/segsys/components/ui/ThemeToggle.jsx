// resources/js/components/theme-toggle.tsx
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme-context";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Toggle theme">
                    <Sun className={`h-4 w-4 transition-all ${isDark ? "scale-0 rotate-90" : "scale-100 rotate-0"}`} />
                    <Moon className={`absolute h-4 w-4 transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light {theme === "light" ? "✓" : ""}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark {theme === "dark" ? "✓" : ""}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System {theme === "system" ? "✓" : ""}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}