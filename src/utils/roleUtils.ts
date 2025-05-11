
/**
 * Utility functions for user role management
 */

import { User } from '@/types';

/**
 * Check if user has admin role
 */
export const isAdminRole = (role?: string): boolean => {
  if (!role) return false;
  return role === 'admin' || role === 'superadmin';
};

/**
 * Check if user has user role (non-admin)
 */
export const isUserRole = (role?: string): boolean => {
  if (!role) return false;
  return role === 'user' || role === 'employee' || role === 'coach' || role === 'guest';
};

/**
 * Check if user has therapist or coach role
 */
export const isTherapistRole = (user?: User | null): boolean => {
  if (!user || !user.role) return false;
  return user.role === 'therapist' || user.role === 'coach';
};

/**
 * Get user role display name
 */
export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'superadmin':
      return 'Super administrateur';
    case 'therapist':
      return 'Thérapeute';
    case 'coach':
      return 'Coach';
    case 'manager':
      return 'Manager';
    case 'user':
      return 'Utilisateur';
    case 'employee':
      return 'Collaborateur';
    case 'guest':
      return 'Invité';
    default:
      return role;
  }
};

/**
 * Get user role name (camelCase version)
 */
export const getRoleName = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'admin';
    case 'superadmin':
      return 'superAdmin';
    case 'therapist':
      return 'therapist';
    case 'coach':
      return 'coach';
    case 'manager':
      return 'manager';
    case 'user':
      return 'user';
    case 'employee':
      return 'employee';
    case 'guest':
      return 'guest';
    default:
      return role;
  }
};
