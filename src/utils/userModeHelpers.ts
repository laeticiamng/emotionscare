
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

/**
 * Get login path for a specific user mode
 * Used to redirect users to the appropriate login page
 */
export const getModeLoginPath = (userMode: string | null): string => {
  if (!userMode) {
    return '/b2c/login';
  }
  
  const normalizedMode = normalizeUserMode(userMode);
  
  switch (normalizedMode) {
    case 'b2b_admin':
      return '/login-admin';
    case 'b2b_user':
      return '/login-collaborateur';
    case 'b2c':
    default:
      return '/b2c/login';
  }
};

/**
 * Get dashboard path for a specific user mode
 * Used to redirect users to the appropriate dashboard
 */
export const getModeDashboardPath = (userMode: string | null): string => {
  if (!userMode) {
    return '/b2c/dashboard';
  }
  
  const normalizedMode = normalizeUserMode(userMode);
  
  switch (normalizedMode) {
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
};

/**
 * Normalize user mode string to a consistent format
 * Handles different formats like b2b-admin, b2b_admin, etc.
 */
export const normalizeUserMode = (mode: string | null): string => {
  if (!mode) return 'b2c';
  
  // Convert to lowercase
  const lowerMode = mode.toLowerCase();
  
  // Normalize B2B Admin variations
  if (lowerMode === 'b2b-admin' || lowerMode === 'b2b_admin' || lowerMode === 'b2badmin') {
    return 'b2b_admin';
  }
  
  // Normalize B2B User variations
  if (lowerMode === 'b2b-user' || lowerMode === 'b2b_user' || lowerMode === 'b2buser') {
    return 'b2b_user';
  }
  
  // Normalize B2C variations
  if (lowerMode === 'b2c' || lowerMode === 'individual' || lowerMode === 'user') {
    return 'b2c';
  }
  
  // Default if no match
  return 'b2c';
};

/**
 * Get a user-friendly display name for a user mode
 */
export const getUserModeDisplayName = (mode: string | null): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2c':
      return 'Particulier';
    default:
      return 'Utilisateur';
  }
};
