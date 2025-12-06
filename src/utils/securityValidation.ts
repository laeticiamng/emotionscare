
/**
 * Utilitaires de validation sécurisée
 */

// Validation d'email sécurisée
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validation de mot de passe
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation de rôle utilisateur
export const validateUserRole = (role: string): boolean => {
  const validRoles = ['b2c', 'b2b_user', 'b2b_admin', 'admin'];
  return validRoles.includes(role);
};

// Sanitisation des entrées utilisateur
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Supprimer les balises potentielles
    .trim()
    .substring(0, 1000); // Limiter la longueur
};

// Validation d'URL sécurisée
export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// Génération de token sécurisé
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
