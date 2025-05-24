
import { UserModeType } from '@/types/userMode';

export function getUserModeDisplayName(userMode: UserModeType | null): string {
  switch (userMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Non défini';
  }
}

export function getModeDashboardPath(userMode: UserModeType | null): string {
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

export function getModeLoginPath(userMode: UserModeType | null): string {
  switch (userMode) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/choose-mode';
  }
}

export function getUserModeColor(userMode: UserModeType | null): string {
  switch (userMode) {
    case 'b2c':
      return 'bg-blue-100 text-blue-700';
    case 'b2b_user':
      return 'bg-green-100 text-green-700';
    case 'b2b_admin':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function normalizeUserMode(role: string | undefined | null): UserModeType {
  if (!role) return 'b2c';
  
  const normalizedRole = role.toLowerCase().trim();
  
  switch (normalizedRole) {
    case 'b2c':
    case 'particulier':
    case 'individual':
    case 'personal':
      return 'b2c';
      
    case 'b2b_user':
    case 'b2b-user':
    case 'collaborateur':
    case 'employee':
    case 'user':
      return 'b2b_user';
      
    case 'b2b_admin':
    case 'b2b-admin':
    case 'admin':
    case 'administrator':
    case 'administrateur':
      return 'b2b_admin';
      
    default:
      console.warn(`Unknown user role: ${role}, defaulting to b2c`);
      return 'b2c';
  }
}
