
import { UserRole } from '@/types/user';

export const getUserModeDisplayName = (mode: UserRole): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur RH';
    default:
      return 'Utilisateur';
  }
};

export const getUserModeLabel = (mode: UserRole): string => {
  return getUserModeDisplayName(mode);
};

export const getModePermissions = (mode: UserRole) => {
  return {
    canAccessAdmin: mode === 'b2b_admin',
    canAccessB2B: mode === 'b2b_user' || mode === 'b2b_admin',
    canAccessB2C: mode === 'b2c',
    canManageUsers: mode === 'b2b_admin',
    canViewAnalytics: mode === 'b2b_admin',
  };
};

export const getRoutePath = (mode: UserRole, path: string): string => {
  switch (mode) {
    case 'b2b_user':
      return `/b2b/user/${path}`;
    case 'b2b_admin':
      return `/b2b/admin/${path}`;
    case 'b2c':
    default:
      return `/b2c/${path}`;
  }
};

export const getModeDashboardPath = (mode: UserRole): string => {
  switch (mode) {
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
};
