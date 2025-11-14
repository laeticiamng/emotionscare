/**
 * Messages d'erreur localisés pour le module de scan émotionnel
 * Supporte le français et l'anglais
 */

export type ErrorCode =
  | 'CAMERA_PERMISSION_DENIED'
  | 'CAMERA_NOT_AVAILABLE'
  | 'MICROPHONE_PERMISSION_DENIED'
  | 'MICROPHONE_NOT_AVAILABLE'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'ANALYSIS_FAILED'
  | 'INVALID_INPUT'
  | 'TEXT_TOO_SHORT'
  | 'TEXT_TOO_LONG'
  | 'AUDIO_RECORDING_FAILED'
  | 'IMAGE_CAPTURE_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED'
  | 'INSUFFICIENT_CONFIDENCE'
  | 'UNKNOWN_ERROR';

export type Language = 'fr' | 'en';

export interface ErrorMessage {
  title: string;
  description: string;
  action?: string;
}

export const ERROR_MESSAGES: Record<ErrorCode, Record<Language, ErrorMessage>> = {
  CAMERA_PERMISSION_DENIED: {
    fr: {
      title: 'Accès à la caméra refusé',
      description: 'Vous devez autoriser l\'accès à votre caméra pour utiliser l\'analyse faciale.',
      action: 'Vérifier les paramètres de votre navigateur',
    },
    en: {
      title: 'Camera access denied',
      description: 'You must allow camera access to use facial analysis.',
      action: 'Check your browser settings',
    },
  },

  CAMERA_NOT_AVAILABLE: {
    fr: {
      title: 'Caméra non disponible',
      description: 'Aucune caméra n\'a été détectée sur votre appareil.',
      action: 'Connectez une caméra ou essayez un autre mode d\'analyse',
    },
    en: {
      title: 'Camera not available',
      description: 'No camera was detected on your device.',
      action: 'Connect a camera or try another analysis mode',
    },
  },

  MICROPHONE_PERMISSION_DENIED: {
    fr: {
      title: 'Accès au microphone refusé',
      description: 'Vous devez autoriser l\'accès au microphone pour utiliser l\'analyse vocale.',
      action: 'Vérifier les paramètres de votre navigateur',
    },
    en: {
      title: 'Microphone access denied',
      description: 'You must allow microphone access to use voice analysis.',
      action: 'Check your browser settings',
    },
  },

  MICROPHONE_NOT_AVAILABLE: {
    fr: {
      title: 'Microphone non disponible',
      description: 'Aucun microphone n\'a été détecté sur votre appareil.',
      action: 'Connectez un microphone ou essayez un autre mode d\'analyse',
    },
    en: {
      title: 'Microphone not available',
      description: 'No microphone was detected on your device.',
      action: 'Connect a microphone or try another analysis mode',
    },
  },

  NETWORK_ERROR: {
    fr: {
      title: 'Erreur de connexion',
      description: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
      action: 'Réessayer',
    },
    en: {
      title: 'Connection error',
      description: 'Unable to connect to the server. Check your internet connection.',
      action: 'Retry',
    },
  },

  API_ERROR: {
    fr: {
      title: 'Erreur du serveur',
      description: 'Une erreur s\'est produite lors de l\'analyse. Veuillez réessayer.',
      action: 'Réessayer',
    },
    en: {
      title: 'Server error',
      description: 'An error occurred during analysis. Please try again.',
      action: 'Retry',
    },
  },

  ANALYSIS_FAILED: {
    fr: {
      title: 'Analyse échouée',
      description: 'L\'analyse de vos émotions n\'a pas pu être effectuée.',
      action: 'Réessayer avec une autre méthode',
    },
    en: {
      title: 'Analysis failed',
      description: 'Your emotion analysis could not be performed.',
      action: 'Try again with another method',
    },
  },

  INVALID_INPUT: {
    fr: {
      title: 'Données invalides',
      description: 'Les données fournies ne sont pas valides.',
      action: 'Vérifier votre saisie',
    },
    en: {
      title: 'Invalid data',
      description: 'The provided data is not valid.',
      action: 'Check your input',
    },
  },

  TEXT_TOO_SHORT: {
    fr: {
      title: 'Texte trop court',
      description: 'Veuillez saisir au moins quelques mots pour une analyse précise.',
      action: 'Ajouter plus de texte',
    },
    en: {
      title: 'Text too short',
      description: 'Please enter at least a few words for accurate analysis.',
      action: 'Add more text',
    },
  },

  TEXT_TOO_LONG: {
    fr: {
      title: 'Texte trop long',
      description: 'Le texte ne doit pas dépasser 1000 caractères.',
      action: 'Réduire le texte',
    },
    en: {
      title: 'Text too long',
      description: 'The text must not exceed 1000 characters.',
      action: 'Reduce the text',
    },
  },

  AUDIO_RECORDING_FAILED: {
    fr: {
      title: 'Enregistrement échoué',
      description: 'L\'enregistrement audio n\'a pas pu être effectué.',
      action: 'Vérifier les permissions et réessayer',
    },
    en: {
      title: 'Recording failed',
      description: 'Audio recording could not be performed.',
      action: 'Check permissions and try again',
    },
  },

  IMAGE_CAPTURE_FAILED: {
    fr: {
      title: 'Capture échouée',
      description: 'La capture d\'image n\'a pas pu être effectuée.',
      action: 'Vérifier la caméra et réessayer',
    },
    en: {
      title: 'Capture failed',
      description: 'Image capture could not be performed.',
      action: 'Check camera and try again',
    },
  },

  RATE_LIMIT_EXCEEDED: {
    fr: {
      title: 'Trop de requêtes',
      description: 'Vous avez effectué trop d\'analyses en peu de temps. Veuillez patienter.',
      action: 'Réessayer dans quelques minutes',
    },
    en: {
      title: 'Too many requests',
      description: 'You have performed too many analyses in a short time. Please wait.',
      action: 'Try again in a few minutes',
    },
  },

  UNAUTHORIZED: {
    fr: {
      title: 'Non autorisé',
      description: 'Vous devez être connecté pour accéder à cette fonctionnalité.',
      action: 'Se connecter',
    },
    en: {
      title: 'Unauthorized',
      description: 'You must be logged in to access this feature.',
      action: 'Log in',
    },
  },

  INSUFFICIENT_CONFIDENCE: {
    fr: {
      title: 'Confiance insuffisante',
      description: 'L\'analyse n\'a pas atteint un niveau de confiance suffisant. Essayez une autre méthode.',
      action: 'Réessayer ou changer de mode',
    },
    en: {
      title: 'Insufficient confidence',
      description: 'The analysis did not reach a sufficient confidence level. Try another method.',
      action: 'Try again or change mode',
    },
  },

  UNKNOWN_ERROR: {
    fr: {
      title: 'Erreur inconnue',
      description: 'Une erreur inattendue s\'est produite.',
      action: 'Réessayer ou contacter le support',
    },
    en: {
      title: 'Unknown error',
      description: 'An unexpected error occurred.',
      action: 'Try again or contact support',
    },
  },
};

