
import { UserRole } from '@/types/user';

/**
 * Normalize the user role to a standard format
 */
export const normalizeUserRole = (role: string | null): UserRole => {
  if (!role) return 'user';
  
  const normalizedRole = role.toLowerCase().trim();
  
  if (normalizedRole.includes('admin') || normalizedRole === 'b2b_admin') {
    return 'b2b_admin';
  } else if (normalizedRole.includes('b2b') || normalizedRole === 'b2b_user') {
    return 'b2b_user';
  } else {
    return 'b2c';
  }
};

/**
 * Compare roles for access permissions
 */
export const compareRoles = (userRole: UserRole, requiredRole: UserRole): number => {
  const roleHierarchy: Record<UserRole, number> = {
    'b2b_admin': 3,
    'b2b_user': 2,
    'b2c': 1,
    'user': 1
  };
  
  return roleHierarchy[userRole] - roleHierarchy[requiredRole];
};

/**
 * Check if user has access to required role (equal or higher role)
 */
export const hasRoleAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return compareRoles(userRole, requiredRole) >= 0;
};

/**
 * Get a descriptive name for a role
 */
export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Professionnel';
    case 'b2c':
    case 'user':
    default:
      return 'Utilisateur';
  }
};

/**
 * Check if role is an admin role
 */
export const isAdminRole = (role: UserRole | null | undefined): boolean => {
  return role === 'b2b_admin';
};

/**
 * Get the login path for a specific role
 */
export const getRoleLoginPath = (role: UserRole): string => {
  switch (role) {
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2c':
    case 'user':
    default:
      return '/b2c/login';
  }
};
