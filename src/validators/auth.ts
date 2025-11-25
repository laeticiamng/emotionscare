/**
 * Auth Validators - Validation pour l'authentification
 *
 * Utilise Zod pour validation runtime
 * @module validators/auth
 */

import { z } from 'zod';
import { EmailSchema, NameSchema } from './common';

// ============================================
// PASSWORD VALIDATORS
// ============================================

/**
 * Règles de validation du mot de passe
 */
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

/**
 * Mot de passe sécurisé
 * - Minimum 8 caractères
 * - Au moins une majuscule
 * - Au moins une minuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial
 */
export const PasswordSchema = z.string()
  .min(PASSWORD_MIN_LENGTH, `Minimum ${PASSWORD_MIN_LENGTH} caractères`)
  .max(PASSWORD_MAX_LENGTH, `Maximum ${PASSWORD_MAX_LENGTH} caractères`)
  .regex(/[A-Z]/, 'Au moins une lettre majuscule requise')
  .regex(/[a-z]/, 'Au moins une lettre minuscule requise')
  .regex(/[0-9]/, 'Au moins un chiffre requis')
  .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial requis');

/**
 * Validation de mot de passe simple (pour legacy)
 */
export const SimplePasswordSchema = z.string()
  .min(6, 'Minimum 6 caractères')
  .max(PASSWORD_MAX_LENGTH, `Maximum ${PASSWORD_MAX_LENGTH} caractères`);

/**
 * Confirmation de mot de passe
 */
export const PasswordConfirmSchema = z.object({
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// ============================================
// LOGIN VALIDATORS
// ============================================

/**
 * Schema de connexion
 */
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string()
    .min(1, 'Mot de passe requis')
    .max(PASSWORD_MAX_LENGTH, 'Mot de passe invalide'),
  rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Login avec magic link
 */
export const MagicLinkSchema = z.object({
  email: EmailSchema,
});

export type MagicLinkInput = z.infer<typeof MagicLinkSchema>;

// ============================================
// REGISTRATION VALIDATORS
// ============================================

/**
 * Types de rôle utilisateur
 */
export const UserRoleSchema = z.enum([
  'consumer',
  'employee',
  'manager',
  'admin',
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

/**
 * Schema d'inscription
 */
export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: z.string(),
  firstName: NameSchema.optional(),
  lastName: NameSchema.optional(),
  role: UserRoleSchema.default('consumer'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions d\'utilisation' }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }),
  }),
  newsletterOptIn: z.boolean().default(false),
  organizationCode: z.string()
    .max(50, 'Code organisation invalide')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Schema d'inscription B2B (entreprise)
 */
export const RegisterB2BSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: z.string(),
  firstName: NameSchema,
  lastName: NameSchema,
  companyName: z.string()
    .min(2, 'Nom de l\'entreprise requis')
    .max(100, 'Nom d\'entreprise trop long'),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']),
  jobTitle: z.string()
    .max(100, 'Titre de poste trop long')
    .optional(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide')
    .optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions d\'utilisation' }),
  }),
  acceptDPA: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter l\'accord de traitement des données' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type RegisterB2BInput = z.infer<typeof RegisterB2BSchema>;

// ============================================
// PASSWORD RESET VALIDATORS
// ============================================

/**
 * Demande de réinitialisation de mot de passe
 */
export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

/**
 * Réinitialisation de mot de passe
 */
export const ResetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Token requis')
    .max(500, 'Token invalide'),
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

/**
 * Changement de mot de passe (utilisateur connecté)
 */
export const ChangePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Mot de passe actuel requis'),
  newPassword: PasswordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Les nouveaux mots de passe ne correspondent pas',
  path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Le nouveau mot de passe doit être différent de l\'actuel',
  path: ['newPassword'],
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

// ============================================
// MFA VALIDATORS
// ============================================

/**
 * Code TOTP (6 chiffres)
 */
export const TOTPCodeSchema = z.string()
  .length(6, 'Code à 6 chiffres requis')
  .regex(/^\d{6}$/, 'Code invalide (6 chiffres uniquement)');

/**
 * Vérification MFA
 */
export const MFAVerifySchema = z.object({
  code: TOTPCodeSchema,
  trustDevice: z.boolean().default(false),
});

export type MFAVerifyInput = z.infer<typeof MFAVerifySchema>;

/**
 * Configuration MFA
 */
export const MFASetupSchema = z.object({
  password: z.string().min(1, 'Mot de passe requis'),
  code: TOTPCodeSchema,
});

export type MFASetupInput = z.infer<typeof MFASetupSchema>;

/**
 * Codes de récupération
 */
export const RecoveryCodeSchema = z.string()
  .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Code de récupération invalide');

export const MFARecoverySchema = z.object({
  recoveryCode: RecoveryCodeSchema,
});

export type MFARecoveryInput = z.infer<typeof MFARecoverySchema>;

// ============================================
// EMAIL VERIFICATION
// ============================================

/**
 * Vérification d'email
 */
export const VerifyEmailSchema = z.object({
  token: z.string()
    .min(1, 'Token requis')
    .max(500, 'Token invalide'),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

/**
 * Renvoyer l'email de vérification
 */
export const ResendVerificationSchema = z.object({
  email: EmailSchema,
});

export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>;

// ============================================
// SESSION VALIDATORS
// ============================================

/**
 * Token de rafraîchissement
 */
export const RefreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token requis')
    .max(1000, 'Token invalide'),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

/**
 * Déconnexion
 */
export const LogoutSchema = z.object({
  allDevices: z.boolean().default(false),
});

export type LogoutInput = z.infer<typeof LogoutSchema>;

// ============================================
// SOCIAL AUTH VALIDATORS
// ============================================

/**
 * Providers OAuth supportés
 */
export const OAuthProviderSchema = z.enum([
  'google',
  'apple',
  'microsoft',
  'facebook',
]);

export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;

/**
 * Callback OAuth
 */
export const OAuthCallbackSchema = z.object({
  provider: OAuthProviderSchema,
  code: z.string().min(1, 'Code d\'autorisation requis'),
  state: z.string().optional(),
});

export type OAuthCallbackInput = z.infer<typeof OAuthCallbackSchema>;

// ============================================
// HELPERS
// ============================================

/**
 * Vérifier la force du mot de passe
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: 'weak' | 'fair' | 'good' | 'strong';
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 0;

  if (password.length >= PASSWORD_MIN_LENGTH) {
    score += 1;
  } else {
    suggestions.push(`Minimum ${PASSWORD_MIN_LENGTH} caractères`);
  }

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Ajouter une majuscule');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Ajouter une minuscule');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Ajouter un chiffre');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Ajouter un caractère spécial');
  }

  // Vérifier les patterns faibles
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    suggestions.push('Éviter les caractères répétés');
  }

  if (/^(123|abc|qwerty|password|azerty)/i.test(password)) {
    score -= 2;
    suggestions.push('Éviter les séquences communes');
  }

  // Normaliser le score
  const normalizedScore = Math.max(0, Math.min(4, Math.floor(score * 4 / 7)));

  const labels: Array<'weak' | 'fair' | 'good' | 'strong'> = ['weak', 'fair', 'good', 'strong'];

  return {
    score: normalizedScore,
    label: labels[normalizedScore] || 'weak',
    suggestions: suggestions.slice(0, 3),
  };
}

/**
 * Vérifier si l'email est valide
 */
export function isValidEmail(email: string): boolean {
  return EmailSchema.safeParse(email).success;
}

/**
 * Vérifier si le mot de passe est valide
 */
export function isValidPassword(password: string): boolean {
  return PasswordSchema.safeParse(password).success;
}
