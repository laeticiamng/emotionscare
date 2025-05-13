
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | 'user';

/**
 * Determines if a role is an admin role
 */
export const isAdminRole = (role?: string | null): boolean => {
  if (!role) return false;
  return role === 'b2b_admin' || role === 'admin';
};

/**
 * Get a human-readable name for a role
 */
export const getRoleName = (role?: UserRole | string | null): string => {
  switch (role) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
    case 'user':
      return 'Collaborateur';
    case 'b2b_admin':
    case 'admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
};

/**
 * Get the home page path for a specific role
 */
export const getRoleHomePath = (role?: UserRole | string | null): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
    case 'user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
    case 'admin':
      return '/b2b/admin/dashboard';
    default:
      return '/';
  }
};

/**
 * Get the corresponding login page for a role
 */
export const getRoleLoginPath = (role?: UserRole | string | null): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
    case 'user':
      return '/b2b/user/login';
    case 'b2b_admin':
    case 'admin':
      return '/b2b/admin/login';
    default:
      return '/login';
  }
};
