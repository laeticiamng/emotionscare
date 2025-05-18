
import { ThemeName, FontFamily, FontSize } from './theme';

// Valeur par défaut pour les préférences utilisateur
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'fr',
  notifications_enabled: true,
  email_notifications: false,
  fontFamily: 'system',
  fontSize: 'medium',
  reduceMotion: false,
  soundEnabled: true,
  ambientSound: 'nature',
  colorBlindMode: false,
  autoplayMedia: false,
  privacy: {
    shareActivity: false,
    shareJournal: false,
    publicProfile: false,
    shareData: false,
    anonymizeReports: false,
    profileVisibility: 'private'
  },
  onboardingCompleted: false,
  // Propriétés supplémentaires pour les fonctionnalités premium
  emotionalCamouflage: false,
  aiSuggestions: false,
  // Propriétés pour l'identité
  avatarUrl: '',
  displayName: '',
  pronouns: '',
  biography: '',
};

export interface UserPreferences {
  theme: ThemeName;
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  reduceMotion?: boolean;
  soundEnabled?: boolean;
  dashboardLayout?: Record<string, any>;
  privacy?: {
    shareActivity?: boolean;
    shareJournal?: boolean;
    publicProfile?: boolean;
    shareData?: boolean;
    anonymizeReports?: boolean;
    profileVisibility?: string;
  };
  onboardingCompleted?: boolean;
  ambientSound?: string;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  notifications?: {
    enabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    types?: Record<string, boolean>;
    frequency?: string;
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    inApp?: boolean;
  };
  // Propriétés supplémentaires pour les fonctionnalités premium
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  // Propriétés pour l'identité de l'utilisateur
  avatarUrl?: string;
  displayName?: string;
  pronouns?: string;
  biography?: string;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

// Exporter FontFamily et FontSize pour les composants qui les importent directement
export { FontFamily, FontSize } from './theme';
