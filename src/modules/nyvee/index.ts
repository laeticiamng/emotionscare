/**
 * Nyvee Module - Respiration guidée avec bulle interactive
 */

export { useNyveeMachine } from './useNyveeMachine';
export { nyveeService } from './nyveeService';

// Re-export des composants existants de features
export { BreathingBubble } from '@/features/nyvee/components/BreathingBubble';
export { BadgeReveal } from '@/features/nyvee/components/BadgeReveal';
export { CocoonGallery } from '@/features/nyvee/components/CocoonGallery';
export { PreCheck } from '@/features/nyvee/components/PreCheck';
export { PostCheck } from '@/features/nyvee/components/PostCheck';

// Store
export { useCocoonStore } from '@/features/nyvee/stores/cocoonStore';

export type {
  BreathingIntensity,
  BreathingPhase,
  BadgeType,
  SessionPhase,
  CocoonType,
  BreathingCycleConfig,
  NyveeSession,
  CreateNyveeSession,
  CompleteNyveeSession,
  NyveeStats,
} from './types';
