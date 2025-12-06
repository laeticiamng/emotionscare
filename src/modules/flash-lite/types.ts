/**
 * Types pour le module flash-lite
 */

export type FlashLiteMode = 'quick' | 'timed' | 'practice' | 'exam';
export type CardDifficulty = 'easy' | 'medium' | 'hard';

export interface FlashCard {
  id: string;
  session_id: string;
  question: string;
  answer: string;
  user_answer?: string;
  is_correct?: boolean;
  response_time_ms?: number;
  difficulty?: CardDifficulty;
  created_at: string;
}

export interface FlashLiteSession {
  id: string;
  user_id: string;
  mode: FlashLiteMode;
  category?: string;
  cards_total: number;
  cards_completed: number;
  cards_correct: number;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  average_response_time?: number;
  accuracy_percentage?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FlashLiteState {
  status: 'idle' | 'active' | 'paused' | 'completed';
  mode: FlashLiteMode | null;
  currentCardIndex: number;
  cards: FlashCard[];
  startTime: number | null;
  cardStartTime: number | null;
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
  error: string | null;
}

export interface FlashLiteConfig {
  mode: FlashLiteMode;
  category?: string;
  cardsCount: number;
  timeLimit?: number; // en secondes, pour le mode timed
}

export const FLASH_LITE_MODES: Record<FlashLiteMode, { name: string; description: string; icon: string }> = {
  quick: {
    name: 'Rapide',
    description: 'Session courte de 10 cartes',
    icon: '⚡'
  },
  timed: {
    name: 'Chrono',
    description: 'Course contre la montre',
    icon: '⏱️'
  },
  practice: {
    name: 'Entraînement',
    description: 'Session personnalisée',
    icon: '📚'
  },
  exam: {
    name: 'Examen',
    description: 'Mode évaluation',
    icon: '🎯'
  }
};
