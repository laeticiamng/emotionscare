/**
 * Profile Validators - Validation du profil utilisateur
 *
 * Utilise Zod pour validation runtime
 * @module validators/profile
 */

import { z } from 'zod';
import {
  EmailSchema,
  NameSchema,
  PhoneSchema,
  TextSchema,
  URLSchema,
  ImageURLSchema,
  BirthDateSchema,
  TagsSchema,
  HexColorSchema,
} from './common';

// ============================================
// PROFILE VALIDATORS
// ============================================

/**
 * Langues supportées
 */
export const LanguageSchema = z.enum(['fr', 'en', 'auto']);
export type Language = z.infer<typeof LanguageSchema>;

/**
 * Thèmes visuels
 */
export const ThemeSchema = z.enum(['light', 'dark', 'system']);
export type Theme = z.infer<typeof ThemeSchema>;

/**
 * Genre
 */
export const GenderSchema = z.enum(['male', 'female', 'other', 'prefer_not_to_say']);
export type Gender = z.infer<typeof GenderSchema>;

/**
 * Schema de mise à jour du profil de base
 */
export const UpdateProfileSchema = z.object({
  firstName: NameSchema.optional(),
  lastName: NameSchema.optional(),
  displayName: z.string()
    .min(2, 'Minimum 2 caractères')
    .max(50, 'Maximum 50 caractères')
    .optional(),
  bio: TextSchema.optional(),
  avatarUrl: ImageURLSchema.optional().nullable(),
  coverImageUrl: ImageURLSchema.optional().nullable(),
  website: URLSchema.optional().nullable(),
  location: z.string()
    .max(100, 'Maximum 100 caractères')
    .optional(),
  timezone: z.string()
    .max(50, 'Fuseau horaire invalide')
    .optional(),
  birthDate: BirthDateSchema.optional().nullable(),
  gender: GenderSchema.optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

/**
 * Schema profil complet
 */
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: EmailSchema,
  ...UpdateProfileSchema.shape,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// ============================================
// PREFERENCES VALIDATORS
// ============================================

/**
 * Préférences de notification
 */
export const NotificationPreferencesSchema = z.object({
  email: z.object({
    marketing: z.boolean().default(false),
    productUpdates: z.boolean().default(true),
    weeklyDigest: z.boolean().default(true),
    dailyReminders: z.boolean().default(true),
    achievements: z.boolean().default(true),
    communityActivity: z.boolean().default(false),
  }),
  push: z.object({
    enabled: z.boolean().default(true),
    dailyReminders: z.boolean().default(true),
    sessionReminders: z.boolean().default(true),
    achievements: z.boolean().default(true),
    tips: z.boolean().default(false),
  }),
  inApp: z.object({
    sounds: z.boolean().default(true),
    vibration: z.boolean().default(true),
    badges: z.boolean().default(true),
  }),
  quietHours: z.object({
    enabled: z.boolean().default(false),
    startTime: z.string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM requis')
      .default('22:00'),
    endTime: z.string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM requis')
      .default('07:00'),
  }),
});

export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;

/**
 * Préférences d'affichage
 */
export const DisplayPreferencesSchema = z.object({
  theme: ThemeSchema.default('system'),
  language: LanguageSchema.default('fr'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  reducedMotion: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  colorBlindMode: z.enum(['none', 'protanopia', 'deuteranopia', 'tritanopia']).default('none'),
  primaryColor: HexColorSchema.optional(),
});

export type DisplayPreferences = z.infer<typeof DisplayPreferencesSchema>;

/**
 * Préférences de confidentialité
 */
export const PrivacyPreferencesSchema = z.object({
  profileVisibility: z.enum(['public', 'connections', 'private']).default('private'),
  showActivityStatus: z.boolean().default(false),
  showLastSeen: z.boolean().default(false),
  allowSearchByEmail: z.boolean().default(false),
  shareProgressWithOrg: z.boolean().default(false),
  anonymizeDataForResearch: z.boolean().default(true),
  dataRetentionDays: z.number()
    .int()
    .min(30, 'Minimum 30 jours')
    .max(365 * 5, 'Maximum 5 ans')
    .default(365),
});

export type PrivacyPreferences = z.infer<typeof PrivacyPreferencesSchema>;

/**
 * Préférences de bien-être
 */
export const WellnessPreferencesSchema = z.object({
  dailyGoal: z.object({
    journalEntries: z.number().int().min(0).max(10).default(1),
    meditationMinutes: z.number().int().min(0).max(120).default(10),
    breathingExercises: z.number().int().min(0).max(10).default(2),
    checkIns: z.number().int().min(0).max(10).default(3),
  }),
  reminderTimes: z.array(
    z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM requis')
  ).max(5, 'Maximum 5 rappels').default(['09:00', '14:00', '20:00']),
  preferredActivities: z.array(
    z.enum([
      'meditation',
      'breathing',
      'journaling',
      'music_therapy',
      'vr_sessions',
      'coaching',
      'community',
    ])
  ).default(['meditation', 'journaling']),
  focusAreas: TagsSchema,
  weeklyReportDay: z.enum(['monday', 'sunday']).default('monday'),
});

export type WellnessPreferences = z.infer<typeof WellnessPreferencesSchema>;

/**
 * Toutes les préférences utilisateur
 */
export const UserPreferencesSchema = z.object({
  notifications: NotificationPreferencesSchema,
  display: DisplayPreferencesSchema,
  privacy: PrivacyPreferencesSchema,
  wellness: WellnessPreferencesSchema,
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

// ============================================
// ACCESSIBILITY SETTINGS
// ============================================

/**
 * Paramètres d'accessibilité
 */
export const AccessibilitySettingsSchema = z.object({
  screenReader: z.boolean().default(false),
  keyboardNavigation: z.boolean().default(true),
  reduceMotion: z.boolean().default(false),
  increasedContrast: z.boolean().default(false),
  largeText: z.boolean().default(false),
  dyslexiaFont: z.boolean().default(false),
  voiceControl: z.boolean().default(false),
  captions: z.boolean().default(true),
  audioDescriptions: z.boolean().default(false),
  customFontSize: z.number()
    .min(12, 'Taille minimum: 12px')
    .max(32, 'Taille maximum: 32px')
    .optional(),
  customLineHeight: z.number()
    .min(1, 'Interligne minimum: 1')
    .max(3, 'Interligne maximum: 3')
    .optional(),
});

export type AccessibilitySettings = z.infer<typeof AccessibilitySettingsSchema>;

// ============================================
// ACCOUNT SETTINGS
// ============================================

/**
 * Mise à jour de l'email
 */
export const UpdateEmailSchema = z.object({
  newEmail: EmailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
});

export type UpdateEmailInput = z.infer<typeof UpdateEmailSchema>;

/**
 * Suppression de compte
 */
export const DeleteAccountSchema = z.object({
  password: z.string().min(1, 'Mot de passe requis'),
  confirmation: z.literal('DELETE', {
    errorMap: () => ({ message: 'Tapez DELETE pour confirmer' }),
  }),
  reason: z.string()
    .max(500, 'Maximum 500 caractères')
    .optional(),
  feedback: z.string()
    .max(2000, 'Maximum 2000 caractères')
    .optional(),
});

export type DeleteAccountInput = z.infer<typeof DeleteAccountSchema>;

/**
 * Export de données RGPD
 */
export const DataExportSchema = z.object({
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
  includeData: z.object({
    profile: z.boolean().default(true),
    journal: z.boolean().default(true),
    assessments: z.boolean().default(true),
    sessions: z.boolean().default(true),
    preferences: z.boolean().default(true),
    activityLogs: z.boolean().default(false),
  }),
});

export type DataExportInput = z.infer<typeof DataExportSchema>;

// ============================================
// CONTACT INFO VALIDATORS
// ============================================

/**
 * Informations de contact
 */
export const ContactInfoSchema = z.object({
  email: EmailSchema,
  phone: PhoneSchema,
  emergencyContact: z.object({
    name: NameSchema,
    phone: z.string()
      .regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide'),
    relationship: z.string()
      .max(50, 'Maximum 50 caractères'),
  }).optional(),
  address: z.object({
    street: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
    country: z.string().length(2, 'Code pays à 2 lettres').optional(),
  }).optional(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;

// ============================================
// SOCIAL PROFILE VALIDATORS
// ============================================

/**
 * Liens sociaux
 */
export const SocialLinksSchema = z.object({
  linkedin: URLSchema.optional().nullable(),
  twitter: URLSchema.optional().nullable(),
  instagram: URLSchema.optional().nullable(),
  facebook: URLSchema.optional().nullable(),
  website: URLSchema.optional().nullable(),
});

export type SocialLinks = z.infer<typeof SocialLinksSchema>;

/**
 * Profil social/communauté
 */
export const SocialProfileSchema = z.object({
  username: z.string()
    .min(3, 'Minimum 3 caractères')
    .max(30, 'Maximum 30 caractères')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Caractères non autorisés'),
  displayName: z.string()
    .min(2, 'Minimum 2 caractères')
    .max(50, 'Maximum 50 caractères'),
  bio: z.string()
    .max(300, 'Maximum 300 caractères')
    .optional(),
  avatarUrl: ImageURLSchema.optional().nullable(),
  isPublic: z.boolean().default(false),
  interests: TagsSchema,
  socialLinks: SocialLinksSchema.optional(),
});

export type SocialProfile = z.infer<typeof SocialProfileSchema>;

// ============================================
// ORGANIZATION PROFILE VALIDATORS
// ============================================

/**
 * Profil organisation (B2B)
 */
export const OrganizationProfileSchema = z.object({
  employeeId: z.string()
    .max(50, 'Maximum 50 caractères')
    .optional(),
  department: z.string()
    .max(100, 'Maximum 100 caractères')
    .optional(),
  jobTitle: z.string()
    .max(100, 'Maximum 100 caractères')
    .optional(),
  manager: z.string()
    .email('Email manager invalide')
    .optional(),
  startDate: z.string()
    .datetime()
    .optional(),
  officeLocation: z.string()
    .max(100, 'Maximum 100 caractères')
    .optional(),
});

export type OrganizationProfile = z.infer<typeof OrganizationProfileSchema>;

// ============================================
// HELPERS
// ============================================

/**
 * Valide un profil partiel (pour mise à jour)
 */
export function validatePartialProfile(data: unknown): {
  success: boolean;
  data?: Partial<UpdateProfileInput>;
  errors?: string[];
} {
  try {
    const result = UpdateProfileSchema.partial().safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    };
  } catch {
    return { success: false, errors: ['Erreur de validation'] };
  }
}

/**
 * Valide les préférences utilisateur
 */
export function validatePreferences(data: unknown): {
  success: boolean;
  data?: UserPreferences;
  errors?: string[];
} {
  try {
    const result = UserPreferencesSchema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    };
  } catch {
    return { success: false, errors: ['Erreur de validation'] };
  }
}
