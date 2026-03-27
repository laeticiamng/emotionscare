// @ts-nocheck
import { z } from 'zod';
import { logger } from '@/lib/logger';

/**
 * Schémas Zod sécurisés avec des valeurs par défaut pour éviter les erreurs undefined
 */

// Schéma pour les props de composants critiques
export const SafeComponentPropsSchema = z.object({
  className: z.string().default(''),
  id: z.string().optional(),
  children: z.unknown().optional(),
  style: z.record(z.unknown()).default({}),
}).partial();

// Schéma pour les paramètres de mood mixer
export const SafeMoodMixerSchema = z.object({
  currentMood: z.string().default('neutral'),
  targetMood: z.string().default('calm'),
  transitionDuration: z.number().default(180),
  mixStyle: z.enum(['smooth', 'sharp', 'gradual']).default('smooth'),
  volume: z.number().min(0).max(1).default(0.8),
  isPlaying: z.boolean().default(false),
  playlist: z.array(z.unknown()).default([]),
  settings: z.object({
    autoPlay: z.boolean().default(false),
    loopMode: z.boolean().default(false),
    visualizations: z.boolean().default(true),
  }).default({}),
});

// Schéma pour les données utilisateur sécurisées
export const SafeUserDataSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().default(''),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.string().default('fr'),
    accessibility: z.object({
      highContrast: z.boolean().default(false),
      reducedMotion: z.boolean().default(false),
      largeText: z.boolean().default(false),
    }).default({}),
  }).default({}),
  profile: z.object({
    avatar: z.string().url().optional(),
    bio: z.string().default(''),
    goals: z.array(z.string()).default([]),
  }).default({}),
});

// Schéma pour les données de session
export const SafeSessionSchema = z.object({
  sessionId: z.string().default(() => `session_${Date.now()}`),
  startTime: z.date().default(() => new Date()),
  endTime: z.date().optional(),
  activities: z.array(z.unknown()).default([]),
  metrics: z.object({
    duration: z.number().default(0),
    interactions: z.number().default(0),
    errors: z.array(z.string()).default([]),
  }).default({}),
});

// Schéma pour les paramètres d'accessibilité
export const SafeAccessibilitySchema = z.object({
  highContrast: z.boolean().default(false),
  reducedMotion: z.boolean().default(false),
  largeText: z.boolean().default(false),
  enhancedFocus: z.boolean().default(false),
  colorBlindSupport: z.enum(['none', 'protanopia', 'deuteranopia', 'tritanopia']).default('none'),
  keyboardNavigation: z.boolean().default(false),
  screenReader: z.boolean().default(false),
});

// Schéma pour les erreurs
export const SafeErrorSchema = z.object({
  message: z.string().default('Une erreur est survenue'),
  code: z.string().default('UNKNOWN_ERROR'),
  timestamp: z.date().default(() => new Date()),
  context: z.string().optional(),
  stack: z.string().optional(),
  metadata: z.record(z.unknown()).default({}),
});

// Fonction helper pour parser avec des valeurs par défaut sécurisées
export function safeParseWithDefaults<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context = 'data parsing'
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    logger.warn(`[safeParseWithDefaults] Failed to parse ${context}, using defaults`, {
      error,
      data,
      context
    }, 'SYSTEM');
    
    // Retourner un objet par défaut basé sur le schéma
    try {
      return schema.parse({});
    } catch (defaultError) {
      logger.error(`[safeParseWithDefaults] Even defaults failed for ${context}`, defaultError as Error, 'SYSTEM');
      
      // Dernier recours : objet vide typé
      return {} as T;
    }
  }
}

// Validation sécurisée des props React
export function validateSafeProps<T>(
  props: unknown,
  schema: z.ZodSchema<T>,
  componentName = 'Component'
): T {
  return safeParseWithDefaults(schema, props, `${componentName} props`);
}

// Schéma pour les paramètres de configuration de l'app
export const SafeAppConfigSchema = z.object({
  apiUrl: z.string().url().default(''),
  features: z.object({
    moodMixer: z.boolean().default(true),
    analytics: z.boolean().default(false),
    notifications: z.boolean().default(true),
    darkMode: z.boolean().default(true),
  }).default({}),
  debug: z.boolean().default(false),
  version: z.string().default('1.0.0'),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
});

// Validation des query parameters
export const SafeQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().default(''),
  sort: z.string().default(''),
  order: z.enum(['asc', 'desc']).default('asc'),
  filters: z.record(z.string()).default({}),
});