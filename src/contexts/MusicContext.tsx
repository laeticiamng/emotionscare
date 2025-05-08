import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Track } from '@/services/music/types';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { convertTrackToMusicTrack, convertMusicTrackToTrack } from '@/services/music/converters';

// Définition de l'interface du contexte
interface MusicContextType {
  currentTrack: Track | MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string | null;
  playlists: MusicPlaylist[];
  playlist: MusicPlaylist | null; // Ajout de playlist
  playTrack: (track: Track | MusicTrack) => void;
  pauseTrack: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  loadPlaylistForEmotion: (emotion: string) => void;
  loadPlaylistById: (id: string) => void; // Ajout de loadPlaylistById
  loadTrack: (track: any) => void; // Ajout de loadTrack
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  openDrawer: () => void;
  closeDrawer: () => void; // Ajout de closeDrawer
  isDrawerOpen: boolean; // Ajout de isDrawerOpen
}

// Création du contexte avec valeur par défaut
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  currentPlaylist: null,
  currentEmotion: null,
  playlists: [],
  playlist: null, // Initialisation de playlist
  playTrack: () => {},
  pauseTrack: () => {},
  setVolume: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  loadPlaylistForEmotion: () => {},
  loadPlaylistById: () => {}, // Initialisation de loadPlaylistById
  loadTrack: () => {}, // Initialisation de loadTrack
  initializeMusicSystem: async () => {},
  error: null,
  openDrawer: () => {},
  closeDrawer: () => {}, // Initialisation de closeDrawer
  isDrawerOpen: false // Initialisation de isDrawerOpen
});

// Hook personnalisé pour utiliser le contexte
export const useMusic = () => useContext(MusicContext);

// Données de démonstration pour les playlists
const DEMO_PLAYLISTS: MusicPlaylist[] = [
  {
    id: 'calm-playlist',
    name: 'Calme et Sérénité',
    emotion: 'calm',
    tracks: [
      {
        id: 'calm-1',
        title: 'Méditation Profonde',
        artist: 'Zen Masters',
        duration: 180,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3',
        coverUrl: 'https://picsum.photos/seed/calm1/200/200',
      },
      {
        id: 'calm-2',
        title: 'Pluie Apaisante',
        artist: 'Nature Sounds',
        duration: 240,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
        coverUrl: 'https://picsum.photos/seed/calm2/200/200',
      }
    ]
  },
  {
    id: 'happy-playlist',
    name: 'Bonheur et Joie',
    emotion: 'happy',
    tracks: [
      {
        id: 'happy-1',
        title: 'Journée Ensoleillée',
        artist: 'Happy Vibes',
        duration: 220,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
        coverUrl: 'https://picsum.photos/seed/happy1/200/200',
      },
      {
        id: 'happy-2',
        title: 'Célébration',
        artist: 'Positive Notes',
        duration: 190,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-happy-dreamy-15.mp3',
        coverUrl: 'https://picsum.photos/seed/happy2/200/200',
      }
    ]
  },
  {
    id: 'focused-playlist',
    name: 'Concentration',
    emotion: 'focused',
    tracks: [
      {
        id: 'focused-1',
        title: 'Deep Work',
        artist: 'Brain Waves',
        duration: 250,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',
        coverUrl: 'https://picsum.photos/seed/focus1/200/200',
      },
      {
        id: 'focused-2',
        title: 'Study Session',
        artist: 'Concentration Masters',
        duration: 265,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-621.mp3',
        coverUrl: 'https://picsum.photos/seed/focus2/200/200',
      }
    ]
  },
  {
    id: 'energetic-playlist',
    name: 'Énergie et Dynamisme',
    emotion: 'energetic',
    tracks: [
      {
        id: 'energetic-1',
        title: 'Power Up',
        artist: 'Energy Boost',
        duration: 180,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3',
        coverUrl: 'https://picsum.photos/seed/energy1/200/200',
      },
      {
        id: 'energetic-2',
        title: 'Workout Mode',
        artist: 'Fitness Beats',
        duration: 195,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3',
        coverUrl: 'https://picsum.photos/seed/energy2/200/200',
      }
    ]
  },
  {
    id: 'neutral-playlist',
    name: 'Ambiance Neutre',
    emotion: 'neutral',
    tracks: [
      {
        id: 'neutral-1',
        title: 'Background Harmony',
        artist: 'Ambient Sounds',
        duration: 230,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
        coverUrl: 'https://picsum.photos/seed/neutral1/200/200',
      },
      {
        id: 'neutral-2',
        title: 'Easy Listening',
        artist: 'Smooth Melodies',
        duration: 210,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-swing-of-things-539.mp3',
        coverUrl: 'https://picsum.photos/seed/neutral2/200/200',
      }
    ]
  },
  {
    id: 'melancholic-playlist',
    name: 'Mélancolie',
    emotion: 'melancholic',
    tracks: [
      {
        id: 'melancholic-1',
        title: 'Souvenirs',
        artist: 'Memory Lane',
        duration: 260,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-within-the-forest-138.mp3',
        coverUrl: 'https://picsum.photos/seed/mel1/200/200',
      },
      {
        id: 'melancholic-2',
        title: 'Réflexions',
        artist: 'Deep Thoughts',
        duration: 280,
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-just-chill-16.mp3',
        coverUrl: 'https://picsum.photos/seed/mel2/200/200',
      }
    ]
  }
];

