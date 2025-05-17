
import { UserModeType } from '@/types/userMode';

export const normalizeUserMode = (mode?: string): UserModeType | string => {
  if (!mode) return 'b2c';

  // Normalize different possible versions of user modes
  const normalizedMode = mode.toLowerCase();
  
  // Convert hyphenated formats to underscore format
  const formattedMode = normalizedMode.replace('-', '_');
  
  if (formattedMode.includes('b2b') && formattedMode.includes('admin')) {
    return 'b2b_admin';
  }
  
  if (formattedMode.includes('b2b') && formattedMode.includes('user')) {
    return 'b2b_user';
  }
  
  if (formattedMode === 'b2c' || formattedMode === 'user') {
    return 'b2c';
  }
  
  // Return the mode as is if no match is found
  return mode;
};

export const getUserModeDisplayName = (mode: UserModeType | string): string => {
  switch (mode) {
    case 'b2b_admin':
      return 'Administrateur Entreprise';
    case 'b2b_user':
      return 'Utilisateur Entreprise';
    case 'b2c':
      return 'Utilisateur Personnel';
    default:
      return 'Utilisateur';
  }
};
