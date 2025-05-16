
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
  emotion?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
}

interface EmotionMusicParams {
  emotion: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  playlist: Playlist | null;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<Playlist | null>;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  setVolume: (volume: number) => void;
  setOpenDrawer?: (open: boolean) => void;
  togglePlay: () => void;
  adjustVolume?: (delta: number) => void;
}

// Create context
const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  volume: 0.5,
  playlist: null,
  loadPlaylistForEmotion: async () => null,
  playTrack: () => {},
  pauseTrack: () => {},
  skipToNext: () => {},
  skipToPrevious: () => {},
  setVolume: () => {},
  togglePlay: () => {},
});

// Mock data for emotions and tracks
const mockPlaylists: Record<string, Playlist> = {
  calm: {
    id: 'calm-playlist',
    name: 'Musique Apaisante',
    emotion: 'calm',
    tracks: [
      {
        id: 'calm-1',
        title: 'Méditation Matinale',
        artist: 'Nature Sounds',
        url: '/sounds/ambient-calm.mp3',
        emotion: 'calm',
        duration: 180
      },
      {
        id: 'calm-2',
        title: 'Océan Tranquille',
        artist: 'Ocean Waves',
        url: '/sounds/ambient-calm-2.mp3',
        emotion: 'calm',
        duration: 210
      }
    ]
  },
  focus: {
    id: 'focus-playlist',
    name: 'Concentration Profonde',
    emotion: 'focus',
    tracks: [
      {
        id: 'focus-1',
        title: 'Deep Focus',
        artist: 'Brain Waves',
        url: '/sounds/focus-1.mp3',
        emotion: 'focus',
        duration: 240
      },
      {
        id: 'focus-2',
        title: 'Clarity',
        artist: 'Mind Space',
        url: '/sounds/focus-2.mp3',
        emotion: 'focus',
        duration: 220
      }
    ]
  },
  energetic: {
    id: 'energetic-playlist',
    name: 'Énergie Positive',
    emotion: 'energetic',
    tracks: [
      {
        id: 'energetic-1',
        title: 'Morning Boost',
        artist: 'Energy Flow',
        url: '/sounds/energetic-1.mp3',
        emotion: 'energetic',
        duration: 195
      },
      {
        id: 'energetic-2',
        title: 'Rise Up',
        artist: 'Motivate',
        url: '/sounds/energetic-2.mp3',
        emotion: 'energetic',
        duration: 185
      }
    ]
  }
};

// Create provider component
export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    setAudioElement(audio);
    audio.volume = volume;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update audio element when currentTrack changes
  useEffect(() => {
    if (audioElement && currentTrack) {
      audioElement.src = currentTrack.url;
      if (isPlaying) {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error('Erreur lors de la lecture de la piste:', err);
          });
        }
      }
    }
  }, [currentTrack, audioElement]);

  // Update audio element when volume changes
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  // Function to load a playlist based on an emotion
  const loadPlaylistForEmotion = async ({ emotion }: EmotionMusicParams): Promise<Playlist | null> => {
    // In a real app, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const playlist = mockPlaylists[emotion] || mockPlaylists.calm;
        setPlaylist(playlist);
        resolve(playlist);
      }, 500);
    });
  };

  // Function to play a specific track
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Function to pause the current track
  const pauseTrack = () => {
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
  };

  // Function to toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      // Resume current track
      if (audioElement) {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error('Erreur lors de la lecture de la piste:', err);
          });
        }
      }
      setIsPlaying(true);
    } else if (playlist && playlist.tracks.length > 0) {
      // Start playing the first track if nothing is currently playing
      playTrack(playlist.tracks[0]);
    }
  };

  // Function to skip to the next track
  const skipToNext = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else {
      // Loop back to the first track
      playTrack(playlist.tracks[0]);
    }
  };

  // Function to skip to the previous track
  const skipToPrevious = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else {
      // Loop to the last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };

  // Function to adjust volume (increase/decrease by delta)
  const adjustVolume = (delta: number) => {
    setVolume(prev => {
      const newVolume = Math.min(Math.max(prev + delta, 0), 1);
      return newVolume;
    });
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        volume,
        playlist,
        loadPlaylistForEmotion,
        playTrack,
        pauseTrack,
        skipToNext,
        skipToPrevious,
        setVolume,
        setOpenDrawer,
        togglePlay,
        adjustVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

// Create custom hook
export const useMusic = () => useContext(MusicContext);

export default MusicContext;
