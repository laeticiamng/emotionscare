
// Export all types from various modules
export * from './user';
export * from './emotion';
export * from './chat';
export * from './journal';
export * from './mood';
export * from './vr';
export * from './invitation';
export * from './badge';
export * from './audio-player';
export * from './music';
export * from './scan';
export * from './gamification';
export * from './community';
export * from './navigation';
export * from './progress-bar';
export * from './track-info';
export * from './group';
export * from './vr-session-music';

// Basic shared types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type NotificationFrequency = 'daily' | 'weekly' | 'flexible' | 'none';
export type NotificationType = 'minimal' | 'detailed' | 'full';
export type NotificationTone = 'minimalist' | 'poetic' | 'directive' | 'silent';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

// User preferences state that components are looking for
export interface UserPreferencesState extends UserPreferences {
  loading: boolean;
  error: string | null;
  emotionalCamouflage?: boolean;
  notification_frequency?: NotificationFrequency;
  notification_type?: NotificationType;
  notification_tone?: NotificationTone;
  email_notifications?: boolean;
  push_notifications?: boolean;
}

// Add EmotionalTeamViewProps that is needed by EmotionalTeamView component
export interface EmotionalTeamViewProps {
  className?: string;
}

// Make sure MusicContextType is complete
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  getTracksForEmotion: (emotion: string) => Promise<MusicTrack[]>;
  playTrack: (track: MusicTrack) => void;
  play: (track?: MusicTrack) => void;
  pauseTrack: () => void;
  pause: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadingTrack: boolean;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  currentEmotion?: string;
}

// Now let's update any other files with import errors
<lov-write file_path="src/components/scan/live/useMusicRecommendation.tsx">
import { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { EmotionResult, MusicTrack } from '@/types';

export const EMOTION_TO_MUSIC: Record<string, string> = {
  joy: 'upbeat',
  happy: 'upbeat',
  calm: 'ambient',
  relaxed: 'ambient',
  anxious: 'calming',
  stressed: 'calming',
  sad: 'gentle',
  melancholic: 'gentle',
  energetic: 'dance',
  excited: 'dance',
  neutral: 'focus',
};

export function useMusicRecommendation(emotionResult?: EmotionResult) {
  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loadPlaylistForEmotion, playTrack, getTracksForEmotion } = useMusic();
  
  useEffect(() => {
    if (emotionResult?.emotion) {
      loadRecommendations(emotionResult.emotion);
    }
  }, [emotionResult]);
  
  const loadRecommendations = async (emotion: string) => {
    setIsLoading(true);
    try {
      const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
      const playlist = await loadPlaylistForEmotion(musicType);
      setRecommendedTracks(playlist?.tracks || []);
    } catch (error) {
      console.error('Error loading music recommendations:', error);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const playRecommendedTrack = (track: MusicTrack) => {
    if (track) {
      playTrack(track);
    }
  };
  
  const playFirstRecommendation = () => {
    if (recommendedTracks.length > 0) {
      playRecommendedTrack(recommendedTracks[0]);
      return true;
    }
    return false;
  };
  
  const handlePlayMusic = (emotion: string) => {
    const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
    return playFirstRecommendation();
  };
  
  return {
    recommendedTracks,
    isLoading,
    playRecommendedTrack,
    playFirstRecommendation,
    handlePlayMusic,
    EMOTION_TO_MUSIC
  };
}
