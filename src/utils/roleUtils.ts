
import { UserModeType } from '@/types/userMode';

export type UserRole = 'admin' | 'user' | 'b2c' | 'b2b_admin' | 'b2b_user';

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2c':
    case 'user':
    default:
      return 'Particulier';
  }
};
