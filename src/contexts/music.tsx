
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types';

const defaultTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Méditation matinale',
    artist: 'SoundHealing',
    duration: 180,
    src: '/sounds/ambient-calm.mp3',
    cover: '/images/calm-cover.jpg',
    emotion: 'calm'
  },
  {
    id: '2',
    title: 'Focus zen',
    artist: 'MindfulAudio',
    duration: 240,
    src: '/sounds/welcome.mp3',
    cover: '/images/focus-cover.jpg',
    emotion: 'focused'
  }
];

const defaultContext: MusicContextType = {
  isPlaying: false,
  currentTrack: null,
  volume: 50,
  playlist: [],
  allTracks: defaultTracks,
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
  createPlaylist: () => {},
  removeFromPlaylist: () => {},
  getTracksByEmotion: () => [],
  progress: 0,
};

const MusicContext = createContext<MusicContextType>(defaultContext);

export const useMusicPlayer = () => useContext(MusicContext);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(50);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [progress, setProgress] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audio.volume = volume / 100;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  React.useEffect(() => {
    if (audioElement && currentTrack) {
      audioElement.src = currentTrack.src;
      
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
  }, [currentTrack, audioElement]);

  React.useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume / 100;
    }
  }, [volume, audioElement]);

  React.useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const stop = () => {
    setIsPlaying(false);
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const setTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);
  };

  const next = () => {
    if (playlist.length === 0 || !currentTrack) return;

    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.length - 1) {
      setTrack(playlist[currentIndex + 1]);
    } else {
      setTrack(playlist[0]); // Loop back to the first track
    }
  };

  const previous = () => {
    if (playlist.length === 0 || !currentTrack) return;

    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      setTrack(playlist[currentIndex - 1]);
    } else {
      setTrack(playlist[playlist.length - 1]); // Loop to the last track
    }
  };

  const addToPlaylist = (track: MusicTrack) => {
    setPlaylist(prevPlaylist => [...prevPlaylist, track]);
  };

  const removeFromPlaylist = (trackId: string) => {
    setPlaylist(prevPlaylist => prevPlaylist.filter(track => track.id !== trackId));
  };

  const createPlaylist = (name: string, tracks: MusicTrack[] = []) => {
    const newPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks
    };
    setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
    return newPlaylist;
  };

  const getTracksByEmotion = (emotion: string): MusicTrack[] => {
    return defaultTracks.filter(track => track.emotion === emotion);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        volume,
        playlist,
        allTracks: defaultTracks,
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
        progress,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
