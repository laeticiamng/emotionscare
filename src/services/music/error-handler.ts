/**
 * Music Error Handler - Service unifié de gestion d'erreurs
 *
 * Features:
 * - Retry logic avec backoff exponentiel
 * - Fallback strategies
 * - Circuit breaker pattern
 * - Error categorization
 * - User-friendly messages
 *
 * @module services/music/error-handler
 */

import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export enum MusicErrorType {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // API errors
  API_ERROR = 'API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  UNAUTHORIZED = 'UNAUTHORIZED',

  // Generation errors
  GENERATION_FAILED = 'GENERATION_FAILED',
  GENERATION_TIMEOUT = 'GENERATION_TIMEOUT',

  // Playback errors
  PLAYBACK_ERROR = 'PLAYBACK_ERROR',
  AUDIO_DECODE_ERROR = 'AUDIO_DECODE_ERROR',
  AUDIO_NOT_FOUND = 'AUDIO_NOT_FOUND',

  // Storage errors
  STORAGE_ERROR = 'STORAGE_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',

  // User errors
  INVALID_INPUT = 'INVALID_INPUT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  // Unknown
  UNKNOWN = 'UNKNOWN'
}

export enum MusicErrorSeverity {
  LOW = 'LOW',       // Logging only
  MEDIUM = 'MEDIUM', // User notification
  HIGH = 'HIGH',     // User action required
  CRITICAL = 'CRITICAL' // System failure
}

export interface MusicError extends Error {
  type: MusicErrorType;
  severity: MusicErrorSeverity;
  originalError?: Error;
  context?: Record<string, any>;
  retryable: boolean;
  userMessage: string;
  timestamp: Date;
}

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: MusicErrorType[];
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
}

// ============================================
// ERROR FACTORY
// ============================================

class MusicErrorFactory {
  /**
   * Crée une erreur musicale typée
   */
  static create(
    type: MusicErrorType,
    message: string,
    options: {
      severity?: MusicErrorSeverity;
      originalError?: Error;
      context?: Record<string, any>;
      retryable?: boolean;
    } = {}
  ): MusicError {
    const error = new Error(message) as MusicError;

    error.type = type;
    error.severity = options.severity || this.inferSeverity(type);
    error.originalError = options.originalError;
    error.context = options.context;
    error.retryable = options.retryable ?? this.isRetryable(type);
    error.userMessage = this.getUserMessage(type, message);
    error.timestamp = new Date();

    return error;
  }

  /**
   * Infère la sévérité depuis le type d'erreur
   */
  private static inferSeverity(type: MusicErrorType): MusicErrorSeverity {
    const severityMap: Record<MusicErrorType, MusicErrorSeverity> = {
      [MusicErrorType.NETWORK_ERROR]: MusicErrorSeverity.MEDIUM,
      [MusicErrorType.TIMEOUT]: MusicErrorSeverity.MEDIUM,
      [MusicErrorType.API_ERROR]: MusicErrorSeverity.HIGH,
      [MusicErrorType.RATE_LIMIT]: MusicErrorSeverity.HIGH,
      [MusicErrorType.UNAUTHORIZED]: MusicErrorSeverity.CRITICAL,
      [MusicErrorType.GENERATION_FAILED]: MusicErrorSeverity.HIGH,
      [MusicErrorType.GENERATION_TIMEOUT]: MusicErrorSeverity.MEDIUM,
      [MusicErrorType.PLAYBACK_ERROR]: MusicErrorSeverity.HIGH,
      [MusicErrorType.AUDIO_DECODE_ERROR]: MusicErrorSeverity.HIGH,
      [MusicErrorType.AUDIO_NOT_FOUND]: MusicErrorSeverity.HIGH,
      [MusicErrorType.STORAGE_ERROR]: MusicErrorSeverity.MEDIUM,
      [MusicErrorType.CACHE_ERROR]: MusicErrorSeverity.LOW,
      [MusicErrorType.INVALID_INPUT]: MusicErrorSeverity.LOW,
      [MusicErrorType.QUOTA_EXCEEDED]: MusicErrorSeverity.HIGH,
      [MusicErrorType.UNKNOWN]: MusicErrorSeverity.MEDIUM,
    };

    return severityMap[type];
  }

  /**
   * Détermine si une erreur est retriable
   */
  private static isRetryable(type: MusicErrorType): boolean {
    const retryableTypes = [
      MusicErrorType.NETWORK_ERROR,
      MusicErrorType.TIMEOUT,
      MusicErrorType.API_ERROR,
      MusicErrorType.GENERATION_TIMEOUT,
    ];

    return retryableTypes.includes(type);
  }

