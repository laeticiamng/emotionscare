import type { ReactNode } from "react";

export interface OnboardingStep {
  id: string;
  title: string;
  content: ReactNode;
  required?: boolean;
}

export interface OnboardingContextType {
  currentStep: number;
  steps: OnboardingStep[];
  nextStep: () => boolean;
  previousStep: () => boolean;
  goToStep: (step: number) => boolean;
  isStepCompleted: (step: number) => boolean;
  completeOnboarding: () => Promise<boolean>;
  loading: boolean;
  emotion: string;
  intensity: number;
  userResponses: Record<string, any>;
  handleResponse: (key: string, value: any) => void;
}
