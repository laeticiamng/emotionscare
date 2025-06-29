
import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { MusicTrack } from '@/types/music';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  playlist: MusicTrack[];
  currentIndex: number;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  toggle: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: MusicTrack[]) => void;
  seekTo: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playlist, setPlaylistState] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
      // Essayer de passer au track suivant en cas d'erreur
      if (playlist.length > 1) {
        nextTrack();
      }
    };

    const handleCanPlay = () => {
      console.log('Audio can play, duration:', audio.duration);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
    };
  }, []);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const play = async (track?: MusicTrack) => {
    console.log('🎵 Play called with track:', track);
    
    if (!audioRef.current) return;

    try {
      if (track) {
        console.log('🎵 Loading new track:', track.title, 'URL:', track.url || track.audioUrl);
        setCurrentTrack(track);
        
        const audioUrl = track.url || track.audioUrl;
        if (!audioUrl) {
          console.error('❌ No audio URL found for track:', track);
          return;
        }

        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        // Attendre que l'audio soit prêt avant de jouer
        audioRef.current.addEventListener('canplay', async () => {
          try {
            await audioRef.current!.play();
            setIsPlaying(true);
            console.log('✅ Audio playing successfully');
          } catch (error) {
            console.error('❌ Error playing audio:', error);
            setIsPlaying(false);
          }
        }, { once: true });
        
      } else if (currentTrack) {
        console.log('🎵 Resuming current track');
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('❌ Error in play function:', error);
      setIsPlaying(false);
    }
  };

  const pause = () => {
    console.log('⏸️ Pause called');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    console.log('🔄 Toggle called, isPlaying:', isPlaying);
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      play(nextTrack);
    }
  };

  const prevTrack = () => {
    if (playlist.length === 0) return;

    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      play(prevTrack);
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    setIsMuted(clampedVolume === 0);
  };

  const setPlaylist = (tracks: MusicTrack[]) => {
    console.log('🎵 Setting playlist with', tracks.length, 'tracks');
    setPlaylistState(tracks);
    setCurrentIndex(0);
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        isMuted,
        currentTime,
        duration,
        playlist,
        currentIndex,
        play,
        pause,
        toggle,
        nextTrack,
        prevTrack,
        setVolume,
        setPlaylist,
        seekTo,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export { MusicContext };
export default MusicProvider;
