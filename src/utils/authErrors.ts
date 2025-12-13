// @ts-nocheck
/**
 * authErrors - Gestion complète des erreurs d'authentification
 * Types, classes et utilitaires pour les erreurs auth
 */

import { logger } from '@/lib/logger';

/** Codes d'erreur d'authentification */
export enum AuthErrorCode {
  // Erreurs de connexion
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED',

  // Erreurs de token
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',

  // Erreurs de session
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_INVALID = 'SESSION_INVALID',
  SESSION_CONFLICT = 'SESSION_CONFLICT',
  MAX_SESSIONS_REACHED = 'MAX_SESSIONS_REACHED',

  // Erreurs d'inscription
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',

  // Erreurs de mot de passe
  PASSWORD_RESET_EXPIRED = 'PASSWORD_RESET_EXPIRED',
  PASSWORD_RESET_INVALID = 'PASSWORD_RESET_INVALID',
  PASSWORD_SAME_AS_OLD = 'PASSWORD_SAME_AS_OLD',
  PASSWORD_RECENTLY_USED = 'PASSWORD_RECENTLY_USED',

  // Erreurs d'autorisation
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ROLE_NOT_ALLOWED = 'ROLE_NOT_ALLOWED',

  // Erreurs OAuth
  OAUTH_PROVIDER_ERROR = 'OAUTH_PROVIDER_ERROR',
  OAUTH_CANCELLED = 'OAUTH_CANCELLED',
  OAUTH_ACCOUNT_NOT_LINKED = 'OAUTH_ACCOUNT_NOT_LINKED',
  OAUTH_EMAIL_MISMATCH = 'OAUTH_EMAIL_MISMATCH',

  // Erreurs MFA
  MFA_REQUIRED = 'MFA_REQUIRED',
  MFA_INVALID_CODE = 'MFA_INVALID_CODE',
  MFA_EXPIRED = 'MFA_EXPIRED',
  MFA_NOT_CONFIGURED = 'MFA_NOT_CONFIGURED',

  // Erreurs réseau/serveur
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Autres
  UNKNOWN = 'UNKNOWN'
}

/** Sévérité de l'erreur */
export type AuthErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/** Contexte de l'erreur */
export interface AuthErrorContext {
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  attemptCount?: number;
  provider?: string;
  timestamp?: Date;
  additionalData?: Record<string, unknown>;
}

/** Options de l'erreur */
export interface AuthErrorOptions {
  code: AuthErrorCode;
  message?: string;
  cause?: Error;
  context?: AuthErrorContext;
  recoverable?: boolean;
  retryAfter?: number;
  redirectTo?: string;
}

/** Classe principale AuthError */
export class AuthError extends Error {
  code: AuthErrorCode;
  severity: AuthErrorSeverity;
  context?: AuthErrorContext;
  recoverable: boolean;
  retryAfter?: number;
  redirectTo?: string;
  timestamp: Date;
  originalError?: Error;

  constructor(options: AuthErrorOptions | AuthErrorCode, message?: string) {
    // Support de l'ancienne API
    if (typeof options === 'string') {
      super(message || getDefaultMessage(options as AuthErrorCode));
      this.code = options as AuthErrorCode;
      this.severity = getErrorSeverity(this.code);
      this.recoverable = isRecoverable(this.code);
    } else {
      super(options.message || getDefaultMessage(options.code));
      this.code = options.code;
      this.severity = getErrorSeverity(options.code);
      this.context = options.context;
      this.recoverable = options.recoverable ?? isRecoverable(options.code);
      this.retryAfter = options.retryAfter;
      this.redirectTo = options.redirectTo;
      this.originalError = options.cause;

      if (options.cause) {
        this.stack = options.cause.stack;
      }
    }

    this.name = 'AuthError';
    this.timestamp = new Date();

    // Log l'erreur
    this.logError();
  }

  private logError(): void {
    const logData = {
      code: this.code,
      message: this.message,
      severity: this.severity,
      context: this.context,
      recoverable: this.recoverable
    };

    if (this.severity === 'critical' || this.severity === 'high') {
      logger.error('Auth error', this, 'AUTH');
    } else {
      logger.warn('Auth error', logData, 'AUTH');
    }
  }

