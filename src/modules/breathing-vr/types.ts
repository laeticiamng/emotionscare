/**
 * Types pour le module breathing-vr
 */

export type BreathingPattern = 'box' | 'calm' | '478' | 'energy' | 'coherence';
export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface BreathingConfig {
  pattern: BreathingPattern;
  inhale: number;
  hold?: number;
  exhale: number;
  rest?: number;
}

export interface BreathingVRState {
  status: 'idle' | 'active' | 'paused' | 'completed';
  config: BreathingConfig | null;
  currentPhase: BreathingPhase;
  phaseProgress: number;
  cyclesCompleted: number;
  totalDuration: number;
  elapsedTime: number;
  vrMode: boolean;
  error: string | null;
}

export interface BreathingSession {
  id: string;
  user_id: string;
  pattern: BreathingPattern;
  duration_seconds: number;
  cycles_completed: number;
  average_pace: number;
  started_at: string;
  completed_at?: string;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
  vr_mode: boolean;
}

export const BREATHING_PATTERNS: Record<BreathingPattern, BreathingConfig> = {
  box: {
    pattern: 'box',
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4
  },
  calm: {
    pattern: 'calm',
    inhale: 4,
    exhale: 6
  },
  '478': {
    pattern: '478',
    inhale: 4,
    hold: 7,
    exhale: 8
  },
  energy: {
    pattern: 'energy',
    inhale: 2,
    hold: 1,
    exhale: 2
  },
  coherence: {
    pattern: 'coherence',
    inhale: 5,
    exhale: 5
  }
};
