
import { Routes } from '@/routerV2';

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
    Routes.home(),
    Routes.b2c(),
    Routes.enterprise(),
    Routes.login({ segment: 'b2c' }),
    Routes.signup({ segment: 'b2c' }),
    Routes.login({ segment: 'b2b' }),
    Routes.signup({ segment: 'b2b' }),
    Routes.login()
  ];

  // Routes admin uniquement
  const adminOnlyRoutes = [
    Routes.teams(),
    Routes.adminReports(),
    Routes.adminEvents(),
    Routes.adminOptimization(),
    Routes.settingsGeneral()
  ];

  // Routes communes (nécessitent une authentification)
  const commonRoutes = [
    Routes.scan(),
    Routes.music(),
    Routes.coach(),
    Routes.journal(),
    Routes.vr(),
    Routes.settingsGeneral(),
    Routes.leaderboard(),
    Routes.socialCocon()
  ];

  // Dashboards
  const dashboards = [
    Routes.consumerHome(),
    Routes.employeeHome(),
    Routes.managerHome()
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
  if (pathname.startsWith('/app/')) {
    // Routes app nécessitent l'authentification principale
    return Routes.login();
  }
  return Routes.b2c();
}

function getDashboardForRole(role?: string): string {
  switch (role) {
    case 'consumer':
    case 'b2c':
      return Routes.consumerHome();
    case 'employee':
    case 'b2b_user':
      return Routes.employeeHome();
    case 'manager':
    case 'b2b_admin':
      return Routes.managerHome();
    default:
      return Routes.home();
  }
}

function getRoleForDashboard(pathname: string): string | null {
  switch (pathname) {
    case Routes.consumerHome():
      return 'b2c';
    case Routes.employeeHome():
      return 'b2b_user';
    case Routes.managerHome():
      return 'b2b_admin';
    default:
      return null;
  }
}

export function getAllValidRoutes(): string[] {
  return [
    Routes.home(), Routes.scan(), Routes.music(), Routes.coach(),
    Routes.journal(), Routes.vr(), Routes.consumerHome(),
    Routes.employeeHome(), Routes.managerHome(), Routes.teams(),
    Routes.adminReports(), Routes.adminEvents(), Routes.settingsGeneral()
  ];
}

export function isRoutePublic(pathname: string): boolean {
  const publicRoutes = [
    Routes.home(),
    Routes.b2c(),
    Routes.enterprise(),
    Routes.login({ segment: 'b2c' }),
    Routes.signup({ segment: 'b2c' }),
    Routes.login({ segment: 'b2b' }),
    Routes.signup({ segment: 'b2b' }),
    Routes.login()
  ];
  
  return publicRoutes.includes(pathname);
}
