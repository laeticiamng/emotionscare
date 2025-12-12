/**
 * Module Emotion Scan - Types
 * Types pour le scan émotionnel (texte, voix, image, facial)
 */

import { z } from 'zod';

// ============================================================================
// SCAN MODES
// ============================================================================

export const ScanMode = z.enum(['text', 'voice', 'image', 'facial', 'realtime']);
export type ScanMode = z.infer<typeof ScanMode>;

export const ScanSource = z.enum(['text', 'voice', 'image', 'facial', 'biometric']);
export type ScanSource = z.infer<typeof ScanSource>;

// ============================================================================
// EMOTION DETECTION
// ============================================================================

export const EmotionType = z.enum([
  'happy',
  'sad',
  'angry',
  'fearful',
  'surprised',
  'disgusted',
  'neutral',
  'calm',
  'tired',
  'excited',
  'bored',
  'stressed',
  'anxious',
  'joyful',
  'frustrated',
  'confident',
  'overwhelmed',
  // Extended emotions for richer analysis
  'contempt',
  'confused',
  'curious',
  'amused',
  'focused',
  'determined',
  'enlightened',
  'reflective',
  'disappointed',
  'empathetic',
  'proud',
  'relieved',
  'satisfied'
]);
export type EmotionType = z.infer<typeof EmotionType>;

export const EmotionScore = z.object({
  emotion: EmotionType,
  score: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1).optional()
});
export type EmotionScore = z.infer<typeof EmotionScore>;

export const EmotionVector = z.object({
  valence: z.number().min(-100).max(100), // Negative to Positive
  arousal: z.number().min(0).max(100),    // Low to High energy
  dominance: z.number().min(0).max(100).optional() // Submissive to Dominant
});
export type EmotionVector = z.infer<typeof EmotionVector>;

// ============================================================================
// EMOTION ANALYSIS RESULT
// ============================================================================

export const EmotionResult = z.object({
  id: z.string().uuid(),
  emotion: z.string(), // Primary emotion
  valence: z.number().min(-100).max(100),
  arousal: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  source: ScanSource,
  timestamp: z.string().datetime(),
  summary: z.string().optional(),
  emotions: z.record(z.number()).optional(), // All detected emotions with scores
  metadata: z.record(z.unknown()).optional()
});
export type EmotionResult = z.infer<typeof EmotionResult>;

export const EmotionAnalysisResult = z.object({
  primary_emotion: EmotionType,
  all_emotions: z.array(EmotionScore),
  emotion_vector: EmotionVector,
  confidence: z.number().min(0).max(1),
  timestamp: z.string().datetime(),
  source: ScanSource,
  metadata: z.object({
    duration_ms: z.number().optional(),
    model_version: z.string().optional(),
    processing_time_ms: z.number().optional()
  }).optional()
});
export type EmotionAnalysisResult = z.infer<typeof EmotionAnalysisResult>;

// ============================================================================
// FACIAL ANALYSIS
// ============================================================================

export const FacialLandmarks = z.object({
  eyes: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
  nose: z.object({ x: z.number(), y: z.number() }).optional(),
  mouth: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
  eyebrows: z.array(z.object({ x: z.number(), y: z.number() })).optional()
});
export type FacialLandmarks = z.infer<typeof FacialLandmarks>;

export const FacialAnalysisResult = z.object({
  emotion_scores: z.array(EmotionScore),
  landmarks: FacialLandmarks.optional(),
  face_detected: z.boolean(),
  confidence: z.number().min(0).max(1),
  quality_metrics: z.object({
    brightness: z.number().optional(),
    sharpness: z.number().optional(),
    face_size: z.number().optional()
  }).optional(),
  boundingBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  }).optional()
});
export type FacialAnalysisResult = z.infer<typeof FacialAnalysisResult>;

// ============================================================================
// BIOMETRIC DATA
// ============================================================================

export const BiometricData = z.object({
  heart_rate: z.number().optional(),
  hrv: z.number().optional(),
  skin_conductance: z.number().optional(),
  temperature: z.number().optional(),
  timestamp: z.string().datetime()
});
export type BiometricData = z.infer<typeof BiometricData>;

// ============================================================================
// EMOTION SCAN SESSION
// ============================================================================

export const EmotionScanSession = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  mode: ScanMode,
  started_at: z.string().datetime(),
  ended_at: z.string().datetime().optional(),
  duration_seconds: z.number().optional(),
  results: z.array(EmotionResult),
  biometric_data: z.array(BiometricData).optional(),
  mood_score_before: z.number().int().min(0).max(100).optional(),
  mood_score_after: z.number().int().min(0).max(100).optional(),
  status: z.enum(['active', 'completed', 'cancelled']),
  metadata: z.record(z.unknown()).optional()
});
export type EmotionScanSession = z.infer<typeof EmotionScanSession>;

// ============================================================================
// DATABASE TYPES
// ============================================================================

export const EmotionScanDB = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  payload: z.record(z.unknown()), // JSONB field
  mood_score: z.number().int().min(0).max(100).nullable(),
  created_at: z.string().datetime()
});
export type EmotionScanDB = z.infer<typeof EmotionScanDB>;

export interface CreateEmotionScan {
  user_id: string;
  payload: Record<string, unknown>;
  mood_score?: number | null;
}

export interface UpdateEmotionScan {
  payload?: Record<string, unknown>;
  mood_score?: number | null;
}

// ============================================================================
// EMOTION SCAN CONFIG
// ============================================================================

export const EmotionAnalysisConfig = z.object({
  mode: ScanMode,
  sensitivity: z.number().min(0).max(1).default(0.7),
  sample_rate_ms: z.number().int().positive().default(1000),
  enable_biometric: z.boolean().default(false),
  enable_facial_landmarks: z.boolean().default(false),
  min_confidence: z.number().min(0).max(1).default(0.5),
  language: z.string().default('fr')
});
export type EmotionAnalysisConfig = z.infer<typeof EmotionAnalysisConfig>;

// ============================================================================
// STATISTICS
// ============================================================================

export interface EmotionScanStats {
  user_id: string;
  total_scans: number;
  scans_by_mode: Record<ScanMode, number>;
  most_frequent_emotion: EmotionType;
  average_valence: number;
  average_arousal: number;
  average_confidence: number;
  mood_improvement: number; // Average change in mood score
  last_scan_date: string;
}

export interface EmotionTrend {
  date: string;
  emotion: EmotionType;
  count: number;
  average_confidence: number;
}

// ============================================================================
// REALTIME SCAN
// ============================================================================

export interface RealtimeScanState {
  isActive: boolean;
  currentEmotion: EmotionType | null;
  emotionHistory: EmotionResult[];
  fps: number;
  latency_ms: number;
}

// ============================================================================
// PERMISSIONS
// ============================================================================

export interface ScanPermissions {
  camera: boolean;
  microphone: boolean;
  notifications: boolean;
}
