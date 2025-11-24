/**
 * Forms Validators - Validation de formulaires génériques
 *
 * Utilise Zod pour validation runtime
 * @module validators/forms
 */

import { z } from 'zod';
import {
  EmailSchema,
  NameSchema,
  TextSchema,
  ShortTextSchema,
  URLSchema,
  TagsSchema,
  RatingSchema,
  UUIDSchema,
} from './common';

// ============================================
// CONTACT FORM VALIDATORS
// ============================================

/**
 * Formulaire de contact
 */
export const ContactFormSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  subject: ShortTextSchema,
  message: z.string()
    .min(10, 'Minimum 10 caractères')
    .max(5000, 'Maximum 5000 caractères')
    .transform(val => val.trim()),
  category: z.enum([
    'general',
    'support',
    'feedback',
    'partnership',
    'press',
    'other',
  ]).default('general'),
  attachments: z.array(z.string().url()).max(5, 'Maximum 5 pièces jointes').optional(),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;

// ============================================
// FEEDBACK VALIDATORS
// ============================================

/**
 * Feedback général
 */
export const FeedbackFormSchema = z.object({
  type: z.enum([
    'bug',
    'feature_request',
    'improvement',
    'praise',
    'complaint',
    'question',
  ]),
  rating: RatingSchema.optional(),
  title: ShortTextSchema,
  description: z.string()
    .min(20, 'Minimum 20 caractères')
    .max(5000, 'Maximum 5000 caractères')
    .transform(val => val.trim()),
  email: EmailSchema.optional(),
  allowContact: z.boolean().default(false),
  deviceInfo: z.object({
    userAgent: z.string().max(500).optional(),
    screenSize: z.string().max(50).optional(),
    platform: z.string().max(50).optional(),
  }).optional(),
  pageUrl: URLSchema.optional(),
  sessionId: z.string().max(100).optional(),
});

export type FeedbackFormInput = z.infer<typeof FeedbackFormSchema>;

/**
 * Feedback d'évaluation rapide (NPS, satisfaction)
 */
export const QuickRatingSchema = z.object({
  rating: z.number()
    .int('Note doit être un entier')
    .min(0, 'Note minimum: 0')
    .max(10, 'Note maximum: 10'),
  comment: z.string()
    .max(500, 'Maximum 500 caractères')
    .optional(),
  context: z.string()
    .max(100, 'Contexte trop long')
    .optional(),
});

export type QuickRatingInput = z.infer<typeof QuickRatingSchema>;

/**
 * Net Promoter Score (NPS)
 */
export const NPSFormSchema = z.object({
  score: z.number()
    .int()
    .min(0, 'Score minimum: 0')
    .max(10, 'Score maximum: 10'),
  reason: z.string()
    .max(1000, 'Maximum 1000 caractères')
    .optional(),
  wouldRecommendTo: z.array(z.string().max(100))
    .max(5, 'Maximum 5 suggestions')
    .optional(),
});

export type NPSFormInput = z.infer<typeof NPSFormSchema>;

// ============================================
// REPORT VALIDATORS
// ============================================

/**
 * Signalement de contenu
 */
export const ReportContentSchema = z.object({
  contentType: z.enum([
    'user',
    'comment',
    'post',
    'message',
    'profile',
    'session',
    'music',
    'other',
  ]),
  contentId: UUIDSchema,
  reason: z.enum([
    'spam',
    'harassment',
    'hate_speech',
    'violence',
    'inappropriate',
    'misinformation',
    'copyright',
    'privacy',
    'other',
  ]),
  description: z.string()
    .min(10, 'Minimum 10 caractères pour décrire le problème')
    .max(2000, 'Maximum 2000 caractères')
    .transform(val => val.trim()),
  evidence: z.array(URLSchema).max(5, 'Maximum 5 preuves').optional(),
  blockUser: z.boolean().default(false),
});

export type ReportContentInput = z.infer<typeof ReportContentSchema>;

// ============================================
// GOAL VALIDATORS
// ============================================

