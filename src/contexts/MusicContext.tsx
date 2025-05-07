import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Track, Playlist } from '@/services/music/types';
import { getPlaylist } from '@/lib/musicService';
import { useToast } from '@/hooks/use-toast';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Playlist | null;
  playlists: Playlist[];
  currentEmotion: string;
  isDrawerOpen: boolean;
  repeat: boolean;
  shuffle: boolean;
  playTrack: (track: Track) => void;
  loadTrack: (track: any) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  loadPlaylistById: (id: string) => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]); 
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Load initial playlist and available playlists
  useEffect(() => {
    loadPlaylistForEmotion('neutral');
    
    // Initialize some default playlists for demo
    const defaultPlaylists: Playlist[] = [
      {
        id: 'calm-playlist',
        name: 'Musique Calme',
        emotion: 'calm',
        tracks: []
      },
      {
        id: 'focus-playlist',
        name: 'Concentration',
        emotion: 'focused',
        tracks: []
      },
      {
        id: 'energy-playlist',
        name: 'Boost d\'Énergie',
        emotion: 'energetic',
        tracks: []
      },
      {
        id: 'relaxation-playlist',
        name: 'Relaxation Profonde',
        emotion: 'calm',
        tracks: []
      }
    ];
    
    setPlaylists(defaultPlaylists);
  }, []);

  // Load a playlist for a specific emotion
  const loadPlaylistForEmotion = async (emotion: string): Promise<void> => {
    try {
      setCurrentEmotion(emotion);
      
      // Here we would normally fetch from API, but for now use mock data
      const mockTracks = [
        {
          id: '1',
          title: 'Méditation Profonde',
          artist: 'Zen Masters',
          album: 'Sérénité',
          duration: 180,
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          cover: 'https://picsum.photos/seed/track1/200',
        },
        {
          id: '2',
          title: 'Voyage Intérieur',
          artist: 'Mindfulness',
          album: 'Voyage',
          duration: 210,
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          cover: 'https://picsum.photos/seed/track2/200',
        },
        {
          id: '3',
          title: 'Relaxation Guidée',
          artist: 'Nature Sounds',
          album: 'Tranquillité',
          duration: 240,
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          cover: 'https://picsum.photos/seed/track3/200',
        }
      ];
      
      const newPlaylist = {
        id: `${emotion}-playlist`,
        name: `Playlist ${emotion}`,
        emotion: emotion,
        tracks: mockTracks
      };
      
      setPlaylist(newPlaylist);
      
      // Auto-play the first track if no track is playing
      if (!currentTrack && mockTracks.length > 0) {
        setCurrentTrack(mockTracks[0]);
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la playlist. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  // Load playlist by ID
  const loadPlaylistById = async (id: string): Promise<void> => {
    const playlist = playlists.find(pl => pl.id === id);
    if (playlist) {
      await loadPlaylistForEmotion(playlist.emotion || 'neutral');
    }
  };
  
  // Load a specific track
  const loadTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  // Play a track
  const playTrack = (track: Track) => {
    if (!audioRef.current) return;
    
    // If trying to play a different track
    if (!currentTrack || track.id !== currentTrack.id) {
      setCurrentTrack(track);
      audioRef.current.src = track.url;
      audioRef.current.load();
    }
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lire ce morceau. Veuillez réessayer.",
            variant: "destructive"
          });
        });
    }
  };
  
  // Pause current track
  const pauseTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Function to get next track (with shuffle support)
  const getNextTrack = (currentTrack: Track, useShuffle: boolean): Track => {
    if (!playlist || playlist.tracks.length === 0) {
      return currentTrack;
    }
    
    if (useShuffle) {
      // Get a random track that's not the current one
      const availableTracks = playlist.tracks.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        return availableTracks[randomIndex];
      }
      return currentTrack;
    } else {
      // Get next track in the playlist
      const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex !== -1 && currentIndex < playlist.tracks.length - 1) {
        return playlist.tracks[currentIndex + 1];
      } else if (repeat && playlist.tracks.length > 0) {
        // Loop back to the beginning if repeat is enabled
        return playlist.tracks[0];
      }
      return currentTrack;
    }
  };
  
  // Function to get previous track
  const getPreviousTrack = (currentTrack: Track, useShuffle: boolean): Track => {
    if (!playlist || playlist.tracks.length === 0) {
      return currentTrack;
    }
    
    if (useShuffle) {
      // Get a random track that's not the current one
      const availableTracks = playlist.tracks.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        return availableTracks[randomIndex];
      }
      return currentTrack;
    } else {
      // Get previous track in the playlist
      const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > 0) {
        return playlist.tracks[currentIndex - 1];
      } else if (repeat && playlist.tracks.length > 0) {
        // Loop to the end if repeat is enabled
        return playlist.tracks[playlist.tracks.length - 1];
      }
      return currentTrack;
    }
  };

  // Play next track
  const nextTrack = () => {
    if (!currentTrack || !playlist) return;
    
    const nextTrackItem = getNextTrack(currentTrack, shuffle);
    playTrack(nextTrackItem);
  };
  
  // Play previous track
  const previousTrack = () => {
    if (!currentTrack || !playlist) return;
    
    const prevTrackItem = getPreviousTrack(currentTrack, shuffle);
    playTrack(prevTrackItem);
  };
  
  // Toggle repeat mode
  const toggleRepeat = () => {
    setRepeat(!repeat);
  };
  
  // Toggle shuffle mode
  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };
  
  // Open the music drawer
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };
  
  // Close the music drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      playlist,
      playlists,
      currentEmotion,
      isDrawerOpen,
      repeat,
      shuffle,
      playTrack,
      loadTrack,
      pauseTrack,
      nextTrack,
      previousTrack,
      setVolume,
      toggleRepeat,
      toggleShuffle,
      loadPlaylistForEmotion,
      loadPlaylistById,
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
