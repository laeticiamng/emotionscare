
import React, { createContext, useState, useEffect, useContext } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { musicTracks, mockPlaylists } from '@/data/musicData';

// Création du contexte avec des valeurs par défaut
const MusicContext = createContext<MusicContextType>({
  // États
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.7,
  isInitialized: false,
  muted: false,
  currentTime: 0,
  duration: 0,
  emotion: null,
  openDrawer: false,
  playlists: [],
  isRepeating: false,
  isShuffled: false,
  queue: [],
  error: null,

  // Actions de base
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  setVolume: () => {},
  setMute: () => {},
  toggleMute: () => {},
  
  // Gestion de playlist
  setPlaylist: () => {},
  setCurrentTrack: () => {},
  loadPlaylistForEmotion: async () => null,
  getRecommendationByEmotion: async () => [],
  
  // UI
  setOpenDrawer: () => {},
  toggleDrawer: () => {},
  closeDrawer: () => {},
  
  // Features avancées
  generateMusic: async () => null,
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  addToQueue: () => {},
  clearQueue: () => {},
  findTracksByMood: () => []
});

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  // États
  const [currentTrack, setCurrentTrackState] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawerState] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(mockPlaylists || []);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);

  // Référence à l'élément audio
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialisation
  useEffect(() => {
    // Créer un élément audio si pas encore fait
    if (!audioRef.current) {
      audioRef.current = new Audio();
      const audio = audioRef.current;
      
      // Configurer les événements audio
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.addEventListener('durationchange', () => setDuration(audio.duration));
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('error', handleAudioError);
      
      // Nettoyer à la fin
      return () => {
        audio.pause();
        audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
        audio.removeEventListener('durationchange', () => setDuration(audio.duration));
        audio.removeEventListener('ended', handleAudioEnded);
        audio.removeEventListener('error', handleAudioError);
      };
    }
    
    setIsInitialized(true);
  }, []);

  // Mettre à jour l'audio quand la piste change
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audioUrl = currentTrack.audioUrl || currentTrack.url || currentTrack.src || '';
      
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        if (isPlaying) {
          audioRef.current.play().catch(handleAudioError);
        }
      }
    }
  }, [currentTrack]);

  // Mettre à jour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Gestion de la fin de lecture
  const handleAudioEnded = () => {
    // Si répétition, rejouer
    if (isRepeating) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(handleAudioError);
      }
    } else {
      // Sinon, passer à la piste suivante
      nextTrack();
    }
  };

  // Gestion des erreurs audio
  const handleAudioError = (e: any) => {
    console.error('Audio error:', e);
    setError(new Error('Erreur de lecture audio'));
    setIsPlaying(false);
  };

  // Méthodes de contrôle de base
  const playTrack = (track: MusicTrack) => {
    setCurrentTrackState(track);
    setIsPlaying(true);
    
    // Si on a l'élément audio, jouer la piste
    if (audioRef.current) {
      const audioUrl = track.audioUrl || track.url || track.src || '';
      
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch(handleAudioError);
      }
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(handleAudioError);
    }
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    } else if (playlist && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex >= playlist.tracks.length - 1) {
      // Si à la fin ou non trouvé, jouer la première piste
      if (playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
      }
    } else {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // Si au début ou non trouvé, jouer la dernière piste
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  // Gestion de playlist
  const setPlaylist = (input: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(input)) {
      setPlaylistState({
        id: `playlist-${Date.now()}`,
        name: 'Custom Playlist',
        tracks: input
      });
    } else {
      setPlaylistState(input);
    }
  };

  const setCurrentTrack = (track: MusicTrack) => {
    setCurrentTrackState(track);
    if (isPlaying) {
      playTrack(track);
    } else {
      // Juste préparer le track sans jouer
      if (audioRef.current) {
        const audioUrl = track.audioUrl || track.url || track.src || '';
        if (audioUrl) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
        }
      }
    }
  };

  // UI
  const setOpenDrawer = (open: boolean) => {
    setOpenDrawerState(open);
  };

  const toggleDrawer = () => {
    setOpenDrawerState(!openDrawer);
  };

  const closeDrawer = () => {
    setOpenDrawerState(false);
  };

  // Features avancées
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const addToQueue = (track: MusicTrack) => {
    setQueue([...queue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const findTracksByMood = (mood: string): MusicTrack[] => {
    return musicTracks.filter(track => 
      (track.mood && track.mood.toLowerCase() === mood.toLowerCase()) ||
      (track.emotion && track.emotion.toLowerCase() === mood.toLowerCase())
    );
  };

  const loadPlaylistForEmotion = async (params: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Chercher une playlist existante pour cette émotion
      const emotionPlaylist = playlists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase() ||
        p.mood?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (emotionPlaylist) {
        setPlaylistState(emotionPlaylist);
        setEmotion(emotionName);
        
        // Si pas de piste courante, définir la première
        if (emotionPlaylist.tracks.length > 0) {
          setCurrentTrackState(emotionPlaylist.tracks[0]);
        }
        
        return emotionPlaylist;
      }
      
      // Si pas trouvé, créer une playlist à partir des pistes avec cette émotion
      const tracksWithEmotion = findTracksByMood(emotionName);
      
      if (tracksWithEmotion.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `emotion-${emotionName}-${Date.now()}`,
          name: `Playlist ${emotionName}`,
          title: `Playlist ${emotionName}`,
          emotion: emotionName,
          tracks: tracksWithEmotion,
          description: `Playlist générée pour l'émotion ${emotionName}`
        };
        
        setPlaylistState(newPlaylist);
        setEmotion(emotionName);
        setCurrentTrackState(tracksWithEmotion[0]);
        
        return newPlaylist;
      }
      
      return null;
    } catch (err) {
      console.error('Error loading playlist for emotion:', err);
      setError(err instanceof Error ? err : new Error('Failed to load playlist'));
      return null;
    }
  };

  const getRecommendationByEmotion = async (params: string | EmotionMusicParams): Promise<MusicPlaylist | MusicTrack[]> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Cette fonction peut être améliorée pour utiliser des données d'API ou une IA
      const tracksForEmotion = findTracksByMood(emotionName);
      
      if (tracksForEmotion.length > 0) {
        return {
          id: `recommendation-${emotionName}-${Date.now()}`,
          name: `Recommandations ${emotionName}`,
          emotion: emotionName,
          tracks: tracksForEmotion
        };
      }
      
      // Fallback sur toutes les pistes si aucune ne correspond
      return mockPlaylists[0] || { id: 'default', name: 'Default Playlist', tracks: musicTracks };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError(error instanceof Error ? error : new Error('Error getting recommendations'));
      return [];
    }
  };

  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    try {
      // Simuler une génération de musique (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Créer une piste générée fictive
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Musique généré: ${prompt.slice(0, 20)}...`,
        artist: 'AI Composer',
        duration: 180,
        audioUrl: '/audio/generated-sample.mp3',
        coverUrl: '/images/covers/generated.jpg',
        album: 'Génération IA',
        year: new Date().getFullYear(),
        tags: ['ia', 'generated', prompt.split(' ')[0]],
        genre: 'Electronic'
      };
      
      return generatedTrack;
    } catch (error) {
      console.error('Error generating music:', error);
      setError(error instanceof Error ? error : new Error('Failed to generate music'));
      return null;
    }
  };

  // Valeur du contexte
  const value: MusicContextType = {
    // États
    currentTrack,
    playlist,
    isPlaying,
    volume,
    isInitialized,
    muted,
    currentTime,
    duration,
    emotion,
    openDrawer,
    playlists,
    isRepeating,
    isShuffled,
    queue,
    error,

    // Actions de base
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    setMute: setMuted,
    toggleMute,
    
    // Gestion de playlist
    setPlaylist,
    setCurrentTrack,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    
    // UI
    setOpenDrawer,
    toggleDrawer,
    closeDrawer,
    
    // Features avancées
    generateMusic,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    clearQueue,
    findTracksByMood
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook d'accès au contexte
export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