  /**
   * Génère un message user-friendly
   */
  private static getUserMessage(type: MusicErrorType, technicalMessage: string): string {
    const messageMap: Record<MusicErrorType, string> = {
      [MusicErrorType.NETWORK_ERROR]: "Problème de connexion. Vérifiez votre réseau.",
      [MusicErrorType.TIMEOUT]: "La requête a pris trop de temps. Réessayez.",
      [MusicErrorType.API_ERROR]: "Erreur du service musical. Réessayez plus tard.",
      [MusicErrorType.RATE_LIMIT]: "Trop de requêtes. Attendez quelques instants.",
      [MusicErrorType.UNAUTHORIZED]: "Session expirée. Reconnectez-vous.",
      [MusicErrorType.GENERATION_FAILED]: "La génération musicale a échoué. Réessayez.",
      [MusicErrorType.GENERATION_TIMEOUT]: "La génération prend trop de temps. Réessayez.",
      [MusicErrorType.PLAYBACK_ERROR]: "Erreur de lecture. Vérifiez le fichier audio.",
      [MusicErrorType.AUDIO_DECODE_ERROR]: "Format audio non supporté.",
      [MusicErrorType.AUDIO_NOT_FOUND]: "Fichier audio introuvable.",
      [MusicErrorType.STORAGE_ERROR]: "Erreur de sauvegarde. Réessayez.",
      [MusicErrorType.CACHE_ERROR]: "Erreur de cache. Continuez normalement.",
      [MusicErrorType.INVALID_INPUT]: "Données invalides. Vérifiez votre saisie.",
      [MusicErrorType.QUOTA_EXCEEDED]: "Quota dépassé. Passez à Premium ou attendez.",
      [MusicErrorType.UNKNOWN]: "Une erreur s'est produite. Réessayez.",
    };

    return messageMap[type] || technicalMessage;
  }

  /**
   * Parse une erreur générique en MusicError
   */
  static fromError(error: unknown, context?: Record<string, any>): MusicError {
    if (this.isMusicError(error)) {
      return error;
    }

    const err = error as Error;
    let type = MusicErrorType.UNKNOWN;

    // Détection du type depuis le message
    const message = err.message?.toLowerCase() || '';

    if (message.includes('network') || message.includes('fetch')) {
      type = MusicErrorType.NETWORK_ERROR;
    } else if (message.includes('timeout')) {
      type = MusicErrorType.TIMEOUT;
    } else if (message.includes('401') || message.includes('unauthorized')) {
      type = MusicErrorType.UNAUTHORIZED;
    } else if (message.includes('429') || message.includes('rate limit')) {
      type = MusicErrorType.RATE_LIMIT;
    } else if (message.includes('quota')) {
      type = MusicErrorType.QUOTA_EXCEEDED;
    } else if (message.includes('audio') || message.includes('playback')) {
      type = MusicErrorType.PLAYBACK_ERROR;
    }

    return this.create(type, err.message || 'Unknown error', {
      originalError: err,
      context
    });
  }

  /**
   * Type guard pour MusicError
   */
  static isMusicError(error: unknown): error is MusicError {
    return (
      error instanceof Error &&
      'type' in error &&
      'severity' in error &&
      'retryable' in error
    );
  }
}

// ============================================
// RETRY LOGIC
// ============================================

