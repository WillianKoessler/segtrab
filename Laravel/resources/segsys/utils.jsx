import routes from "./routes";

function flattenRoutes(routes, parentPath = "") {
    return routes.flatMap((route) => {
        const currentPath = route.index
            ? parentPath
            : [parentPath, route.path]
                  .filter(Boolean)
                  .join("/");

        const { routes: children, ...current } = route;

        const result = [
            {
                ...current,
                path: currentPath,
            },
        ];

        if (children) {
            result.push(...flattenRoutes(children, currentPath));
        }

        return result;
    });
}

function matchesPath(pattern, path) {
    const escapeRegex = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(
        "^" +
        pattern
            .split("/")
            .map(segment => {
                if (!segment) return "";
                if (segment.startsWith(":")) return "[^/]+";
                return escapeRegex(segment);
            })
            .join("/") +
        "/?$"
    );

    return regex.test(path);
}

export function getPageTitle(pathname) {
    // const match = [...routes]
    //     .sort((a, b) => b.path.length - a.path.length)
    //     .find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
    
    // const match = [...routes]
    //     .sort((a, b) => b.path.length - a.path.length)
    //     .find(route => pathname === route.path || matchesPath(route.path, pathname));

    const match = flattenRoutes(routes)
        .sort((a, b) => b.path.length - a.path.length)
        .find(route => pathname === `/${route.path}` || matchesPath(`/${route.path}`, pathname));

    return match?.title ?? "ERP";
}