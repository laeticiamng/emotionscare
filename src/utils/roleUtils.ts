
import { UserModeType } from "@/types/userMode";

export const isAdminRole = (role?: string | null): boolean => {
  if (!role) return false;
  const normalizedRole = role.toLowerCase();
  
  return normalizedRole === 'admin' || 
         normalizedRole === 'b2b_admin' || 
         normalizedRole === 'b2b-admin' ||
         normalizedRole === 'rh';
};

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

export const getRoleHomePath = (role: string): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
    case 'b2b-user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
    case 'b2b-admin':
      return '/b2b/admin/dashboard';
    default:
      return '/';
  }
};

export const normalizeRole = (role?: string | null): string => {
  return normalizeUserRole(role);
};

export const normalizeUserRole = (role?: string | null): UserModeType => {
  if (!role) return 'b2c'; // Default role
  
  const normalizedRole = role.toLowerCase();
  
  if (normalizedRole === 'b2c' || normalizedRole === 'particulier') {
    return 'b2c';
  }
  
  if (normalizedRole === 'b2b-user' || normalizedRole === 'b2b_user' || normalizedRole === 'collaborateur') {
    return 'b2b-user';
  }
  
  if (normalizedRole === 'b2b-admin' || normalizedRole === 'b2b_admin' || normalizedRole === 'admin' || normalizedRole === 'rh') {
    return 'b2b-admin';
  }
  
  return 'b2c'; // Default fallback
};
