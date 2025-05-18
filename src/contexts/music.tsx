
import React, { createContext, useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/music';
import { tracks, playlists } from '@/data/music';

const MusicContext = createContext<MusicContextType>({
  isInitialized: false,
  isPlaying: false,
  currentTrack: null,
  volume: 0.7,
  duration: 0,
  currentTime: 0,
  muted: false,
  playlist: null,
  emotion: null,
  openDrawer: false,
  
  setVolume: () => {},
  setMute: () => {},
  toggleMute: () => {},
  seekTo: () => {},
  togglePlayPause: () => {},
  toggleDrawer: () => {},
  closeDrawer: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: async () => {},
  setPlaylist: () => {},
  generateMusic: async () => {
    return {
      id: '',
      title: '',
      artist: '',
      duration: 0,
      audioUrl: ''
    };
  }
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [audio] = useState(new Audio());

  // Initialize audio
  useEffect(() => {
    const initAudio = () => {
      audio.volume = volume;
      audio.muted = muted;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        nextTrack();
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        nextTrack();
      });
      
      setIsInitialized(true);
    };
    
    initAudio();
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Handle volume change
  useEffect(() => {
    if (isInitialized) {
      audio.volume = volume;
    }
  }, [volume, isInitialized]);
  
  // Handle mute change
  useEffect(() => {
    if (isInitialized) {
      audio.muted = muted;
    }
  }, [muted, isInitialized]);
  
  const setMute = (muted: boolean) => {
    setMuted(muted);
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  const seekTo = (time: number) => {
    if (isInitialized && audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };
  
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  
  const closeDrawer = () => {
    setOpenDrawer(false);
  };
  
  const playTrack = (track: MusicTrack) => {
    if (!track.audioUrl) {
      console.error('Track has no audio URL:', track);
      return;
    }
    
    setCurrentTrack(track);
    audio.src = track.audioUrl;
    audio.play().catch(err => {
      console.error('Error playing track:', err);
    });
    setIsPlaying(true);
  };
  
  const pauseTrack = () => {
    if (isInitialized && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };
  
  const resumeTrack = () => {
    if (isInitialized && !isPlaying && currentTrack) {
      audio.play().catch(err => {
        console.error('Error resuming track:', err);
      });
      setIsPlaying(true);
    } else if (isInitialized && !currentTrack && playlist && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };
  
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) {
      // Either not found or last track, play first
      playTrack(playlist.tracks[0]);
    } else {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };
  
  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) {
      // First track or not found, play last
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };
  
  const setEmotion = (newEmotion: string) => {
    setEmotionState(newEmotion);
    loadPlaylistForEmotion(newEmotion);
  };
  
  const loadPlaylistForEmotion = async (emotion: string): Promise<void> => {
    // Find a matching playlist or create one
    const matchingPlaylist = playlists.find(p => p.emotion === emotion);
    if (matchingPlaylist) {
      setPlaylist(matchingPlaylist);
    } else {
      // Create a new playlist with matching tracks
      const matchingTracks = tracks.filter(t => t.emotion === emotion || t.mood === emotion);
      if (matchingTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `generated-${emotion}-${Date.now()}`,
          name: `${emotion} Mix`,
          description: `Music for ${emotion} mood`,
          tracks: matchingTracks,
          emotion,
          created_at: new Date().toISOString()
        };
        setPlaylist(newPlaylist);
      } else {
        console.warn(`No tracks found for emotion: ${emotion}`);
      }
    }
    
    return Promise.resolve();
  };
  
  const setPlaylist = (newPlaylist: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(newPlaylist)) {
      // Convert track array to playlist
      const playlistFromTracks: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        name: 'Custom Playlist',
        tracks: newPlaylist,
        created_at: new Date().toISOString()
      };
      setPlaylistState(playlistFromTracks);
    } else {
      setPlaylistState(newPlaylist);
    }
  };
  
  const generateMusic = async (prompt: string): Promise<MusicTrack> => {
    // Simulate music generation
    console.log(`Generating music for prompt: ${prompt}`);
    
    // Return mock track
    const mockTrack: MusicTrack = {
      id: `gen-${Date.now()}`,
      title: `Generated - ${prompt.substring(0, 20)}`,
      artist: 'AI Composer',
      duration: 120,
      audioUrl: '/sounds/ambient-calm.mp3',
      coverUrl: '/images/waves.jpg',
      genre: 'ambient',
      emotion: 'calm',
      tags: ['ai', 'generated']
    };
    
    return Promise.resolve(mockTrack);
  };
  
  const value: MusicContextType = {
    isInitialized,
    isPlaying,
    currentTrack,
    volume,
    duration,
    currentTime,
    muted,
    playlist,
    emotion,
    openDrawer,
    
    setVolume,
    setMute,
    toggleMute,
    seekTo,
    togglePlayPause,
    toggleDrawer,
    closeDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    setEmotion,
    loadPlaylistForEmotion,
    setPlaylist,
    generateMusic
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const context = React.useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
