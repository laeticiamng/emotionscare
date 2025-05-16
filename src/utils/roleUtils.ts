
import { UserRole } from "@/types/user";

export function getRoleName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'user':
      return 'Utilisateur';
    case 'b2b_user':
    case 'b2b-user':
      return 'Collaborateur';
    case 'b2b_admin':
    case 'b2b-admin':
      return 'Admin Entreprise';
    case 'b2c':
      return 'Particulier';
    case 'collaborator':
      return 'Collaborateur';
    default:
      return role;
  }
}

export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'user':
      return '/dashboard';
    case 'b2b_user':
    case 'b2b-user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
    case 'b2b-admin':
      return '/b2b/admin/dashboard';
    case 'b2c':
      return '/b2c/dashboard';
    case 'collaborator':
      return '/collaborator/dashboard';
    default:
      return '/dashboard';
  }
}

export function getRoleRoute(role: UserRole): string {
  return getRoleHomePath(role);
}

export function isB2BUser(role?: UserRole): boolean {
  return role === 'b2b_user' || role === 'b2b-user';
}

export function isB2BAdmin(role?: UserRole): boolean {
  return role === 'b2b_admin' || role === 'b2b-admin';
}

export function isB2C(role?: UserRole): boolean {
  return role === 'b2c';
}

export function isAdmin(role?: UserRole): boolean {
  return role === 'admin';
}
