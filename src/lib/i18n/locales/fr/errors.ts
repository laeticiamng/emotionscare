export const errors = {
  // General errors
  generalError: 'Une erreur est survenue',
  unexpectedError: 'Erreur inattendue',
  somethingWentWrong: 'Quelque chose s\'est mal passé',
  tryAgain: 'Veuillez réessayer',
  contactSupport: 'Contactez le support si le problème persiste',
  
  // Network errors
  networkError: 'Erreur de connexion',
  noInternet: 'Pas de connexion internet',
  serverError: 'Erreur serveur',
  timeoutError: 'Délai d\'attente dépassé',
  connectionLost: 'Connexion perdue',
  operationAborted: 'Opération annulée',
  
  // Authentication errors
  authError: 'Erreur d\'authentification',
  notAuthenticated: 'Non authentifié',
  sessionExpired: 'Session expirée',
  invalidToken: 'Token invalide',
  accessDenied: 'Accès refusé',
  
  // Validation errors
  validationError: 'Erreur de validation',
  requiredField: 'Ce champ est requis',
  invalidFormat: 'Format invalide',
  invalidEmail: 'Adresse e-mail invalide',
  invalidPassword: 'Mot de passe invalide',
  
  // API errors
  apiError: 'Erreur API',
  badRequest: 'Requête invalide',
  unauthorized: 'Non autorisé',
  forbidden: 'Interdit',
  notFound: 'Non trouvé',
  methodNotAllowed: 'Méthode non autorisée',
  tooManyRequests: 'Trop de requêtes',
  internalServerError: 'Erreur interne du serveur',
  
  // Device errors
  deviceError: 'Erreur d\'appareil',
  cameraNotAvailable: 'Caméra non disponible',
  microphoneNotAvailable: 'Microphone non disponible',
  bluetoothNotAvailable: 'Bluetooth non disponible',
  webrtcNotSupported: 'WebRTC non supporté',
  geolocationNotAvailable: 'Géolocalisation non disponible',
  
  // Permission errors
  permissionError: 'Erreur de permission',
  cameraPermissionDenied: 'Permission caméra refusée',
  microphonePermissionDenied: 'Permission microphone refusée',
  notificationPermissionDenied: 'Permission notifications refusée',
  locationPermissionDenied: 'Permission géolocalisation refusée',
  
  // Data errors
  dataError: 'Erreur de données',
  dataNotFound: 'Données non trouvées',
  dataCorrupted: 'Données corrompues',
  exportError: 'Erreur d\'exportation',
  importError: 'Erreur d\'importation',
  
  // File errors
  fileError: 'Erreur de fichier',
  fileNotFound: 'Fichier non trouvé',
  fileTooLarge: 'Fichier trop volumineux',
  invalidFileType: 'Type de fichier invalide',
  uploadError: 'Erreur de téléchargement',
  
  // Feature errors
  featureNotAvailable: 'Fonctionnalité non disponible',
  featureNotSupported: 'Fonctionnalité non supportée',
  vrNotSupported: 'VR non supportée',
  webxrNotAvailable: 'WebXR non disponible',
  
  // Subscription errors
  subscriptionError: 'Erreur d\'abonnement',
  subscriptionExpired: 'Abonnement expiré',
  subscriptionRequired: 'Abonnement requis',
  paymentError: 'Erreur de paiement',
  
  // Rate limiting
  rateLimitExceeded: 'Limite de débit dépassée',
  quotaExceeded: 'Quota dépassé',
  dailyLimitReached: 'Limite quotidienne atteinte',
  
  // Specific module errors
  emotionScanError: 'Erreur du scan émotionnel',
  musicGenerationError: 'Erreur de génération musicale',
  aiCoachError: 'Erreur du coach IA',
  journalError: 'Erreur du journal',
  vrInitError: 'Erreur d\'initialisation VR',
  
  // Recovery suggestions
  refreshPage: 'Actualiser la page',
  checkConnection: 'Vérifiez votre connexion',
  enablePermissions: 'Activez les permissions',
  updateBrowser: 'Mettez à jour votre navigateur',
  clearCache: 'Vider le cache',
  restartApp: 'Redémarrer l\'application',
};