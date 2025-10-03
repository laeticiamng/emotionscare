/**
 * AuthErrorService - Service de gestion des erreurs d'authentification
 * Traduit les erreurs Supabase en messages utilisateur-friendly
 */

import { AuthError } from '@supabase/supabase-js';

interface FriendlyError {
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
  action?: string;
}

const ERROR_MESSAGES: Record<string, FriendlyError> = {
  // Erreurs d'inscription
  'signup_disabled': {
    message: 'Les nouvelles inscriptions sont temporairement désactivées.',
    code: 'SIGNUP_DISABLED',
    severity: 'warning',
    action: 'Contactez le support pour plus d\'informations.'
  },
  'user_already_registered': {
    message: 'Un compte existe déjà avec cette adresse email.',
    code: 'USER_EXISTS',
    severity: 'error',
    action: 'Essayez de vous connecter ou utilisez une autre adresse.'
  },
  'weak_password': {
    message: 'Le mot de passe doit contenir au moins 8 caractères, incluant majuscules, minuscules et chiffres.',
    code: 'WEAK_PASSWORD',
    severity: 'error',
    action: 'Choisissez un mot de passe plus robuste.'
  },
  'invalid_email': {
    message: 'L\'adresse email n\'est pas valide.',
    code: 'INVALID_EMAIL',
    severity: 'error',
    action: 'Vérifiez le format de votre adresse email.'
  },

  // Erreurs de connexion
  'invalid_credentials': {
    message: 'Email ou mot de passe incorrect.',
    code: 'INVALID_CREDENTIALS',
    severity: 'error',
    action: 'Vérifiez vos identifiants ou réinitialisez votre mot de passe.'
  },
  'email_not_confirmed': {
    message: 'Votre adresse email n\'a pas encore été confirmée.',
    code: 'EMAIL_NOT_CONFIRMED',
    severity: 'warning',
    action: 'Vérifiez votre boîte mail et cliquez sur le lien de confirmation.'
  },
  'too_many_requests': {
    message: 'Trop de tentatives de connexion. Veuillez patienter avant de réessayer.',
    code: 'RATE_LIMITED',
    severity: 'warning',
    action: 'Attendez quelques minutes avant de réessayer.'
  },
  'account_locked': {
    message: 'Votre compte a été temporairement verrouillé pour des raisons de sécurité.',
    code: 'ACCOUNT_LOCKED',
    severity: 'error',
    action: 'Contactez le support pour débloquer votre compte.'
  },

  // Erreurs de session
  'session_expired': {
    message: 'Votre session a expiré. Veuillez vous reconnecter.',
    code: 'SESSION_EXPIRED',
    severity: 'info',
    action: 'Reconnectez-vous pour continuer.'
  },
  'invalid_token': {
    message: 'Token d\'authentification invalide.',
    code: 'INVALID_TOKEN',
    severity: 'error',
    action: 'Reconnectez-vous pour obtenir un nouveau token.'
  },

  // Erreurs de réinitialisation
  'password_reset_failed': {
    message: 'Impossible d\'envoyer l\'email de réinitialisation.',
    code: 'RESET_FAILED',
    severity: 'error',
    action: 'Vérifiez votre adresse email et réessayez.'
  },
  'invalid_reset_token': {
    message: 'Le lien de réinitialisation est invalide ou a expiré.',
    code: 'INVALID_RESET_TOKEN',
    severity: 'error',
    action: 'Demandez un nouveau lien de réinitialisation.'
  },

  // Erreurs réseau
  'network_error': {
    message: 'Problème de connexion réseau.',
    code: 'NETWORK_ERROR',
    severity: 'warning',
    action: 'Vérifiez votre connexion internet et réessayez.'
  },
  'service_unavailable': {
    message: 'Le service d\'authentification est temporairement indisponible.',
    code: 'SERVICE_UNAVAILABLE',
    severity: 'error',
    action: 'Réessayez dans quelques minutes.'
  },

  // Erreurs de validation
  'email_format_invalid': {
    message: 'Le format de l\'adresse email n\'est pas correct.',
    code: 'EMAIL_FORMAT_INVALID',
    severity: 'error',
    action: 'Utilisez un format email valide (exemple@domaine.com).'
  },
  'password_too_short': {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
    code: 'PASSWORD_TOO_SHORT',
    severity: 'error',
    action: 'Choisissez un mot de passe plus long.'
  },
  'password_mismatch': {
    message: 'Les mots de passe ne correspondent pas.',
    code: 'PASSWORD_MISMATCH',
    severity: 'error',
    action: 'Assurez-vous que les deux mots de passe sont identiques.'
  }
};

