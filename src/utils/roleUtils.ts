
import { UserRole } from '@/types';

/**
 * Check if a role is an admin role
 */
export const isAdminRole = (role?: UserRole) => {
  return role === UserRole.ADMIN;
};

/**
 * Check if a role is a user role
 */
export const isUserRole = (role?: UserRole) => {
  return role === UserRole.USER;
};
