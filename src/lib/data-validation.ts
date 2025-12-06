/**
 * Validation centralisée des données avec schémas Zod
 * Implémente la validation côté client et transformation d'erreurs
 */

import { z } from 'zod';

// ============= Schémas de base =============

export const EmailSchema = z
  .string()
  .email('Adresse email invalide')
  .min(1, 'L\'email est requis');

export const PasswordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

export const NameSchema = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères')
  .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne peut contenir que des lettres, espaces et tirets');

// ============= Schémas d'authentification =============

export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const SignUpSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: NameSchema,
  role: z.enum(['b2c', 'b2b_user', 'b2b_admin'], {
    errorMap: () => ({ message: 'Rôle invalide' })
  }).optional(),
});

export const ResetPasswordSchema = z.object({
  email: EmailSchema,
});

// ============= Schémas de profil =============

export const ProfileUpdateSchema = z.object({
  name: NameSchema.optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.enum(['fr', 'en']).optional(),
    notifications: z.boolean().optional(),
    analytics: z.boolean().optional(),
  }).optional(),
});

// ============= Schémas métier =============

export const EmotionScanSchema = z.object({
  emotion_primary: z.string().min(1, 'Émotion principale requise'),
  intensity: z.number().min(0).max(1, 'L\'intensité doit être entre 0 et 1'),
  context: z.string().max(500, 'Le contexte ne peut pas dépasser 500 caractères').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
});

export const JournalEntrySchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères').max(5000, 'Le contenu ne peut pas dépasser 5000 caractères'),
  mood: z.number().min(1).max(5, 'L\'humeur doit être entre 1 et 5').optional(),
  is_private: z.boolean().optional(),
});

// ============= Types déduits =============

export type SignInData = z.infer<typeof SignInSchema>;
export type SignUpData = z.infer<typeof SignUpSchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
export type ProfileUpdateData = z.infer<typeof ProfileUpdateSchema>;
export type EmotionScanData = z.infer<typeof EmotionScanSchema>;
export type JournalEntryData = z.infer<typeof JournalEntrySchema>;

// ============= Erreurs de validation =============

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

// ============= Utilitaires de validation =============

/**
 * Valide des données avec un schéma Zod et retourne un résultat standardisé
 */
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> => {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      return {
        success: false,
        errors,
      };
    }
    
    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Erreur de validation inconnue' }],
    };
  }
};

/**
 * Valide et transforme les données d'une API
 */
export const validateApiResponse = <T>(
  schema: z.ZodSchema<T>,
  response: unknown
): ValidationResult<T> => {
  return validateData(schema, response);
};

/**
 * Valide les données d'un formulaire
 */
export const validateFormData = <T>(
  schema: z.ZodSchema<T>,
  formData: FormData | Record<string, any>
): ValidationResult<T> => {
  let data: Record<string, any>;
  
  if (formData instanceof FormData) {
    data = Object.fromEntries(formData.entries());
  } else {
    data = formData;
  }
  
  return validateData(schema, data);
};

// ============= Validateurs spécifiques =============

/**
 * Valide un email de manière asynchrone (uniqueness)
 */
export const validateEmailUniqueness = async (email: string): Promise<boolean> => {
  // Implementation will be added when user registration API is available
  // For now, simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!email.includes('test@test.com')); // Fake validation
    }, 300);
  });
};

/**
 * Valide la force d'un mot de passe
 */
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score++;
  else feedback.push('Au moins 8 caractères');
  
  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Au moins une majuscule');
  
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Au moins une minuscule');
  
  if (/[0-9]/.test(password)) score++;
  else feedback.push('Au moins un chiffre');
  
  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Au moins un caractère spécial');
  
  return { score, feedback };
};

// ============= Cache de validation =============

const validationCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Valide avec mise en cache pour éviter les re-validations
 */
export const validateWithCache = <T>(
  key: string,
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> => {
  const cached = validationCache.get(key);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.result;
  }
  
  const result = validateData(schema, data);
  validationCache.set(key, { result, timestamp: now });
  
  return result;
};