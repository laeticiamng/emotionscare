
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track, Playlist } from '@/services/music/types';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playlist: Track[];
  recentPlaylists: Playlist[];
  loadPlaylistForEmotion: (emotion: string) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
  loadPlaylist: (playlist: Playlist) => void;
}

const defaultContext: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  playlist: [],
  recentPlaylists: [],
  loadPlaylistForEmotion: () => {},
  setVolume: () => {},
  setProgress: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  togglePlay: () => {},
  loadPlaylist: () => {}
};

const MusicContext = createContext<MusicContextType>(defaultContext);

export const useMusic = () => useContext(MusicContext);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [recentPlaylists, setRecentPlaylists] = useState<Playlist[]>([]);

  // Fonction pour charger une playlist en fonction d'une émotion
  const loadPlaylistForEmotion = (emotion: string) => {
    console.log(`Loading playlist for emotion: ${emotion}`);
    
    // Exemples de playlists pour différentes émotions
    const tracksMap: Record<string, Track[]> = {
      joy: [
        { id: '1', title: 'Happy Day', artist: 'Joy Band', duration: 180, url: '/music/happy-1.mp3', emotion: 'joy' },
        { id: '2', title: 'Sunshine', artist: 'Bright Sounds', duration: 210, url: '/music/happy-2.mp3', emotion: 'joy' }
      ],
      calm: [
        { id: '3', title: 'Peaceful Mind', artist: 'Tranquil Waves', duration: 240, url: '/music/calm-1.mp3', emotion: 'calm' },
        { id: '4', title: 'Gentle Stream', artist: 'Nature Sounds', duration: 300, url: '/music/calm-2.mp3', emotion: 'calm' }
      ],
      sadness: [
        { id: '5', title: 'Rainy Day', artist: 'Melancholy', duration: 190, url: '/music/sad-1.mp3', emotion: 'sadness' },
        { id: '6', title: 'Blue Sky', artist: 'Reflective Mood', duration: 220, url: '/music/sad-2.mp3', emotion: 'sadness' }
      ],
      energy: [
        { id: '7', title: 'Power Up', artist: 'Energy Beats', duration: 160, url: '/music/energy-1.mp3', emotion: 'energy' },
        { id: '8', title: 'Rush Hour', artist: 'Active Mind', duration: 180, url: '/music/energy-2.mp3', emotion: 'energy' }
      ],
      focus: [
        { id: '9', title: 'Deep Work', artist: 'Concentration', duration: 300, url: '/music/focus-1.mp3', emotion: 'focus' },
        { id: '10', title: 'Clear Mind', artist: 'Study Mode', duration: 280, url: '/music/focus-2.mp3', emotion: 'focus' }
      ]
    };
    
    // Émotion par défaut si celle demandée n'existe pas
    const defaultEmotion = 'calm';
    
    // Récupérer les morceaux pour l'émotion demandée ou utiliser la playlist par défaut
    const tracks = tracksMap[emotion.toLowerCase()] || tracksMap[defaultEmotion];
    
    // Créer une nouvelle playlist
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: `Playlist ${emotion}`,
      emotion: emotion.toLowerCase(),
      tracks: tracks
    };
    
    // Mettre à jour les playlists récentes
    setRecentPlaylists(prev => [newPlaylist, ...prev].slice(0, 5));
    
    // Charger la playlist et démarrer la lecture du premier morceau
    setPlaylist(tracks);
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
      setProgress(0);
      setDuration(tracks[0].duration);
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setDuration(track.duration);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  };

  const loadPlaylist = (newPlaylist: Playlist) => {
    setPlaylist(newPlaylist.tracks);
    if (newPlaylist.tracks.length > 0) {
      playTrack(newPlaylist.tracks[0]);
    }
    setRecentPlaylists(prev => [newPlaylist, ...prev.filter(p => p.id !== newPlaylist.id)].slice(0, 5));
  };

  return (
    <MusicContext.Provider 
      value={{ 
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        playlist,
        recentPlaylists,
        loadPlaylistForEmotion,
        setVolume,
        setProgress,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        togglePlay,
        loadPlaylist
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
