/**
 * Meditation Module - Méditation guidée avec tracking
 */

export { MeditationMain } from './components/MeditationMain';
export { useMeditation } from './useMeditation';
export { useMeditationMachine } from './useMeditationMachine';
export { meditationService } from './meditationService';

export { MeditationTimer } from './ui/MeditationTimer';
export { TechniqueSelector } from './ui/TechniqueSelector';
export { MeditationProgress } from './ui/MeditationProgress';
export { MeditationStats as MeditationStatsCard } from './ui/MeditationStats';
export { MeditationHistory } from './ui/MeditationHistory';

export type {
  MeditationTechnique,
  MeditationDuration,
  MeditationConfig,
  MeditationSession,
  CreateMeditationSession,
  CompleteMeditationSession,
  MeditationStats,
} from './types';
