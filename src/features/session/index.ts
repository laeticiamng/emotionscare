/**
 * Feature: Session Management
 * Gestion et persistance des sessions utilisateur
 */

// Persistence
export { 
  persistMusicSession,
  persistFlashGlowSession,
  persistBreathSession,
  persistNyveeSession 
} from './persistSession';
export type { 
  MusicSessionMetadata, 
  PersistMusicSessionInput, 
  FlashGlowSessionMetadata, 
  PersistBreathPayload,
  PersistSessionResult,
  NyveePersistPayload
} from './persistSession';

// Re-exports from hooks for compatibility
export { useSessionHistory } from '@/hooks/useSessionHistory';
export { useSessionClock } from '@/hooks/useSessionClock';
export { useModuleSession } from '@/hooks/useModuleSession';
