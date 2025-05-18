
import { UserRole } from './user';

export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

// Helper function to normalize user mode strings
export function normalizeUserMode(mode: string): UserModeType {
  switch (mode.toLowerCase()) {
    case 'b2b_admin':
    case 'admin':
    case 'rh':
    case 'hr':
      return 'b2b_admin';
    case 'b2b_user':
    case 'user':
    case 'collaborator':
    case 'employee':
      return 'b2b_user';
    case 'b2c':
    case 'particular':
    case 'individual':
    default:
      return 'b2c';
  }
}

// Convert user role to user mode
export function roleToMode(role?: UserRole | string): UserModeType {
  if (!role) return 'b2c';
  
  switch(role) {
    case 'b2b_admin':
    case 'admin':
      return 'b2b_admin';
    case 'b2b_user':
      return 'b2b_user';
    case 'b2c':
    default:
      return 'b2c';
  }
}
