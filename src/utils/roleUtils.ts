
import { User } from '@/types/user';

export const isAdminRole = (role: string | undefined): boolean => {
  if (!role) return false;
  
  return (
    role === 'admin' ||
    role === 'b2b_admin' ||
    role === 'administrator' ||
    role === 'superadmin'
  );
};

export const isB2BRole = (role: string | undefined): boolean => {
  if (!role) return false;
  
  return (
    role === 'b2b_user' ||
    role === 'b2b_admin' ||
    role === 'b2b-user' ||
    role === 'b2b-admin'
  );
};

export const getPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // Administrateurs ont toutes les permissions
  if (isAdminRole(user.role)) return true;
  
  // Vérifier les permissions spécifiques
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  
  return false;
};

export const getUserRoleDisplay = (role: string | undefined): string => {
  if (!role) return 'Utilisateur';
  
  switch (role) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
    case 'b2b-user':
      return 'Collaborateur';
    case 'b2b_admin':
    case 'b2b-admin':
      return 'Administrateur';
    case 'admin':
    case 'superadmin':
      return 'Super Administrateur';
    default:
      return 'Utilisateur';
  }
};

export default {
  isAdminRole,
  isB2BRole,
  getPermission,
  getUserRoleDisplay,
};
