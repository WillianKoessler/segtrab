import ModulePlaceholderPage from "./app/shared/ModulePlaceholderPage";
import DashboardHome from "./app/dashboard/Home/index";
import SettingsPage from './app/dashboard/Settings';
import { LayoutDashboard, Users, Package, ShoppingCart, BarChart3, Settings, File, ShieldCheck } from "lucide-react";
import { ProfilePage } from "./app/dashboard/Profile";
import UserPage from "./app/users/UserPage";
import AccessControlPage from "./app/access-control/AccessControlPage";
import AEPPage from "./app/dashboard/AEP";
import { TesterPage } from "./app/dashboard/Tester";
import ClientsPage from "./app/dashboard/Clientes";


const routes = [
    {
        path: "",
        Component: DashboardHome,
        title: "Home",
        extra: {
            icon: LayoutDashboard,
        },
    },
    {
        path: "clients",
        Component: ClientsPage,
        title: "Clientes",
        extra: {
            icon: Users,
        }
    },
    {
        path: "produtos",
        Component: ModulePlaceholderPage,
        title: "Produtos",
        extra: {
            title: "Produtos",
            icon: Package,
        },
    },
    {
        path: "vendas",
        Component: ModulePlaceholderPage,
        title: "Vendas",
        extra: {
            title: "Vendas",
            icon: ShoppingCart,
        },
    },
    {
        path: "relatorios",
        Component: ModulePlaceholderPage,
        title: "Relatórios",
        extra: {
            title: "Relatórios",
            icon: BarChart3,
        },
    },
    {
        path: "aep",
        Component: AEPPage,
        title: "AEP",
        extra: {
            title: "Avaliação Ergonômica Preliminar",
            icon: File,
        },
    },
    {
        path: "configs",
        Component: SettingsPage,
        title: "Configuração",
        extra: {
            icon: Settings,
        },
    },
    {
        path: "profile",
        Component: ProfilePage,
        title: "Perfil do Usuário",
        extra: {}
    },
    {
        path: "users",
        Component: UserPage,
        title: "Usuários",
        extra: {
            icon: Users,
        },
    },
    {
        path: "acesso",
        Component: AccessControlPage,
        title: "Grupos e Permissões",
        extra: {
            icon: ShieldCheck,
        },
    },
    {
        path: "tester",
        Component: TesterPage,
        title: "Tester",
        extra: {
            icon: Settings,
        },
    },
];

export default routes;