// Composant Provider
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Ajout de playlist comme alias de currentPlaylist pour compatibilité
  const playlist = currentPlaylist;

  // Initialisation du système musical
  const initializeMusicSystem = useCallback(async () => {
    try {
      console.info('Initializing music system');
      // Dans une vraie application, nous chargerions les playlists depuis une API
      // Pour l'instant, nous utilisons les données de démonstration
      setPlaylists(DEMO_PLAYLISTS);
      return Promise.resolve();
    } catch (err) {
      console.error('Error initializing music system:', err);
      setError('Failed to initialize music system');
      return Promise.reject(err);
    }
  }, []);

  // Effet pour gérer la lecture audio
  useEffect(() => {
    if (!audio) return;

    // Régler le volume
    audio.volume = volume;

    // Gestion des événements audio
    const handleEnd = () => {
      // Passer à la piste suivante si disponible
      nextTrack();
    };

    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('ended', handleEnd);
      audio.pause();
    };
  }, [audio, volume]);

  // Charger une piste audio
  const playTrack = useCallback((track: Track | MusicTrack) => {
    if (!audio) return;

    // Convert track if needed for consistent handling
    const normalizedTrack = 'url' in track ? track : convertTrackToMusicTrack(track as Track);
    
    // Set as current track
    setCurrentTrack(normalizedTrack);
    
    // Set audio source and play
    const audioSrc = 'url' in normalizedTrack ? normalizedTrack.url : normalizedTrack.audioUrl;
    audio.src = audioSrc;
    audio.play().catch(err => console.error('Error playing track:', err));
    setIsPlaying(true);
  }, [audio]);

  // Mettre en pause la lecture
  const pauseTrack = useCallback(() => {
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, [audio]);

  // Charger la playlist pour une émotion donnée
  const loadPlaylistForEmotion = useCallback((emotion: string) => {
    const playlist = playlists.find(p => p.emotion.toLowerCase() === emotion.toLowerCase());
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      setCurrentEmotion(emotion);
      
      // Optionally auto-play the first track
      if (playlist.tracks.length > 0 && !currentTrack) {
        playTrack(playlist.tracks[0]);
      }
    } else {
      console.warn(`No playlist found for emotion: ${emotion}`);
      // Fall back to a default playlist if available
      if (playlists.length > 0) {
        setCurrentPlaylist(playlists[0]);
        setCurrentEmotion(playlists[0].emotion);
      }
    }
  }, [playlists, playTrack, currentTrack]);

  // Ajouter la fonction pour charger une playlist par ID
  const loadPlaylistById = useCallback((id: string) => {
    const playlist = playlists.find(p => p.id === id);
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      setCurrentEmotion(playlist.emotion);
      
      // Optionally auto-play the first track
      if (playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
      }
    } else {
      console.warn(`No playlist found with ID: ${id}`);
    }
  }, [playlists, playTrack]);

  // Ajouter une fonction pour charger une piste spécifique
  const loadTrack = useCallback((track: any) => {
    let normalizedTrack: Track | MusicTrack;
    
    // Normaliser le format de piste si nécessaire
    if ('audioUrl' in track || 'coverUrl' in track) {
      normalizedTrack = track as MusicTrack;
    } else if ('url' in track) {
      normalizedTrack = track as Track;
    } else {
      // Créer une piste avec le minimum de champs requis
      normalizedTrack = {
        id: track.id || `track-${Date.now()}`,
        title: track.title || 'Unknown Track',
        artist: track.artist || 'Unknown Artist',
        duration: track.duration || 0,
        audioUrl: track.url || '',
        coverUrl: track.coverImage || '',
        url: track.url || '',
      } as MusicTrack;
    }
    
    setCurrentTrack(normalizedTrack);
    playTrack(normalizedTrack);
  }, [playTrack]);

  // Passer à la piste suivante
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.tracks.length - 1) {
      // Si c'est la dernière piste ou si la piste actuelle n'est pas trouvée, revenir à la première
      playTrack(currentPlaylist.tracks[0]);
    } else {
      // Sinon, passer à la piste suivante
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  // Passer à la piste précédente
  const previousTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) {
      // Si c'est la première piste ou si la piste actuelle n'est pas trouvée, aller à la dernière
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    } else {
      // Sinon, passer à la piste précédente
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  // Ouvrir le tiroir de musique
  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  // Fermer le tiroir de musique
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // La valeur du contexte
  const contextValue: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    currentPlaylist,
    currentEmotion,
    playlists,
    playlist,
    playTrack,
    pauseTrack,
    setVolume,
    nextTrack,
    previousTrack,
    loadPlaylistForEmotion,
    loadPlaylistById,
    loadTrack,
    initializeMusicSystem,
    error,
    openDrawer,
    closeDrawer,
    isDrawerOpen
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};
