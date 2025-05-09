
import { UserRole } from '@/types';

/**
 * Check if the role is an admin role
 * @param role User role
 * @returns True if the role has admin privileges
 */
export const isAdminRole = (role?: string): boolean => {
  if (!role) return false;
  return role === UserRole.ADMIN || 
         role === UserRole.WELLBEING_MANAGER || 
         role === UserRole.ANALYST;
};

/**
 * Check if the role is a manager role
 * @param role User role
 * @returns True if the role has manager privileges
 */
export const isManagerRole = (role?: string): boolean => {
  if (!role) return false;
  return isAdminRole(role) || role === UserRole.MANAGER;
};

/**
 * Get the access level of a role
 * @param role User role
 * @returns Access level (3 for admin, 2 for manager, 1 for employee, 0 for unknown)
 */
export const getRoleAccessLevel = (role?: string): number => {
  if (!role) return 0;
  if (isAdminRole(role)) return 3;
  if (isManagerRole(role)) return 2;
  if (role === UserRole.EMPLOYEE || role === UserRole.USER) return 1;
  return 0;
};
