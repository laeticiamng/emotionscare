
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { mockMusicTracks, mockPlaylists } from './mockMusicData';

const defaultContext: MusicContextType = {
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.5,
  muted: false,
  currentTime: 0,
  duration: 0,
  emotion: null,
  openDrawer: false,
  isInitialized: false,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  seekTo: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
  toggleMute: () => {}
};

const MusicContext = createContext<MusicContextType>(defaultContext);

export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Audio element reference
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    // Set up event listeners
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('durationchange', () => setDuration(audio.duration));
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Set initialized flag
    setIsInitialized(true);
    
    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.removeEventListener('durationchange', () => setDuration(audio.duration));
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update audio when currentTrack changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audioUrl = currentTrack.audioUrl || currentTrack.url || currentTrack.src;
      
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        if (isPlaying) {
          audioRef.current.play().catch(handleError);
        }
      }
    }
  }, [currentTrack]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update muted state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  // Handle playback end
  const handleEnded = () => {
    setIsPlaying(false);
    nextTrack();
  };

  // Handle audio errors
  const handleError = (e: Event) => {
    setError(new Error("Error playing audio"));
    setIsPlaying(false);
    console.error("Audio error:", e);
  };

  // Play a track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Pause playback
  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  // Resume playback
  const resumeTrack = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(handleError);
    }
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      if (currentTrack) {
        resumeTrack();
      } else if (playlist && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
      }
    }
  };

  // Play next track
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex >= playlist.tracks.length - 1) {
      // If at the end or not found, play first track
      playTrack(playlist.tracks[0]);
    } else {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  // Play previous track
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // If at the beginning or not found, play last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  // Seek to a specific time
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Load a playlist based on emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // In a real app, this would be an API call
      const emotionPlaylist = mockPlaylists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (emotionPlaylist) {
        setPlaylist(emotionPlaylist);
        
        // If no current track, set the first track
        if (!currentTrack && emotionPlaylist.tracks.length > 0) {
          setCurrentTrack(emotionPlaylist.tracks[0]);
        }
        
        return emotionPlaylist;
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load playlist'));
      return null;
    }
  };

  // Generate AI music (mock implementation)
  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    try {
      // In a real app, this would call an AI music generation API
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Generated Music: ${prompt}`,
        artist: 'AI Composer',
        duration: 180,
        audioUrl: '/audio/generated-music.mp3',
        coverUrl: '/images/generated-music-cover.jpg',
        emotion: prompt.toLowerCase().includes('calm') ? 'calm' : 
                prompt.toLowerCase().includes('happy') ? 'happy' : 'neutral'
      };
      
      return generatedTrack;
    } catch (error) {
      console.error('Error generating music:', error);
      setError(error instanceof Error ? error : new Error('Failed to generate music'));
      return null;
    }
  };

  // Handle playlist setting with array or playlist object
  const setPlaylistHandler = (newPlaylist: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(newPlaylist)) {
      setPlaylist({
        id: `playlist-${Date.now()}`,
        name: 'Custom Playlist',
        tracks: newPlaylist
      });
    } else {
      setPlaylist(newPlaylist);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        volume,
        muted,
        currentTime,
        duration,
        emotion,
        openDrawer,
        isInitialized,
        error,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        previousTrack,
        setVolume,
        seekTo,
        setEmotion,
        loadPlaylistForEmotion,
        setOpenDrawer,
        toggleMute,
        setCurrentTrack,
        setPlaylist: setPlaylistHandler,
        generateMusic
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
