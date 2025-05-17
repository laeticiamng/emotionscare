
import { UserModeType } from '@/types/userMode';

export const normalizeUserMode = (mode?: string): UserModeType | string => {
  if (!mode) return 'b2c';

  // Normaliser les différentes versions possibles des modes utilisateur
  const normalizedMode = mode.toLowerCase().replace('-', '_');
  
  if (normalizedMode.includes('b2b') && normalizedMode.includes('admin')) {
    return 'b2b_admin';
  }
  
  if (normalizedMode.includes('b2b') && normalizedMode.includes('user')) {
    return 'b2b_user';
  }
  
  if (normalizedMode === 'b2c' || normalizedMode === 'user') {
    return 'b2c';
  }
  
  // Retourner le mode tel quel si aucune correspondance n'est trouvée
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
