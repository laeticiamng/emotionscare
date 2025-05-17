
import React, { createContext, useState, useContext, useCallback } from 'react';
import { AudioTrack, AudioPlayerState, AudioContextValue } from '@/types/audio';

// Initial state
const initialState: AudioPlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  progress: 0,
  duration: 0,
  playlist: [],
  repeatMode: 'off',
  shuffleMode: false,
};

// Create context
export const AudioContext = createContext<AudioContextValue>({
  audioState: initialState,
  play: () => {},
  pause: () => {},
  stop: () => {},
  next: () => {},
  previous: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  seekTo: () => {},
  playTrack: () => {},
  toggleShuffle: () => {},
  changeRepeatMode: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>(initialState);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && audioState.currentTrack) {
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [audioState.currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, volume));
      setAudioState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !audioState.isMuted;
      audioRef.current.muted = newMuted;
      setAudioState(prev => ({ ...prev, isMuted: newMuted }));
    }
  }, [audioState.isMuted]);

  const seekTo = useCallback((position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position;
      setAudioState(prev => ({ ...prev, progress: position }));
    }
  }, []);

  const findTrackIndex = useCallback((track: AudioTrack | null) => {
    if (!track || !audioState.playlist.length) return -1;
    return audioState.playlist.findIndex(t => t.id === track.id);
  }, [audioState.playlist]);

  const next = useCallback(() => {
    if (!audioState.playlist.length) return;
    
    const currentIndex = findTrackIndex(audioState.currentTrack);
    
    if (currentIndex >= 0) {
      let nextIndex: number;
      
      if (audioState.shuffleMode) {
        // Random but not the same as current
        nextIndex = Math.floor(Math.random() * (audioState.playlist.length - 1));
        if (nextIndex >= currentIndex) nextIndex++;
      } else if (currentIndex < audioState.playlist.length - 1) {
        // Next track
        nextIndex = currentIndex + 1;
      } else if (audioState.repeatMode === 'all') {
        // Loop back to beginning
        nextIndex = 0;
      } else {
        // End of playlist and no repeat
        return;
      }
      
      const nextTrack = audioState.playlist[nextIndex];
      playTrack(nextTrack);
    }
  }, [audioState.playlist, audioState.currentTrack, audioState.repeatMode, audioState.shuffleMode]);

  const previous = useCallback(() => {
    if (!audioState.playlist.length) return;
    
    const currentIndex = findTrackIndex(audioState.currentTrack);
    
    if (currentIndex > 0) {
      // Previous track
      const previousTrack = audioState.playlist[currentIndex - 1];
      playTrack(previousTrack);
    } else if (currentIndex === 0 && audioState.repeatMode === 'all') {
      // Loop to end
      const lastTrack = audioState.playlist[audioState.playlist.length - 1];
      playTrack(lastTrack);
    } else {
      // Start current track from beginning
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setAudioState(prev => ({ ...prev, progress: 0 }));
      }
    }
  }, [audioState.playlist, audioState.currentTrack, audioState.repeatMode]);

  const playTrack = useCallback((track: AudioTrack) => {
    if (!track || !track.url) {
      console.error("Cannot play track: Invalid track or missing URL");
      return;
    }
    
    const newUrl = track.url || track.audioUrl;
    
    if (audioRef.current) {
      // Stop current audio
      audioRef.current.pause();
      
      // Set up new audio
      audioRef.current.src = newUrl as string;
      audioRef.current.load();
      
      // Update state with new track
      setAudioState(prev => ({
        ...prev,
        currentTrack: track,
        progress: 0,
        duration: track.duration || 0,
        isPlaying: true
      }));
      
      // Play new track
      audioRef.current.play().catch(error => {
        console.error("Error playing track:", error);
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      });
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setAudioState(prev => ({
      ...prev,
      shuffleMode: !prev.shuffleMode
    }));
  }, []);

  const changeRepeatMode = useCallback(() => {
    setAudioState(prev => {
      const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return {
        ...prev,
        repeatMode: modes[nextIndex]
      };
    });
  }, []);

  return (
    <AudioContext.Provider
      value={{
        audioState,
        play,
        pause,
        stop,
        next,
        previous,
        setVolume,
        toggleMute,
        seekTo,
        playTrack,
        toggleShuffle,
        changeRepeatMode
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
