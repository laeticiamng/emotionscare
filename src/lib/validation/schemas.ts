// @ts-nocheck

import { z } from 'zod';

/**
 * Centralized Zod validation schemas
 */

// Base schemas
export const emailSchema = z.string()
  .email({ message: 'Adresse e-mail invalide' })
  .min(1, { message: 'L\'email est requis' });

export const passwordSchema = z.string()
  .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
  .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
  .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
  .regex(/[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' });

export const nameSchema = z.string()
  .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Le nom contient des caractères invalides' });

export const phoneSchema = z.string()
  .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, { message: 'Numéro de téléphone français invalide' })
  .optional();

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Le mot de passe est requis' })
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

export const resetPasswordSchema = z.object({
  email: emailSchema
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Le mot de passe actuel est requis' }),
  newPassword: passwordSchema,
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Les nouveaux mots de passe ne correspondent pas',
  path: ['confirmNewPassword']
});

// User profile schemas
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  bio: z.string().max(500, { message: 'La biographie ne peut pas dépasser 500 caractères' }).optional(),
  preferences: z.object({
    language: z.enum(['fr', 'en'], { message: 'Langue non supportée' }),
    theme: z.enum(['light', 'dark', 'system'], { message: 'Thème invalide' }),
    notifications: z.boolean()
  }).optional()
});

// Content schemas
export const journalEntrySchema = z.object({
  title: z.string()
    .min(1, { message: 'Le titre est requis' })
    .max(100, { message: 'Le titre ne peut pas dépasser 100 caractères' }),
  content: z.string()
    .min(10, { message: 'Le contenu doit contenir au moins 10 caractères' })
    .max(5000, { message: 'Le contenu ne peut pas dépasser 5000 caractères' }),
  mood: z.number()
    .min(1, { message: 'L\'humeur doit être entre 1 et 10' })
    .max(10, { message: 'L\'humeur doit être entre 1 et 10' }),
  tags: z.array(z.string()).max(5, { message: 'Maximum 5 tags autorisés' }).optional()
});

export const commentSchema = z.object({
  content: z.string()
    .min(1, { message: 'Le commentaire ne peut pas être vide' })
    .max(1000, { message: 'Le commentaire ne peut pas dépasser 1000 caractères' }),
  postId: z.string().uuid({ message: 'ID de publication invalide' }),
  parentId: z.string().uuid().optional()
});

// API request schemas
export const searchSchema = z.object({
  query: z.string()
    .min(1, { message: 'La recherche ne peut pas être vide' })
    .max(100, { message: 'La recherche ne peut pas dépasser 100 caractères' }),
  filters: z.object({
    category: z.string().optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional()
  }).optional()
});

export const invitationSchema = z.object({
  email: emailSchema,
  role: z.enum(['b2c', 'b2b_user', 'b2b_admin'], { message: 'Rôle invalide' }),
  message: z.string().max(500, { message: 'Le message ne peut pas dépasser 500 caractères' }).optional()
});

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string()
    .min(3, { message: 'Le sujet doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le sujet ne peut pas dépasser 200 caractères' }),
  message: z.string()
    .min(10, { message: 'Le message doit contenir au moins 10 caractères' })
    .max(2000, { message: 'Le message ne peut pas dépasser 2000 caractères' })
});

// Feedback schema
export const feedbackSchema = z.object({
  module: z.string().min(1, { message: 'Le module est requis' }),
  type: z.enum(['bug', 'suggestion', 'compliment', 'feature_request'], { 
    message: 'Type de feedback invalide' 
  }),
  rating: z.number()
    .min(1, { message: 'La note doit être entre 1 et 5' })
    .max(5, { message: 'La note doit être entre 1 et 5' })
    .optional(),
  title: z.string()
    .min(3, { message: 'Le titre doit contenir au moins 3 caractères' })
    .max(200, { message: 'Le titre ne peut pas dépasser 200 caractères' }),
  description: z.string()
    .min(10, { message: 'La description doit contenir au moins 10 caractères' })
    .max(2000, { message: 'La description ne peut pas dépasser 2000 caractères' }),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    message: 'Priorité invalide'
  }).optional(),
  tags: z.array(z.string().max(50)).max(10, { message: 'Maximum 10 tags autorisés' }).optional()
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Fichier requis' }),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp'])
}).refine(data => data.file.size <= data.maxSize, {
  message: 'Fichier trop volumineux'
}).refine(data => data.allowedTypes.includes(data.file.type), {
  message: 'Type de fichier non autorisé'
});

// ──────────────────────────────────────────────
// Emotional Scan schemas
// ──────────────────────────────────────────────

const scanMode = z.enum(['text', 'voice', 'facial', 'questionnaire'], {
  message: 'Mode de scan invalide',
});

export const emotionalScanSchema = z.object({
  mode: scanMode,
  textInput: z.string()
    .max(5000, { message: 'Le texte ne peut pas depasser 5000 caracteres' })
    .optional(),
  voiceDurationMs: z.number()
    .min(500, { message: 'Enregistrement trop court (min 0.5s)' })
    .max(300000, { message: 'Enregistrement trop long (max 5 min)' })
    .optional(),
  questionnaireAnswers: z.array(z.object({
    questionId: z.string().uuid(),
    value: z.number().min(0).max(10),
  })).max(50, { message: 'Maximum 50 reponses' }).optional(),
}).refine(
  (data) => {
    if (data.mode === 'text' && (!data.textInput || data.textInput.trim().length < 3)) {
      return false;
    }
    return true;
  },
  { message: 'Le scan texte necessite au moins 3 caracteres', path: ['textInput'] }
);

