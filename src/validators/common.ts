/**
 * Common Validators - Schémas de validation réutilisables
 *
 * Utilise Zod pour validation runtime
 * @module validators/common
 */

import { z } from 'zod';

// ============================================
// EMAIL & CONTACT VALIDATORS
// ============================================

/**
 * Validation d'email
 */
export const EmailSchema = z.string()
  .email('Adresse email invalide')
  .min(5, 'Email trop court')
  .max(254, 'Email trop long')
  .transform(val => val.toLowerCase().trim());

/**
 * Validation de numéro de téléphone (format international)
 */
export const PhoneSchema = z.string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Numéro de téléphone invalide (format international attendu)'
  )
  .optional();

// ============================================
// STRING VALIDATORS
// ============================================

/**
 * Nom (prénom, nom de famille)
 */
export const NameSchema = z.string()
  .min(1, 'Ce champ est requis')
  .max(100, 'Maximum 100 caractères')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Caractères non autorisés')
  .transform(val => val.trim());

/**
 * Username/pseudo
 */
export const UsernameSchema = z.string()
  .min(3, 'Minimum 3 caractères')
  .max(30, 'Maximum 30 caractères')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Seuls les lettres, chiffres, tirets et underscores sont autorisés'
  )
  .transform(val => val.toLowerCase().trim());

/**
 * Texte libre (description, bio, etc.)
 */
export const TextSchema = z.string()
  .max(2000, 'Maximum 2000 caractères')
  .transform(val => val.trim());

/**
 * Texte court (titre, label)
 */
export const ShortTextSchema = z.string()
  .min(1, 'Ce champ est requis')
  .max(200, 'Maximum 200 caractères')
  .transform(val => val.trim());

// ============================================
// DATE & TIME VALIDATORS
// ============================================

/**
 * Date au format ISO
 */
export const DateSchema = z.string()
  .datetime({ message: 'Date invalide (format ISO attendu)' });

/**
 * Date de naissance (doit être dans le passé, âge raisonnable)
 */
export const BirthDateSchema = z.string()
  .refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 120, 0, 1);
    const maxDate = new Date(now.getFullYear() - 13, 11, 31);
    return date >= minDate && date <= maxDate;
  }, 'Date de naissance invalide (âge minimum 13 ans)');

/**
 * Timestamp Unix
 */
export const TimestampSchema = z.number()
  .int('Timestamp doit être un entier')
  .positive('Timestamp doit être positif');

// ============================================
// NUMERIC VALIDATORS
// ============================================

/**
 * Score de 0 à 100
 */
export const ScoreSchema = z.number()
  .min(0, 'Score minimum: 0')
  .max(100, 'Score maximum: 100');

/**
 * Rating de 1 à 5
 */
export const RatingSchema = z.number()
  .int('Note doit être un entier')
  .min(1, 'Note minimum: 1')
  .max(5, 'Note maximum: 5');

/**
 * Pourcentage (0-100)
 */
export const PercentageSchema = z.number()
  .min(0, 'Pourcentage minimum: 0%')
  .max(100, 'Pourcentage maximum: 100%');

/**
 * Nombre positif
 */
export const PositiveNumberSchema = z.number()
  .positive('Doit être un nombre positif');

// ============================================
// ID VALIDATORS
// ============================================

/**
 * UUID v4
 */
export const UUIDSchema = z.string()
  .uuid('ID invalide');

/**
 * ID générique (UUID ou string)
 */
export const IdSchema = z.string()
  .min(1, 'ID requis')
  .max(128, 'ID trop long');

// ============================================
// URL & MEDIA VALIDATORS
// ============================================

/**
 * URL valide
 */
export const URLSchema = z.string()
  .url('URL invalide')
  .max(2048, 'URL trop longue');

/**
 * URL d'image
 */
export const ImageURLSchema = z.string()
  .url('URL invalide')
  .regex(
    /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
    'URL doit pointer vers une image'
  )
  .max(2048, 'URL trop longue');

/**
 * URL audio
 */
