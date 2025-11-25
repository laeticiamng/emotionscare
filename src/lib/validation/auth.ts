import { z } from 'zod';

// ============================================
// VALIDATION PATTERNS
// ============================================

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

/**
 * Pattern de validation pour mot de passe sécurisé
 * - Au moins une minuscule
 * - Au moins une majuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial (recommandé mais pas obligatoire pour le register)
 */
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

// ============================================
// LOGIN SCHEMA
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Format email invalide')
    .max(254, 'Email trop long')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(1, 'Mot de passe requis')
    .max(PASSWORD_MAX_LENGTH, 'Mot de passe trop long'),
  rememberMe: z.boolean().optional().default(false),
});

// ============================================
// REGISTER SCHEMA
// ============================================

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Format email invalide')
    .max(254, 'Email trop long')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Minimum ${PASSWORD_MIN_LENGTH} caractères`)
    .max(PASSWORD_MAX_LENGTH, 'Mot de passe trop long')
    .regex(passwordPattern, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string().min(1, 'Confirmation requise'),
  acceptTerms: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// ============================================
// UNIFIED REGISTER SCHEMA (avec nom complet)
// ============================================

export const unifiedRegisterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Format email invalide')
    .max(254, 'Email trop long')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Minimum ${PASSWORD_MIN_LENGTH} caractères`)
    .max(PASSWORD_MAX_LENGTH, 'Mot de passe trop long')
    .regex(passwordPattern, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string().min(1, 'Confirmation requise'),
  fullName: z
    .string()
    .trim()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères non autorisés'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions d\'utilisation' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// ============================================
// RESET PASSWORD SCHEMAS
// ============================================

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Format email invalide')
    .transform(val => val.toLowerCase().trim()),
});

export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Minimum ${PASSWORD_MIN_LENGTH} caractères`)
    .max(PASSWORD_MAX_LENGTH, 'Mot de passe trop long')
    .regex(strongPasswordPattern, 'Le mot de passe doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial'),
  confirmPassword: z.string().min(1, 'Confirmation requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// ============================================
// CHANGE PASSWORD SCHEMA
// ============================================

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Mot de passe actuel requis'),
  newPassword: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Minimum ${PASSWORD_MIN_LENGTH} caractères`)
    .max(PASSWORD_MAX_LENGTH, 'Mot de passe trop long')
    .regex(strongPasswordPattern, 'Le mot de passe doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial'),
  confirmNewPassword: z.string().min(1, 'Confirmation requise'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Les nouveaux mots de passe ne correspondent pas",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Le nouveau mot de passe doit être différent de l'actuel",
  path: ["newPassword"],
});

// ============================================
// MFA SCHEMA
// ============================================

export const mfaCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Code à 6 chiffres requis')
    .regex(/^\d{6}$/, 'Code invalide (6 chiffres uniquement)'),
  trustDevice: z.boolean().optional().default(false),
});

// ============================================
// PASSWORD STRENGTH HELPER
// ============================================

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export function getPasswordStrength(password: string): {
  score: number;
  strength: PasswordStrength;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 0;

  if (password.length >= PASSWORD_MIN_LENGTH) score += 1;
  else suggestions.push(`Minimum ${PASSWORD_MIN_LENGTH} caractères`);

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('Ajouter une majuscule');

  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('Ajouter une minuscule');

  if (/[0-9]/.test(password)) score += 1;
  else suggestions.push('Ajouter un chiffre');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else suggestions.push('Ajouter un caractère spécial');

  // Pénalités
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    suggestions.push('Éviter les caractères répétés');
  }

  if (/^(123|abc|qwerty|password|azerty)/i.test(password)) {
    score -= 2;
    suggestions.push('Éviter les séquences communes');
  }

  const normalizedScore = Math.max(0, Math.min(4, Math.floor(score * 4 / 7)));
  const strengths: PasswordStrength[] = ['weak', 'fair', 'good', 'strong'];

  return {
    score: normalizedScore,
    strength: strengths[normalizedScore] || 'weak',
    suggestions: suggestions.slice(0, 3),
  };
}

// ============================================
// TYPE EXPORTS
// ============================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UnifiedRegisterFormData = z.infer<typeof unifiedRegisterSchema>;
export type MfaCodeFormData = z.infer<typeof mfaCodeSchema>;
