// @ts-nocheck
import { create } from 'zustand';

import { createImmutableStore } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5;

export interface ModuleSuggestion {
  id: string;
  title: string;
  deeplink: string;
  reason: string;
}

export interface ProfileDraft {
  language: string;
  theme: 'light' | 'dark' | 'system';
  displayName?: string;
}

export interface GoalsDraft {
  objectives: string[]; // focus, energy, resilience, sleep, ambition
}

export interface SensorsDraft {
  cam: boolean;
  mic: boolean;
  hr: boolean;
  gps: boolean;
  social: boolean;
  nft: boolean;
}

interface OnboardingState {
  // Progress tracking
  currentStep: OnboardingStep;
  completed: boolean;
  flowId?: string;

  // Draft data
  profileDraft?: ProfileDraft;
  goalsDraft?: GoalsDraft;
  sensorsDraft?: SensorsDraft;
  notificationsEnabled: boolean;

  // Suggestions
  moduleSuggestions: ModuleSuggestion[];

  // UI state
  loading: boolean;
  error: string | null;

  // Actions
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCompleted: (completed: boolean) => void;
  setFlowId: (flowId: string) => void;
  setProfileDraft: (profile: ProfileDraft) => void;
  setGoalsDraft: (goals: GoalsDraft) => void;
  setSensorsDraft: (sensors: SensorsDraft) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setModuleSuggestions: (suggestions: ModuleSuggestion[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0 as OnboardingStep,
  completed: false,
  flowId: undefined,
  profileDraft: undefined,
  goalsDraft: undefined,
  sensorsDraft: undefined,
  notificationsEnabled: false,
  moduleSuggestions: [],
  loading: false,
  error: null,
};

const onboardingStoreBase = create<OnboardingState>()(
  createImmutableStore(
    (set, get) => ({
      ...initialState,

      setStep: (currentStep) => set({ currentStep }),

      nextStep: () => {
        const current = get().currentStep;
        if (current < 5) {
          set({ currentStep: (current + 1) as OnboardingStep });
        }
      },

      prevStep: () => {
        const current = get().currentStep;
        if (current > 0) {
          set({ currentStep: (current - 1) as OnboardingStep });
        }
      },

      setCompleted: (completed) => set({ completed }),
      setFlowId: (flowId) => set({ flowId }),
      setProfileDraft: (profileDraft) => set({ profileDraft }),
      setGoalsDraft: (goalsDraft) => set({ goalsDraft }),
      setSensorsDraft: (sensorsDraft) => set({ sensorsDraft }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setModuleSuggestions: (moduleSuggestions) => set({ moduleSuggestions }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      persist: {
        name: 'onboarding-store',
        partialize: (state) => ({
          currentStep: state.currentStep,
          completed: state.completed,
          profileDraft: state.profileDraft,
          goalsDraft: state.goalsDraft,
          sensorsDraft: state.sensorsDraft,
          notificationsEnabled: state.notificationsEnabled,
        }),
      },
    }
  )
);

export const useOnboardingStore = createSelectors(onboardingStoreBase);
