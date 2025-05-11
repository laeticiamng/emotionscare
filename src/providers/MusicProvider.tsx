
import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Track, Playlist } from '@/types';

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentIndex: number;
  duration: number;
  currentTime: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isShuffled: boolean;
  isRepeating: boolean;
  playlist: Track[];
  playlistId: string | null;
  loadPlaylist: (tracks: Track[], startIndex?: number) => void;
  loadPlaylistById: (id: string, playlist: Playlist) => void;
  playlists: Playlist[];
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  currentPlaylist: Playlist | null;
  initializeMusicSystem: () => Promise<void>;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  currentIndex: -1,
  duration: 0,
  currentTime: 0,
  volume: 0.5,
  isLoading: false,
  error: null,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  setVolume: () => {},
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  isShuffled: false,
  isRepeating: false,
  playlist: [],
  playlistId: null,
  loadPlaylist: () => {},
  loadPlaylistById: () => {},
  playlists: [],
  openDrawer: false,
  setOpenDrawer: () => {},
  currentPlaylist: null,
  initializeMusicSystem: async () => {}
});

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  // Handle time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error("Error replaying track:", err));
      } else {
        nextTrack();
      }
    };

    const handleError = () => {
      setError("Error loading audio file");
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeating]);

  // Load track
  const loadTrack = (track: Track) => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    audioRef.current.src = track.url || '';
    audioRef.current.load();
    setCurrentTrack(track);
  };

  // Play track
  const playTrack = (track: Track) => {
    if (!audioRef.current) return;
    
    // If track is already playing, just return
    if (currentTrack && currentTrack.id === track.id && isPlaying) return;
    
    // If it's the same track but paused, resume playback
    if (currentTrack && currentTrack.id === track.id) {
      resumeTrack();
      return;
    }
    
    // Load and play new track
    loadTrack(track);
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(err => {
        console.error("Error playing track:", err);
        setError("Failed to play audio");
        setIsPlaying(false);
      });
  };

  // Pause track
  const pauseTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Resume track
  const resumeTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(err => {
        console.error("Error resuming playback:", err);
        setError("Failed to resume audio");
      });
  };

  // Seek to time
  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Next track
  const nextTrack = () => {
    if (playlist.length === 0 || currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    playTrack(playlist[nextIndex]);
  };

  // Previous track
  const previousTrack = () => {
    if (playlist.length === 0 || currentIndex === -1) return;
    
    // If current time is more than 3 seconds, restart the track instead
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    playTrack(playlist[prevIndex]);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(prev => !prev);
  };

  // Toggle repeat
  const toggleRepeat = () => {
    setIsRepeating(prev => !prev);
  };

  // Load playlist
  const loadPlaylist = (tracks: Track[], startIndex = 0) => {
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
    if (tracks[startIndex]) {
      playTrack(tracks[startIndex]);
    }
  };

  // Load playlist by ID
  const loadPlaylistById = (id: string, playlist: Playlist) => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) return;
    
    setPlaylistId(id);
    setCurrentPlaylist(playlist);
    loadPlaylist(playlist.tracks, 0);
  };

  // Initialize music system
  const initializeMusicSystem = async () => {
    try {
      // Mock implementation - replace with actual API call to load playlists
      const mockPlaylists: Playlist[] = [
        {
          id: 'relax',
          name: 'Relaxation',
          title: 'Music for Relaxation',
          description: 'Calm and soothing tracks to help you unwind and relax',
          tracks: [
            {
              id: 'track1',
              title: 'Peaceful Morning',
              artist: 'Ambient Dreams',
              duration: 180,
              url: 'https://example.com/track1.mp3',
              coverUrl: 'https://example.com/cover1.jpg'
            },
            {
              id: 'track2',
              title: 'Ocean Waves',
              artist: 'Nature Sounds',
              duration: 240,
              url: 'https://example.com/track2.mp3',
              coverUrl: 'https://example.com/cover2.jpg'
            }
          ]
        },
        {
          id: 'focus',
          name: 'Focus',
          title: 'Focus & Concentration',
          description: 'Music designed to help you concentrate and be productive',
          tracks: [
            {
              id: 'track3',
              title: 'Deep Work',
              artist: 'Productivity Sounds',
              duration: 300,
              url: 'https://example.com/track3.mp3',
              coverUrl: 'https://example.com/cover3.jpg'
            }
          ]
        }
      ];
      
      setPlaylists(mockPlaylists);
      return mockPlaylists;
    } catch (error) {
      console.error("Error initializing music system:", error);
      setError("Failed to initialize music system");
      return [];
    }
  };

  return (
    <MusicContext.Provider 
      value={{ 
        isPlaying,
        currentTrack,
        currentIndex,
        duration,
        currentTime,
        volume,
        isLoading,
        error,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        isShuffled,
        isRepeating,
        playlist,
        playlistId,
        loadPlaylist,
        loadPlaylistById,
        playlists,
        openDrawer,
        setOpenDrawer,
        currentPlaylist,
        initializeMusicSystem
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
