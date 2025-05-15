
import { UserRole } from "@/types/auth";

/**
 * Normalize role names to a standard format
 */
export const normalizeRole = (role: string): UserRole => {
  const roleLower = role.toLowerCase();
  
  if (roleLower === 'b2b-admin' || roleLower === 'b2badmin') {
    return 'b2b_admin';
  }
  
  if (roleLower === 'b2b-user' || roleLower === 'b2buser' || roleLower === 'b2b-collaborator' || roleLower === 'b2bcollaborator') {
    return 'b2b_user';
  }
  
  if (roleLower === 'individual' || roleLower === 'user' || roleLower === 'b2c') {
    return 'b2c';
  }
  
  return role as UserRole;
};

/**
 * Check if the user has one of the specified roles
 */
export const hasRoleAccess = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);
  
  // Admin always has access
  if (normalizedUserRole === 'admin' || normalizedUserRole === 'b2b_admin') {
    return true;
  }
  
  return normalizedAllowedRoles.includes(normalizedUserRole);
};

/**
 * Get the login path for a specific role
 */
export const getRoleLoginPath = (role: UserRole): string => {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2c':
    default:
      return '/b2c/login';
  }
};

/**
 * Check if a user role is an admin role
 */
export const isAdminRole = (role: UserRole): boolean => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'admin' || normalizedRole === 'b2b_admin';
};

/**
 * Get a display name for a user role
 */
export const getRoleName = (role: UserRole): string => {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'b2b_admin':
      return 'Administrateur B2B';
    case 'b2b_user':
      return 'Collaborateur B2B';
    case 'b2c':
      return 'Particulier';
    case 'admin':
      return 'Administrateur';
    case 'moderator':
      return 'Modérateur';
    case 'employee':
      return 'Employé';
    case 'manager':
      return 'Manager';
    case 'coach':
      return 'Coach';
    case 'wellbeing_manager':
      return 'Responsable bien-être';
    case 'team_lead':
      return 'Chef d\'équipe';
    case 'professional':
      return 'Professionnel';
    case 'individual':
      return 'Particulier';
    case 'user':
      return 'Utilisateur';
    case 'guest':
      return 'Invité';
    default:
      return role;
  }
};
