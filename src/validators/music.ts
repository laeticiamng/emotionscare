/**
 * Music Validators - Validation et sanitization des inputs
 *
 * Utilise Zod pour validation runtime et DOMPurify pour sanitization
 * @module validators/music
 */

import { z } from 'zod';

// ============================================
// MUSIC GENERATION VALIDATORS
// ============================================

/**
 * Models Suno supportés
 */
export const SunoModelSchema = z.enum([
  'V3_5',
  'V4',
  'V4_5',
  'V4_5PLUS',
  'V5'
]);

/**
 * Schema de validation pour génération musicale
 */
export const MusicGenerationInputSchema = z.object({
  title: z.string()
    .min(1, 'Le titre est requis')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .transform(val => val.trim()),

  style: z.string()
    .min(1, 'Le style est requis')
    .max(200, 'Le style ne peut pas dépasser 200 caractères')
    .transform(val => val.trim()),

  prompt: z.string()
    .max(500, 'Le prompt ne peut pas dépasser 500 caractères')
    .optional()
    .transform(val => val?.trim()),

  model: SunoModelSchema.default('V4'),

  instrumental: z.boolean().default(true),

  vocalGender: z.enum(['m', 'f']).optional().nullable(),

  styleWeight: z.number()
    .min(0, 'Style weight minimum: 0')
    .max(100, 'Style weight maximum: 100')
    .optional(),

  durationSeconds: z.number()
    .min(30, 'Durée minimum: 30 secondes')
    .max(600, 'Durée maximum: 600 secondes (10 minutes)')
    .optional()
    .default(180),

  negativeTags: z.array(z.string())
    .max(10, 'Maximum 10 tags négatifs')
    .optional(),

  weirdnessConstraint: z.number()
    .min(0)
    .max(1)
    .optional(),

  audioWeight: z.number()
    .min(0)
    .max(1)
    .optional()
});

export type MusicGenerationInput = z.infer<typeof MusicGenerationInputSchema>;

// ============================================
// PLAYLIST VALIDATORS
// ============================================

/**
 * Schema de validation pour création de playlist
 */
