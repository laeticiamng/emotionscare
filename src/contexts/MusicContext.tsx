
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { MusicTrack, MusicPlayerState } from '@/types/music';

interface MusicContextType extends MusicPlayerState {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: MusicTrack[]) => void;
  playTrack: (track: MusicTrack) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerState, setPlayerState] = useState<MusicPlayerState>({
    currentTrack: null,
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser l'élément audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = playerState.volume;
      
      // Gestionnaires d'événements audio
      audioRef.current.addEventListener('loadedmetadata', () => {
        setPlayerState(prev => ({
          ...prev,
          duration: audioRef.current?.duration || 0
        }));
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setPlayerState(prev => ({
          ...prev,
          currentTime: audioRef.current?.currentTime || 0
        }));
      });

      audioRef.current.addEventListener('ended', () => {
        nextTrack();
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('❌ Erreur de lecture audio:', e);
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
      });
    }
  }, []);

  const play = async () => {
    if (audioRef.current && playerState.currentTrack) {
      try {
        await audioRef.current.play();
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
        console.log('▶️ Lecture en cours:', playerState.currentTrack.title);
      } catch (error) {
        console.error('❌ Erreur de lecture:', error);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      console.log('⏸️ Lecture en pause');
    }
  };

  const toggle = () => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setPlayerState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
    }
  };

  const playTrack = (track: MusicTrack) => {
    if (audioRef.current) {
      console.log('🎵 Chargement de la piste:', track.title, 'URL:', track.url);
      audioRef.current.src = track.url || track.audioUrl || '';
      audioRef.current.load();
      
      setPlayerState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: false
      }));
      
      // Auto-play après chargement
      setTimeout(() => {
        play();
      }, 100);
    }
  };

  const setPlaylist = (tracks: MusicTrack[]) => {
    console.log('📋 Nouvelle playlist chargée:', tracks.length, 'morceaux');
    setPlayerState(prev => ({
      ...prev,
      playlist: tracks,
      currentIndex: 0,
      currentTrack: tracks[0] || null
    }));
    
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  const nextTrack = () => {
    const { playlist, currentIndex } = playerState;
    if (playlist.length > 0) {
      const nextIndex = (currentIndex + 1) % playlist.length;
      const nextTrack = playlist[nextIndex];
      
      setPlayerState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        currentTrack: nextTrack
      }));
      
      playTrack(nextTrack);
    }
  };

  const prevTrack = () => {
    const { playlist, currentIndex } = playerState;
    if (playlist.length > 0) {
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
      const prevTrack = playlist[prevIndex];
      
      setPlayerState(prev => ({
        ...prev,
        currentIndex: prevIndex,
        currentTrack: prevTrack
      }));
      
      playTrack(prevTrack);
    }
  };

  const contextValue: MusicContextType = {
    ...playerState,
    play,
    pause,
    toggle,
    nextTrack,
    prevTrack,
    setVolume,
    setPlaylist,
    playTrack
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export { MusicContext };
export default MusicProvider;
