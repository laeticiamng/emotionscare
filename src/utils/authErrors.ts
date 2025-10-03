export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  UNKNOWN = 'UNKNOWN',
}

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'AuthError';
  }
}
