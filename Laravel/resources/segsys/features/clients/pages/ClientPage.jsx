import { Outlet } from "react-router";
import ClientListPage from "./ClientListPage";

export default function ClientPage() {
    return (
        <>
            <ClientListPage />
            <Outlet />
        </>
    );
}