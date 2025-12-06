// @ts-nocheck

import { ReactNode } from 'react';

export type OnboardingStepType = 'welcome' | 'info' | 'action' | 'form' | 'quiz' | 'completion';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: OnboardingStepType;
  content?: ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
  };
  form?: {
    fields: {
      id: string;
      label: string;
      type: 'text' | 'email' | 'select' | 'checkbox' | 'radio';
      options?: { value: string; label: string }[];
      required?: boolean;
      placeholder?: string;
    }[];
  };
  quiz?: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
  };
  role?: 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';
  isRequired?: boolean;
  recommendedTime?: number; // in seconds
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  responses: Record<string, any>;
  startedAt?: string;
  completedAt?: string;
  timeSpent?: number; // in seconds
}

export interface OnboardingLog {
  userId: string;
  stepId: string;
  action: 'view' | 'complete' | 'skip' | 'back';
  timestamp: string;
  timeSpent?: number;
  responses?: any;
}
