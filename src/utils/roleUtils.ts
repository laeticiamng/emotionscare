
import { UserRole } from '@/types';

/**
 * Check if a role is an admin role
 */
export const isAdminRole = (role?: UserRole | string | undefined): boolean => {
  return role === UserRole.ADMIN;
};

/**
 * Check if a role is a user role
 */
export const isUserRole = (role?: UserRole | string | undefined): boolean => {
  return role === UserRole.USER;
};
