
// Ajout des nouveaux types
import { ReactNode } from 'react';

// Emotion types
export interface EmotionResult {
  id: string;
  user_id?: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  date: string;
  emojis: string[];
  recommendations: string[];
}

export interface Story {
  id: string;
  title: string;
  content: string;
  type: 'onboarding' | 'notification' | 'emotion';
  seen: boolean;
  cta?: {
    label: string;
    route: string;
  };
}

export interface UserModeType {
  mode: 'b2c' | 'b2b-user' | 'b2b-admin';
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  tags: string[];
  emotionTarget?: string;
  difficulty?: string;
  benefits?: string[];
  thumbnailUrl?: string;
  category?: string;
  theme?: string;
  completionRate?: number;
  recommendedMood?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  emotion?: string;
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points?: number;
  progress: number;
  goal: number;
  completed?: boolean;
  failed?: boolean;
  category?: string;
  type?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  total?: number;
  status?: 'active' | 'completed' | 'failed';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category?: string;
  level?: number;
  image_url?: string;
  icon?: string;
  unlockedAt?: string | null;
  completed?: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  url?: string;
  cover_url?: string;
  genre?: string;
  emotion?: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
  coverUrl?: string;
  cover?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
  category?: string;
  coverUrl?: string;
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  activeUsersPercent?: number;
  totalBadges?: number;
  badgeLevels?: { level: string; count: number }[];
  leaderboard?: Array<{ userId?: string; username: string; points: number }>;
  progress?: { current: number; target: number };
  completionRate?: number;
  achievements?: Array<{ id: string; name: string; completed: boolean }>;
  lastActivityDate?: string;
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  ariaLabel?: string;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: ReactNode | string;
  onClick?: () => void;
  className?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  } | number;
  status?: 'positive' | 'negative' | 'neutral';
  trendText?: string;
  details?: string;
  period?: string;
  loading?: boolean;
}

export interface ProgressBarProps {
  value?: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume?: number;
  onChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

export interface MusicDrawerProps {
  children?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

export interface LeaderboardEntry {
  userId?: string;
  username: string;
  points: number;
}
