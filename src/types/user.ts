
// Updated User type with additional fields
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  avatar_url?: string;
  department?: string; // For UsersTableDemo & UserDetailView
  position?: string; // For UserDetailView
  joined_at?: string; // For UserDetailView
  team_id?: string;
  company_id?: string;
  last_active?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'poppins' | 'roboto' | 'opensans';

// Extended UserPreferences interface with all required fields
export interface UserPreferences {
  theme: ThemeName;
  dynamicTheme: 'none' | 'time' | 'emotion' | 'weather';
  highContrast: boolean;
  reducedAnimations: boolean;
  fontSize: FontSize;
  font: FontFamily;
  customBackground?: string;
  
  // Identity
  displayName?: string;
  pronouns?: 'il' | 'elle' | 'iel' | 'autre';
  biography?: string;
  avatarUrl?: string;
  
  // Accessibility
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioGuidance: boolean;
  
  // Notifications
  notificationsEnabled: boolean;
  notificationTypes: {
    journal: boolean;
    breathing: boolean;
    music: boolean;
  };
  notificationFrequency: string;
  notificationTone: string;
  reminderTime?: string;
  
  // Backwards compatibility
  notifications_enabled?: boolean;
  reminder_time?: string;
  
  // Data
  dataExport: 'pdf' | 'json';
  incognitoMode: boolean;
  lockJournals: boolean;
  
  // Privacy
  privacy?: {
    shareJournal: boolean;
    shareActivity: boolean;
    shareEmotions: boolean;
  };
  
  // Premium features
  emotionalCamouflage: boolean; // For PremiumFeatures
  aiSuggestions: boolean; // For PremiumFeatures
  duoModeEnabled?: boolean;
  trustedContact?: string;
  customPresets: {
    name: string;
    theme: ThemeName;
    audioPreset: string;
  }[];
  
  // Additional features
  autoplayVideos: boolean; // For PreferencesForm
}

// For state management in useUserPreferences
export type UserPreferencesState = UserPreferences;

// Result of invitation verification
export interface InvitationVerificationResult {
  isValid: boolean;
  error?: string;
  invitation?: {
    id: string;
    role: string;
    email: string;
    expires_at: string;
  };
}
