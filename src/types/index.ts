
export * from './user';
export * from './theme';
export * from './music';
export * from './gamification';
export * from './emotions';
export * from './auth';
export * from './widgets';
export * from './dashboard';
export * from './sidebar';
export * from './navigation';

export interface EmotionResult {
  emotion: string;
  confidence?: number;
  timestamp?: Date | string;
  id?: string;
  source?: 'text' | 'voice' | 'face' | 'manual';
  score?: number;
  intensity?: number;
  user_id?: string;
  date?: string;
  text?: string;
  feedback?: string;
  transcript?: string;
}

export interface Emotion {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
}

export interface LiveVoiceScannerProps {
  onResult: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: "day" | "week" | "month" | "year";
}

export interface EmotionalTeamViewProps {
  departmentId?: string;
  period?: "day" | "week" | "month" | "year";
}

export type NotificationFrequency = "immediate" | "hourly" | "daily" | "weekly" | "never";
export type NotificationTone = "standard" | "friendly" | "professional" | "minimal";
export type NotificationPreference = {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  types: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement: boolean;
  };
  frequency: NotificationFrequency;
};

export interface Theme {
  id: string;
  name: string;
  value: string;
  preview?: string;
}

export interface VRSessionWithMusicProps {
  sessionId?: string;
  title?: string;
  description?: string;
  duration?: number;
  environment?: string;
  musicTrackId?: string;
}
