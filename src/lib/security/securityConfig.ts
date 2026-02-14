import { APP_BASE_CSP } from './headers';

// Security configuration and utilities
// NOTE: CSP is centralized in headers.ts (APP_BASE_CSP). Do NOT duplicate CSP directives here.
export const SECURITY_CONFIG = {
  // Content Security Policy — single source of truth in headers.ts
  CSP: APP_BASE_CSP,

  // Rate limiting
  RATE_LIMITS: {
    API_CALLS_PER_MINUTE: 60,
    LOGIN_ATTEMPTS: 5,
    PASSWORD_RESET_ATTEMPTS: 3,
  },

  // Session settings
  SESSION: {
    TIMEOUT_MINUTES: 30,
    REFRESH_THRESHOLD_MINUTES: 5,
    MAX_CONCURRENT_SESSIONS: 3,
  },

  // Data validation
  VALIDATION: {
    MAX_FILE_SIZE_MB: 10,
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_TEXT_LENGTH: 5000,
  },
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .trim();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate secure random strings
export const generateSecureId = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Check password strength
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }

  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// OWASP security headers
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cross-Origin-Resource-Policy': 'same-site',
  'X-Robots-Tag': 'noindex',
});
