
// Updated User type with additional fields
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | 'user' | 'manager';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  avatar_url?: string;
  avatar?: string; // Added for backward compatibility
  department?: string;
  position?: string;
  joined_at?: string;
  created_at?: string; // Added for backward compatibility
  team_id?: string;
  company_id?: string;
  last_active?: string;
  status?: 'active' | 'inactive' | 'pending';
  onboarded?: boolean;
  preferences?: UserPreferences;
  emotional_score?: number;
  anonymity_code?: string;
}

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'poppins' | 'roboto' | 'opensans';

// Extended UserPreferences interface with all required fields
export interface UserPreferences {
  theme: ThemeName;
  dynamicTheme?: 'none' | 'time' | 'emotion' | 'weather';
  highContrast?: boolean;
  reducedAnimations?: boolean;
  fontSize: FontSize;
  font: FontFamily;
  customBackground?: string;
  
  // Identity
  displayName?: string;
  pronouns?: 'il' | 'elle' | 'iel' | 'autre';
  biography?: string;
  avatarUrl?: string;
  
  // Accessibility
  screenReader?: boolean;
  keyboardNavigation?: boolean;
  audioGuidance?: boolean;
  
  // Notifications
  notificationsEnabled?: boolean;
  notifications_enabled?: boolean; // For backward compatibility
  notificationTypes?: {
    journal?: boolean;
    breathing?: boolean;
    music?: boolean;
  };
  // Added notifications for backward compatibility
  notifications?: {
    enabled: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
  };
  notificationFrequency?: string;
  notificationTone?: string;
  reminderTime?: string;
  reminder_time?: string;
  
  // Privacy options
  privacy?: {
    shareJournal?: boolean;
    shareActivity?: boolean;
    shareEmotions?: boolean;
    profileVisibility?: 'public' | 'private' | 'team';
  };
  
  // Data
  dataExport?: 'pdf' | 'json';
  incognitoMode?: boolean;
  lockJournals?: boolean;
  
  // Premium features
  emotionalCamouflage?: boolean; // For PremiumFeatures
  aiSuggestions?: boolean; // For PremiumFeatures
  duoModeEnabled?: boolean;
  trustedContact?: string;
  customPresets?: {
    name: string;
    theme: ThemeName;
    audioPreset: string;
  }[];
  
  // Additional features
  autoplayVideos?: boolean; // For PreferencesForm
  dataCollection?: boolean; // For PreferencesForm
  language?: string; // For language preference
  onboardingCompleted?: boolean; // For completed onboarding
  dashboardLayout?: string; // For dashboard layout preference
}
