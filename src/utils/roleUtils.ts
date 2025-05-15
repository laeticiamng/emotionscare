
import { UserRole } from '@/types/auth';

/**
 * Normalize a role string to a standard format
 * @param role Role string to normalize
 */
export function normalizeRole(role: string | UserRole): UserRole {
  if (!role) return 'user';
  
  const roleString = role.toString().toLowerCase();
  
  // Convert dash to underscore for consistency
  if (roleString.includes('-')) {
    return roleString.replace('-', '_') as UserRole;
  }
  
  // Map friendly names to actual roles
  switch (roleString) {
    case 'admin': return 'admin';
    case 'b2c':
    case 'individual':
    case 'user': return 'user';
    case 'b2b_user':
    case 'b2buser':
    case 'collaborator': return 'b2b_user';
    case 'b2b_admin':
    case 'b2badmin':
    case 'enterprise': return 'b2b_admin';
    default: return roleString as UserRole;
  }
}

/**
 * Check if a user role has access to a specific set of required roles
 * @param userRole The user's current role
 * @param requiredRoles Array of roles that grant access
 */
export function hasRoleAccess(userRole: string, requiredRoles: string[]): boolean {
  const normalizedUserRole = normalizeRole(userRole);
  
  // Admin role has access to everything
  if (normalizedUserRole === 'admin') return true;
  
  // Check if user role matches any of the required roles
  return requiredRoles.some(role => normalizeRole(role) === normalizedUserRole);
}

/**
 * Get a user-friendly role name for display
 * @param role Role identifier
 */
export function getRoleName(role: string): string {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'admin': return 'Administrateur';
    case 'user': return 'Particulier';
    case 'b2b_user': return 'Collaborateur';
    case 'b2b_admin': return 'Admin B2B';
    case 'coach': return 'Coach';
    case 'moderator': return 'Modérateur';
    case 'wellbeing_manager': return 'Responsable Bien-être';
    case 'team_lead': return 'Chef d\'équipe';
    case 'professional': return 'Professionnel';
    default: return 'Utilisateur';
  }
}

/**
 * Get the home path for a given role
 */
export function getRoleHomePath(role: string): string {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'admin': return '/admin/dashboard';
    case 'b2b_user': return '/b2b/user/dashboard';
    case 'b2b_admin': return '/b2b/admin/dashboard';
    case 'user': return '/b2c/dashboard';
    default: return '/b2c/dashboard';
  }
}

/**
 * Get the login path for a given role
 */
export function getRoleLoginPath(role: string): string {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'b2b_admin': return '/b2b/admin/login';
    case 'b2b_user': return '/b2b/user/login';
    case 'user': return '/b2c/login';
    default: return '/b2c/login';
  }
}

/**
 * Normalize user mode to standard format
 * @param mode Mode string to normalize
 */
export function normalizeUserMode(mode: string): string {
  if (!mode) return 'b2c';
  
  const modeString = mode.toString().toLowerCase();
  
  // Convert dash to underscore for consistency
  if (modeString.includes('-')) {
    return modeString.replace('-', '_');
  }
  
  // Map friendly names to actual modes
  switch (modeString) {
    case 'b2c':
    case 'individual':
    case 'personal': return 'b2c';
    case 'b2b_user':
    case 'b2buser':
    case 'collaborator': return 'b2b_user';
    case 'b2b_admin':
    case 'b2badmin':
    case 'enterprise': return 'b2b_admin';
    default: return modeString;
  }
}
