
import { RouteObject } from 'react-router-dom';
import { unifiedRoutes } from './routes/unifiedRoutes';
import { OFFICIAL_ROUTES } from '@/routesManifest';

// Export de tous les manifestes de routes pour compatibilité
export const ROUTES_MANIFEST = {
  home: OFFICIAL_ROUTES.HOME,
  chooseMode: OFFICIAL_ROUTES.CHOOSE_MODE,
  b2cLogin: OFFICIAL_ROUTES.B2C_LOGIN,
  b2cRegister: OFFICIAL_ROUTES.B2C_REGISTER,
  b2cDashboard: OFFICIAL_ROUTES.B2C_DASHBOARD,
  b2b: OFFICIAL_ROUTES.B2B,
  b2bSelection: OFFICIAL_ROUTES.B2B_SELECTION,
  b2bUserLogin: OFFICIAL_ROUTES.B2B_USER_LOGIN,
  b2bUserRegister: OFFICIAL_ROUTES.B2B_USER_REGISTER,
  b2bUserDashboard: OFFICIAL_ROUTES.B2B_USER_DASHBOARD,
  b2bAdminLogin: OFFICIAL_ROUTES.B2B_ADMIN_LOGIN,
  b2bAdminDashboard: OFFICIAL_ROUTES.B2B_ADMIN_DASHBOARD,
  scan: OFFICIAL_ROUTES.SCAN,
  music: OFFICIAL_ROUTES.MUSIC,
  coach: OFFICIAL_ROUTES.COACH,
  journal: OFFICIAL_ROUTES.JOURNAL,
  preferences: OFFICIAL_ROUTES.PREFERENCES,
  teams: OFFICIAL_ROUTES.TEAMS,
  reports: OFFICIAL_ROUTES.REPORTS,
  events: OFFICIAL_ROUTES.EVENTS,
  optimisation: OFFICIAL_ROUTES.OPTIMISATION,
  settings: OFFICIAL_ROUTES.SETTINGS,
} as const;

export function buildUnifiedRoutes(): RouteObject[] {
  return unifiedRoutes;
}

export function validateRoute(route: string): route is keyof typeof ROUTES_MANIFEST {
  return Object.keys(ROUTES_MANIFEST).includes(route);
}

export const getRoutePath = (route: keyof typeof ROUTES_MANIFEST): string => {
  if (!validateRoute(route)) {
    throw new Error(`Invalid route name: ${route}`);
  }
  return ROUTES_MANIFEST[route];
};

export function validateRoutesManifest() {
  const routes = Object.values(ROUTES_MANIFEST);
  const uniqueRoutes = new Set(routes);
  
  return {
    valid: routes.length === uniqueRoutes.size,
    totalRoutes: routes.length,
    uniqueRoutes: uniqueRoutes.size,
    errors: routes.length !== uniqueRoutes.size ? ['Duplicate routes detected'] : []
  };
}

export type RouteManifestEntry = {
  path: string;
  name: keyof typeof ROUTES_MANIFEST;
};

export const ROUTE_MANIFEST: RouteManifestEntry[] = Object.entries(ROUTES_MANIFEST).map(([name, path]) => ({
  name: name as keyof typeof ROUTES_MANIFEST,
  path
}));
