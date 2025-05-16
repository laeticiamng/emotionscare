
import { UserRole } from '@/types/user';

export const getRoleName = (role: UserRole | string): string => {
  switch (role) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2c':
      return 'Utilisateur';
    default:
      return 'Utilisateur';
  }
};

// Add the missing isAdminRole function
export const isAdminRole = (role: UserRole | string): boolean => {
  return role === 'b2b_admin' || role === 'admin';
};

// Utility function to check if user is a B2B user (admin or standard user)
export const isB2bUser = (role: UserRole | string): boolean => {
  return role === 'b2b_admin' || role === 'b2b_user';
};
