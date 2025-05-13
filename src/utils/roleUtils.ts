
import { UserRole } from '@/types/user';

export function isAdminRole(role?: string): boolean {
  return role === 'admin' || role === 'b2b_admin';
}

export function isUserRole(role?: string): boolean {
  return role === 'user' || role === 'b2b_user' || role === 'b2c';
}

export function getRoleName(role?: string): string {
  switch(role) {
    case 'admin': return 'Administrateur';
    case 'b2b_admin': return 'Admin B2B';
    case 'b2b_user': return 'Utilisateur B2B';
    case 'user': return 'Utilisateur';
    case 'b2c': return 'Particulier';
    case 'moderator': return 'Modérateur';
    default: return 'Utilisateur';
  }
}

export function getRolePermissions(role?: string): string[] {
  switch(role) {
    case 'admin':
    case 'b2b_admin':
      return ['read', 'write', 'delete', 'manage_users', 'view_reports', 'manage_settings'];
    case 'moderator':
      return ['read', 'write', 'delete', 'manage_content'];
    case 'b2b_user':
      return ['read', 'write', 'view_team_data'];
    case 'user':
    case 'b2c':
    default:
      return ['read', 'write'];
  }
}

export function hasPermission(role: string | undefined, permission: string): boolean {
  if (!role) return false;
  const permissions = getRolePermissions(role);
  return permissions.includes(permission);
}
