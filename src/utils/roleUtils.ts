
import { UserRole } from '@/types/auth';
import { ROUTES } from '@/types/navigation';

/**
 * Checks if a user role has access to a protected resource
 */
export const hasRoleAccess = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  // Allow admin access to all routes
  if (userRole === 'admin') return true;

  // For B2B roles, check for exact match or check if both are B2B types
  if (userRole.startsWith('b2b') && allowedRoles.some(role => role.startsWith('b2b'))) {
    return true;
  }

  // Direct role match
  return allowedRoles.includes(userRole);
};

/**
 * Gets the appropriate login path for a given role
 */
export const getRoleLoginPath = (role: UserRole): string => {
  console.log("Getting login path for role:", role);
  
  if (role === 'b2c' || role === 'user' || role === 'individual') {
    return ROUTES.b2c.login;
  }
  
  if (role.includes('admin') || role === 'wellbeing_manager' || role === 'manager') {
    return ROUTES.b2bAdmin.login;
  }
  
  if (role.includes('b2b') || role === 'employee' || role === 'professional') {
    return ROUTES.b2bUser.login;
  }
  
  // Default path
  return '/';
};

/**
 * Gets the home path for a given role after successful login
 */
export const getRoleHomePath = (role: UserRole): string => {
  console.log("Getting home path for role:", role);
  
  if (role === 'b2c' || role === 'user' || role === 'individual') {
    return ROUTES.b2c.dashboard;
  }
  
  if (role.includes('admin') || role === 'wellbeing_manager' || role === 'manager') {
    return ROUTES.b2bAdmin.dashboard;
  }
  
  if (role.includes('b2b') || role === 'employee' || role === 'professional') {
    return ROUTES.b2bUser.dashboard;
  }
  
  // Default path
  return '/';
};

/**
 * Normalizes roles to ensure consistent checking
 */
export const normalizeRole = (role: string): UserRole => {
  role = role.toLowerCase();
  
  if (role === 'b2b-admin' || role === 'b2b_admin') return 'b2b_admin';
  if (role === 'b2b-user' || role === 'b2b_user' || role === 'b2b-collaborator') return 'b2b_user';
  if (role === 'b2c' || role === 'individual' || role === 'user') return 'b2c';
  
  return role as UserRole;
};

/**
 * Check if the given role is an admin role
 */
export const isAdminRole = (role?: UserRole): boolean => {
  if (!role) return false;
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'admin' || normalizedRole === 'b2b_admin';
};

/**
 * Get a display name for a user role
 */
export const getRoleName = (role: UserRole): string => {
  const normalizedRole = normalizeRole(role);
  
  switch(normalizedRole) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'admin':
      return 'Administrateur système';
    case 'manager':
    case 'wellbeing_manager':
      return 'Manager';
    case 'employee':
    case 'professional':
      return 'Professionnel';
    default:
      return 'Utilisateur';
  }
};
