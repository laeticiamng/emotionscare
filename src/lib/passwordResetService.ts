// @ts-nocheck
import { User } from '@/types';
import { mockUsers } from '@/data/mockUsers';
import { logger } from '@/lib/logger';

// Simuler une base de données de tokens de réinitialisation
interface PasswordResetToken {
  token: string;
  email: string;
  created: Date;
  expires: Date;
  isUsed: boolean;
}

// Collection simulée de tokens
let resetTokens: PasswordResetToken[] = [];

// Générer un token aléatoire
const generateToken = (): string => {
  return 'valid_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Requête de réinitialisation de mot de passe
export const requestPasswordReset = async (email: string): Promise<{ success: boolean }> => {
  // Dans une vraie implémentation, nous vérifions si l'email existe en base de données,
  // mais nous ne divulguons pas cette information à l'utilisateur pour des raisons de sécurité
  
  // Vérifier si l'email existe
  const userExists = mockUsers.some(user => user.email === email);

  // Créer un token qu'il existe ou pas (pour éviter de révéler l'existence de l'email)
  const token = generateToken();
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 heures plus tard

  // Stocker le token uniquement si l'utilisateur existe
  if (userExists) {
    // Supprimer tout token existant pour cet email
    resetTokens = resetTokens.filter(t => t.email !== email);
    
    // Ajouter le nouveau token
    resetTokens.push({
      token,
      email,
      created: now,
      expires,
      isUsed: false
    });
    
    // Dans une vraie implémentation, nous enverrions un email ici
    logger.info(`Token de réinitialisation créé pour ${email}`, { token }, 'AUTH');
  } else {
    logger.info(`Tentative de réinitialisation pour un email non existant: ${email}`, undefined, 'AUTH');
  }

  // Toujours retourner success pour ne pas révéler si l'email existe
  return { success: true };
};

// Vérifier la validité d'un token
export const verifyResetToken = async (token: string): Promise<{ 
  valid: boolean, 
  email?: string 
}> => {
  // Nettoyer les tokens expirés (bonne pratique)
  const now = new Date();
  resetTokens = resetTokens.filter(t => t.expires > now && !t.isUsed);
  
  // Rechercher le token
  const tokenRecord = resetTokens.find(t => t.token === token);
  
  if (!tokenRecord) {
    return { valid: false };
  }
  
  return { 
    valid: true,
    email: tokenRecord.email
  };
};

// Réinitialiser le mot de passe
export const resetPassword = async (token: string, newPassword: string): Promise<{ 
  success: boolean, 
  message?: string 
}> => {
  // Vérifier la validité du token
  const { valid, email } = await verifyResetToken(token);
  
  if (!valid || !email) {
    return { 
      success: false, 
      message: "Ce lien de réinitialisation est invalide ou a expiré." 
    };
  }
  
  // Trouver l'utilisateur
  const userIndex = mockUsers.findIndex(user => user.email === email);
  
  if (userIndex === -1) {
    return { 
      success: false, 
      message: "Utilisateur introuvable." 
    };
  }
  
  // Dans une vraie implémentation, nous hasherions le mot de passe ici
  // mockUsers[userIndex].password = hashPassword(newPassword);
  
  // Simuler la mise à jour du mot de passe
  logger.info(`Mot de passe réinitialisé pour ${email}`, undefined, 'AUTH');
  
  // Marquer le token comme utilisé
  const tokenIndex = resetTokens.findIndex(t => t.token === token);
  if (tokenIndex !== -1) {
    resetTokens[tokenIndex].isUsed = true;
  }
  
  return { 
    success: true,
    message: "Votre mot de passe a été réinitialisé avec succès." 
  };
};
