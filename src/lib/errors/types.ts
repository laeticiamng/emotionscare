// @ts-nocheck
/**
 * Error Types - Système de gestion des erreurs complet
 * Types, classes et utilitaires pour les erreurs applicatives
 */

/** Code d'erreur */
export type ErrorCode =
  | 'NETWORK'
  | 'TIMEOUT'
  | 'ABORTED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMIT'
  | 'VALIDATION'
  | 'SERVER'
  | 'UNKNOWN'
  | 'CONFLICT'
  | 'GONE'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA'
  | 'UNPROCESSABLE'
  | 'TOO_MANY_REQUESTS'
  | 'SERVICE_UNAVAILABLE'
  | 'GATEWAY_TIMEOUT'
  | 'DATABASE'
  | 'CACHE'
  | 'STORAGE'
  | 'EXTERNAL_SERVICE'
  | 'AUTHENTICATION'
  | 'AUTHORIZATION'
  | 'PERMISSION'
  | 'SESSION_EXPIRED'
  | 'TOKEN_INVALID'
  | 'TOKEN_EXPIRED'
  | 'CAPTCHA_REQUIRED'
  | 'MFA_REQUIRED'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_DISABLED'
  | 'MAINTENANCE'
  | 'FEATURE_DISABLED'
  | 'QUOTA_EXCEEDED'
  | 'SUBSCRIPTION_REQUIRED'
  | 'PAYMENT_REQUIRED'
  | 'INSUFFICIENT_FUNDS'
  | 'INVALID_INPUT'
  | 'MISSING_REQUIRED'
  | 'DUPLICATE'
  | 'INTEGRITY'
  | 'PARSE_ERROR'
  | 'SERIALIZATION'
  | 'ENCRYPTION'
  | 'DECRYPTION';

/** Sévérité de l'erreur */
export type ErrorSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical' | 'fatal';

/** Catégorie d'erreur */
export type ErrorCategory =
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'business'
  | 'infrastructure'
  | 'external'
  | 'unknown';

/** Interface d'erreur applicative */
export interface AppError {
  code: ErrorCode;
  messageKey: string;
  message?: string;
  httpStatus?: number;
  cause?: unknown;
  context?: Record<string, unknown>;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  retryable?: boolean;
  timestamp?: number;
  requestId?: string;
  stack?: string;
}

/** Métadonnées de contexte d'erreur */
export type ErrorContextMetadata = Record<string, unknown>;

/** Options de création d'erreur */
export interface CreateErrorOptions {
  code: ErrorCode;
  message: string;
  messageKey?: string;
  httpStatus?: number;
  cause?: Error | unknown;
  context?: ErrorContextMetadata;
  severity?: ErrorSeverity;
  retryable?: boolean;
}

/** Configuration de mapping HTTP -> ErrorCode */
export const HTTP_STATUS_TO_ERROR_CODE: Record<number, ErrorCode> = {
  400: 'VALIDATION',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  405: 'VALIDATION',
  408: 'TIMEOUT',
  409: 'CONFLICT',
  410: 'GONE',
  413: 'PAYLOAD_TOO_LARGE',
  415: 'UNSUPPORTED_MEDIA',
  422: 'UNPROCESSABLE',
  429: 'TOO_MANY_REQUESTS',
  500: 'SERVER',
  502: 'EXTERNAL_SERVICE',
  503: 'SERVICE_UNAVAILABLE',
  504: 'GATEWAY_TIMEOUT'
};