class RetryHandler {
  private defaultOptions: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryableErrors: [
      MusicErrorType.NETWORK_ERROR,
      MusicErrorType.TIMEOUT,
      MusicErrorType.API_ERROR,
      MusicErrorType.GENERATION_TIMEOUT,
    ]
  };

  /**
   * Exécute une fonction avec retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const opts = { ...this.defaultOptions, ...options };
    let lastError: MusicError;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = MusicErrorFactory.fromError(error);

        // Ne pas retry si l'erreur n'est pas retriable
        if (!this.shouldRetry(lastError, opts)) {
          throw lastError;
        }

        // Dernier essai échoué
        if (attempt === opts.maxRetries) {
          logger.error(
            `Max retries (${opts.maxRetries}) reached`,
            lastError,
            'MusicErrorHandler'
          );
          throw lastError;
        }

        // Calculer le délai avec backoff exponentiel
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
          opts.maxDelay
        );

        logger.warn(
          `Retry attempt ${attempt + 1}/${opts.maxRetries} after ${delay}ms`,
          { error: lastError.message },
          'MusicErrorHandler'
        );

        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private shouldRetry(error: MusicError, options: Required<RetryOptions>): boolean {
    return (
      error.retryable &&
      options.retryableErrors.includes(error.type)
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================
// CIRCUIT BREAKER
// ============================================

enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, reject immediately
  HALF_OPEN = 'HALF_OPEN' // Testing if recovered
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime?: Date;
  private readonly options: Required<CircuitBreakerOptions>;

  constructor(options: CircuitBreakerOptions = {}) {
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000, // 1 minute
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw MusicErrorFactory.create(
          MusicErrorType.API_ERROR,
          'Circuit breaker is OPEN. Service temporarily unavailable.',
          { severity: MusicErrorSeverity.HIGH }
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN;
      logger.error(
        `Circuit breaker opened after ${this.failureCount} failures`,
        undefined,
        'CircuitBreaker'
      );
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return false;

    const elapsed = Date.now() - this.lastFailureTime.getTime();
    return elapsed >= this.options.resetTimeout;
  }

  getState(): CircuitState {
    return this.state;
  }
}

// ============================================
// MAIN SERVICE
// ============================================

class MusicErrorHandlerService {
  private retryHandler = new RetryHandler();
  private circuitBreakers = new Map<string, CircuitBreaker>();

  /**
   * Crée une erreur typée
   */
  createError(
    type: MusicErrorType,
    message: string,
    options?: Parameters<typeof MusicErrorFactory.create>[2]
  ): MusicError {
    return MusicErrorFactory.create(type, message, options);
  }

  /**
   * Parse une erreur générique
   */
  fromError(error: unknown, context?: Record<string, any>): MusicError {
    return MusicErrorFactory.fromError(error, context);
  }

  /**
   * Exécute avec retry logic
   */
  async withRetry<T>(
    fn: () => Promise<T>,
    options?: RetryOptions
  ): Promise<T> {
    return this.retryHandler.execute(fn, options);
  }

  /**
   * Exécute avec circuit breaker
   */
  async withCircuitBreaker<T>(
    key: string,
    fn: () => Promise<T>,
    options?: CircuitBreakerOptions
  ): Promise<T> {
    let breaker = this.circuitBreakers.get(key);

    if (!breaker) {
      breaker = new CircuitBreaker(options);
      this.circuitBreakers.set(key, breaker);
    }

    return breaker.execute(fn);
  }

  /**
   * Exécute avec retry ET circuit breaker
   */
  async withResilient<T>(
    key: string,
    fn: () => Promise<T>,
    retryOptions?: RetryOptions,
    circuitOptions?: CircuitBreakerOptions
  ): Promise<T> {
    return this.withCircuitBreaker(
      key,
      () => this.withRetry(fn, retryOptions),
      circuitOptions
    );
  }

  /**
   * Log et notifie une erreur selon sa sévérité
   */
  handle(error: MusicError, notify = true): void {
    // Log
    const logMethod = this.getLogMethod(error.severity);
    logMethod(
      `[${error.type}] ${error.message}`,
      error.originalError || error,
      'MusicErrorHandler'
    );

    // Notification utilisateur (si UI disponible)
    if (notify && error.severity >= MusicErrorSeverity.MEDIUM) {
      this.notifyUser(error);
    }
  }

  /**
   * Stratégie de fallback
   */
  async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    options?: RetryOptions
  ): Promise<T> {
    try {
      return await this.withRetry(primary, options);
    } catch (primaryError) {
      const musicError = this.fromError(primaryError);

      logger.warn(
        'Primary function failed, using fallback',
        { error: musicError.message },
        'MusicErrorHandler'
      );

      try {
        return await fallback();
      } catch (fallbackError) {
        // Les deux ont échoué, throw l'erreur primaire
        throw musicError;
      }
    }
  }

  private getLogMethod(severity: MusicErrorSeverity) {
    switch (severity) {
      case MusicErrorSeverity.LOW:
        return logger.debug.bind(logger);
      case MusicErrorSeverity.MEDIUM:
        return logger.warn.bind(logger);
      case MusicErrorSeverity.HIGH:
      case MusicErrorSeverity.CRITICAL:
        return logger.error.bind(logger);
    }
  }

  private notifyUser(error: MusicError): void {
    // Cette fonction devrait être connectée au système de notifications UI
    // Pour l'instant, on log simplement
    console.error(`[USER NOTIFICATION] ${error.userMessage}`);

    // Si vous avez un toast/notification system:
    // toastService.error(error.userMessage);
  }
}

// ============================================
// EXPORTS
// ============================================

export const musicErrorHandler = new MusicErrorHandlerService();

// Re-exports
export { MusicErrorFactory };
export { CircuitState };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Exemple 1: Génération avec retry
 *
 * ```typescript
 * const generation = await musicErrorHandler.withRetry(
 *   () => sunoApi.generate(params),
 *   { maxRetries: 3, initialDelay: 2000 }
 * );
 * ```
 */

/**
 * Exemple 2: API call avec circuit breaker
 *
 * ```typescript
 * const data = await musicErrorHandler.withCircuitBreaker(
 *   'suno-api',
 *   () => fetch('https://api.suno.ai/...').then(r => r.json())
 * );
 * ```
 */

/**
 * Exemple 3: Resilient call (retry + circuit breaker)
 *
 * ```typescript
 * const playlist = await musicErrorHandler.withResilient(
 *   'recommendations',
 *   () => getRecommendations(userId),
 *   { maxRetries: 2 },
 *   { failureThreshold: 5, resetTimeout: 30000 }
 * );
 * ```
 */

/**
 * Exemple 4: Fallback strategy
 *
 * ```typescript
 * const music = await musicErrorHandler.withFallback(
 *   () => generateWithSuno(params),
 *   () => generateWithTopMedia(params) // Fallback vers TopMedia
 * );
 * ```
 */

/**
 * Exemple 5: Error handling manuel
 *
 * ```typescript
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   const musicError = musicErrorHandler.fromError(error, {
 *     operation: 'riskyOperation',
 *     userId
 *   });
 *
 *   musicErrorHandler.handle(musicError);
 *
 *   if (musicError.retryable) {
 *     // Proposer un retry
 *   } else {
 *     // Fallback ou abandon
 *   }
 * }
 * ```
 */
