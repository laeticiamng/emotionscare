
import { UserRole } from '@/types/user';

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'user':
      return 'Utilisateur';
    case 'collaborator':
      return 'Collaborateur';
    case 'manager':
      return 'Manager';
    case 'b2b_user':
      return 'Utilisateur Pro';
    case 'b2b_admin':
      return 'Admin Pro';
    default:
      return 'Utilisateur';
  }
};

export const isAdminRole = (role?: UserRole): boolean => {
  return role === 'admin' || role === 'b2b_admin';
};

export const isManagerRole = (role?: UserRole): boolean => {
  return role === 'manager' || isAdminRole(role);
};

export const isB2BRole = (role?: UserRole): boolean => {
  return role === 'b2b_user' || role === 'b2b_admin';
};

export const getRoleColor = (role?: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'b2b_admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'user':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'collaborator':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'manager':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'b2b_user':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};