/** Messages d'erreur par code */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  NETWORK: 'Erreur de connexion réseau',
  TIMEOUT: 'La requête a expiré',
  ABORTED: 'Requête annulée',
  UNAUTHORIZED: 'Authentification requise',
  FORBIDDEN: 'Accès refusé',
  NOT_FOUND: 'Ressource non trouvée',
  RATE_LIMIT: 'Trop de requêtes',
  VALIDATION: 'Données invalides',
  SERVER: 'Erreur serveur',
  UNKNOWN: 'Une erreur inattendue s\'est produite',
  CONFLICT: 'Conflit de données',
  GONE: 'Ressource supprimée',
  PAYLOAD_TOO_LARGE: 'Données trop volumineuses',
  UNSUPPORTED_MEDIA: 'Format non supporté',
  UNPROCESSABLE: 'Données non traitables',
  TOO_MANY_REQUESTS: 'Limite de requêtes atteinte',
  SERVICE_UNAVAILABLE: 'Service temporairement indisponible',
  GATEWAY_TIMEOUT: 'Timeout du serveur distant',
  DATABASE: 'Erreur de base de données',
  CACHE: 'Erreur de cache',
  STORAGE: 'Erreur de stockage',
  EXTERNAL_SERVICE: 'Erreur du service externe',
  AUTHENTICATION: 'Erreur d\'authentification',
  AUTHORIZATION: 'Non autorisé',
  PERMISSION: 'Permission insuffisante',
  SESSION_EXPIRED: 'Session expirée',
  TOKEN_INVALID: 'Token invalide',
  TOKEN_EXPIRED: 'Token expiré',
  CAPTCHA_REQUIRED: 'Vérification CAPTCHA requise',
  MFA_REQUIRED: 'Authentification à deux facteurs requise',
  EMAIL_NOT_VERIFIED: 'Email non vérifié',
  ACCOUNT_LOCKED: 'Compte bloqué',
  ACCOUNT_DISABLED: 'Compte désactivé',
  MAINTENANCE: 'Maintenance en cours',
  FEATURE_DISABLED: 'Fonctionnalité désactivée',
  QUOTA_EXCEEDED: 'Quota dépassé',
  SUBSCRIPTION_REQUIRED: 'Abonnement requis',
  PAYMENT_REQUIRED: 'Paiement requis',
  INSUFFICIENT_FUNDS: 'Fonds insuffisants',
  INVALID_INPUT: 'Entrée invalide',
  MISSING_REQUIRED: 'Champ requis manquant',
  DUPLICATE: 'Doublon détecté',
  INTEGRITY: 'Erreur d\'intégrité des données',
  PARSE_ERROR: 'Erreur de parsing',
  SERIALIZATION: 'Erreur de sérialisation',
  ENCRYPTION: 'Erreur de chiffrement',
  DECRYPTION: 'Erreur de déchiffrement'
};

/** Messages d'erreur en anglais */
export const ERROR_MESSAGES_EN: Record<ErrorCode, string> = {
  NETWORK: 'Network connection error',
  TIMEOUT: 'Request timed out',
  ABORTED: 'Request was aborted',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  RATE_LIMIT: 'Too many requests',
  VALIDATION: 'Invalid data',
  SERVER: 'Server error',
  UNKNOWN: 'An unexpected error occurred',
  CONFLICT: 'Data conflict',
  GONE: 'Resource deleted',
  PAYLOAD_TOO_LARGE: 'Payload too large',
  UNSUPPORTED_MEDIA: 'Unsupported format',
  UNPROCESSABLE: 'Unprocessable data',
  TOO_MANY_REQUESTS: 'Request limit reached',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  GATEWAY_TIMEOUT: 'Remote server timeout',
  DATABASE: 'Database error',
  CACHE: 'Cache error',
  STORAGE: 'Storage error',
  EXTERNAL_SERVICE: 'External service error',
  AUTHENTICATION: 'Authentication error',
  AUTHORIZATION: 'Not authorized',
  PERMISSION: 'Insufficient permissions',
  SESSION_EXPIRED: 'Session expired',
  TOKEN_INVALID: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  CAPTCHA_REQUIRED: 'CAPTCHA verification required',
  MFA_REQUIRED: 'Two-factor authentication required',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  ACCOUNT_LOCKED: 'Account locked',
  ACCOUNT_DISABLED: 'Account disabled',
  MAINTENANCE: 'Maintenance in progress',
  FEATURE_DISABLED: 'Feature disabled',
  QUOTA_EXCEEDED: 'Quota exceeded',
  SUBSCRIPTION_REQUIRED: 'Subscription required',
  PAYMENT_REQUIRED: 'Payment required',
  INSUFFICIENT_FUNDS: 'Insufficient funds',
  INVALID_INPUT: 'Invalid input',
  MISSING_REQUIRED: 'Required field missing',
  DUPLICATE: 'Duplicate detected',
  INTEGRITY: 'Data integrity error',
  PARSE_ERROR: 'Parse error',
  SERIALIZATION: 'Serialization error',
  ENCRYPTION: 'Encryption error',
  DECRYPTION: 'Decryption error'
};

