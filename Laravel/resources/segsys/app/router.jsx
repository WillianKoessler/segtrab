import { Navigate, Route, Routes } from "react-router";

import { DashboardLayout } from "../components/layout/DashboardLayout";
import routes from "../routes";

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

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                {renderRoutes(routes)}
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}