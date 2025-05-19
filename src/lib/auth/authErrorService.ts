
/**
 * Service qui traduit les erreurs d'authentification techniques en messages compréhensibles
 */

// Types d'erreurs possibles
export type AuthErrorType =
  | 'credentials'    // Erreurs de crendentials (mot de passe incorrect, etc.)
  | 'email'          // Erreurs liées à l'email
  | 'account'        // Erreurs liées au compte
  | 'connection'     // Erreurs de connexion
  | 'server'         // Erreurs serveur
  | 'validation'     // Erreurs de validation
  | 'unknown';       // Erreurs inconnues

// Récupérer le message d'erreur UX-friendly en fonction de l'erreur technique
export const getFriendlyAuthError = (error: any): { type: AuthErrorType; message: string } => {
  // Cas de base: pas d'objet d'erreur
  if (!error) {
    return {
      type: 'unknown',
      message: 'Une erreur est survenue lors de la tentative d\'authentification.'
    };
  }

  // Récupérer le message d'erreur (différentes structures possibles)
  const errorMessage = error.message || error.error_description || error.error || String(error);

  // Email invalide ou inexistant
  if (
    errorMessage.includes('email') && 
    (errorMessage.includes('not found') || errorMessage.includes('invalid'))
  ) {
    return {
      type: 'email',
      message: 'Adresse email invalide ou inexistante.'
    };
  }

  // Mot de passe incorrect
  if (
    errorMessage.includes('password') && 
    (errorMessage.includes('incorrect') || errorMessage.includes('invalid') || errorMessage.includes('wrong'))
  ) {
    return {
      type: 'credentials',
      message: 'Mot de passe incorrect. Veuillez réessayer.'
    };
  }
  
  // Email déjà utilisé
  if (
    errorMessage.includes('email') && 
    errorMessage.includes('already') && 
    errorMessage.includes('exists')
  ) {
    return {
      type: 'email',
      message: 'Cette adresse email est déjà utilisée.'
    };
  }

  // Compte inexistant
  if (errorMessage.includes('user') && errorMessage.includes('not found')) {
    return {
      type: 'account',
      message: 'Aucun compte n\'existe avec cet identifiant.'
    };
  }

  // Problème de connexion
  if (
    errorMessage.includes('network') || 
    errorMessage.includes('timeout') || 
    errorMessage.includes('connection')
  ) {
    return {
      type: 'connection',
      message: 'Problème de connexion. Veuillez vérifier votre réseau et réessayer.'
    };
  }

  // Erreur serveur
  if (
    errorMessage.includes('server') || 
    errorMessage.includes('500') || 
    errorMessage.includes('unavailable')
  ) {
    return {
      type: 'server',
      message: 'Le service est momentanément indisponible. Veuillez réessayer ultérieurement.'
    };
  }

  // Erreur de validation
  if (errorMessage.includes('validation')) {
    return {
      type: 'validation',
      message: 'Certaines informations saisies sont invalides. Veuillez les vérifier et réessayer.'
    };
  }

  // Par défaut: message générique mais rassurant
  return {
    type: 'unknown',
    message: 'Une erreur est survenue. Veuillez réessayer ou contacter notre support.'
  };
};

// Récupérer les recommandations en fonction du type d'erreur
export const getAuthErrorRecommendation = (errorType: AuthErrorType): string => {
  switch (errorType) {
    case 'credentials':
      return 'Vérifiez que votre mot de passe est correct. Vous pouvez utiliser la fonction "Mot de passe oublié" si nécessaire.';
    
    case 'email':
      return 'Vérifiez que votre adresse email est correcte et qu\'elle est bien associée à un compte.';
    
    case 'account':
      return 'Si vous n\'avez pas de compte, vous pouvez vous inscrire. Sinon, vérifiez l\'adresse email utilisée.';
    
    case 'connection':
      return 'Vérifiez votre connexion internet ou réessayez dans quelques instants.';
    
    case 'server':
      return 'Nos serveurs rencontrent actuellement des difficultés. Veuillez réessayer plus tard.';
    
    case 'validation':
      return 'Assurez-vous que toutes les informations requises sont correctement remplies.';
    
    case 'unknown':
    default:
      return 'Vous pouvez réessayer ou contacter notre support si le problème persiste.';
  }
};
