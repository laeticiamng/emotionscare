
import React, { createContext, useState, useContext, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, AudioPlayerState } from '@/types';

// Create a placeholder playlists array to avoid the import error
const playlists: MusicPlaylist[] = [
  {
    id: "playlist-1",
    title: "Détente profonde",
    tracks: [
      {
        id: "track-1",
        title: "Méditation du matin",
        artist: "Nature Sounds",
        duration: 182,
        url: "https://example.com/audio/meditation.mp3",
        cover: "https://example.com/covers/meditation.jpg",
        emotion: "calm"
      },
      {
        id: "track-2",
        title: "Forêt paisible",
        artist: "Ambient Sounds",
        duration: 240,
        url: "https://example.com/audio/forest.mp3",
        cover: "https://example.com/covers/forest.jpg",
        emotion: "peaceful"
      }
    ],
    emotion: "calm",
    description: "Sons apaisants pour la méditation et la relaxation"
  },
  {
    id: "playlist-2",
    title: "Énergie positive",
    tracks: [
      {
        id: "track-3",
        title: "Premier rayon",
        artist: "Morning Light",
        duration: 195,
        url: "https://example.com/audio/sunray.mp3",
        cover: "https://example.com/covers/sunray.jpg",
        emotion: "happy"
      },
      {
        id: "track-4",
        title: "Motivation",
        artist: "Uplift",
        duration: 210,
        url: "https://example.com/audio/motivation.mp3",
        cover: "https://example.com/covers/motivation.jpg",
        emotion: "energetic"
      }
    ],
    emotion: "happy",
    description: "Musique énergisante pour commencer la journée"
  }
];

interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  allPlaylists: MusicPlaylist[];
  audioState: AudioPlayerState;
  setAudioState: (state: Partial<AudioPlayerState>) => void;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  loadPlaylistById: (id: string) => void;
  currentEmotion: string | null;
  setCurrentEmotion: (emotion: string | null) => void;
  previousTrack: () => void;
}

const defaultAudioState: AudioPlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  muted: false,
  buffering: false,
  error: null,
  track: null,
  repeat: 'none',
  shuffle: false,
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [audioState, setAudioState] = useState<AudioPlayerState>(defaultAudioState);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  // Load initial playlists from data
  useEffect(() => {
    // In a real app, you would fetch playlists from an API
    console.log('Playlists loaded:', playlists);
  }, []);

  const updateAudioState = (state: Partial<AudioPlayerState>) => {
    setAudioState(prev => ({ ...prev, ...state }));
  };

  const play = (track?: MusicTrack) => {
    if (track) {
      setCurrentTrack(track);
      updateAudioState({ 
        isPlaying: true, 
        track,
        currentTime: 0,
      });
    } else if (currentTrack) {
      updateAudioState({ isPlaying: true });
    }
  };

  const pause = () => {
    updateAudioState({ isPlaying: false });
  };

  const next = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const tracks = currentPlaylist.tracks;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex < tracks.length - 1) {
      play(tracks[currentIndex + 1]);
    } else if (audioState.repeat === 'all') {
      play(tracks[0]);
    }
  };

  const previous = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const tracks = currentPlaylist.tracks;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex > 0) {
      play(tracks[currentIndex - 1]);
    } else if (audioState.repeat === 'all') {
      play(tracks[tracks.length - 1]);
    }
  };

  const loadPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    if (playlist.tracks.length > 0) {
      play(playlist.tracks[0]);
    }
  };

  const loadPlaylistById = (id: string) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      loadPlaylist(playlist);
    }
  };

  const setVolume = (volume: number) => {
    updateAudioState({ volume });
  };

  const setMuted = (muted: boolean) => {
    updateAudioState({ muted });
  };

  const previousTrack = previous;

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playlist: currentPlaylist,
        allPlaylists: playlists,
        audioState,
        setAudioState: updateAudioState,
        play,
        pause,
        next,
        previous,
        previousTrack,
        loadPlaylist,
        loadPlaylistById,
        setVolume,
        setMuted,
        currentEmotion,
        setCurrentEmotion
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
