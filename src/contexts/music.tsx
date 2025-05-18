import React, { createContext, useContext, useState, useRef } from 'react';

// Types et interfaces

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumCover?: string;
  duration: number;
  audioUrl: string;
  type?: string;
  bpm?: number;
  genre?: string;
  mood?: string;
  created_at?: string;  // Pour compatibilité
  updated_at?: string;  // Pour compatibilité
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  tracks: MusicTrack[];
  totalDuration?: number;
  coverImage?: string;
  emotion?: string;
  created_at?: string; // Pour compatibilité
  updated_at?: string; // Pour compatibilité
  createdBy?: string;
}

interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  playPlaylist: (playlist: MusicPlaylist) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
}

const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
  playTrack: () => {},
  playPlaylist: () => {},
  togglePlay: () => {},
  setVolume: () => {},
  seek: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  loadPlaylistForEmotion: () => null,
});

// Provider
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().catch(error => console.error("Playback failed:", error));
    }
  };

  const playPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(error => console.error("Playback failed:", error));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const nextTrack = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex < currentPlaylist.tracks.length - 1) {
        playTrack(currentPlaylist.tracks[currentIndex + 1]);
      } else {
        // Optionally loop back to the start of the playlist
        playTrack(currentPlaylist.tracks[0]);
      }
    }
  };

  const previousTrack = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex > 0) {
        playTrack(currentPlaylist.tracks[currentIndex - 1]);
      } else {
        // Optionally go to the end of the playlist
        playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
      }
    }
  };

  // Fonction pour charger une playlist en fonction d'une émotion
  const loadPlaylistForEmotion = (emotion: string): MusicPlaylist | null => {
    // Trouver la playlist correspondant à l'émotion
    const playlist = mockPlaylists.find(p => p.emotion?.toLowerCase() === emotion.toLowerCase());
    
    if (playlist) {
      setCurrentPlaylist({
        ...playlist,
        created_at: playlist.created_at || new Date().toISOString(),
        updated_at: playlist.updated_at || new Date().toISOString(),
      });
      
      if (playlist.tracks && playlist.tracks.length > 0) {
        setCurrentTrack(playlist.tracks[0]);
      }
      
      return playlist;
    }
    
    return null;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  // Ensemble des valeurs à fournir
  const value = {
    currentTrack,
    currentPlaylist,
    isPlaying,
    volume,
    currentTime,
    duration,
    playTrack,
    playPlaylist,
    togglePlay,
    setVolume,
    seek,
    nextTrack,
    previousTrack,
    loadPlaylistForEmotion,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack ? currentTrack.audioUrl : ""}
        volume={volume}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </MusicContext.Provider>
  );
};

// Mock data pour les playlists
const mockPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-happy",
    title: "Happy Vibes",
    description: "Morceaux joyeux pour améliorer votre humeur",
    emotion: "happy",
    tracks: [
      {
        id: "track-1",
        title: "Walking on Sunshine",
        artist: "Katrina & The Waves",
        duration: 230,
        audioUrl: "/music/walking-on-sunshine.mp3"
      },
      {
        id: "track-2",
        title: "Happy",
        artist: "Pharrell Williams",
        duration: 232,
        audioUrl: "/music/happy.mp3"
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    coverImage: "/images/playlists/happy.jpg"
  },
  {
    id: "playlist-calm",
    title: "Calm & Relax",
    description: "Musique douce pour se détendre",
    emotion: "calm",
    tracks: [
      {
        id: "track-3",
        title: "Weightless",
        artist: "Marconi Union",
        duration: 480,
        audioUrl: "/music/weightless.mp3"
      },
      {
        id: "track-4",
        title: "Nuvole Bianche",
        artist: "Ludovico Einaudi",
        duration: 350,
        audioUrl: "/music/nuvole-bianche.mp3"
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    coverImage: "/images/playlists/calm.jpg"
  }
];

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicProvider");
  }
  return context;
};

export default MusicContext;
