
import { useState, useRef, useEffect } from 'react';
import { MusicTrack, MusicPlayerState } from '@/types/music';

export const useMusicControls = (initialTrack?: MusicTrack | null) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<MusicPlayerState>({
    currentTrack: initialTrack || null,
    isPlaying: false,
    volume: 0.7,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    playlist: [],
    currentIndex: 0,
    shuffle: false,
    repeat: 'none'
  });

  useEffect(() => {
    if (state.currentTrack && !audioRef.current) {
      audioRef.current = new Audio(state.currentTrack.url);
      setupAudioListeners();
    }
  }, [state.currentTrack]);

  const setupAudioListeners = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    });

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    });

    audio.addEventListener('ended', handleTrackEnd);
  };

  const handleTrackEnd = () => {
    if (state.repeat === 'one') {
      play();
    } else if (state.repeat === 'all' || state.currentIndex < state.playlist.length - 1) {
      next();
    } else {
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const play = async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  };

  const setVolume = (volume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setState(prev => ({ ...prev, volume: clampedVolume, isMuted: clampedVolume === 0 }));
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMutedState = !state.isMuted;
    audioRef.current.muted = newMutedState;
    setState(prev => ({ ...prev, isMuted: newMutedState }));
  };

  const loadTrack = (track: MusicTrack) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.url;
    } else {
      audioRef.current = new Audio(track.url);
      setupAudioListeners();
    }
    
    setState(prev => ({ 
      ...prev, 
      currentTrack: track, 
      isPlaying: false,
      currentTime: 0,
      duration: 0 
    }));
  };

  const next = () => {
    if (state.playlist.length === 0) return;
    
    let nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.playlist.length) {
      nextIndex = state.repeat === 'all' ? 0 : state.playlist.length - 1;
    }
    
    if (nextIndex !== state.currentIndex) {
      const nextTrack = state.playlist[nextIndex];
      loadTrack(nextTrack);
      setState(prev => ({ ...prev, currentIndex: nextIndex }));
    }
  };

  const previous = () => {
    if (state.playlist.length === 0) return;
    
    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = state.repeat === 'all' ? state.playlist.length - 1 : 0;
    }
    
    if (prevIndex !== state.currentIndex) {
      const prevTrack = state.playlist[prevIndex];
      loadTrack(prevTrack);
      setState(prev => ({ ...prev, currentIndex: prevIndex }));
    }
  };

  const setPlaylist = (playlist: MusicTrack[], startIndex = 0) => {
    setState(prev => ({ 
      ...prev, 
      playlist, 
      currentIndex: startIndex 
    }));
    
    if (playlist.length > 0 && playlist[startIndex]) {
      loadTrack(playlist[startIndex]);
    }
  };

  return {
    ...state,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    loadTrack,
    next,
    previous,
    setPlaylist,
    audioRef
  };
};
