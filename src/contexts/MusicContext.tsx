
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track, MusicContextType, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { mockMusicPlaylists } from '@/mocks/musicTracks';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
        setIsLoading(false);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        next();
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (track?: Track) => {
    if (!audioRef.current) return;
    
    if (track && track !== currentTrack) {
      setCurrentTrack(track);
      setIsLoading(true);
      audioRef.current.src = track.url;
      audioRef.current.load();
    }
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      console.error('Error playing audio:', error);
      setIsLoading(false);
    });
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const next = () => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    play(playlist[nextIndex]);
  };

  const previous = () => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    play(playlist[prevIndex]);
  };

  // Implémentation de la fonction loadPlaylistForEmotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trouver une playlist correspondant à l'émotion
      const matchingPlaylist = mockMusicPlaylists.find(
        playlist => playlist.name?.toLowerCase().includes(params.emotion.toLowerCase())
      );
      
      if (matchingPlaylist) {
        setPlaylist(matchingPlaylist.tracks);
        return matchingPlaylist;
      }
      
      // Si aucune playlist spécifique, retourner la première
      if (mockMusicPlaylists.length > 0) {
        setPlaylist(mockMusicPlaylists[0].tracks);
        return mockMusicPlaylists[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoading,
    playlist,
    play,
    pause,
    next,
    previous,
    setVolume,
    setPlaylist,
    loadPlaylistForEmotion,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export { MusicContext };
