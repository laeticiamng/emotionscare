
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getPlaylist, convertMusicTrackToTrack } from '@/lib/musicService';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

// Import the Track type that matches musicService.ts definition
import { Track, Playlist } from '@/lib/musicService';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Playlist | null;
  currentEmotion: string;
  isDrawerOpen: boolean;
  repeat: boolean;
  shuffle: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7); // 0 to 1
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );
  const { toast } = useToast();

  // Load initial playlist
  useEffect(() => {
    loadPlaylistForEmotion('neutral');
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (!audio) return;

    // Set volume
    audio.volume = volume;

    // Set up audio event listeners
    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audio, volume]);

  // Update audio source when current track changes
  useEffect(() => {
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.url;
    
    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  }, [audio, currentTrack]);

  // Toggle play/pause when isPlaying changes
  useEffect(() => {
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [audio, isPlaying]);

  const loadPlaylistForEmotion = async (emotion: string) => {
    try {
      const musicPlaylist = await getPlaylist(emotion);
      
      // Convert MusicPlaylist to Playlist
      const convertedPlaylist: Playlist = {
        id: musicPlaylist.id,
        name: musicPlaylist.name,
        emotion: musicPlaylist.emotion,
        tracks: musicPlaylist.tracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          url: track.audioUrl,
          cover: track.coverUrl,
        }))
      };
      
      setPlaylist(convertedPlaylist);
      setCurrentEmotion(emotion);
      
      if (convertedPlaylist.tracks.length > 0) {
        setCurrentTrack(convertedPlaylist.tracks[0]);
      }

      toast({
        title: "Playlist chargée",
        description: `Ambiance "${convertedPlaylist.name}" prête à être écoutée`,
      });
    } catch (error) {
      console.error('Error loading playlist:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la playlist",
        variant: "destructive"
      });
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    let nextIndex;
    
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.tracks.length;
    }
    
    setCurrentTrack(playlist.tracks[nextIndex]);
    setIsPlaying(true);
  };

  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    let prevIndex;
    
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * playlist.tracks.length);
    } else {
      prevIndex = (currentIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
    }
    
    setCurrentTrack(playlist.tracks[prevIndex]);
    setIsPlaying(true);
  };

  const toggleRepeat = () => {
    setRepeat(prev => !prev);
  };

  const toggleShuffle = () => {
    setShuffle(prev => !prev);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      playlist,
      currentEmotion,
      isDrawerOpen,
      repeat,
      shuffle,
      playTrack,
      pauseTrack,
      nextTrack,
      previousTrack,
      setVolume,
      toggleRepeat,
      toggleShuffle,
      loadPlaylistForEmotion,
      openDrawer,
      closeDrawer,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
