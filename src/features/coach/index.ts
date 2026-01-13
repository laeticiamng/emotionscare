/**
 * Feature: Coach IA
 * Coaching émotionnel personnalisé avec IA
 */

// Hooks - re-export depuis le barrel
export { useCoachState, useCoachConversations } from '@/hooks/useCoach';
export { useCoachChat } from '@/hooks/useCoachChat';
export { useCoachMemory } from '@/hooks/useCoachMemory';

// Context
export { useUnifiedCoach as useCoachContext } from '@/contexts/coach/UnifiedCoachContext';

// Types
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
