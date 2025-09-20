import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { toAppError } from '@/lib/errors/normalize';
import type { AppError } from '@/lib/errors/types';

describe('toAppError', () => {
  it('normalises HTTP status codes to AppError variants', () => {
    expect(toAppError({ status: 401 })).toMatchObject({ code: 'UNAUTHORIZED', messageKey: 'errors.unauthorized', httpStatus: 401 });
    expect(toAppError({ status: 403 })).toMatchObject({ code: 'FORBIDDEN', messageKey: 'errors.forbidden', httpStatus: 403 });
    expect(toAppError({ status: 404 })).toMatchObject({ code: 'NOT_FOUND', messageKey: 'errors.notFound', httpStatus: 404 });
    expect(toAppError({ status: 429 })).toMatchObject({ code: 'RATE_LIMIT', messageKey: 'errors.rateLimitExceeded', httpStatus: 429 });
    expect(toAppError({ status: 500 })).toMatchObject({ code: 'SERVER', messageKey: 'errors.internalServerError', httpStatus: 500 });
  });

  it('detects abort errors', () => {
    const abort = new DOMException('user aborted request', 'AbortError');
    expect(toAppError(abort)).toMatchObject({ code: 'ABORTED', messageKey: 'errors.operationAborted' });
  });

  it('detects timeout errors', () => {
    const timeoutError = { name: 'TimeoutError', message: 'Request timed out' };
    expect(toAppError(timeoutError)).toMatchObject({ code: 'TIMEOUT', messageKey: 'errors.timeoutError' });
  });

  it('normalises network errors', () => {
    const network = new TypeError('Network error');
    expect(toAppError(network)).toMatchObject({ code: 'NETWORK', messageKey: 'errors.networkError' });
  });

  it('normalises Zod errors', () => {
    const schema = z.object({ name: z.string() });
    let appError: AppError | null = null;
    try {
      schema.parse({});
    } catch (error) {
      appError = toAppError(error);
    }
    expect(appError).toMatchObject({ code: 'VALIDATION', messageKey: 'errors.validationError' });
  });

  it('handles Supabase style errors', () => {
    const supabaseError = { message: 'Database error', code: '23505', details: 'duplicate key', status: 400 };
    expect(toAppError(supabaseError)).toMatchObject({ code: 'SERVER', messageKey: 'errors.internalServerError', httpStatus: 400 });
  });

  it('accepts AppError input directly', () => {
    const custom: AppError = { code: 'SERVER', messageKey: 'errors.internalServerError', httpStatus: 502 };
    expect(toAppError(custom)).toEqual(custom);
  });

  it('keeps translation keys when provided as strings', () => {
    expect(toAppError('errors.journalError')).toMatchObject({ code: 'UNKNOWN', messageKey: 'errors.journalError' });
  });

  it('falls back to a generic key when string contains digits', () => {
    expect(toAppError('errors.500')).toMatchObject({ messageKey: 'errors.unexpectedError' });
  });

  it('redacts sensitive fields in causes', () => {
    const error = toAppError({
      status: 500,
      password: 'secret',
      token: 'abc',
    });
    expect(error.cause).toMatchObject({ password: '[redacted]', token: '[redacted]' });
  });
});
