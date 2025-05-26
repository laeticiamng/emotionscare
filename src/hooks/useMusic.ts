
import { useState, useCallback } from 'react';
import { MusicTrack, MusicPlayerState } from '@/types/music';

export interface UseMusicReturn {
  playerState: MusicPlayerState;
  playlist: MusicTrack[];
  addToPlaylist: (track: MusicTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  clearPlaylist: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeat: (mode: 'none' | 'one' | 'all') => void;
}

export const useMusic = (): UseMusicReturn => {
  const [playerState, setPlayerState] = useState<MusicPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    shuffle: false,
    repeat: 'none'
  });

  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);

  const addToPlaylist = useCallback((track: MusicTrack) => {
    setPlaylist(prev => {
      const exists = prev.find(t => t.id === track.id);
      if (exists) return prev;
      return [...prev, track];
    });
  }, []);

  const removeFromPlaylist = useCallback((trackId: string) => {
    setPlaylist(prev => prev.filter(track => track.id !== trackId));
  }, []);

  const clearPlaylist = useCallback(() => {
    setPlaylist([]);
  }, []);

  const playTrack = useCallback((track: MusicTrack) => {
    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0
    }));
  }, []);

  const pauseTrack = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, []);

  const resumeTrack = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: true
    }));
  }, []);

  const stopTrack = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0
    }));
  }, []);

  const nextTrack = useCallback(() => {
    if (playlist.length === 0 || !playerState.currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === playerState.currentTrack?.id);
    let nextIndex;
    
    if (playerState.shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  }, [playlist, playerState.currentTrack, playerState.shuffle, playTrack]);

  const previousTrack = useCallback(() => {
    if (playlist.length === 0 || !playerState.currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === playerState.currentTrack?.id);
    const previousIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const previousTrack = playlist[previousIndex];
    
    if (previousTrack) {
      playTrack(previousTrack);
    }
  }, [playlist, playerState.currentTrack, playTrack]);

  const seekTo = useCallback((time: number) => {
    setPlayerState(prev => ({
      ...prev,
      currentTime: time
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setPlayerState(prev => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isMuted: !prev.isMuted
    }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      shuffle: !prev.shuffle
    }));
  }, []);

  const setRepeat = useCallback((mode: 'none' | 'one' | 'all') => {
    setPlayerState(prev => ({
      ...prev,
      repeat: mode
    }));
  }, []);

  return {
    playerState,
    playlist,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeat
  };
};
