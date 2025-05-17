
import { UserRole } from '@/types/user';
import { normalizeUserMode } from './userModeHelpers';

/**
 * Takes a user role and returns a human-readable name
 * @param role The user role to format
 * @returns A human-readable name for the role
 */
export const getRoleName = (role: string | UserRole): string => {
  const normalizedRole = normalizeUserMode(role);
  
  switch (normalizedRole) {
    case 'b2c':
      return 'Client';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    case 'admin':
      return 'Administrateur';
    case 'coach':
      return 'Coach';
    case 'therapist':
      return 'Thérapeute';
    default:
      return 'Utilisateur';
  }
};

/**
 * Checks if a user has a specific role
 * @param userRole The user's current role
 * @param requiredRole The role to check for
 * @returns Boolean indicating if the user has the required role
 */
export const hasRole = (userRole: string | UserRole | undefined, requiredRole: string | UserRole): boolean => {
  if (!userRole) return false;
  
  const normalizedUserRole = normalizeUserMode(userRole);
  const normalizedRequiredRole = normalizeUserMode(requiredRole);
  
  return normalizedUserRole === normalizedRequiredRole;
};

/**
 * Checks if a user is a B2B administrator
 * @param role The user role to check
 * @returns Boolean indicating if the user is a B2B admin
 */
export const isB2BAdmin = (role: string | UserRole | undefined): boolean => {
  if (!role) return false;
  return normalizeUserMode(role) === 'b2b_admin';
};

/**
 * Checks if a user is a B2B user/collaborator
 * @param role The user role to check
 * @returns Boolean indicating if the user is a B2B user
 */
export const isB2BUser = (role: string | UserRole | undefined): boolean => {
  if (!role) return false;
  return normalizeUserMode(role) === 'b2b_user';
};

/**
 * Checks if a user is a B2C client
 * @param role The user role to check
 * @returns Boolean indicating if the user is a B2C client
 */
export const isB2C = (role: string | UserRole | undefined): boolean => {
  if (!role) return false;
  return normalizeUserMode(role) === 'b2c';
};

/**
 * Checks if a user belongs to any B2B role
 * @param role The user role to check
 * @returns Boolean indicating if the user has any B2B role
 */
export const isB2B = (role: string | UserRole | undefined): boolean => {
  if (!role) return false;
  const normalizedRole = normalizeUserMode(role);
  return normalizedRole === 'b2b_user' || normalizedRole === 'b2b_admin';
};
