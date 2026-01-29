/**
 * Feature: Flash Glow
 * Séances de luminothérapie et exercices de visualisation rapide
 */

// ============================================================================
// HOOKS
// ============================================================================
export { useFlashGlowSession } from './hooks/useFlashGlowSession';

// Re-exports from modules
export {
  useFlashGlowMachine,
  flashGlowService,
  VelvetPulse,
  EndChoice,
  FlashGlowSettingsPanel,
  FlashGlowStatsPanel,
  FlashGlowAchievements,
  FlashGlowSessionHistory,
  type FlashGlowSession,
  type FlashGlowResponse,
  type FlashGlowStats,
  type FlashGlowAchievement,
} from '@/modules/flash-glow';

// Re-exports from modules/flash-lite
export {
  FlashCard,
  FlashLiteMain,
  useFlashLite,
  FlashLiteService,
  ModeSelector,
  FLASH_LITE_MODES,
  type FlashLiteMode,
  type CardDifficulty,
  type FlashCardType,
  type FlashLiteSession,
  type FlashLiteState,
  type FlashLiteConfig,
} from '@/modules/flash-lite';

// ============================================================================
// TYPES
// ============================================================================
export interface FlashGlowPreset {
  id: string;
  name: string;
  description: string;
  color_sequence: string[];
  duration_seconds: number;
  intensity: 'low' | 'medium' | 'high';
  category: 'relaxation' | 'energy' | 'focus' | 'sleep';
  benefits: string[];
}

export interface FlashGlowMetrics {
  total_sessions: number;
  total_minutes: number;
  favorite_preset: string;
  avg_mood_improvement: number;
  streak_days: number;
}

export const FLASH_GLOW_CATEGORIES = [
  'relaxation',
  'energy',
  'focus',
  'sleep',
] as const;

export type FlashGlowCategory = typeof FLASH_GLOW_CATEGORIES[number];
