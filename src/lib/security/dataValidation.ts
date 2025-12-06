// @ts-nocheck
/**
 * Data validation and sanitization for security
 */

import { logger } from '@/lib/logger';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/javascript:/gi, '') // Remove javascript: urls
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password: string): { 
  isValid: boolean; 
  errors: string[]; 
  score: number;
} => {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  } else {
    score += 20;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  } else {
    score += 20;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  } else {
    score += 20;
  }

  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  } else {
    score += 20;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  } else {
    score += 20;
  }

  // Bonus for length
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.min(100, score),
  };
};

// Data sanitization for API calls
export const sanitizeApiData = (data: Record<string, any>): Record<string, any> => {
  const sanitized = { ...data };

  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeApiData(value);
    }
  });

  return sanitized;
};

// File upload validation
export const validateFileUpload = (file: File): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'application/pdf'
  ];

  if (file.size > maxSize) {
    errors.push('Le fichier ne peut pas dépasser 10MB');
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('Type de fichier non autorisé');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting checker
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  
  isRateLimited(key: string, maxRequests = 100, windowMs = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const current = this.requests.get(key);
    
    if (!current || current.resetTime < windowStart) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return false;
    }
    
    if (current.count >= maxRequests) {
      logger.warn('Rate limit exceeded', { key, count: current.count }, 'SECURITY');
      return true;
    }
    
    current.count++;
    return false;
  }
  
  reset(key: string) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// SQL injection protection
export const validateSqlInput = (input: string): boolean => {
    const sqlInjectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i,
      /(UNION|OR|AND)\s+\d+\s*=\s*\d+/i,
      /['"]\s*(OR|AND)\s*['"]\d+['"]\s*=\s*['"]\d+['"]/i,
      /--|\*|\/\*|\*\//,
  ];
  
  return !sqlInjectionPatterns.some(pattern => pattern.test(input));
};

// XSS protection
export const validateXssInput = (input: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
  ];
  
  return !xssPatterns.some(pattern => pattern.test(input));
};

// Content security validation
export const validateContent = (content: string): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  if (!validateSqlInput(content)) {
    errors.push('Contenu suspect détecté (SQL)');
  }
  
  if (!validateXssInput(content)) {
    errors.push('Contenu suspect détecté (XSS)');
  }
  
  if (content.length > 10000) {
    errors.push('Contenu trop long (max 10000 caractères)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// UUID validation
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Phone number validation (French format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};