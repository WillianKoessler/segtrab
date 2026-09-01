import { Menu, Search } from "lucide-react";
import { useLocation } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPageTitle } from "../../utils";
import { useAuth } from "../../app/providers/AuthProvider";
import { NavLink } from "react-router";

export default function Topbar({ sidebarOpen = false, onMenuClick }) {
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location = "/login";
    }

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 md:hidden"
                    aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
                    aria-controls="mobile-sidebar"
                    aria-expanded={sidebarOpen}
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Current page</div>
                <div className="text-base font-semibold">
                    {getPageTitle(location.pathname)}
                </div>
            </div>

            <div className="hidden w-full max-w-md items-center gap-2 md:flex">
                <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search..." />
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-auto items-center gap-3 px-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {currentUser?.name?.slice(0, 2)?.toUpperCase() ?? "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="hidden text-right sm:block">
                            <div className="text-sm font-medium leading-none">
                                {currentUser?.name ?? "User"}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                                {currentUser?.email}
                            </div>
                        </div>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <NavLink to="profile"><DropdownMenuItem>Perfil</DropdownMenuItem></NavLink>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}