/** Erreurs réessayables par défaut */
export const RETRYABLE_ERRORS: ErrorCode[] = [
  'NETWORK',
  'TIMEOUT',
  'SERVICE_UNAVAILABLE',
  'GATEWAY_TIMEOUT',
  'TOO_MANY_REQUESTS',
  'RATE_LIMIT'
];

/** Classe d'erreur applicative */
export class ApplicationError extends Error implements AppError {
  code: ErrorCode;
  messageKey: string;
  httpStatus?: number;
  cause?: unknown;
  context?: ErrorContextMetadata;
  severity: ErrorSeverity;
  category: ErrorCategory;
  retryable: boolean;
  timestamp: number;
  requestId?: string;

  constructor(options: CreateErrorOptions) {
    super(options.message);
    this.name = 'ApplicationError';
    this.code = options.code;
    this.messageKey = options.messageKey || `errors.${options.code.toLowerCase()}`;
    this.httpStatus = options.httpStatus;
    this.cause = options.cause;
    this.context = options.context;
    this.severity = options.severity || getSeverityForCode(options.code);
    this.category = getCategoryForCode(options.code);
    this.retryable = options.retryable ?? RETRYABLE_ERRORS.includes(options.code);
    this.timestamp = Date.now();

    // Capture la stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }

    // Incorpore la stack de la cause si présente
    if (options.cause instanceof Error && options.cause.stack) {
      this.stack = `${this.stack}\n\nCaused by: ${options.cause.stack}`;
    }
  }

  /** Convertir en objet simple */
  toJSON(): AppError {
    return {
      code: this.code,
      messageKey: this.messageKey,
      message: this.message,
      httpStatus: this.httpStatus,
      context: this.context,
      severity: this.severity,
      category: this.category,
      retryable: this.retryable,
      timestamp: this.timestamp,
      requestId: this.requestId,
      stack: this.stack
    };
  }

  /** Obtenir le message localisé */
  getLocalizedMessage(locale: 'fr' | 'en' = 'fr'): string {
    const messages = locale === 'en' ? ERROR_MESSAGES_EN : ERROR_MESSAGES;
    return messages[this.code] || this.message;
  }
}

/** Obtenir la sévérité pour un code */
export function getSeverityForCode(code: ErrorCode): ErrorSeverity {
  switch (code) {
    case 'VALIDATION':
    case 'NOT_FOUND':
    case 'CONFLICT':
    case 'INVALID_INPUT':
    case 'MISSING_REQUIRED':
      return 'warning';

    case 'UNAUTHORIZED':
    case 'FORBIDDEN':
    case 'SESSION_EXPIRED':
    case 'TOKEN_EXPIRED':
    case 'RATE_LIMIT':
      return 'error';

    case 'SERVER':
    case 'DATABASE':
    case 'ENCRYPTION':
    case 'DECRYPTION':
    case 'INTEGRITY':
      return 'critical';

    case 'NETWORK':
    case 'TIMEOUT':
    case 'SERVICE_UNAVAILABLE':
      return 'error';

    default:
      return 'error';
  }
}

/** Obtenir la catégorie pour un code */
export function getCategoryForCode(code: ErrorCode): ErrorCategory {
  switch (code) {
    case 'NETWORK':
    case 'TIMEOUT':
    case 'ABORTED':
      return 'network';

    case 'UNAUTHORIZED':
    case 'SESSION_EXPIRED':
    case 'TOKEN_INVALID':
    case 'TOKEN_EXPIRED':
    case 'CAPTCHA_REQUIRED':
    case 'MFA_REQUIRED':
    case 'EMAIL_NOT_VERIFIED':
    case 'AUTHENTICATION':
      return 'authentication';

    case 'FORBIDDEN':
    case 'PERMISSION':
    case 'ACCOUNT_LOCKED':
    case 'ACCOUNT_DISABLED':
    case 'AUTHORIZATION':
      return 'authorization';

    case 'VALIDATION':
    case 'INVALID_INPUT':
    case 'MISSING_REQUIRED':
    case 'UNPROCESSABLE':
    case 'PAYLOAD_TOO_LARGE':
    case 'UNSUPPORTED_MEDIA':
      return 'validation';

    case 'DATABASE':
    case 'CACHE':
    case 'STORAGE':
    case 'SERVER':
    case 'INTEGRITY':
      return 'infrastructure';

    case 'EXTERNAL_SERVICE':
    case 'GATEWAY_TIMEOUT':
    case 'SERVICE_UNAVAILABLE':
      return 'external';

    case 'SUBSCRIPTION_REQUIRED':
    case 'PAYMENT_REQUIRED':
    case 'INSUFFICIENT_FUNDS':
    case 'QUOTA_EXCEEDED':
    case 'FEATURE_DISABLED':
    case 'MAINTENANCE':
      return 'business';

    default:
      return 'unknown';
  }
}

