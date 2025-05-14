
import { UserRole } from '@/types';

/**
 * Check if a role is an admin role
 */
export function isAdminRole(role: UserRole): boolean {
  return ['admin', 'b2b_admin', 'b2b-admin', 'wellbeing_manager', 'manager'].includes(role);
}

/**
 * Get a human-readable name for a role
 */
export function getRoleName(role: UserRole): string {
  const roleNames: Record<string, string> = {
    'b2c': 'Utilisateur Personnel',
    'b2b_user': 'Utilisateur Entreprise',
    'b2b-user': 'Utilisateur Entreprise',
    'b2b_admin': 'Administrateur Entreprise',
    'b2b-admin': 'Administrateur Entreprise',
    'admin': 'Administrateur',
    'team': 'Équipe',
    'manager': 'Manager',
    'wellbeing_manager': 'Responsable Bien-être',
    'coach': 'Coach',
    'employee': 'Employé',
    'user': 'Utilisateur'
  };

  return roleNames[role] || 'Utilisateur';
}

/**
 * Get the home path for a specific role
 */
export function getRoleHomePath(role: UserRole): string {
  if (isAdminRole(role)) {
    return '/admin/dashboard';
  }
  return '/dashboard';
}

/**
 * Get the login path for a specific role
 */
export function getRoleLoginPath(role: UserRole): string {
  if (role === 'b2b_admin' || role === 'b2b-admin') {
    return '/admin/login';
  }
  return '/login';
}

/**
 * Check if a user has access to specific roles
 */
export function hasRoleAccess(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}
