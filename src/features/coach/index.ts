/**
 * Feature: Coach IA
 * Coaching émotionnel personnalisé avec IA
 */

// ============================================================================
// HOOKS - Re-export depuis le dossier hooks/coach organisé
// ============================================================================
export { useCoach } from '@/hooks/coach/useCoach';
export { useCoachEvents } from '@/hooks/coach/useCoachEvents';
export { useRecommendations } from '@/hooks/coach/useRecommendations';

// Hooks depuis racine
export { useCoachState, useCoachConversations } from '@/hooks/useCoach';
export { useCoachChat } from '@/hooks/useCoachChat';
export { useCoachMemory } from '@/hooks/useCoachMemory';
export { useCoachConversationsEnriched } from '@/hooks/useCoachConversationsEnriched';

// ============================================================================
// CONTEXT
// ============================================================================
export { useUnifiedCoach as useCoachContext } from '@/contexts/coach/UnifiedCoachContext';

// ============================================================================
// COMPONENTS - Re-export from modules
// ============================================================================
export { CoachPage, CoachView, CoachConsent } from '@/modules/coach';

// ============================================================================
// TYPES
// ============================================================================
export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  emotions_detected?: string[];
  techniques_suggested?: string[];
}

export interface CoachSession {
  id: string;
  user_id: string;
  messages: CoachMessage[];
  started_at: string;
  ended_at?: string;
  mood_before?: number;
  mood_after?: number;
  satisfaction?: number;
}

export interface CoachPersonality {
  name: string;
  style: 'empathetic' | 'motivational' | 'analytical' | 'playful';
  voice_tone: string;
  avatar_url?: string;
}

export type CoachMode = 'chat' | 'guided' | 'crisis' | 'reflection';
