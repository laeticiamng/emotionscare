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
  | 'UNKNOWN';

export interface AppError {
  code: ErrorCode;
  messageKey: string;
  httpStatus?: number;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export type ErrorContextMetadata = Record<string, unknown>;

/**
 * Classe d'erreur API typée pour remplacer les Error génériques
 */
export class ApiRequestError extends Error {
  public readonly code: ErrorCode;
  public readonly httpStatus: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    httpStatus: number,
    code?: ErrorCode,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.httpStatus = httpStatus;
    this.code = code ?? ApiRequestError.codeFromStatus(httpStatus);
    this.details = details;
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }

  private static codeFromStatus(status: number): ErrorCode {
    if (status === 401) return 'UNAUTHORIZED';
    if (status === 403) return 'FORBIDDEN';
    if (status === 404) return 'NOT_FOUND';
    if (status === 429) return 'RATE_LIMIT';
    if (status >= 400 && status < 500) return 'VALIDATION';
    if (status >= 500) return 'SERVER';
    return 'UNKNOWN';
  }

  get isRetryable(): boolean {
    return this.code === 'SERVER' || this.code === 'NETWORK' || this.code === 'TIMEOUT' || this.code === 'RATE_LIMIT';
  }
}

export class NetworkError extends Error {
  public readonly code: ErrorCode = 'NETWORK';

  constructor(message = 'Erreur réseau — vérifiez votre connexion') {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class TimeoutError extends Error {
  public readonly code: ErrorCode = 'TIMEOUT';

  constructor(message = 'La requête a expiré') {
    super(message);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
