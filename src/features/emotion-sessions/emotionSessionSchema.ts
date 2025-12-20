import { z } from 'zod';

export const emotionContextTags = [
  'travail',
  'famille',
  'santé',
  'relations',
  'argent',
  'autre',
] as const;

export const emotionInputSchema = z
  .object({
    inputType: z.enum(['text', 'choice']),
    text: z.string().trim().max(500, '500 caractères maximum').optional(),
    selectedEmotion: z.string().optional(),
    intensity: z.number().int().min(1).max(10),
    contextTags: z.array(z.enum(emotionContextTags)).optional().default([]),
  })
  .superRefine((value, ctx) => {
    if (value.inputType === 'text') {
      if (!value.text || value.text.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Décrivez votre ressenti (10 caractères minimum).',
          path: ['text'],
        });
      }
    }

    if (value.inputType === 'choice') {
      if (!value.selectedEmotion) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Sélectionnez une émotion dans la roue.',
          path: ['selectedEmotion'],
        });
      }
    }
  });

export type EmotionSessionInput = z.infer<typeof emotionInputSchema>;

export const detectedEmotionSchema = z.object({
  label: z.string(),
  intensity: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1).optional(),
  valence: z.number().min(-1).max(1).optional(),
});

export const emotionAnalysisSchema = z.object({
  sessionId: z.string().uuid(),
  detectedEmotions: z.array(detectedEmotionSchema),
  primaryEmotion: z.string(),
  valence: z.number().min(-1).max(1),
  arousal: z.number().min(0).max(1),
  summary: z.string().min(1),
  modelVersion: z.string().optional(),
});

export type EmotionAnalysisResult = z.infer<typeof emotionAnalysisSchema>;

export const planRecommendationSchema = z.object({
  type: z.enum(['breathing', 'music', 'light', 'journaling', 'grounding']),
  title: z.string(),
  description: z.string(),
  durationMin: z.number().int().min(1).optional(),
  priority: z.number().int().min(1),
});

export const emotionPlanSchema = z.object({
  planId: z.string().uuid(),
  sessionId: z.string().uuid(),
  recommendations: z.array(planRecommendationSchema).min(3),
  estimatedDurationMin: z.number().int().min(1),
});

export type EmotionPlanResult = z.infer<typeof emotionPlanSchema>;
