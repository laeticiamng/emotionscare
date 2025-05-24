
import { UserModeType } from '@/types/userMode';

/**
 * Normalise le mode utilisateur pour assurer la compatibilité
 * avec différents formats de rôles utilisateur
 */
export function normalizeUserMode(role: string | undefined | null): UserModeType {
  if (!role) return 'b2c';
  
  const normalizedRole = role.toLowerCase().trim();
  
  // Mapping des différents formats possibles
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

export default normalizeUserMode;
