
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
