import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { EmotionResult } from '@/types/emotion';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  emotion: string;
  intensity: number;
  imageUrl?: string;
  isGenerated?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  emotion: string;
  generatedAt: string;
}

export interface EmotionsCareMusicState {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
  isLoading: boolean;
}

export interface EmotionsCareMusicContextType {
  state: EmotionsCareMusicState;
  playTrack: (track: MusicTrack) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  selectTrack: (trackId: string) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeat: (repeat: 'none' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  generateEmotionPlaylist: (emotion: { emotion: string; intensity: number }) => Promise<void>;
  formatTime: (seconds: number) => string;
  getProgressPercentage: () => number;
}

const EmotionsCareMusicContext = createContext<EmotionsCareMusicContextType | undefined>(undefined);

export const EmotionsCareMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<EmotionsCareMusicState>({
    currentTrack: null,
    currentPlaylist: null,
    isPlaying: false,
    volume: 0.8,
    currentTime: 0,
    duration: 0,
    isMuted: false,
    repeat: 'none',
    shuffle: false,
    isLoading: false,
  });

  const playTrack = useCallback(async (track: MusicTrack) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Log listening activity
      if (user) {
        await supabase.functions.invoke('music-analytics', {
          body: { 
            action: 'play_track',
            trackId: track.id,
            userId: user.id,
            emotion: track.emotion
          }
        });
      }

      setState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error playing track:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const stop = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const selectTrack = useCallback((trackId: string) => {
    if (state.currentPlaylist) {
      const track = state.currentPlaylist.tracks.find(t => t.id === trackId);
      if (track) {
        playTrack(track);
      }
    }
  }, [state.currentPlaylist, playTrack]);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const setRepeat = useCallback((repeat: 'none' | 'one' | 'all') => {
    setState(prev => ({ ...prev, repeat }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const generateEmotionPlaylist = useCallback(async ({ emotion, intensity }: { emotion: string; intensity: number }) => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('emotion-music-generation', {
        body: {
          emotion,
          intensity,
          userId: user.id,
        }
      });

      if (error) throw error;

      const playlist: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        name: `Musique pour ${emotion}`,
        tracks: data.tracks || [],
        emotion,
        generatedAt: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        currentPlaylist: playlist,
        isLoading: false,
      }));

      // Auto-play first track
      if (playlist.tracks.length > 0) {
        await playTrack(playlist.tracks[0]);
      }
    } catch (error) {
      console.error('Error generating playlist:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, playTrack]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getProgressPercentage = useCallback(() => {
    return state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
  }, [state.currentTime, state.duration]);

  const contextValue: EmotionsCareMusicContextType = {
    state,
    playTrack,
    pause,
    resume,
    stop,
    selectTrack,
    setVolume,
    toggleMute,
    setRepeat,
    toggleShuffle,
    generateEmotionPlaylist,
    formatTime,
    getProgressPercentage,
  };

  return (
    <EmotionsCareMusicContext.Provider value={contextValue}>
      {children}
    </EmotionsCareMusicContext.Provider>
  );
};

export const useEmotionsCareMusicContext = (): EmotionsCareMusicContextType => {
  const context = useContext(EmotionsCareMusicContext);
  if (!context) {
    throw new Error('useEmotionsCareMusicContext must be used within EmotionsCareMusicProvider');
  }
  return context;
};

export default EmotionsCareMusicProvider;