/**
 * Analyse une erreur d'authentification et retourne un message convivial
 */
export function getFriendlyAuthError(error: unknown): FriendlyError {
  console.error('Auth error:', error);

  // Erreur Supabase
  if (error && typeof error === 'object' && 'message' in error) {
    const authError = error as AuthError;
    const message = authError.message?.toLowerCase() || '';

    // Mapper les messages d'erreur Supabase vers nos messages personnalisés
    if (message.includes('invalid login credentials')) {
      return ERROR_MESSAGES['invalid_credentials'];
    }
    if (message.includes('user already registered')) {
      return ERROR_MESSAGES['user_already_registered'];
    }
    if (message.includes('email not confirmed')) {
      return ERROR_MESSAGES['email_not_confirmed'];
    }
    if (message.includes('too many requests')) {
      return ERROR_MESSAGES['too_many_requests'];
    }
    if (message.includes('weak password')) {
      return ERROR_MESSAGES['weak_password'];
    }
    if (message.includes('invalid email')) {
      return ERROR_MESSAGES['invalid_email'];
    }
    if (message.includes('signup disabled')) {
      return ERROR_MESSAGES['signup_disabled'];
    }
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGES['network_error'];
    }
  }

  // Erreur JavaScript standard
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGES['network_error'];
    }
  }

  // Erreur générique
  return {
    message: 'Une erreur inattendue s\'est produite.',
    code: 'UNKNOWN_ERROR',
    severity: 'error',
    action: 'Réessayez ou contactez le support si le problème persiste.'
  };
}

/**
 * Vérifie si une erreur indique un problème temporaire
 */
export function isTemporaryError(error: unknown): boolean {
  const friendlyError = getFriendlyAuthError(error);
  return ['RATE_LIMITED', 'NETWORK_ERROR', 'SERVICE_UNAVAILABLE'].includes(friendlyError.code);
}

/**
 * Vérifie si une erreur nécessite une action de l'utilisateur
 */
export function requiresUserAction(error: unknown): boolean {
  const friendlyError = getFriendlyAuthError(error);
  return [
    'EMAIL_NOT_CONFIRMED',
    'WEAK_PASSWORD', 
    'INVALID_EMAIL',
    'PASSWORD_TOO_SHORT',
    'PASSWORD_MISMATCH'
  ].includes(friendlyError.code);
}

/**
 * Obtient des suggestions d'action pour résoudre l'erreur
 */
export function getErrorActionSuggestions(error: unknown): string[] {
  const friendlyError = getFriendlyAuthError(error);
  
  const suggestions: Record<string, string[]> = {
    'INVALID_CREDENTIALS': [
      'Vérifiez que votre email est correct',
      'Vérifiez que votre mot de passe est correct',
      'Essayez de réinitialiser votre mot de passe',
      'Assurez-vous que Caps Lock n\'est pas activé'
    ],
    'WEAK_PASSWORD': [
      'Utilisez au moins 8 caractères',
      'Incluez des majuscules et minuscules',
      'Ajoutez des chiffres',
      'Ajoutez des caractères spéciaux (!@#$%)'
    ],
    'EMAIL_NOT_CONFIRMED': [
      'Vérifiez votre boîte de réception',
      'Vérifiez vos spams/courrier indésirable',
      'Demandez un nouvel email de confirmation',
      'Contactez le support si besoin'
    ],
    'NETWORK_ERROR': [
      'Vérifiez votre connexion internet',
      'Réessayez dans quelques instants',
      'Désactivez temporairement votre VPN',
      'Contactez le support si le problème persiste'
    ]
  };
  
  return suggestions[friendlyError.code] || ['Contactez le support pour assistance'];
}