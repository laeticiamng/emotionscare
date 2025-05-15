
import { UserModeType } from '@/types/userMode';

// Normalize user role to handle different formats
export const normalizeUserRole = (role: string | null | undefined): string => {
  if (!role) return 'b2c';
  
  const lowerRole = typeof role === 'string' ? role.toLowerCase() : '';
  
  switch (lowerRole) {
    case 'b2c':
    case 'particulier':
    case 'individual':
    case 'user':
      return 'b2c';
    case 'b2b-user':
    case 'b2b_user':
    case 'b2buser':
    case 'b2b-collaborator':
    case 'collaborateur':
      return 'b2b_user';
    case 'b2b-admin':
    case 'b2b_admin':
    case 'b2badmin':
    case 'admin':
    case 'rh':
    case 'manager':
      return 'b2b_admin';
    default:
      return 'b2c';
  }
};

// Check if the role is an admin role
export const isAdminRole = (role: string | null | undefined): boolean => {
  const normalized = normalizeUserRole(role);
  return normalized === 'b2b_admin';
};

// Check if the role is a B2B user role
export const isB2BUserRole = (role: string | null | undefined): boolean => {
  const normalized = normalizeUserRole(role);
  return normalized === 'b2b_user';
};

// Check if the role is a B2C role
export const isB2CRole = (role: string | null | undefined): boolean => {
  const normalized = normalizeUserRole(role);
  return normalized === 'b2c';
};

// Helper function to compare roles safely
export const compareRoles = (userRole: string | null | undefined, roleToCheck: string): boolean => {
  const normalizedUserRole = normalizeUserRole(userRole);
  const normalizedRoleToCheck = normalizeUserRole(roleToCheck);
  return normalizedUserRole === normalizedRoleToCheck;
};
