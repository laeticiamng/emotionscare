import { UserRole } from '@/types';

/**
 * Checks if the provided role has admin privileges
 */
export const isAdminRole = (role: UserRole): boolean => {
  return role === 'admin' || role === 'b2b_admin' || role === 'b2b-admin' || role === 'wellbeing_manager' || role === 'manager';
};

/**
 * Checks if a user has access based on their role
 */
export const hasRoleAccess = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  // If admin roles should have access to everything
  if (isAdminRole(userRole)) return true;
  // Otherwise check if the user's role is in the allowed roles
  return allowedRoles.includes(userRole);
};

/**
 * Get the home path based on user role
 */
export const getRoleHomePath = (role: UserRole): string => {
  if (isAdminRole(role)) {
    return '/admin/dashboard';
  } else if (role === 'coach') {
    return '/coach/dashboard';
  } else if (role === 'b2b_user' || role === 'b2b-user' || role === 'team') {
    return '/team/dashboard';
  } else {
    return '/dashboard';
  }
};

/**
 * Get the login path based on user role
 */
export const getRoleLoginPath = (role: UserRole): string => {
  if (isAdminRole(role)) {
    return '/admin/login';
  } else if (role === 'coach') {
    return '/coach/login';
  } else if (role === 'b2b_user' || role === 'b2b-user' || role === 'team') {
    return '/team/login';
  } else {
    return '/login';
  }
};
