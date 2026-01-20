/**
 * Nyvee Module - Respiration guidée avec bulle interactive et personnalisation
 */

// ============================================================================
// SERVICE
// ============================================================================

export { nyveeService, NyveeServiceEnriched } from './nyveeServiceUnified';

// ============================================================================
// HOOKS
// ============================================================================

export { useNyveeMachine } from './useNyveeMachine';
export { useNyveeSessions } from './hooks/useNyveeSessions';

// ============================================================================
// COMPONENTS
// ============================================================================

export { BreathingBubble } from '@/features/nyvee/components/BreathingBubble';
export { BadgeReveal } from '@/features/nyvee/components/BadgeReveal';
export { CocoonGallery } from '@/features/nyvee/components/CocoonGallery';
export { PreCheck } from '@/features/nyvee/components/PreCheck';
export { PostCheck } from '@/features/nyvee/components/PostCheck';
export { NyveeStatsWidget } from '@/features/nyvee/components/NyveeStatsWidget';
export { NyveeSessionHistory } from '@/features/nyvee/components/NyveeSessionHistory';
export { NyveeStreakWidget } from '@/features/nyvee/components/NyveeStreakWidget';
export { IntensitySelector } from '@/features/nyvee/components/IntensitySelector';
export { MoodSlider } from '@/features/nyvee/components/MoodSlider';
export { NyveeExportButton } from '@/features/nyvee/components/NyveeExportButton';
export { AmbientSound } from '@/features/nyvee/components/AmbientSound';
export { ShareSessionButton } from '@/features/nyvee/components/ShareSessionButton';

// ============================================================================
// STORE
// ============================================================================

export { useCocoonStore } from '@/features/nyvee/stores/cocoonStore';

// ============================================================================
// TYPES
// ============================================================================

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

export type {
  EnrichedNyveeSession,
  NarrativeElement,
  CozyEnvironment,
  PersonalizedRecommendation,
  NyveeProgressionStats,
} from './nyveeServiceUnified';
