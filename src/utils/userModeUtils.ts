
import { UserModeType } from '@/types/userMode';

/**
 * Normalizes user mode types for consistency across the application
 */
export function normalizeUserMode(mode: string): UserModeType {
  // Convert to lowercase for consistent comparison
  const normalizedMode = mode.toLowerCase();
  
  // Map to standard values
  if (normalizedMode === 'b2c' || normalizedMode === 'individual' || normalizedMode === 'user') {
    return 'b2c';
  }
  
  if (normalizedMode === 'b2b_admin' || normalizedMode === 'b2b-admin' || normalizedMode === 'admin') {
    return 'b2b_admin';
  }
  
  if (normalizedMode === 'b2b_user' || normalizedMode === 'b2b-user' || 
      normalizedMode === 'b2b-collaborator' || normalizedMode === 'professional') {
    return 'b2b_user';
  }
  
  if (normalizedMode === 'b2b') {
    return 'b2b';
  }
  
  // Return the original value if no match (TypeScript will enforce valid values)
  return normalizedMode as UserModeType;
}

/**
 * Gets display name for a user mode
 */
export function getUserModeDisplayName(mode: UserModeType): string {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b':
      return 'Entreprise';
    default:
      return mode;
  }
}

/**
 * Gets dashboard path for a user mode
 */
export function getUserModeDashboardPath(mode: UserModeType): string {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b':
      return '/b2b/selection';
    default:
      return '/';
  }
}

/**
 * Ensures proper user mode storage in localStorage
 */
export function storeUserMode(mode: UserModeType): void {
  const normalizedMode = normalizeUserMode(mode);
  localStorage.setItem('userMode', normalizedMode);
  console.log(`User mode stored: ${normalizedMode}`);
}
