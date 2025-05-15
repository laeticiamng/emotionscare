
import { UserModeType } from "@/types/userMode";

export const hasRoleAccess = (userRole: string | null, requiredRole: string): boolean => {
  if (!userRole) return false;
  
  // Direct match
  if (userRole === requiredRole) return true;
  
  // B2C specific role checks
  if (requiredRole === 'b2c' && userRole === 'b2c') return true;
  
  // B2B user specific role checks
  if (requiredRole === 'b2b_user' && 
      (userRole === 'b2b-user' || userRole === 'b2b_user')) return true;
  
  // B2B admin specific role checks
  if (requiredRole === 'b2b_admin' && 
      (userRole === 'b2b-admin' || userRole === 'b2b_admin')) return true;
  
  return false;
};

export const getRoleLoginPath = (role: string): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
    case 'b2b-user':
      return '/b2b/user/login';
    case 'b2b_admin':
    case 'b2b-admin':
      return '/b2b/admin/login';
    default:
      return '/';
  }
};

export const getRoleName = (role: string): string => {
  switch (role) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
    case 'b2b-user':
      return 'Collaborateur';
    case 'b2b_admin':
    case 'b2b-admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
};

export const normalizeUserRole = (role?: string | null): UserModeType => {
  if (!role) return 'b2c'; // Default role
  
  if (role === 'b2c' || role === 'particulier') return 'b2c';
  
  if (role === 'b2b-user' || role === 'b2b_user' || role === 'collaborateur') {
    return 'b2b-user';
  }
  
  if (role === 'b2b-admin' || role === 'b2b_admin' || role === 'admin' || role === 'rh') {
    return 'b2b-admin';
  }
  
  return 'b2c'; // Default fallback
};