/** Créer une erreur */
export function createError(options: CreateErrorOptions): ApplicationError {
  return new ApplicationError(options);
}

/** Créer une erreur depuis un code HTTP */
export function fromHttpStatus(
  status: number,
  message?: string,
  context?: ErrorContextMetadata
): ApplicationError {
  const code = HTTP_STATUS_TO_ERROR_CODE[status] || 'UNKNOWN';
  return createError({
    code,
    message: message || ERROR_MESSAGES[code],
    httpStatus: status,
    context
  });
}

/** Créer une erreur réseau */
export function networkError(message?: string, cause?: Error): ApplicationError {
  return createError({
    code: 'NETWORK',
    message: message || ERROR_MESSAGES.NETWORK,
    cause
  });
}

/** Créer une erreur de timeout */
export function timeoutError(message?: string, cause?: Error): ApplicationError {
  return createError({
    code: 'TIMEOUT',
    message: message || ERROR_MESSAGES.TIMEOUT,
    cause
  });
}

/** Créer une erreur de validation */
export function validationError(
  message: string,
  context?: ErrorContextMetadata
): ApplicationError {
  return createError({
    code: 'VALIDATION',
    message,
    httpStatus: 400,
    context
  });
}

/** Créer une erreur d'authentification */
export function authenticationError(message?: string): ApplicationError {
  return createError({
    code: 'UNAUTHORIZED',
    message: message || ERROR_MESSAGES.UNAUTHORIZED,
    httpStatus: 401
  });
}

/** Créer une erreur d'autorisation */
export function authorizationError(message?: string): ApplicationError {
  return createError({
    code: 'FORBIDDEN',
    message: message || ERROR_MESSAGES.FORBIDDEN,
    httpStatus: 403
  });
}

/** Créer une erreur not found */
export function notFoundError(resource?: string): ApplicationError {
  return createError({
    code: 'NOT_FOUND',
    message: resource ? `${resource} non trouvé` : ERROR_MESSAGES.NOT_FOUND,
    httpStatus: 404
  });
}

/** Créer une erreur serveur */
export function serverError(message?: string, cause?: Error): ApplicationError {
  return createError({
    code: 'SERVER',
    message: message || ERROR_MESSAGES.SERVER,
    httpStatus: 500,
    cause,
    severity: 'critical'
  });
}

/** Vérifier si une erreur est une ApplicationError */
export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError;
}

/** Vérifier si une erreur est réessayable */
export function isRetryable(error: unknown): boolean {
  if (isApplicationError(error)) {
    return error.retryable;
  }
  return false;
}

/** Normaliser une erreur en ApplicationError */
export function normalizeError(error: unknown): ApplicationError {
  if (isApplicationError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return createError({
      code: 'UNKNOWN',
      message: error.message,
      cause: error
    });
  }

  return createError({
    code: 'UNKNOWN',
    message: String(error)
  });
}

/** Wrapper pour attraper et normaliser les erreurs */
export async function tryCatch<T>(
  fn: () => Promise<T> | T
): Promise<[T, null] | [null, ApplicationError]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, normalizeError(error)];
  }
}

/** Agréger plusieurs erreurs */
export class AggregateError extends Error {
  errors: ApplicationError[];

  constructor(errors: ApplicationError[], message?: string) {
    super(message || `${errors.length} errors occurred`);
    this.name = 'AggregateError';
    this.errors = errors;
  }
}

export default {
  ApplicationError,
  AggregateError,
  createError,
  fromHttpStatus,
  networkError,
  timeoutError,
  validationError,
  authenticationError,
  authorizationError,
  notFoundError,
  serverError,
  isApplicationError,
  isRetryable,
  normalizeError,
  tryCatch,
  getSeverityForCode,
  getCategoryForCode,
  ERROR_MESSAGES,
  ERROR_MESSAGES_EN,
  HTTP_STATUS_TO_ERROR_CODE,
  RETRYABLE_ERRORS
};
