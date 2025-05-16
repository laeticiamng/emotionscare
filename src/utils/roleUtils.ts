import { UserRole } from '@/types';

/**
 * Normalizes user role string to a consistent format
 */
export const normalizeUserRole = (role: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'admin': 'admin',
    'administrator': 'admin',
    'user': 'user',
    'standard': 'user',
    'b2b_admin': 'b2b_admin',
    'b2b_admin_role': 'b2b_admin',
    'admin_b2b': 'b2b_admin',
    'b2b_user': 'b2b_user',
    'user_b2b': 'b2b_user',
    'employee': 'b2b_user',
    'collaborator': 'b2b_user',
    'b2c': 'user',
    'b2c_user': 'user',
    'client': 'user',
    'customer': 'user'
  };

  const normalizedRole = String(role).toLowerCase().trim();
  return roleMap[normalizedRole] || 'user';
};

/**
 * Alias for normalizeUserRole for compatibility
 */
export const normalizeRole = normalizeUserRole;

/**
 * Returns the home path for a given role
 */
export const getRoleHomePath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'b2b_admin':
      return '/b2b/admin';
    case 'b2b_user':
      return '/b2b/user';
    case 'user':
    default:
      return '/home';
  }
};

/**
 * Checks if user has admin privileges
 */
export const isAdminRole = (role: string): boolean => {
  const normalizedRole = normalizeUserRole(role);
  return normalizedRole === 'admin' || normalizedRole === 'b2b_admin';
};

/**
 * Formats role for display
 */
export const formatRoleForDisplay = (role: string): string => {
  const roleDisplayMap: Record<string, string> = {
    'admin': 'Administrateur',
    'b2b_admin': 'Admin B2B',
    'b2b_user': 'Utilisateur B2B',
    'user': 'Utilisateur'
  };

  const normalizedRole = normalizeUserRole(role);
  return roleDisplayMap[normalizedRole] || 'Utilisateur';
};

/**
 * Alias for formatRoleForDisplay
 */
export const getRoleName = formatRoleForDisplay;

/**
 * Checks if a user with a given role has access to a required role
 */
export const hasRoleAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  // Admin has access to all roles
  if (userRole === 'admin') return true;
  
  // B2B Admin has access to b2b_admin and b2b_user
  if (userRole === 'b2b_admin' && (requiredRole === 'b2b_admin' || requiredRole === 'b2b_user')) return true;
  
  // Same role always has access to itself
  if (userRole === requiredRole) return true;
  
  // Otherwise no access
  return false;
};

/**
 * Returns the login path for a given role
 */
export const getRoleLoginPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'user':
    default:
      return '/login';
  }
};
