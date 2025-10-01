// @ts-nocheck

import { z } from 'zod';
import { toast } from '@/hooks/use-toast';

/**
 * Centralized validation service
 */

export class ValidationError extends Error {
  public readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Validate data against a Zod schema
 */
export const validateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options?: {
    showToast?: boolean;
    fieldPrefix?: string;
  }
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      
      error.errors.forEach(err => {
        const field = options?.fieldPrefix 
          ? `${options.fieldPrefix}.${err.path.join('.')}`
          : err.path.join('.');
        
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });

      if (options?.showToast) {
        const firstError = Object.values(fieldErrors)[0]?.[0];
        if (firstError) {
          toast({
            title: "Erreur de validation",
            description: firstError,
            variant: "destructive",
          });
        }
      }

      return { success: false, errors: fieldErrors };
    }
    
    // Handle unexpected errors
    const message = error instanceof Error ? error.message : 'Erreur de validation inconnue';
    
    if (options?.showToast) {
      toast({
        title: "Erreur de validation",
        description: message,
        variant: "destructive",
      });
    }
    
    return { success: false, errors: { general: [message] } };
  }
};

/**
 * Validate and throw on error
 */
export const validateAndThrow = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options?: { fieldPrefix?: string }
): T => {
  const result = validateSchema(schema, data, options);
  
  if (!result.success) {
    throw new ValidationError('Validation failed', result.errors);
  }
  
  return result.data;
};

/**
 * Async validation wrapper
 */
export const validateAsync = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options?: {
    showToast?: boolean;
    fieldPrefix?: string;
  }
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string[]> }> => {
  return new Promise(resolve => {
    // Use setTimeout to make validation async and non-blocking
    setTimeout(() => {
      resolve(validateSchema(schema, data, options));
    }, 0);
  });
};

/**
 * Sanitize input data
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validate file upload
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    showToast?: boolean;
  } = {}
): boolean => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    showToast = true
  } = options;

  if (file.size > maxSize) {
    if (showToast) {
      toast({
        title: "Fichier trop volumineux",
        description: `Le fichier ne doit pas dépasser ${Math.round(maxSize / 1024 / 1024)}MB`,
        variant: "destructive",
      });
    }
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    if (showToast) {
      toast({
        title: "Type de fichier non autorisé",
        description: `Types autorisés: ${allowedTypes.join(', ')}`,
        variant: "destructive",
      });
    }
    return false;
  }

  return true;
};
