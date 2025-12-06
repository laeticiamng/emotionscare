import { ZodError } from 'zod';
import type { AppError, ErrorCode } from './types';

const SENSITIVE_KEYS = new Set(['password', 'token', 'authorization', 'auth', 'secret', 'api_key', 'apikey']);

const HTTP_STATUS_MAP: Record<number, { code: ErrorCode; messageKey: string }> = {
  400: { code: 'VALIDATION', messageKey: 'errors.badRequest' },
  401: { code: 'UNAUTHORIZED', messageKey: 'errors.unauthorized' },
  403: { code: 'FORBIDDEN', messageKey: 'errors.forbidden' },
  404: { code: 'NOT_FOUND', messageKey: 'errors.notFound' },
  408: { code: 'TIMEOUT', messageKey: 'errors.timeoutError' },
  409: { code: 'VALIDATION', messageKey: 'errors.validationError' },
  422: { code: 'VALIDATION', messageKey: 'errors.validationError' },
  429: { code: 'RATE_LIMIT', messageKey: 'errors.rateLimitExceeded' },
  500: { code: 'SERVER', messageKey: 'errors.internalServerError' },
  502: { code: 'SERVER', messageKey: 'errors.internalServerError' },
  503: { code: 'SERVER', messageKey: 'errors.internalServerError' },
  504: { code: 'TIMEOUT', messageKey: 'errors.timeoutError' },
};

export function toAppError(raw: unknown): AppError {
  if (isAppErrorLike(raw)) {
    return {
      code: ensureValidCode(raw.code),
      messageKey: sanitizeMessageKey(raw.messageKey),
      httpStatus: typeof raw.httpStatus === 'number' ? raw.httpStatus : undefined,
      cause: raw.cause,
      context: raw.context,
    };
  }

  if (typeof raw === 'string') {
    if (looksLikeTranslationKey(raw)) {
      return {
        code: 'UNKNOWN',
        messageKey: sanitizeMessageKey(raw),
      };
    }

    return {
      code: 'UNKNOWN',
      messageKey: 'errors.unexpectedError',
      cause: raw,
    };
  }

  if (isAbortError(raw)) {
    return {
      code: 'ABORTED',
      messageKey: 'errors.operationAborted',
    };
  }

  if (isTimeoutError(raw)) {
    return {
      code: 'TIMEOUT',
      messageKey: 'errors.timeoutError',
      cause: redact(raw),
    };
  }

  if (isSupabaseError(raw)) {
    return {
      code: 'SERVER',
      messageKey: 'errors.internalServerError',
      httpStatus: typeof raw.status === 'number' ? raw.status : undefined,
      cause: redact({ code: raw.code, details: raw.details, hint: raw.hint }),
    };
  }

  const httpStatus = extractStatus(raw);
  if (typeof httpStatus === 'number') {
    const mapped = mapHttpStatus(httpStatus);
    return {
      ...mapped,
      httpStatus,
      cause: redact(raw),
    };
  }

  if (raw instanceof ZodError) {
    return {
      code: 'VALIDATION',
      messageKey: 'errors.validationError',
      cause: raw.flatten(),
    };
  }

  if (raw instanceof TypeError || isNetworkError(raw)) {
    return {
      code: 'NETWORK',
      messageKey: 'errors.networkError',
      cause: redact(raw),
    };
  }

  if (raw instanceof Error) {
    return {
      code: 'UNKNOWN',
      messageKey: 'errors.unexpectedError',
      cause: redact({ message: raw.message, stack: raw.stack }),
    };
  }

  return {
    code: 'UNKNOWN',
    messageKey: 'errors.unexpectedError',
    cause: redact(raw),
  };
}

function isAppErrorLike(input: unknown): input is AppError {
  if (!input || typeof input !== 'object') {
    return false;
  }
  const candidate = input as Partial<AppError>;
  return typeof candidate.code === 'string' && typeof candidate.messageKey === 'string';
}

function ensureValidCode(code: string): ErrorCode {
  const allowed: ErrorCode[] = ['NETWORK', 'TIMEOUT', 'ABORTED', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'RATE_LIMIT', 'VALIDATION', 'SERVER', 'UNKNOWN'];
  return (allowed as string[]).includes(code) ? (code as ErrorCode) : 'UNKNOWN';
}

function sanitizeMessageKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) {
    return 'errors.unexpectedError';
  }
  if (/\d/.test(trimmed)) {
    return 'errors.unexpectedError';
  }
  return trimmed;
}

function looksLikeTranslationKey(value: string): boolean {
  return Boolean(value) && !value.includes(' ') && !/\d/.test(value.split('.').pop() ?? '');
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as { name?: string };
  return candidate.name === 'AbortError';
}

function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as { name?: string; code?: string; message?: string };
  return candidate.name === 'TimeoutError' || candidate.code === 'ETIMEDOUT' || candidate.message?.toLowerCase().includes('timeout');
}

function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as { name?: string; message?: string };
  return candidate.name === 'TypeError' || candidate.message?.toLowerCase().includes('network');
}

function extractStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const candidate = error as { status?: unknown; response?: { status?: unknown }; error?: { status?: unknown } };

  if (typeof candidate.status === 'number') {
    return candidate.status;
  }

  if (candidate.response && typeof candidate.response.status === 'number') {
    return candidate.response.status;
  }

  if (candidate.error && typeof candidate.error.status === 'number') {
    return candidate.error.status;
  }

  return undefined;
}

function mapHttpStatus(status: number): { code: ErrorCode; messageKey: string } {
  if (HTTP_STATUS_MAP[status]) {
    return HTTP_STATUS_MAP[status];
  }

  if (status >= 500) {
    return { code: 'SERVER', messageKey: 'errors.internalServerError' };
  }

  if (status >= 400) {
    return { code: 'SERVER', messageKey: 'errors.apiError' };
  }

  return { code: 'UNKNOWN', messageKey: 'errors.unexpectedError' };
}

interface SupabaseErrorLike {
  message: string;
  details?: unknown;
  hint?: string;
  code?: string;
  status?: number;
}

function isSupabaseError(error: unknown): error is SupabaseErrorLike {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as SupabaseErrorLike;
  return typeof candidate.message === 'string' && typeof candidate.code === 'string';
}

function redact(value: unknown, depth = 0, seen: WeakSet<object> = new WeakSet()): unknown {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'string' && value.length > 160) {
      return `${value.slice(0, 157)}…`;
    }
    return value;
  }

  if (seen.has(value as object)) {
    return '[Circular]';
  }

  seen.add(value as object);

  if (Array.isArray(value)) {
    if (depth > 2) {
      return '[Array]';
    }
    return value.slice(0, 5).map(entry => redact(entry, depth + 1, seen));
  }

  if (depth > 3) {
    return '[Object]';
  }

  const result: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = '[redacted]';
      continue;
    }
    result[key] = redact(entry, depth + 1, seen);
  }

  return result;
}
