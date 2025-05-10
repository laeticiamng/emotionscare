
// Types for user-related components
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  avatar?: string;
  created_at?: string | Date;
  preferences?: UserPreferences;
  department?: string;
  position?: string;
  last_active?: string | Date;
  status?: 'active' | 'inactive' | 'pending';
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest'
}

export interface UserPreferences {
  // Appearance
  theme: ThemeName;
  dynamicTheme?: DynamicThemeMode;
  highContrast?: boolean;
  reducedAnimations?: boolean;
  fontSize: FontSize;
  font?: FontFamily;
  customBackground?: string;
  
  // Identity
  displayName?: string;
  pronouns?: 'il' | 'elle' | 'iel' | 'autre';
  biography?: string;
  avatarUrl?: string;
  
  // Notifications
  notifications_enabled: boolean;
  notificationTypes?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  notificationFrequency?: NotificationFrequency;
  notificationTone?: NotificationTone;
  reminder_time?: string;
  
  // Language
  language?: string;
  
  // Audio & Sensorial
  ambientSound?: 'none' | 'piano' | 'forest' | 'river' | 'fire' | 'ai';
  adaptiveSound?: boolean;
  
  // Accessibility
  screenReader?: boolean;
  keyboardNavigation?: boolean;
  audioGuidance?: boolean;
  
  // Data
  dataExport?: 'pdf' | 'json';
  incognitoMode?: boolean;
  lockJournals?: boolean;
  
  // Accent colors
  accent_color?: string;
  background_color?: string;
  
  // Premium features
  duoModeEnabled?: boolean;
  trustedContact?: string;
  emotionalCamouflage?: boolean;
}

// Import needed types
import { 
  ThemeName, 
  FontSize, 
  FontFamily, 
  NotificationFrequency, 
  NotificationTone, 
  DynamicThemeMode 
} from './index';
