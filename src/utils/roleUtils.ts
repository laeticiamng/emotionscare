
import { UserRole } from '@/types/user';

/**
 * Normalizes user role to a consistent format
 */
export const normalizeUserRole = (role?: UserRole | string | null): string => {
  if (!role) return 'user';
  
  // Convert to lowercase
  const lowerRole = role.toString().toLowerCase();
  
  // Normalize B2B Admin variations
  if (lowerRole.includes('admin') || lowerRole === 'b2b_admin' || lowerRole === 'b2b-admin' || lowerRole === 'b2badmin') {
    return 'b2b_admin';
  }
  
  // Normalize B2B User variations
  if (lowerRole.includes('collab') || lowerRole.includes('b2b') || lowerRole === 'b2b_user' || lowerRole === 'b2b-user') {
    return 'b2b_user';
  }
  
  // Default role is user
  return 'user';
};