/**
 * Création d'objectif
 */
export const CreateGoalSchema = z.object({
  title: ShortTextSchema,
  description: TextSchema.optional(),
  category: z.enum([
    'wellness',
    'meditation',
    'journaling',
    'exercise',
    'sleep',
    'social',
    'work',
    'personal',
    'custom',
  ]),
  targetValue: z.number()
    .positive('Valeur cible doit être positive')
    .max(1000000, 'Valeur trop élevée'),
  targetUnit: z.enum([
    'times',
    'minutes',
    'hours',
    'days',
    'sessions',
    'entries',
    'points',
  ]),
  frequency: z.enum([
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'one_time',
  ]),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  reminders: z.array(
    z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM requis')
  ).max(3, 'Maximum 3 rappels').optional(),
  isPublic: z.boolean().default(false),
  tags: TagsSchema,
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  { message: 'La date de fin doit être après la date de début', path: ['endDate'] }
);

export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;

/**
 * Mise à jour de progression d'objectif
 */
export const UpdateGoalProgressSchema = z.object({
  goalId: UUIDSchema,
  value: z.number()
    .min(0, 'Valeur minimum: 0'),
  note: z.string()
    .max(500, 'Maximum 500 caractères')
    .optional(),
  date: z.string().datetime().optional(),
});

export type UpdateGoalProgressInput = z.infer<typeof UpdateGoalProgressSchema>;

// ============================================
// CHALLENGE VALIDATORS
// ============================================

/**
 * Participation à un challenge
 */
export const JoinChallengeSchema = z.object({
  challengeId: UUIDSchema,
  teamId: UUIDSchema.optional(),
  commitment: z.string()
    .max(500, 'Maximum 500 caractères')
    .optional(),
  notifyOnUpdates: z.boolean().default(true),
});

export type JoinChallengeInput = z.infer<typeof JoinChallengeSchema>;

/**
 * Création de challenge (admin)
 */
export const CreateChallengeSchema = z.object({
  title: ShortTextSchema,
  description: z.string()
    .min(20, 'Minimum 20 caractères')
    .max(2000, 'Maximum 2000 caractères')
    .transform(val => val.trim()),
  type: z.enum([
    'individual',
    'team',
    'community',
  ]),
  category: z.enum([
    'meditation',
    'journaling',
    'breathing',
    'exercise',
    'sleep',
    'social',
    'custom',
  ]),
  goal: z.object({
    value: z.number().positive('Valeur doit être positive'),
    unit: z.string().max(50),
  }),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  maxParticipants: z.number()
    .int()
    .positive()
    .max(10000, 'Maximum 10000 participants')
    .optional(),
  rewards: z.array(z.object({
    rank: z.number().int().positive(),
    badge: z.string().max(100),
    points: z.number().int().min(0),
  })).max(10, 'Maximum 10 récompenses').optional(),
  isPublic: z.boolean().default(true),
  requiresApproval: z.boolean().default(false),
  imageUrl: URLSchema.optional(),
  tags: TagsSchema,
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  { message: 'La date de fin doit être après la date de début', path: ['endDate'] }
);

export type CreateChallengeInput = z.infer<typeof CreateChallengeSchema>;

// ============================================
// COMMENT VALIDATORS
// ============================================

/**
 * Création de commentaire
 */
export const CreateCommentSchema = z.object({
  content: z.string()
    .min(1, 'Commentaire requis')
    .max(2000, 'Maximum 2000 caractères')
    .transform(val => val.trim()),
  parentId: UUIDSchema.optional(), // Pour les réponses
  mentions: z.array(UUIDSchema).max(10, 'Maximum 10 mentions').optional(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

/**
 * Mise à jour de commentaire
 */
export const UpdateCommentSchema = z.object({
  commentId: UUIDSchema,
  content: z.string()
    .min(1, 'Commentaire requis')
    .max(2000, 'Maximum 2000 caractères')
    .transform(val => val.trim()),
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;

// ============================================
// SEARCH & FILTER VALIDATORS
// ============================================

/**
 * Filtres de recherche
 */
export const SearchFiltersSchema = z.object({
  query: z.string()
    .max(200, 'Requête trop longue')
    .optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  categories: z.array(z.string().max(50)).max(10).optional(),
  tags: TagsSchema.optional(),
  sortBy: z.enum([
    'relevance',
    'date_desc',
    'date_asc',
    'popularity',
    'rating',
  ]).default('relevance'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo);
    }
    return true;
  },
  { message: 'La date de début doit être avant la date de fin', path: ['dateTo'] }
);

export type SearchFiltersInput = z.infer<typeof SearchFiltersSchema>;

// ============================================
// SUBSCRIPTION VALIDATORS
// ============================================

/**
 * Abonnement newsletter
 */
export const NewsletterSubscribeSchema = z.object({
  email: EmailSchema,
  firstName: NameSchema.optional(),
  interests: z.array(z.enum([
    'wellness',
    'meditation',
    'productivity',
    'mental_health',
    'research',
    'product_updates',
  ])).default(['wellness', 'product_updates']),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
});

export type NewsletterSubscribeInput = z.infer<typeof NewsletterSubscribeSchema>;

/**
 * Désabonnement
 */
export const UnsubscribeSchema = z.object({
  email: EmailSchema,
  token: z.string().min(1, 'Token requis'),
  reason: z.enum([
    'too_frequent',
    'not_relevant',
    'never_subscribed',
    'other',
  ]).optional(),
  feedback: z.string().max(500).optional(),
});

export type UnsubscribeInput = z.infer<typeof UnsubscribeSchema>;

// ============================================
// BOOKING/SCHEDULING VALIDATORS
// ============================================

/**
 * Réservation de session
 */
export const BookSessionSchema = z.object({
  sessionType: z.enum([
    'coaching',
    'therapy',
    'group_session',
    'workshop',
    'consultation',
  ]),
  providerId: UUIDSchema.optional(),
  preferredDate: z.string().datetime(),
  alternativeDates: z.array(z.string().datetime()).max(3).optional(),
  duration: z.enum(['30', '45', '60', '90']).default('60'),
  timezone: z.string().max(50).default('Europe/Paris'),
  notes: z.string().max(1000).optional(),
  isFirstSession: z.boolean().default(false),
});

export type BookSessionInput = z.infer<typeof BookSessionSchema>;

// ============================================
// INVITE VALIDATORS
// ============================================

/**
 * Invitation utilisateur
 */
export const InviteUserSchema = z.object({
  email: EmailSchema,
  role: z.enum(['member', 'admin', 'viewer']).default('member'),
  message: z.string()
    .max(500, 'Maximum 500 caractères')
    .optional(),
  expiresInDays: z.number()
    .int()
    .min(1, 'Minimum 1 jour')
    .max(30, 'Maximum 30 jours')
    .default(7),
});

export type InviteUserInput = z.infer<typeof InviteUserSchema>;

/**
 * Invitation en lot
 */
export const BulkInviteSchema = z.object({
  emails: z.array(EmailSchema)
    .min(1, 'Au moins une adresse email requise')
    .max(100, 'Maximum 100 invitations à la fois'),
  role: z.enum(['member', 'admin', 'viewer']).default('member'),
  message: z.string()
    .max(500, 'Maximum 500 caractères')
    .optional(),
});

export type BulkInviteInput = z.infer<typeof BulkInviteSchema>;

// ============================================
// EXPORT HELPERS
// ============================================

/**
 * Valide un formulaire générique
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const path = err.path.join('.') || 'form';
      errors[path] = err.message;
    });

    return { success: false, errors };
  } catch {
    return { success: false, errors: { form: 'Erreur de validation' } };
  }
}

/**
 * Obtient les erreurs de validation formatées pour react-hook-form
 */
export function getFormErrors(error: z.ZodError): Record<string, { message: string }> {
  const errors: Record<string, { message: string }> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (path && !errors[path]) {
      errors[path] = { message: err.message };
    }
  });
  return errors;
}
