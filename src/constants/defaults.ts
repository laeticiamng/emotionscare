
import { UserPreferences } from '@/types/user';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'sans',
  notifications: true,
  notifications_enabled: true,
  sound: true,
  language: 'fr',
  dashboardLayout: 'standard',
  emotionalCamouflage: false,
  aiSuggestions: true,
  onboardingCompleted: false,
  autoplayVideos: false,
  dataCollection: true,
  privacy: {
    showEmotionalScore: true,
    shareJournalInsights: false,
    anonymousDataContribution: true
  }
};

export enum TIME_OF_DAY {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  EVENING = "evening",
  NIGHT = "night"
}