export const CreatePlaylistSchema = z.object({
  name: z.string()
    .min(1, 'Le nom de la playlist est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .transform(val => val.trim()),

  description: z.string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional()
    .transform(val => val?.trim()),

  isPublic: z.boolean().default(false),

  tags: z.array(z.string().max(50))
    .max(20, 'Maximum 20 tags par playlist')
    .default([]),

  coverImageUrl: z.string().url('URL invalide').optional()
});

export type CreatePlaylistInput = z.infer<typeof CreatePlaylistSchema>;

/**
 * Schema de validation pour ajout de track à playlist
 */
export const AddToPlaylistSchema = z.object({
  playlistId: z.string().uuid('ID de playlist invalide'),
  musicGenerationId: z.string().uuid('ID de génération musicale invalide')
});

export type AddToPlaylistInput = z.infer<typeof AddToPlaylistSchema>;

// ============================================
// SHARE VALIDATORS
// ============================================

/**
 * Schema de validation pour partage de musique
 */
export const ShareMusicSchema = z.object({
  musicGenerationId: z.string().uuid('ID de génération invalide'),

  sharedWith: z.string().uuid('ID utilisateur invalide').optional(),

  isPublic: z.boolean().default(false),

  message: z.string()
    .max(500, 'Le message ne peut pas dépasser 500 caractères')
    .optional()
    .transform(val => val?.trim()),

  expiresInDays: z.number()
    .min(1, 'Expiration minimum: 1 jour')
    .max(365, 'Expiration maximum: 365 jours')
    .optional()
});

export type ShareMusicInput = z.infer<typeof ShareMusicSchema>;

// ============================================
// PREFERENCES VALIDATORS
// ============================================

/**
 * Schema de validation pour préférences musicales
 */
export const MusicPreferencesSchema = z.object({
  favoriteGenres: z.array(z.string().max(50))
    .max(20, 'Maximum 20 genres favoris')
    .default([]),

  dislikedGenres: z.array(z.string().max(50))
    .max(20, 'Maximum 20 genres non aimés')
    .default([]),

  preferredDuration: z.number()
    .min(30)
    .max(600)
    .optional(),

  autoplay: z.boolean().default(true),

  languagePreference: z.string()
    .length(2, 'Code langue invalide (ex: fr, en)')
    .optional()
});

export type MusicPreferencesInput = z.infer<typeof MusicPreferencesSchema>;

// ============================================
// SESSION VALIDATORS
// ============================================

/**
 * Schema de validation pour session thérapeutique
 */
export const MusicSessionConfigSchema = z.object({
  emotion: z.string()
    .min(1, 'Émotion requise')
    .max(100, 'Émotion trop longue'),

  duration: z.number()
    .min(5, 'Durée minimum: 5 minutes')
    .max(120, 'Durée maximum: 120 minutes')
    .default(30),

  intensity: z.number()
    .min(1, 'Intensité minimum: 1')
    .max(10, 'Intensité maximum: 10')
    .default(5),

  adaptiveMode: z.boolean().default(true),

  targetMood: z.string().max(100).optional(),

  biofeedbackEnabled: z.boolean().default(false)
});

export type MusicSessionConfig = z.infer<typeof MusicSessionConfigSchema>;

// ============================================
// EMOTION UPDATE VALIDATORS
// ============================================

/**
 * Schema de validation pour mise à jour émotionnelle
 */
export const EmotionUpdateSchema = z.object({
  sessionId: z.string().uuid('ID session invalide'),

  emotionData: z.object({
    valence: z.number()
      .min(0, 'Valence minimum: 0')
      .max(100, 'Valence maximum: 100'),

    arousal: z.number()
      .min(0, 'Arousal minimum: 0')
      .max(100, 'Arousal maximum: 100'),

    dominance: z.number()
      .min(0, 'Dominance minimum: 0')
      .max(100, 'Dominance maximum: 100')
      .optional(),

    timestamp: z.string().datetime()
  })
});

export type EmotionUpdateInput = z.infer<typeof EmotionUpdateSchema>;

// ============================================
// FEEDBACK VALIDATORS
// ============================================

/**
 * Schema de validation pour feedback session
 */
export const SessionFeedbackSchema = z.object({
  sessionId: z.string().uuid('ID session invalide'),

  rating: z.number()
    .min(1, 'Note minimum: 1')
    .max(5, 'Note maximum: 5'),

  effectiveness: z.number()
    .min(1, 'Efficacité minimum: 1')
    .max(10, 'Efficacité maximum: 10'),

  comment: z.string()
    .max(1000, 'Commentaire trop long')
    .optional()
    .transform(val => val?.trim()),

  wouldRecommend: z.boolean(),

  tags: z.array(z.string().max(50))
    .max(10)
    .default([])
});

export type SessionFeedbackInput = z.infer<typeof SessionFeedbackSchema>;

// ============================================
// CHALLENGE VALIDATORS
// ============================================

/**
 * Schema de validation pour challenges
 */
export const StartChallengeSchema = z.object({
  challengeId: z.string()
    .min(1, 'Challenge ID requis')
    .max(100),

  metadata: z.record(z.any()).optional()
});

export type StartChallengeInput = z.infer<typeof StartChallengeSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Valide et parse un input avec gestion d'erreur
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation error'] };
  }
}

/**
 * Valide de manière asynchrone (pour async transforms)
 */
export async function validateInputAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation error'] };
  }
}

/**
 * Sanitize HTML/text input (pour éviter XSS)
 * Note: DOMPurify doit être installé séparément si nécessaire
 */
export function sanitizeText(input: string): string {
  // Remplace les caractères dangereux
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valide un UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Valide une URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// EXPORT TYPES
// ============================================

export type {
  z as ZodType
};
