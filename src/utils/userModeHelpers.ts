
import { UserModeType } from '@/types/userMode';
import { UserRole } from '@/types/user';

/**
 * Normalize various role/mode formats to a consistent UserModeType
 */
export function normalizeUserMode(mode: string | undefined | null): UserModeType {
  if (!mode) return 'b2c';

  const lowerMode = mode.toLowerCase();
  
  if (lowerMode.includes('admin') || lowerMode === 'rh' || lowerMode === 'hr') {
    return 'b2b_admin';
  } else if (lowerMode.includes('user') || lowerMode === 'collaborateur' || lowerMode === 'employee') {
    return 'b2b_user';
  } else {
    return 'b2c';
  }
}

/**
 * Get the display name for a user mode
 */
export function getUserModeDisplayName(mode: UserModeType): string {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Responsable RH';
    case 'admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
}

/**
 * Convert UserRole to UserModeType
 */
export function roleToMode(role: UserRole | string | undefined | null): UserModeType {
  if (!role) return 'b2c';
  
  return normalizeUserMode(role);
}

/**
 * Get the login path for a specific mode
 */
export function getModeLoginPath(mode: UserModeType): string {
  switch (mode) {
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2c':
    default:
      return '/b2c/login';
  }
}

/**
 * Get the dashboard path for a specific mode
 */
export function getModeDashboardPath(mode: UserModeType): string {
  switch (mode) {
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
}
