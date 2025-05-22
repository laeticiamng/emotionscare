
import { normalizeUserMode, getModeDashboardPath } from './userModeHelpers';

/**
 * Check if the current path matches a given route
 * Supports exact matching and prefix matching
 */
export const isRouteActive = (
  currentPath: string,
  routePath: string,
  exact: boolean = false
): boolean => {
  if (!currentPath || !routePath) {
    return false;
  }
  
  // Normalize paths to ensure consistent comparison
  const normalizedCurrentPath = currentPath.toLowerCase();
  const normalizedRoutePath = routePath.toLowerCase();
  
  // Handle exact matching
  if (exact) {
    return normalizedCurrentPath === normalizedRoutePath;
  }
  
  // Special case for root path
  if (normalizedRoutePath === '/') {
    return normalizedCurrentPath === '/';
  }
  
  // Handle prefix matching for nested routes
  return normalizedCurrentPath.startsWith(normalizedRoutePath);
};

/**
 * Get active class name based on whether a route is active
 */
export const getActiveClassName = (
  currentPath: string,
  routePath: string,
  activeClass: string = 'active',
  inactiveClass: string = '',
  exact: boolean = false
): string => {
  return isRouteActive(currentPath, routePath, exact) ? activeClass : inactiveClass;
};

/**
 * Normalize route paths to ensure consistent comparison
 */
export const normalizeRoutePath = (path: string): string => {
  // Remove trailing slash except for root path
  return path === '/' ? path : path.replace(/\/+$/, '');
};

/**
 * Get breadcrumb items for the current path
 */
export const getBreadcrumbs = (currentPath: string) => {
  if (currentPath === '/') {
    return [{ label: 'Accueil', path: '/' }];
  }
  
  const pathSegments = currentPath.split('/').filter(Boolean);
  
  // Create breadcrumb items
  const breadcrumbs = [{ label: 'Accueil', path: '/' }];
  
  let currentPathBuilder = '';
  
  pathSegments.forEach((segment, index) => {
    currentPathBuilder += `/${segment}`;
    
    // Map segments to user-friendly names
    let label = '';
    
    switch (segment) {
      case 'b2c':
        label = 'Espace Personnel';
        break;
      case 'b2b':
        label = 'Espace Entreprise';
        break;
      case 'user':
        label = 'Collaborateur';
        break;
      case 'admin':
        label = 'Administrateur';
        break;
      case 'dashboard':
        label = 'Tableau de bord';
        break;
      case 'settings':
        label = 'Paramètres';
        break;
      case 'journal':
        label = 'Journal';
        break;
      case 'music':
        label = 'Musique';
        break;
      default:
        // Capitalize first letter
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    
    breadcrumbs.push({
      label,
      path: currentPathBuilder
    });
  });
  
  return breadcrumbs;
};