  /** Obtenir un message utilisateur friendly */
  getUserMessage(locale: string = 'fr'): string {
    return getUserFriendlyMessage(this.code, locale);
  }

  /** Sérialiser l'erreur pour transmission */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      recoverable: this.recoverable,
      retryAfter: this.retryAfter,
      redirectTo: this.redirectTo,
      timestamp: this.timestamp.toISOString()
    };
  }

  /** Créer depuis une réponse API */
  static fromResponse(response: { status: number; data?: any }): AuthError {
    const code = mapHttpStatusToCode(response.status);
    return new AuthError({
      code,
      message: response.data?.message,
      context: response.data?.context
    });
  }

  /** Créer depuis une erreur native */
  static fromError(error: Error): AuthError {
    if (error instanceof AuthError) return error;

    // Détecter le type d'erreur
    const code = detectErrorCode(error);

    return new AuthError({
      code,
      message: error.message,
      cause: error
    });
  }
}

/** Obtenir le message par défaut pour un code */
export function getDefaultMessage(code: AuthErrorCode): string {
  const messages: Record<AuthErrorCode, string> = {
    [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
    [AuthErrorCode.TOO_MANY_ATTEMPTS]: 'Too many failed attempts. Please try again later.',
    [AuthErrorCode.ACCOUNT_LOCKED]: 'Your account has been locked',
    [AuthErrorCode.ACCOUNT_DISABLED]: 'Your account has been disabled',
    [AuthErrorCode.ACCOUNT_NOT_VERIFIED]: 'Please verify your email address',
    [AuthErrorCode.TOKEN_EXPIRED]: 'Your session has expired',
    [AuthErrorCode.TOKEN_INVALID]: 'Invalid authentication token',
    [AuthErrorCode.TOKEN_REVOKED]: 'Your session has been revoked',
    [AuthErrorCode.REFRESH_TOKEN_EXPIRED]: 'Please log in again',
    [AuthErrorCode.SESSION_EXPIRED]: 'Your session has expired',
    [AuthErrorCode.SESSION_INVALID]: 'Invalid session',
    [AuthErrorCode.SESSION_CONFLICT]: 'Session conflict detected',
    [AuthErrorCode.MAX_SESSIONS_REACHED]: 'Maximum number of sessions reached',
    [AuthErrorCode.EMAIL_ALREADY_EXISTS]: 'This email is already registered',
    [AuthErrorCode.USERNAME_TAKEN]: 'This username is already taken',
    [AuthErrorCode.WEAK_PASSWORD]: 'Password does not meet requirements',
    [AuthErrorCode.INVALID_EMAIL_FORMAT]: 'Invalid email format',
    [AuthErrorCode.PASSWORD_RESET_EXPIRED]: 'Password reset link has expired',
    [AuthErrorCode.PASSWORD_RESET_INVALID]: 'Invalid password reset link',
    [AuthErrorCode.PASSWORD_SAME_AS_OLD]: 'New password must be different from current',
    [AuthErrorCode.PASSWORD_RECENTLY_USED]: 'This password was recently used',
    [AuthErrorCode.UNAUTHORIZED]: 'Authentication required',
    [AuthErrorCode.FORBIDDEN]: 'Access denied',
    [AuthErrorCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
    [AuthErrorCode.ROLE_NOT_ALLOWED]: 'Your role does not allow this action',
    [AuthErrorCode.OAUTH_PROVIDER_ERROR]: 'Error with authentication provider',
    [AuthErrorCode.OAUTH_CANCELLED]: 'Authentication was cancelled',
    [AuthErrorCode.OAUTH_ACCOUNT_NOT_LINKED]: 'Account not linked to this provider',
    [AuthErrorCode.OAUTH_EMAIL_MISMATCH]: 'Email mismatch with provider',
    [AuthErrorCode.MFA_REQUIRED]: 'Two-factor authentication required',
    [AuthErrorCode.MFA_INVALID_CODE]: 'Invalid verification code',
    [AuthErrorCode.MFA_EXPIRED]: 'Verification code has expired',
    [AuthErrorCode.MFA_NOT_CONFIGURED]: 'Two-factor authentication not configured',
    [AuthErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
    [AuthErrorCode.SERVER_ERROR]: 'Server error. Please try again later.',
    [AuthErrorCode.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
    [AuthErrorCode.UNKNOWN]: 'An unknown error occurred'
  };

  return messages[code] || messages[AuthErrorCode.UNKNOWN];
}

/** Obtenir un message user-friendly selon la locale */
export function getUserFriendlyMessage(code: AuthErrorCode, locale: string = 'fr'): string {
  const messages: Record<string, Record<AuthErrorCode, string>> = {
    fr: {
      [AuthErrorCode.INVALID_CREDENTIALS]: 'Email ou mot de passe incorrect',
      [AuthErrorCode.TOO_MANY_ATTEMPTS]: 'Trop de tentatives. Veuillez réessayer plus tard.',
      [AuthErrorCode.ACCOUNT_LOCKED]: 'Votre compte a été verrouillé',
      [AuthErrorCode.ACCOUNT_DISABLED]: 'Votre compte a été désactivé',
      [AuthErrorCode.ACCOUNT_NOT_VERIFIED]: 'Veuillez vérifier votre adresse email',
      [AuthErrorCode.TOKEN_EXPIRED]: 'Votre session a expiré',
      [AuthErrorCode.TOKEN_INVALID]: 'Session invalide',
      [AuthErrorCode.TOKEN_REVOKED]: 'Votre session a été révoquée',
      [AuthErrorCode.REFRESH_TOKEN_EXPIRED]: 'Veuillez vous reconnecter',
      [AuthErrorCode.SESSION_EXPIRED]: 'Votre session a expiré',
      [AuthErrorCode.SESSION_INVALID]: 'Session invalide',
      [AuthErrorCode.SESSION_CONFLICT]: 'Conflit de session détecté',
      [AuthErrorCode.MAX_SESSIONS_REACHED]: 'Nombre maximum de sessions atteint',
      [AuthErrorCode.EMAIL_ALREADY_EXISTS]: 'Cet email est déjà utilisé',
      [AuthErrorCode.USERNAME_TAKEN]: 'Ce nom d\'utilisateur est déjà pris',
      [AuthErrorCode.WEAK_PASSWORD]: 'Le mot de passe ne respecte pas les critères',
      [AuthErrorCode.INVALID_EMAIL_FORMAT]: 'Format d\'email invalide',
      [AuthErrorCode.PASSWORD_RESET_EXPIRED]: 'Le lien de réinitialisation a expiré',
      [AuthErrorCode.PASSWORD_RESET_INVALID]: 'Lien de réinitialisation invalide',
      [AuthErrorCode.PASSWORD_SAME_AS_OLD]: 'Le nouveau mot de passe doit être différent',
      [AuthErrorCode.PASSWORD_RECENTLY_USED]: 'Ce mot de passe a été utilisé récemment',
      [AuthErrorCode.UNAUTHORIZED]: 'Authentification requise',
      [AuthErrorCode.FORBIDDEN]: 'Accès refusé',
      [AuthErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permissions insuffisantes',
      [AuthErrorCode.ROLE_NOT_ALLOWED]: 'Cette action n\'est pas autorisée pour votre rôle',
      [AuthErrorCode.OAUTH_PROVIDER_ERROR]: 'Erreur avec le fournisseur d\'authentification',
      [AuthErrorCode.OAUTH_CANCELLED]: 'Authentification annulée',
      [AuthErrorCode.OAUTH_ACCOUNT_NOT_LINKED]: 'Compte non lié à ce fournisseur',
      [AuthErrorCode.OAUTH_EMAIL_MISMATCH]: 'Email différent du fournisseur',
      [AuthErrorCode.MFA_REQUIRED]: 'Authentification à deux facteurs requise',
      [AuthErrorCode.MFA_INVALID_CODE]: 'Code de vérification invalide',
      [AuthErrorCode.MFA_EXPIRED]: 'Le code de vérification a expiré',
      [AuthErrorCode.MFA_NOT_CONFIGURED]: 'Authentification à deux facteurs non configurée',
      [AuthErrorCode.NETWORK_ERROR]: 'Erreur réseau. Vérifiez votre connexion.',
      [AuthErrorCode.SERVER_ERROR]: 'Erreur serveur. Veuillez réessayer.',
      [AuthErrorCode.SERVICE_UNAVAILABLE]: 'Service temporairement indisponible',
      [AuthErrorCode.UNKNOWN]: 'Une erreur est survenue'
    }
  };

  return messages[locale]?.[code] || messages.fr[code] || getDefaultMessage(code);
}

/** Obtenir la sévérité d'une erreur */
export function getErrorSeverity(code: AuthErrorCode): AuthErrorSeverity {
  const severityMap: Record<AuthErrorCode, AuthErrorSeverity> = {
    [AuthErrorCode.INVALID_CREDENTIALS]: 'low',
    [AuthErrorCode.TOO_MANY_ATTEMPTS]: 'medium',
    [AuthErrorCode.ACCOUNT_LOCKED]: 'high',
    [AuthErrorCode.ACCOUNT_DISABLED]: 'high',
    [AuthErrorCode.ACCOUNT_NOT_VERIFIED]: 'low',
    [AuthErrorCode.TOKEN_EXPIRED]: 'low',
    [AuthErrorCode.TOKEN_INVALID]: 'medium',
    [AuthErrorCode.TOKEN_REVOKED]: 'medium',
    [AuthErrorCode.REFRESH_TOKEN_EXPIRED]: 'low',
    [AuthErrorCode.SESSION_EXPIRED]: 'low',
    [AuthErrorCode.SESSION_INVALID]: 'medium',
    [AuthErrorCode.SESSION_CONFLICT]: 'high',
    [AuthErrorCode.MAX_SESSIONS_REACHED]: 'low',
    [AuthErrorCode.EMAIL_ALREADY_EXISTS]: 'low',
    [AuthErrorCode.USERNAME_TAKEN]: 'low',
    [AuthErrorCode.WEAK_PASSWORD]: 'low',
    [AuthErrorCode.INVALID_EMAIL_FORMAT]: 'low',
    [AuthErrorCode.PASSWORD_RESET_EXPIRED]: 'low',
    [AuthErrorCode.PASSWORD_RESET_INVALID]: 'medium',
    [AuthErrorCode.PASSWORD_SAME_AS_OLD]: 'low',
    [AuthErrorCode.PASSWORD_RECENTLY_USED]: 'low',
    [AuthErrorCode.UNAUTHORIZED]: 'medium',
    [AuthErrorCode.FORBIDDEN]: 'high',
    [AuthErrorCode.INSUFFICIENT_PERMISSIONS]: 'medium',
    [AuthErrorCode.ROLE_NOT_ALLOWED]: 'medium',
    [AuthErrorCode.OAUTH_PROVIDER_ERROR]: 'medium',
    [AuthErrorCode.OAUTH_CANCELLED]: 'low',
    [AuthErrorCode.OAUTH_ACCOUNT_NOT_LINKED]: 'low',
    [AuthErrorCode.OAUTH_EMAIL_MISMATCH]: 'medium',
    [AuthErrorCode.MFA_REQUIRED]: 'low',
    [AuthErrorCode.MFA_INVALID_CODE]: 'medium',
    [AuthErrorCode.MFA_EXPIRED]: 'low',
    [AuthErrorCode.MFA_NOT_CONFIGURED]: 'low',
    [AuthErrorCode.NETWORK_ERROR]: 'medium',
    [AuthErrorCode.SERVER_ERROR]: 'high',
    [AuthErrorCode.SERVICE_UNAVAILABLE]: 'high',
    [AuthErrorCode.UNKNOWN]: 'medium'
  };

  return severityMap[code] || 'medium';
}

/** Vérifier si une erreur est récupérable */
export function isRecoverable(code: AuthErrorCode): boolean {
  const unrecoverable = [
    AuthErrorCode.ACCOUNT_DISABLED,
    AuthErrorCode.FORBIDDEN,
    AuthErrorCode.TOKEN_REVOKED
  ];

  return !unrecoverable.includes(code);
}

/** Mapper un status HTTP à un code d'erreur */
export function mapHttpStatusToCode(status: number): AuthErrorCode {
  const statusMap: Record<number, AuthErrorCode> = {
    401: AuthErrorCode.UNAUTHORIZED,
    403: AuthErrorCode.FORBIDDEN,
    404: AuthErrorCode.UNKNOWN,
    408: AuthErrorCode.NETWORK_ERROR,
    429: AuthErrorCode.TOO_MANY_ATTEMPTS,
    500: AuthErrorCode.SERVER_ERROR,
    502: AuthErrorCode.SERVICE_UNAVAILABLE,
    503: AuthErrorCode.SERVICE_UNAVAILABLE,
    504: AuthErrorCode.NETWORK_ERROR
  };

  return statusMap[status] || AuthErrorCode.UNKNOWN;
}

/** Détecter le code d'erreur depuis une erreur native */
export function detectErrorCode(error: Error): AuthErrorCode {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch')) {
    return AuthErrorCode.NETWORK_ERROR;
  }
  if (message.includes('timeout')) {
    return AuthErrorCode.NETWORK_ERROR;
  }
  if (message.includes('expired')) {
    return AuthErrorCode.TOKEN_EXPIRED;
  }
  if (message.includes('invalid')) {
    return AuthErrorCode.TOKEN_INVALID;
  }
  if (message.includes('unauthorized')) {
    return AuthErrorCode.UNAUTHORIZED;
  }

  return AuthErrorCode.UNKNOWN;
}

/** Vérifier si c'est une AuthError */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/** Vérifier si l'erreur nécessite une reconnexion */
export function requiresReauth(error: AuthError | AuthErrorCode): boolean {
  const code = error instanceof AuthError ? error.code : error;

  return [
    AuthErrorCode.TOKEN_EXPIRED,
    AuthErrorCode.TOKEN_INVALID,
    AuthErrorCode.TOKEN_REVOKED,
    AuthErrorCode.REFRESH_TOKEN_EXPIRED,
    AuthErrorCode.SESSION_EXPIRED,
    AuthErrorCode.SESSION_INVALID,
    AuthErrorCode.UNAUTHORIZED
  ].includes(code);
}

/** Obtenir l'action recommandée */
export function getRecommendedAction(code: AuthErrorCode): string {
  const actions: Partial<Record<AuthErrorCode, string>> = {
    [AuthErrorCode.INVALID_CREDENTIALS]: 'retry_login',
    [AuthErrorCode.TOO_MANY_ATTEMPTS]: 'wait_and_retry',
    [AuthErrorCode.ACCOUNT_LOCKED]: 'contact_support',
    [AuthErrorCode.ACCOUNT_NOT_VERIFIED]: 'verify_email',
    [AuthErrorCode.TOKEN_EXPIRED]: 'refresh_token',
    [AuthErrorCode.SESSION_EXPIRED]: 'login',
    [AuthErrorCode.PASSWORD_RESET_EXPIRED]: 'request_new_reset',
    [AuthErrorCode.MFA_REQUIRED]: 'enter_mfa_code',
    [AuthErrorCode.MFA_EXPIRED]: 'request_new_code',
    [AuthErrorCode.NETWORK_ERROR]: 'check_connection'
  };

  return actions[code] || 'contact_support';
}

/** Créer une erreur avec retry */
export function createRetryableError(
  code: AuthErrorCode,
  retryAfterSeconds: number
): AuthError {
  return new AuthError({
    code,
    retryAfter: retryAfterSeconds * 1000,
    recoverable: true
  });
}

export default {
  AuthError,
  AuthErrorCode,
  getDefaultMessage,
  getUserFriendlyMessage,
  getErrorSeverity,
  isRecoverable,
  isAuthError,
  requiresReauth,
  getRecommendedAction,
  createRetryableError
};