/**
 * Récupère un message d'erreur localisé
 */
export function getErrorMessage(
  code: ErrorCode,
  language: Language = 'fr'
): ErrorMessage {
  return ERROR_MESSAGES[code][language];
}

/**
 * Crée une erreur structurée avec code et message localisé
 */
export class ScanError extends Error {
  public readonly code: ErrorCode;
  public readonly localizedMessage: ErrorMessage;

  constructor(code: ErrorCode, language: Language = 'fr', cause?: unknown) {
    const localizedMessage = getErrorMessage(code, language);
    super(localizedMessage.description);

    this.name = 'ScanError';
    this.code = code;
    this.localizedMessage = localizedMessage;

    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * Détecte le type d'erreur et retourne le code approprié
 */
export function detectErrorCode(error: unknown): ErrorCode {
  if (error instanceof ScanError) {
    return error.code;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Permissions
    if (message.includes('permission') || message.includes('denied')) {
      if (message.includes('camera') || message.includes('video')) {
        return 'CAMERA_PERMISSION_DENIED';
      }
      if (message.includes('microphone') || message.includes('audio')) {
        return 'MICROPHONE_PERMISSION_DENIED';
      }
    }

    // Devices not found
    if (message.includes('not found') || message.includes('no device')) {
      if (message.includes('camera') || message.includes('video')) {
        return 'CAMERA_NOT_AVAILABLE';
      }
      if (message.includes('microphone') || message.includes('audio')) {
        return 'MICROPHONE_NOT_AVAILABLE';
      }
    }

    // Network errors
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection')
    ) {
      return 'NETWORK_ERROR';
    }

    // Rate limiting
    if (message.includes('rate limit') || message.includes('too many')) {
      return 'RATE_LIMIT_EXCEEDED';
    }

    // Authorization
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'UNAUTHORIZED';
    }

    // API errors
    if (message.includes('api') || message.includes('server')) {
      return 'API_ERROR';
    }
  }

  return 'UNKNOWN_ERROR';
}

/**
 * Hook pour afficher les erreurs avec toast
 */
export function formatErrorForToast(
  error: unknown,
  language: Language = 'fr'
): { title: string; description: string; variant: 'destructive' } {
  const code = detectErrorCode(error);
  const message = getErrorMessage(code, language);

  return {
    title: message.title,
    description: message.description,
    variant: 'destructive',
  };
}
