// @ts-nocheck
import { normalizeUserMode as normalizeUserModeBase } from './normalizeUserMode';

export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

// Re-export normalizeUserMode for convenience
export const normalizeUserMode = normalizeUserModeBase;

export const getUserModeDisplayName = (mode: UserMode | null): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur RH';
    default:
      return 'Non défini';
  }
};

export const getModeLoginPath = (mode: UserMode | null): string => {
  switch (mode) {
    case 'b2c':
      return '/login?segment=b2c';
    case 'b2b_user':
      return '/login?segment=b2b';
    case 'b2b_admin':
      return '/login?segment=b2b&mode=admin';
    default:
      return '/choose-mode';
  }
};

export const getModeDashboardPath = (mode: UserMode | null): string => {
  switch (mode) {
    case 'b2c':
      return '/app/consumer/home';
    case 'b2b_user':
      return '/app/collab';
    case 'b2b_admin':
      return '/app/rh';
    default:
      return '/';
  }
};
