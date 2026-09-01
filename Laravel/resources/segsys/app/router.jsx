import { Navigate, Route, Routes, useLocation } from "react-router";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import routes from "../routes";
import LoginPage from "../features/auth/pages/LoginPage";
import { useAuth } from "./providers/AuthProvider";

function renderRoutes(routeList) {
    return routeList.map(({ path, Component, extra, routes: children }) => (
        <Route
            key={path}
            path={path}
            element={Component ? <Component {...extra} /> : null}
        >
            {children?.length ? renderRoutes(children) : null}
        </Route>
    ));
}

function RequireAuth({ children }) {
    const { authLoading, currentUser } = useAuth();
    const location = useLocation();

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div
                    className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
                    aria-label="Carregando"
                />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}

export default function AppRouter() {
    return (
        <Routes>
            <Route path="login" element={<LoginPage />} />

            <Route
                element={
                    <RequireAuth>
                        <DashboardLayout />
                    </RequireAuth>
                }
            >
                {renderRoutes(routes)}
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