export const scanResultSchema = z.object({
  scanId: z.string().uuid(),
  emotions: z.array(z.object({
    name: z.string().min(1).max(50),
    score: z.number().min(0).max(1),
    confidence: z.number().min(0).max(1),
  })).min(1).max(20),
  dominantEmotion: z.string().min(1).max(50),
  overallScore: z.number().min(0).max(100),
  timestamp: z.string().datetime(),
});

// ──────────────────────────────────────────────
// Music / Musicotherapy schemas
// ──────────────────────────────────────────────

export const musicGenerationSchema = z.object({
  prompt: z.string()
    .min(3, { message: 'La description doit contenir au moins 3 caracteres' })
    .max(500, { message: 'La description ne peut pas depasser 500 caracteres' }),
  emotion: z.string()
    .min(1, { message: "L'emotion est requise" })
    .max(50),
  genre: z.enum([
    'ambient', 'classical', 'lofi', 'nature', 'meditation',
    'binaural', 'piano', 'jazz', 'electronic',
  ], { message: 'Genre musical non supporte' }).optional(),
  durationSeconds: z.number()
    .min(15, { message: 'Duree minimale : 15 secondes' })
    .max(300, { message: 'Duree maximale : 5 minutes' })
    .default(60),
  intensity: z.number()
    .min(0, { message: "L'intensite doit etre entre 0 et 1" })
    .max(1, { message: "L'intensite doit etre entre 0 et 1" })
    .default(0.5),
});

export const musicPlaybackSchema = z.object({
  trackId: z.string().uuid({ message: 'ID de piste invalide' }),
  action: z.enum(['play', 'pause', 'stop', 'seek', 'volume'], {
    message: 'Action de lecture invalide',
  }),
  seekPosition: z.number().min(0).optional(),
  volume: z.number().min(0).max(1).optional(),
});

// ──────────────────────────────────────────────
// Coach IA (Nyvee) schemas
// ──────────────────────────────────────────────

export const coachMessageSchema = z.object({
  message: z.string()
    .min(1, { message: 'Le message ne peut pas etre vide' })
    .max(2000, { message: 'Le message ne peut pas depasser 2000 caracteres' }),
  sessionId: z.string().uuid({ message: 'ID de session invalide' }).optional(),
  context: z.enum([
    'general', 'stress', 'anxiety', 'burnout', 'sleep',
    'motivation', 'relationships', 'exam_prep',
  ], { message: 'Contexte invalide' }).optional(),
});

export const coachSessionSchema = z.object({
  title: z.string()
    .min(1, { message: 'Le titre est requis' })
    .max(100, { message: 'Le titre ne peut pas depasser 100 caracteres' })
    .optional(),
  goal: z.string()
    .max(500, { message: "L'objectif ne peut pas depasser 500 caracteres" })
    .optional(),
  moodBefore: z.number()
    .min(1, { message: "L'humeur doit etre entre 1 et 10" })
    .max(10, { message: "L'humeur doit etre entre 1 et 10" })
    .optional(),
  moodAfter: z.number()
    .min(1, { message: "L'humeur doit etre entre 1 et 10" })
    .max(10, { message: "L'humeur doit etre entre 1 et 10" })
    .optional(),
});

// ──────────────────────────────────────────────
// Anomaly detection for emotional scans
// ──────────────────────────────────────────────

export const scanAnomalyDetectionSchema = z.object({
  userId: z.string().uuid(),
  scanId: z.string().uuid(),
  emotionScores: z.array(z.number().min(0).max(1)),
  previousAvgScore: z.number().min(0).max(1),
  deviationThreshold: z.number().min(0.1).max(1).default(0.3),
  frequencyPerHour: z.number().min(0).max(100),
  maxScansPerHour: z.number().min(1).max(50).default(10),
}).refine(
  (data) => data.frequencyPerHour <= data.maxScansPerHour,
  { message: 'Frequence de scan anormalement elevee', path: ['frequencyPerHour'] }
);

// ──────────────────────────────────────────────
// Gamification schemas
// ──────────────────────────────────────────────

export const challengeSubmissionSchema = z.object({
  challengeId: z.string().uuid({ message: 'ID de defi invalide' }),
  completionData: z.record(z.string(), z.unknown()).optional(),
  note: z.string().max(500, { message: 'La note ne peut pas depasser 500 caracteres' }).optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type InvitationInput = z.infer<typeof invitationSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type EmotionalScanInput = z.infer<typeof emotionalScanSchema>;
export type ScanResultInput = z.infer<typeof scanResultSchema>;
export type MusicGenerationInput = z.infer<typeof musicGenerationSchema>;
export type MusicPlaybackInput = z.infer<typeof musicPlaybackSchema>;
export type CoachMessageInput = z.infer<typeof coachMessageSchema>;
export type CoachSessionInput = z.infer<typeof coachSessionSchema>;
export type ScanAnomalyInput = z.infer<typeof scanAnomalyDetectionSchema>;
export type ChallengeSubmissionInput = z.infer<typeof challengeSubmissionSchema>;
