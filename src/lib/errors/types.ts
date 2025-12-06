// @ts-nocheck
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