export const AudioURLSchema = z.string()
  .url('URL invalide')
  .regex(
    /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i,
    'URL doit pointer vers un fichier audio'
  )
  .max(2048, 'URL trop longue');

/**
 * URL vidéo
 */
export const VideoURLSchema = z.string()
  .url('URL invalide')
  .regex(
    /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i,
    'URL doit pointer vers un fichier vidéo'
  )
  .max(2048, 'URL trop longue');

// ============================================
// ARRAY VALIDATORS
// ============================================

/**
 * Liste de tags
 */
export const TagsSchema = z.array(
  z.string()
    .min(1, 'Tag ne peut pas être vide')
    .max(50, 'Tag trop long')
    .transform(val => val.trim().toLowerCase())
)
  .max(20, 'Maximum 20 tags')
  .default([]);

/**
 * Liste d'IDs
 */
export const IdsArraySchema = z.array(UUIDSchema)
  .max(100, 'Maximum 100 éléments');

// ============================================
// PAGINATION VALIDATORS
// ============================================

/**
 * Paramètres de pagination
 */
export const PaginationSchema = z.object({
  page: z.number()
    .int('Page doit être un entier')
    .min(1, 'Page minimum: 1')
    .default(1),

  limit: z.number()
    .int('Limite doit être un entier')
    .min(1, 'Limite minimum: 1')
    .max(100, 'Limite maximum: 100')
    .default(20),

  sortBy: z.string()
    .max(50, 'Champ de tri trop long')
    .optional(),

  sortOrder: z.enum(['asc', 'desc'])
    .default('desc')
    .optional(),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

// ============================================
// SEARCH VALIDATORS
// ============================================

/**
 * Paramètres de recherche
 */
export const SearchSchema = z.object({
  query: z.string()
    .min(1, 'Requête de recherche requise')
    .max(200, 'Requête trop longue')
    .transform(val => val.trim()),

  filters: z.record(z.string(), z.any())
    .optional(),

  ...PaginationSchema.shape,
});

export type SearchInput = z.infer<typeof SearchSchema>;

// ============================================
// GEOLOCATION VALIDATORS
// ============================================

/**
 * Coordonnées géographiques
 */
export const GeoLocationSchema = z.object({
  latitude: z.number()
    .min(-90, 'Latitude invalide')
    .max(90, 'Latitude invalide'),

  longitude: z.number()
    .min(-180, 'Longitude invalide')
    .max(180, 'Longitude invalide'),

  accuracy: z.number()
    .positive('Précision doit être positive')
    .optional(),
});

export type GeoLocation = z.infer<typeof GeoLocationSchema>;

// ============================================
// COLOR VALIDATORS
// ============================================

/**
 * Couleur hexadécimale
 */
export const HexColorSchema = z.string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, 'Couleur hex invalide');

/**
 * Couleur RGB
 */
export const RGBColorSchema = z.object({
  r: z.number().int().min(0).max(255),
  g: z.number().int().min(0).max(255),
  b: z.number().int().min(0).max(255),
  a: z.number().min(0).max(1).optional(),
});

// ============================================
// FILE VALIDATORS
// ============================================

/**
 * Métadonnées de fichier
 */
export const FileMetadataSchema = z.object({
  name: z.string()
    .min(1, 'Nom de fichier requis')
    .max(255, 'Nom de fichier trop long'),

  size: z.number()
    .int('Taille doit être un entier')
    .positive('Taille doit être positive')
    .max(100 * 1024 * 1024, 'Fichier trop volumineux (max 100MB)'),

  type: z.string()
    .min(1, 'Type de fichier requis')
    .max(100, 'Type de fichier invalide'),

  lastModified: z.number().optional(),
});

export type FileMetadata = z.infer<typeof FileMetadataSchema>;

// ============================================
// EXPORTS TYPES
// ============================================

export type Email = z.infer<typeof EmailSchema>;
export type Phone = z.infer<typeof PhoneSchema>;
export type Name = z.infer<typeof NameSchema>;
export type Username = z.infer<typeof UsernameSchema>;
export type UUID = z.infer<typeof UUIDSchema>;
