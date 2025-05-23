
/**
 * Helper functions for user mode related operations
 */

export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

/**
 * Normalizes the user mode value to ensure it's a valid option
 */
export function normalizeUserMode(userMode: UserMode): UserMode {
  if (userMode === 'b2c' || userMode === 'b2b_user' || userMode === 'b2b_admin') {
    return userMode;
  }
  return null;
}

/**
 * Returns the display name for a user mode
 */
export function getUserModeDisplayName(userMode: UserMode): string {
  switch (userMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
}

/**
 * Returns the appropriate dashboard path based on the user mode
 */
export function getModeDashboardPath(userMode: UserMode): string {
  switch (userMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/choose-mode';
  }
}

/**
 * Returns the appropriate scan path based on the user mode
 */
export function getModeScanPath(userMode: UserMode): string {
  switch (userMode) {
    case 'b2c':
      return '/b2c/scan';
    case 'b2b_user':
      return '/b2b/user/scan';
    case 'b2b_admin':
      return '/b2b/admin/dashboard'; // Admins don't have a scan page, redirect to dashboard
    default:
      return '/choose-mode';
  }
}

/**
 * Returns the appropriate social path based on the user mode
 */
export function getModeSocialPath(userMode: UserMode): string {
  switch (userMode) {
    case 'b2c':
      return '/b2c/social';
    case 'b2b_user':
      return '/b2b/user/social';
    case 'b2b_admin':
      return '/b2b/admin/social-cocoon';
    default:
      return '/choose-mode';
  }
}

/**
 * Returns whether the user is an administrator
 */
export function isAdminMode(userMode: UserMode): boolean {
  return userMode === 'b2b_admin';
}

/**
 * Returns whether the user is a B2B user (either admin or normal user)
 */
export function isB2BMode(userMode: UserMode): boolean {
  return userMode === 'b2b_admin' || userMode === 'b2b_user';
}
