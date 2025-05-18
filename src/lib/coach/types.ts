
/**
 * Coach Types
 * --------------------------------------
 * This file defines types for the AI coach functionality.
 */

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

// AI model configuration
export const AI_MODEL_CONFIG = {
  defaultModel: 'gpt-3.5-turbo',
  advancedModel: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1024,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5,
  coach: {
    defaultPersonality: 'supportive',
    defaultTone: 'encouraging',
    maxContextLength: 10,
    memoryCapacity: 50
  }
};
