
// Music types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  category?: string; // Adding category field
  mood?: string[];
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  coverUrl: string;
  description?: string; // Adding description field
  category?: string; // Adding category field
}

// Leaderboard entry
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  name?: string; // Adding name field
  points: number;
  rank: number;
  avatar?: string;
  department?: string;
  trend: 'up' | 'down' | 'same';
  previousRank: number;
}

// Badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: string;
  progress: number;
  total?: number; // Adding total field
}

// Challenge
export interface Challenge {
  id: string;
  name: string;
  description: string;
  points: number;
  progress: number;
  total: number;
  completed: boolean;
}

// Gamification Stats
export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  streak: number;
  rank: string;
  nextLevelPoints: number;
  progressToNextLevel: number;
  completedChallenges: number;
  totalChallenges: number;
  activeChallenges: number;
  recentAchievements?: Badge[];
  challenges?: Challenge[];
  streakDays?: number;
  badgesCount?: number;
  nextLevel?: {
    points: number;
    rewards: string[];
  };
  lastActivityDate?: string;
  activeUsersPercent?: number; // Adding needed field
  totalBadges?: number; // Adding needed field
  badgeLevels?: { level: string; count: number; }[]; // Adding needed field
  topChallenges?: { name: string; completions: number; }[]; // Adding needed field
}

// User Preferences
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: string;
}

export interface UserPreferences {
  theme: string;
  fontSize: string;
  fontFamily: string;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  soundEnabled: boolean;
  notifications: NotificationPreferences;
  sound?: { // Adding sound field
    volume: number;
    effects: boolean;
    music: boolean;
  };
}

// Music Library Props
export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

// Progress Bar Props
export interface ProgressBarProps {
  value: number;
  max: number;
  currentTime: number;
  duration: number;
  onSeek?: (value: number) => void;
  className?: string;
  showTimestamps?: boolean;
  showLabel?: boolean;
  variant?: string;
}

// Volume Control Props
export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  className?: string;
  onChange?: (value: number) => void;
  showLabel?: boolean;
}

// Music Drawer Props
export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
