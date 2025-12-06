// @ts-nocheck

/**
 * Coach Types
 * --------------------------------------
 * This file defines types for the AI coach functionality.
 */

import { EmotionResult } from '@/types/emotion';
import { EmotionalTrend } from '@/hooks/coach/types';

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

// Define CoachNotification type for action handlers
export interface CoachNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date | string;
  read?: boolean;
  action?: CoachAction;
}

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
    memoryCapacity: 50,
    model: 'gpt-3.5-turbo',
    max_tokens: 1024
  }
};
