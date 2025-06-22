
import { UNIFIED_ROUTES } from './routeUtils';

export interface RouteValidationResult {
  isValid: boolean;
  hasAccess: boolean;
  errorMessage?: string;
  suggestedRoute?: string;
  requiresAuth: boolean;
}

export function validateRouteAccess(
  pathname: string,
  isAuthenticated: boolean,
  userRole?: string
): RouteValidationResult {
  // Routes publiques
  const publicRoutes = [
    UNIFIED_ROUTES.HOME,
    UNIFIED_ROUTES.CHOOSE_MODE,
    UNIFIED_ROUTES.B2B_SELECTION,
    UNIFIED_ROUTES.B2C_LOGIN,
    UNIFIED_ROUTES.B2C_REGISTER,
    UNIFIED_ROUTES.B2B_USER_LOGIN,
    UNIFIED_ROUTES.B2B_USER_REGISTER,
    UNIFIED_ROUTES.B2B_ADMIN_LOGIN
  ];

  // Routes admin uniquement
  const adminOnlyRoutes = [
    UNIFIED_ROUTES.TEAMS,
    UNIFIED_ROUTES.REPORTS,
    UNIFIED_ROUTES.EVENTS,
    UNIFIED_ROUTES.OPTIMISATION,
    UNIFIED_ROUTES.SETTINGS
  ];

  // Routes communes (nécessitent une authentification)
  const commonRoutes = [
    UNIFIED_ROUTES.SCAN,
    UNIFIED_ROUTES.MUSIC,
    UNIFIED_ROUTES.COACH,
    UNIFIED_ROUTES.JOURNAL,
    UNIFIED_ROUTES.VR,
    UNIFIED_ROUTES.PREFERENCES,
    UNIFIED_ROUTES.GAMIFICATION,
    UNIFIED_ROUTES.SOCIAL_COCON
  ];

  // Dashboards
  const dashboards = [
    UNIFIED_ROUTES.B2C_DASHBOARD,
    UNIFIED_ROUTES.B2B_USER_DASHBOARD,
    UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD
  ];

  // Vérification si la route est publique
  if (publicRoutes.includes(pathname as any)) {
    return {
      isValid: true,
      hasAccess: true,
      requiresAuth: false
    };
  }

  // Vérification de l'authentification pour toutes les autres routes
  if (!isAuthenticated) {
    return {
      isValid: false,
      hasAccess: false,
      errorMessage: 'Authentification requise',
      suggestedRoute: getLoginRouteForPath(pathname),
      requiresAuth: true
    };
  }

  // Vérification des routes admin
  if (adminOnlyRoutes.includes(pathname as any)) {
    if (userRole !== 'b2b_admin') {
      return {
        isValid: false,
        hasAccess: false,
        errorMessage: 'Accès administrateur requis',
        suggestedRoute: getDashboardForRole(userRole),
        requiresAuth: true
      };
    }
  }

  // Vérification des dashboards selon le rôle
  if (dashboards.includes(pathname as any)) {
    const expectedRole = getRoleForDashboard(pathname);
    if (expectedRole && userRole !== expectedRole) {
      return {
        isValid: false,
        hasAccess: false,
        errorMessage: 'Dashboard non autorisé pour votre rôle',
        suggestedRoute: getDashboardForRole(userRole),
        requiresAuth: true
      };
    }
  }

  // Route valide et accessible
  return {
    isValid: true,
    hasAccess: true,
    requiresAuth: true
  };
}

function getLoginRouteForPath(pathname: string): string {
  if (pathname.startsWith('/b2b/admin')) {
    return UNIFIED_ROUTES.B2B_ADMIN_LOGIN;
  } else if (pathname.startsWith('/b2b/user')) {
    return UNIFIED_ROUTES.B2B_USER_LOGIN;
  } else if (pathname.startsWith('/b2c')) {
    return UNIFIED_ROUTES.B2C_LOGIN;
  }
  return UNIFIED_ROUTES.CHOOSE_MODE;
}

function getDashboardForRole(role?: string): string {
  switch (role) {
    case 'b2c':
      return UNIFIED_ROUTES.B2C_DASHBOARD;
    case 'b2b_user':
      return UNIFIED_ROUTES.B2B_USER_DASHBOARD;
    case 'b2b_admin':
      return UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD;
    default:
      return UNIFIED_ROUTES.HOME;
  }
}

function getRoleForDashboard(pathname: string): string | null {
  switch (pathname) {
    case UNIFIED_ROUTES.B2C_DASHBOARD:
      return 'b2c';
    case UNIFIED_ROUTES.B2B_USER_DASHBOARD:
      return 'b2b_user';
    case UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD:
      return 'b2b_admin';
    default:
      return null;
  }
}

export function getAllValidRoutes(): string[] {
  return Object.values(UNIFIED_ROUTES);
}

export function isRoutePublic(pathname: string): boolean {
  const publicRoutes = [
    UNIFIED_ROUTES.HOME,
    UNIFIED_ROUTES.CHOOSE_MODE,
    UNIFIED_ROUTES.B2B_SELECTION,
    UNIFIED_ROUTES.B2C_LOGIN,
    UNIFIED_ROUTES.B2C_REGISTER,
    UNIFIED_ROUTES.B2B_USER_LOGIN,
    UNIFIED_ROUTES.B2B_USER_REGISTER,
    UNIFIED_ROUTES.B2B_ADMIN_LOGIN
  ];
  
  return publicRoutes.includes(pathname as any);
}
