
import { UserRole } from '@/types/user';

export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    'b2c': 'Particulier',
    'b2b_user': 'Collaborateur',
    'b2b_admin': 'Administrateur RH',
    'admin': 'Administrateur'
  };
  
  return roleNames[role] || 'Utilisateur';
};

export const getRolePermissions = (role: UserRole) => {
  return {
    canAccessAdmin: role === 'b2b_admin' || role === 'admin',
    canAccessB2B: role === 'b2b_user' || role === 'b2b_admin',
    canAccessB2C: role === 'b2c',
    canManageUsers: role === 'b2b_admin' || role === 'admin',
    canViewAnalytics: role === 'b2b_admin' || role === 'admin',
  };
};
