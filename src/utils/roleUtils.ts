
import { UserRole } from '@/types/user';

export const isAdminRole = (role?: string): boolean => {
  return role === 'admin';
};

export const isManagerRole = (role?: string): boolean => {
  return role === 'manager' || role === 'wellbeing_manager';
};

export const isCoachRole = (role?: string): boolean => {
  return role === 'coach';
};

export const isEmployeeRole = (role?: string): boolean => {
  return role === 'employee';
};

export const isUserRole = (role?: string): boolean => {
  return role === 'user';
};

export const getHighestRole = (roles: string[]): string => {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('manager') || roles.includes('wellbeing_manager')) return 'manager';
  if (roles.includes('coach')) return 'coach';
  if (roles.includes('employee')) return 'employee';
  return 'user';
};

export const getRoleLabel = (role?: string): string => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'manager':
      return 'Manager';
    case 'wellbeing_manager':
      return 'Wellbeing Manager';
    case 'coach':
      return 'Coach';
    case 'employee':
      return 'Employee';
    case 'user':
      return 'User';
    default:
      return 'User';
  }
};

export const getRoleBadgeColor = (role?: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-500';
    case 'manager':
      return 'bg-blue-500';
    case 'wellbeing_manager':
      return 'bg-teal-500';
    case 'coach':
      return 'bg-green-500';
    case 'employee':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

// Fix the error with the moderator role by using a type guard
export const hasModeratorAccess = (role?: string): boolean => {
  if (!role) return false;
  
  // Compare as strings to avoid type issues
  const moderatorRoles = ['admin', 'manager', 'wellbeing_manager', 'moderator'];
  return moderatorRoles.includes(role);
};

export const canAccessAdminFeatures = (role?: string): boolean => {
  return isAdminRole(role) || isManagerRole(role);
};

export const canAccessAnalytics = (role?: string): boolean => {
  return isAdminRole(role) || isManagerRole(role) || isCoachRole(role);
};

export const canManageUsers = (role?: string): boolean => {
  return isAdminRole(role) || isManagerRole(role);
};
