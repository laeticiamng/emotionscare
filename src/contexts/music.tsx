
import React, { createContext, useState, useContext, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/music';

// Sample music data
const sampleTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Calm Waters',
    artist: 'Nature Sounds',
    duration: 180,
    src: '/sounds/ambient-calm.mp3',
    emotion: 'calm'
  },
  {
    id: '2',
    title: 'Peaceful Mind',
    artist: 'Meditation Masters',
    duration: 240,
    src: '/sounds/welcome.mp3',
    emotion: 'relaxed'
  }
];

const samplePlaylists: MusicPlaylist[] = [
  {
    id: 'calm-playlist',
    name: 'Calming Sounds',
    tracks: sampleTracks,
    description: 'Relaxing sounds to calm your mind'
  }
];

// Create the context
export const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  volume: 0.5,
  playlist: [],
  allTracks: [],
  playlists: [],
  play: () => {},
  pause: () => {},
  stop: () => {},
  next: () => {},
  previous: () => {},
  setTrack: () => {},
  setVolume: () => {},
  setPlaylist: () => {},
  togglePlay: () => {},
  addToPlaylist: () => {},
  createPlaylist: () => ({ id: '', name: '', tracks: [] }),
  removeFromPlaylist: () => {},
  getTracksByEmotion: () => [],
  progress: 0
});

// Create a provider component
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [allTracks, setAllTracks] = useState<MusicTrack[]>(sampleTracks);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(samplePlaylists);
  const [progress, setProgress] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update audio source when current track changes
  useEffect(() => {
    if (audioElement && currentTrack) {
      audioElement.src = currentTrack.src;
      if (isPlaying) {
        audioElement.play().catch(err => console.error("Error playing audio:", err));
      }
    }
  }, [currentTrack, audioElement]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(err => console.error("Error playing audio:", err));
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);

  // Update volume when it changes
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  // Track progress
  useEffect(() => {
    if (!audioElement) return;

    const updateProgress = () => {
      if (audioElement.duration > 0) {
        setProgress(audioElement.currentTime / audioElement.duration);
      }
    };

    const handleEnded = () => {
      next();
    };

    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', updateProgress);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement, playlist]);

  // Play function
  const play = () => {
    setIsPlaying(true);
  };

  // Pause function
  const pause = () => {
    setIsPlaying(false);
  };

  // Stop function
  const stop = () => {
    setIsPlaying(false);
    if (audioElement) {
      audioElement.currentTime = 0;
    }
  };

  // Set track function
  const setTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Toggle play/pause function
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Next track function
  const next = () => {
    if (playlist.length === 0 || !currentTrack) return;

    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.length - 1) {
      setCurrentTrack(playlist[currentIndex + 1]);
    } else {
      setCurrentTrack(playlist[0]); // Loop back to the first track
    }
  };

  // Previous track function
  const previous = () => {
    if (playlist.length === 0 || !currentTrack) return;

    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(playlist[currentIndex - 1]);
    } else {
      setCurrentTrack(playlist[playlist.length - 1]); // Loop to the last track
    }
  };

  // Add to playlist function
  const addToPlaylist = (track: MusicTrack) => {
    setPlaylist([...playlist, track]);
  };

  // Create playlist function
  const createPlaylist = (name: string, tracks: MusicTrack[] = []): MusicPlaylist => {
    const newPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks,
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  // Remove from playlist function
  const removeFromPlaylist = (trackId: string) => {
    setPlaylist(playlist.filter(track => track.id !== trackId));
  };

  // Get tracks by emotion
  const getTracksByEmotion = (emotion: string): MusicTrack[] => {
    return allTracks.filter(track => 
      track.emotion && track.emotion.toLowerCase() === emotion.toLowerCase()
    );
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        volume,
        playlist,
        allTracks,
        playlists,
        play,
        pause,
        stop,
        next,
        previous,
        setTrack,
        setVolume,
        setPlaylist,
        togglePlay,
        addToPlaylist,
        createPlaylist,
        removeFromPlaylist,
        getTracksByEmotion,
        progress
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

// Export the useMusic hook
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
