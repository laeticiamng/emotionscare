
import { EmotionResult } from '@/types/emotion';
import { EmotionalTrend } from '@/types/emotional-data';

export interface CoachAction {
  type: string;
  payload: any;
}

export interface CoachState {
  currentEmotion?: EmotionResult | null;
  emotionHistory?: EmotionResult[];
  trends?: EmotionalTrend[];
  recommendations?: any[];
  lastUpdate?: string;
}

export type CoachReducer = (state: CoachState, action: CoachAction) => CoachState;
