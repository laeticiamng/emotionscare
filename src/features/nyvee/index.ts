/**
 * Feature: Nyvee
 * Assistant IA émotionnel personnalisé
 */

// Components
export { default as NyveeFlowController } from './NyveeFlowController';

// Re-exports from modules
export { 
  nyveeService,
  useNyveeMachine,
  useNyveeSessions,
  BreathingBubble,
  BadgeReveal,
  useCocoonStore
} from '@/modules/nyvee';

// Re-exports from hooks for compatibility  
export { useNyvee } from '@/hooks/useNyvee';
