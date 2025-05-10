
import { User, UserRole } from '@/types';

export const isAdminRole = (role?: string): boolean => {
  return role === 'admin';
};

export const isCoachRole = (role?: string): boolean => {
  return role === 'coach';
};

export const isUserRole = (role?: string): boolean => {
  return role === 'user';
};

export const getRoleName = (role?: string): string => {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'coach':
      return 'Coach';
    case 'user':
      return 'Utilisateur';
    default:
      return 'Invité';
  }
};

export const canAccessAdminFeatures = (user: User | null): boolean => {
  return user ? isAdminRole(user.role) : false;
};

export const canAccessCoachFeatures = (user: User | null): boolean => {
  return user ? (isAdminRole(user.role) || isCoachRole(user.role)) : false;
};

export const getUserRoleBadgeColor = (role?: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'coach':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'user':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};
