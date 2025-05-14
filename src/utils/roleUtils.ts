
import { UserRole } from '@/types/types';

export const isAdminRole = (role?: UserRole): boolean => {
  return role === 'b2b_admin';
};

export const hasRoleAccess = (role: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(role);
};

export const getRoleLoginPath = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/unauthorized';
  }
};

export const getRoleHomePath = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/unauthorized';
  }
};

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'b2c': return 'Utilisateur particulier';
    case 'b2b_user': return 'Collaborateur';
    case 'b2b_admin': return 'RH / Manager';
    default: return 'Utilisateur';
  }
};
