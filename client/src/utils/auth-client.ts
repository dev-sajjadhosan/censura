export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export type Role = "USER" | "ADMIN";

export const authRoles = [
  "/login",
  "/register",
  "/forgot-password",
  "/account-deleted",
];

export const isAuthRoute = (pathname: string) => {
  return authRoles.some((route) => route === pathname);
};

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/profile", "/change-password", "/logout", "/settings"],
  pattern: [
    /^\/profile(\/.*)?$/, 
  ],
};

export const userProtectedRoutes: RouteConfig = {
  exact: ["/dashboard"], 
  pattern: [
    /^\/payment\/.*/, 
  ],
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin/], 
  exact: [],
};

export const isRouteMatch = (pathname: string, routes: RouteConfig) => {
  const { exact, pattern } = routes;
  return (
    exact.includes(pathname) || pattern.some((regex) => regex.test(pathname))
  );
};

export const getRouteOwner = (pathname: string) => {
  if (isRouteMatch(pathname, adminProtectedRoutes)) return "ADMIN";
  if (isRouteMatch(pathname, userProtectedRoutes)) return "USER";
  if (isRouteMatch(pathname, commonProtectedRoutes)) return "COMMON";
  return null;
};

export const getDefaultRoute = (role: Role) => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "USER":
      return "/profile";
    default:
      return "/";
  }
};

export const isValidRedicrectForRole = (redirectPath: string, role: Role) => {
  const routeOwner = getRouteOwner(redirectPath);
  if (!routeOwner || routeOwner === "COMMON") return true;
  if (routeOwner === role) return true;
  return false;
};
