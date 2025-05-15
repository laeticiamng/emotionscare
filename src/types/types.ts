
import { Theme, FontFamily, FontSize } from './theme';
import { Badge } from './gamification';

export type UserModeType = 'personal' | 'professional' | 'team' | 'admin' | 'b2b_admin' | 'b2b-admin';

export interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isAdmin: boolean;
  isTeamLead: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  text?: string;
  mood: string;
  mood_score?: number;
  emotion?: string;
  date: Date | string;
  tags?: string[];
  ai_feedback?: string;
  user_id?: string;
}

export type UserRole = 'admin' | 'user' | 'team_lead' | 'manager' | 'guest' | 
  'b2c' | 'b2b_user' | 'b2b_admin' | 'wellbeing_manager' | 'coach' | 
  'employee' | 'moderator';

export interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  preferences?: UserPreferences;
  team_id?: string;
  teamId?: string;
  avatar?: string;
  avatar_url?: string;
  department?: string;
  department_id?: string;
  position?: string;
  created_at?: string;
  createdAt?: string;
  joined_at?: string;
  onboarded?: boolean;
  emotional_score?: number;
  job_title?: string;
  profile?: {
    bio?: string;
    company?: string;
    job_title?: string;
  };
  company_id?: string;
  last_seen?: string;
  last_active?: string;
  anonymity_code?: string;
}

export interface UserPreferences {
  theme?: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  ambientSound?: boolean;
  notifications?: boolean | {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
    types?: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
    };
    tone?: string;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  language?: string;
  notificationsEnabled?: boolean;
  notifications_enabled?: boolean;
  privacy?: string | {
    shareData?: boolean;
    anonymizeReports?: boolean;
    publicProfile?: boolean;
    anonymousMode?: boolean;
    dataSharing?: boolean;
    profileVisibility?: 'public' | 'team' | 'private';
    showEmotionalScore?: boolean;
    shareJournalInsights?: boolean;
    anonymousDataContribution?: boolean;
    shareEmotionalData?: boolean;
    allowCoaching?: boolean;
  };
  profileVisibility?: 'public' | 'private' | 'team';
  dashboardLayout?: any;
  sound?: boolean;
  soundEnabled?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  timezone?: string;
  musicPreferences?: {
    autoplay: boolean;
    volume: number;
    preferredGenres: string[];
  };
  accessibilityFeatures?: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  reduceMotion?: boolean;
  highContrast?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  onboardingCompleted?: boolean;
  colorAccent?: string;
  incognitoMode?: boolean;
  lockJournals?: boolean;
  dataExport?: 'pdf' | 'json' | 'csv';
  avatarUrl?: string;
  displayName?: string;
  pronouns?: string;
  biography?: string;
  dynamicTheme?: string;
  reducedAnimations?: boolean;
  notificationFrequency?: string;
  notificationTone?: string;
  font?: string;
}

export interface UserPreferencesState {
  theme?: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
}

export interface AuthContextType {
  user: User | null;
  profile?: User;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export interface InvitationVerificationResult {
  valid: boolean;
  expired?: boolean;
  alreadyAccepted?: boolean;
  error?: string;
  invitation?: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
}

export type DashboardLayout = Record<string, {
  x: number;
  y: number;
  w: number;
  h: number;
}>;

export interface NotificationPreferences {
  enabled: boolean;
  email: boolean;
  push: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  categories?: {
    system: boolean;
    activity: boolean;
    social: boolean;
    marketing: boolean;
  };
  frequency: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  threshold?: number;
  type?: string;
  imageUrl?: string;
  image_url?: string; // For backward compatibility
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';

export type { KpiCardProps, DraggableKpiCardsGridProps, GlobalOverviewTabProps, GamificationData } from './dashboard';
export type { GamificationStats, Challenge } from './gamification';
export type { NotificationFilter, NotificationItemProps, NotificationType, NotificationTone, Notification, NotificationPreference, NotificationChannels } from './notification';

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion: string;
  probability: number;
  confidence: number;
  triggers: string[];
  recommendations: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority: number;
  confidence: number;
  actionUrl?: string;
  actionLabel?: string;
  type?: 'activity' | 'content' | 'insight';
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected: number;
  sent: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  teams: Record<string, number>;
  recent_invites: InvitationData[];
}

export interface InvitationData {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  role: string;
}

export interface InvitationFormData {
  email: string;
  role: string;
  message?: string;
  expires_in_days: number;
}
