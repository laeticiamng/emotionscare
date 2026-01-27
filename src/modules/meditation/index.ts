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
export { GuidedSessionPlayer } from './ui/GuidedSessionPlayer';
export { AmbientSoundMixer } from './ui/AmbientSoundMixer';
export { MeditationSettingsPanel } from './ui/MeditationSettingsPanel';
export { StreakWidget } from './ui/StreakWidget';
export { MeditationCalendar } from './ui/MeditationCalendar';

// Group Meditation
export { GroupMeditationService, groupMeditationService } from './groupMeditationService';
export { useGroupMeditation } from './hooks/useGroupMeditation';
export type {
  GroupSession,
  GroupParticipant,
  GroupSessionState,
  CreateGroupSessionParams,
  JoinGroupSessionParams
} from './groupMeditationService';

export type {
  MeditationTechnique,
  MeditationDuration,
  MeditationConfig,
  MeditationSession,
  CreateMeditationSession,
  CompleteMeditationSession,
  MeditationStats,
} from './types';
