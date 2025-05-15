
// Fichier d'export centralisé pour tous les types de l'application
// Tous les composants doivent importer leurs types depuis ce fichier

// Exports des types liés au thème
export type {
  Theme,
  FontSize,
  FontFamily,
  ThemeContextType,
  ThemeButtonProps,
  ThemeSwitcherProps
} from './theme';

// Exports des types liés à l'utilisateur
export type {
  User,
  UserRole,
  UserPreferences,
  UserPreferencesState,
  AuthContextType,
  InvitationVerificationResult,
  ThemeName
} from './user';

// Exports des types liés au mode utilisateur
export type {
  UserModeType,
  UserModeContextType
} from './types';

// Exports des types liés à la sidebar
export type {
  SidebarContextType
} from './types';

// Exports des types liés à la musique
export type {
  MusicTrack,
  MusicPlaylist,
  MusicContextType,
  MusicDrawerProps,
  TrackInfoProps,
  ProgressBarProps,
  VolumeControlProps,
  EmotionMusicParams
} from './music';

// Exports des types liés aux notifications
export type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationFrequency,
  NotificationTone,
  NotificationFilter,
  NotificationBadge,
  NotificationPreference,
  NotificationItemProps
} from './notification';

// Exports des types liés à la réalité virtuelle
export type {
  VRSession,
  VRSessionTemplate,
  VRHistoryListProps,
  VRSessionWithMusicProps,
  VRTemplateGridProps,
  VRSessionWithMusicPropsType
} from './vr';

// Exports des types liés aux émotions
export type {
  Emotion,
  EmotionResult,
  EnhancedEmotionResult,
  VoiceEmotionScannerProps,
  LiveVoiceScannerProps,
  EmotionalTeamViewProps,
  TeamOverviewProps
} from './emotion';

// Exports des types liés au dashboard
export type {
  DashboardWidgetConfig,
  DashboardKpi,
  DashboardShortcut,
  ChartData,
  DashboardStats,
  GamificationData
} from './dashboard';

// Exports des types liés à la gamification
export type {
  GamificationStats,
  Badge,
  Challenge,
  Period
} from './gamification';

// Exports des types liés au journal
export type {
  JournalEntry
} from './journal';

// Exports des types liés au player audio
export type {
  UseAudioPlayerStateReturn
} from './audio-player';

// Exports des types liés aux graphiques
export type {
  ChartConfig,
  ChartContextProps
} from './chart';

// Exports des types liés aux activités
export type {
  ActivityTabView,
  ActivityFiltersState,
  AnonymousActivity,
  ActivityStats
} from './activity';

// Exports des types liés au coaching
export type {
  CoachMessage,
  CoachEvent,
  CoachAction,
  EmotionalData,
  EmotionalTrend,
  CoachNotification
} from './coach';

// Types génériques utilisés dans différentes parties de l'application
export interface Story {
  id: string;
  title: string;
  content: string;
  type: string;
  seen: boolean;
  emotion?: string;
  image?: string;
  cta?: {
    label: string;
    route: string;
    text?: string;
    action?: string;
  };
}

export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  mood?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
}

export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
}

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

// Fix for GridPosition in admin components
export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}
