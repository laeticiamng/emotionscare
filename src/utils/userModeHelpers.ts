
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
