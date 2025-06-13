export const LOGIN_ROUTES = {
  B2C: '/login',
  B2B_USER: '/b2b/login',
  B2B_ADMIN: '/b2b/admin/login',
} as const;

export const DASHBOARD_ROUTES = {
  B2C: '/dashboard',
  B2B_USER: '/b2b/dashboard',
  B2B_ADMIN: '/b2b/admin/dashboard',
} as const;

export const CURRENT_ROUTES = [
  ...Object.values(LOGIN_ROUTES),
  ...Object.values(DASHBOARD_ROUTES),
  '/flow-walk',
  // etc.
] as const;

export type UserMode = keyof typeof LOGIN_ROUTES;

export const getModeLoginPath = (mode: UserMode) => LOGIN_ROUTES[mode];
export const getLoginRoute = getModeLoginPath;
export const getDashboardRoute = (mode: UserMode) => DASHBOARD_ROUTES[mode];
export const isValidRoute = (path: string) =>
  CURRENT_ROUTES.includes(path as (typeof CURRENT_ROUTES)[number]);
