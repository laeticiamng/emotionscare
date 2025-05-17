
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { MusicContextType, MusicPlaylist, MusicTrack } from '@/types/music';
import { mockPlaylists, mockTracks } from '@/data/music';

interface MusicProviderProps {
  children: React.ReactNode;
}

// Initialisation avec les bonnes valeurs
const initialPlaylists: MusicPlaylist[] = [
  {
    id: "default-playlist",
    title: "Default Playlist",
    tracks: []
  }
];

const MusicContext = React.createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(initialPlaylists);
  const [openDrawer, setOpenDrawer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const allTracks = mockTracks;

  useEffect(() => {
    if (!currentPlaylist && playlists.length > 0) {
      setCurrentPlaylist(playlists[0]);
    }
  }, [playlists]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl || currentTrack.trackUrl || '';
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const playPlaylist = useCallback((playlist: MusicPlaylist) => {
    if (playlist.tracks && playlist.tracks.length > 0) {
      setCurrentPlaylist(playlist);
      setCurrentTrack(playlist.tracks[0]);
      setIsPlaying(true);
    }
  }, []);

  const playNext = useCallback(() => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex !== -1 && currentIndex < currentPlaylist.tracks.length - 1) {
        setCurrentTrack(currentPlaylist.tracks[currentIndex + 1]);
      } else {
        setCurrentTrack(currentPlaylist.tracks[0]);
      }
      setIsPlaying(true);
    }
  }, [currentPlaylist, currentTrack]);

  const playPrevious = useCallback(() => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex > 0) {
        setCurrentTrack(currentPlaylist.tracks[currentIndex - 1]);
      } else {
        setCurrentTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
      }
      setIsPlaying(true);
    }
  }, [currentPlaylist, currentTrack]);

  const setVolumeLevel = useCallback((volume: number) => {
    setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // Dans la fonction setPlaylist, ajouter le titre
  const setPlaylist = (newPlaylist: MusicPlaylist | ((prev: MusicPlaylist) => MusicPlaylist)) => {
    if (typeof newPlaylist === 'function') {
      setCurrentPlaylist(newPlaylist);
    } else {
      if (!newPlaylist.title) {
        newPlaylist.title = "Generated Playlist";
      }
      setCurrentPlaylist(newPlaylist);
    }
  };

  const getRecommendedPlaylists = (limit: number = 3): MusicPlaylist[] => {
    return mockPlaylists.slice(0, limit);
  };

  // Dans recommendByEmotion, assurer que la valeur de retour est une playlist complète
  const recommendByEmotion = (emotion: string, intensity: number = 0.5): MusicPlaylist => {
    let mood;
    if (emotion === 'joy') {
      mood = 'happy';
    } else if (emotion === 'sadness') {
      mood = 'sad';
    } else if (emotion === 'anger') {
      mood = 'angry';
    } else {
      mood = 'calm';
    }

    const matchingTracks = allTracks.filter(track => {
      if (mood) {
        return track.mood === mood;
      }
      return true;
    });

    // Retourner une playlist valide
    return {
      id: `${emotion}-${Date.now()}`,
      title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
      tracks: matchingTracks,
      mood: emotion
    };
  };

  const playSimilar = (mood?: string) => {
    if (mood) {
      const similarTracks = allTracks.filter(track => track.mood === mood);
      if (similarTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `similar-${mood}-${Date.now()}`,
          title: `Similar to ${mood}`,
          tracks: similarTracks,
        };
        setPlaylist(newPlaylist);
        playPlaylist(newPlaylist);
      }
    }
  };

  const contextValue: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    duration,
    currentTime,
    playlist: currentPlaylist,
    playlists,
    openDrawer,
    setOpenDrawer,
    playTrack,
    playPlaylist,
    playSimilar,
    playNext,
    playPrevious,
    togglePlay,
    setVolume: setVolumeLevel,
    seekTo,
    recommendByEmotion,
    getRecommendedPlaylists,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current ? audioRef.current.currentTime : 0)}
        onLoadedMetadata={() => setDuration(audioRef.current ? audioRef.current.duration : 0)}
        onEnded={playNext}
      />
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
