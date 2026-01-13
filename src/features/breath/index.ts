/**
 * Feature: Breathing / Respiration
 * Exercices de respiration guidés
 */

// Hooks
export { useBreathwork } from '@/hooks/useBreathwork';
export { useBreathworkStats } from '@/hooks/useBreathworkStats';
export { useBreathPattern } from '@/hooks/useBreathPattern';
export { useBreathMetrics } from '@/hooks/useBreathMetrics';
export { useBreathSessions } from '@/hooks/useBreathSessions';
export { useBreathMic } from '@/hooks/useBreathMic';
export { useBreathExport } from '@/hooks/useBreathExport';

// Store
export { useBreathStore } from '@/store/breath.store';

// Types
export interface BreathPattern {
  id: string;
  name: string;
  description: string;
  inhale_duration: number;
  hold_duration: number;
  exhale_duration: number;
  hold_after_exhale?: number;
  cycles: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

export interface BreathSession {
  id: string;
  user_id: string;
  pattern_id: string;
  started_at: string;
  completed_at?: string;
  cycles_completed: number;
  heart_rate_before?: number;
  heart_rate_after?: number;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
}

export interface BreathMetrics {
  total_sessions: number;
  total_minutes: number;
  avg_session_duration: number;
  favorite_pattern: string;
  streak_days: number;
  best_streak: number;
}

export const DEFAULT_PATTERNS: BreathPattern[] = [
  {
    id: '4-7-8',
    name: 'Relaxation 4-7-8',
    description: 'Technique de relaxation profonde',
    inhale_duration: 4,
    hold_duration: 7,
    exhale_duration: 8,
    cycles: 4,
    difficulty: 'beginner',
    benefits: ['Réduit l\'anxiété', 'Améliore le sommeil']
  },
  {
    id: 'box',
    name: 'Respiration Carrée',
    description: 'Équilibre et concentration',
    inhale_duration: 4,
    hold_duration: 4,
    exhale_duration: 4,
    hold_after_exhale: 4,
    cycles: 6,
    difficulty: 'beginner',
    benefits: ['Calme le mental', 'Améliore la concentration']
  },
  {
    id: 'energizing',
    name: 'Énergisant',
    description: 'Boost d\'énergie rapide',
    inhale_duration: 2,
    hold_duration: 0,
    exhale_duration: 2,
    cycles: 20,
    difficulty: 'intermediate',
    benefits: ['Augmente l\'énergie', 'Stimule l\'éveil']
  }
];
