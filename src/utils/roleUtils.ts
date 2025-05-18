
import { UserRole } from "@/types/user";

export function getRoleName(role: UserRole): string {
  switch (role) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'RH';
    case 'admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
}

export function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'b2c':
      return 'text-blue-500';
    case 'b2b_user':
      return 'text-green-500';
    case 'b2b_admin':
      return 'text-purple-500';
    case 'admin':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getRolePermissions(role: UserRole): string[] {
  switch (role) {
    case 'admin':
      return ['admin', 'manage_users', 'view_analytics', 'manage_content', 'manage_settings'];
    case 'b2b_admin':
      return ['view_analytics', 'manage_users', 'view_team_data', 'manage_team_settings'];
    case 'b2b_user':
      return ['view_profile', 'manage_own_data', 'use_tools'];
    case 'b2c':
      return ['view_profile', 'manage_own_data', 'use_tools'];
    default:
      return ['view_profile', 'manage_own_data'];
  }
}

export function canUserAccessFeature(role: UserRole, feature: string): boolean {
  const permissions = getRolePermissions(role);
  switch (feature) {
    case 'admin_panel':
      return permissions.includes('admin');
    case 'analytics':
      return permissions.includes('view_analytics');
    case 'team_management':
      return permissions.includes('manage_users');
    case 'settings':
      return permissions.includes('manage_settings') || permissions.includes('manage_team_settings');
    default:
      return permissions.includes('use_tools');
  }
}

export function isAdminRole(role: UserRole | string | undefined | null): boolean {
  if (!role) return false;
  return role === 'admin' || role === 'b2b_admin';
}
