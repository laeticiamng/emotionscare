
export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

/**
 * Normalize user role to user mode
 */
export function normalizeUserMode(role: string | undefined | null): UserMode {
  if (!role) return 'b2c';
  
  switch (role.toLowerCase()) {
    case 'b2c':
    case 'personal':
    case 'individual':
      return 'b2c';
    case 'b2b_user':
    case 'b2b-user':
    case 'collaborator':
    case 'employee':
      return 'b2b_user';
    case 'b2b_admin':
    case 'b2b-admin':
    case 'admin':
    case 'administrator':
      return 'b2b_admin';
    default:
      return 'b2c';
  }
}

/**
 * Get dashboard path for a specific user mode
 */
export function getModeDashboardPath(mode: UserMode): string {
  switch (mode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/b2c/dashboard';
  }
}

/**
 * Get login path for a specific user mode
 */
export function getModeLoginPath(mode: UserMode): string {
  switch (mode) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/b2c/login';
  }
}

/**
 * Check if a mode is valid
 */
export function isValidUserMode(mode: string): mode is UserMode {
  return ['b2c', 'b2b_user', 'b2b_admin'].includes(mode);
}
