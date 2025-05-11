
import { useState, useEffect, useCallback } from 'react';
import { Track, Playlist } from '@/services/music/types';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

// Converters to handle type differences
const convertMusicTrackToTrack = (musicTrack: MusicTrack): Track => ({
  id: musicTrack.id,
  title: musicTrack.title,
  artist: musicTrack.artist,
  duration: musicTrack.duration,
  url: musicTrack.audioUrl || musicTrack.audio_url || musicTrack.url || '',
  cover: musicTrack.coverUrl || musicTrack.cover_url || musicTrack.cover,
  emotion: musicTrack.emotion || musicTrack.emotion_tag
});

const convertTrackToMusicTrack = (track: Track): MusicTrack => ({
  id: track.id,
  title: track.title,
  artist: track.artist,
  duration: track.duration,
  audioUrl: track.url || '',
  coverUrl: track.cover || track.coverUrl,
  emotion: track.emotion
});

const convertMusicPlaylistToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => ({
  id: musicPlaylist.id,
  name: musicPlaylist.name || musicPlaylist.title || '',
  emotion: musicPlaylist.emotion,
  tracks: musicPlaylist.tracks.map(convertMusicTrackToTrack)
});

const convertPlaylistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => ({
  id: playlist.id,
  name: playlist.name,
  description: '',
  coverUrl: '',
  emotion: playlist.emotion,
  tracks: playlist.tracks.map(convertTrackToMusicTrack)
});

// Mock playlist data
const EMOTION_PLAYLISTS: Record<string, MusicPlaylist> = {
  calm: {
    id: 'calm-playlist',
    name: 'Calm Music',
    description: 'Relaxing tunes to help you find peace',
    tracks: [
      {
        id: 'calm-1',
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        duration: 180,
        audioUrl: '/audio/calm1.mp3'
      },
      {
        id: 'calm-2',
        title: 'Forest Rain',
        artist: 'Nature Sounds',
        duration: 210,
        audioUrl: '/audio/calm2.mp3'
      }
    ]
  },
  happy: {
    id: 'happy-playlist',
    name: 'Happy Vibes',
    description: 'Upbeat music to boost your mood',
    tracks: [
      {
        id: 'happy-1',
        title: 'Summer Joy',
        artist: 'Good Times',
        duration: 160,
        audioUrl: '/audio/happy1.mp3'
      },
      {
        id: 'happy-2',
        title: 'Celebration',
        artist: 'Party Band',
        duration: 190,
        audioUrl: '/audio/happy2.mp3'
      }
    ]
  },
  neutral: {
    id: 'neutral-playlist',
    name: 'Background Focus',
    description: 'Neutral tunes for focus and concentration',
    tracks: [
      {
        id: 'neutral-1',
        title: 'Deep Focus',
        artist: 'Study Music',
        duration: 220,
        audioUrl: '/audio/neutral1.mp3'
      },
      {
        id: 'neutral-2',
        title: 'Ambient Work',
        artist: 'Productivity',
        duration: 240,
        audioUrl: '/audio/neutral2.mp3'
      }
    ]
  }
};

const getPlaylistByEmotion = (emotion: string): MusicPlaylist | null => {
  const normalizedEmotion = emotion.toLowerCase();
  
  // Direct match
  if (EMOTION_PLAYLISTS[normalizedEmotion]) {
    return EMOTION_PLAYLISTS[normalizedEmotion];
  }
  
  // Map emotional states to playlists
  const emotionMap: Record<string, string> = {
    happy: 'happy',
    joy: 'happy',
    excited: 'happy',
    cheerful: 'happy',
    
    calm: 'calm',
    relaxed: 'calm',
    peaceful: 'calm',
    serene: 'calm',
    
    sad: 'calm',
    melancholy: 'calm',
    
    focused: 'neutral',
    neutral: 'neutral',
    balanced: 'neutral'
  };
  
  const mappedEmotion = emotionMap[normalizedEmotion];
  if (mappedEmotion && EMOTION_PLAYLISTS[mappedEmotion]) {
    return EMOTION_PLAYLISTS[mappedEmotion];
  }
  
  // Default to neutral
  return EMOTION_PLAYLISTS.neutral;
};

export const usePlaylistManager = () => {
  const [playlists, setPlaylists] = useState<Record<string, Playlist>>({});
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialiser les playlists au chargement du hook
  useEffect(() => {
    const convertedPlaylists: Record<string, Playlist> = {};
    
    Object.entries(EMOTION_PLAYLISTS).forEach(([emotion, musicPlaylist]) => {
      convertedPlaylists[emotion] = convertMusicPlaylistToPlaylist(musicPlaylist);
    });
    
    setPlaylists(convertedPlaylists);
  }, []);

  // Obtenir la playlist actuelle
  const getCurrentPlaylist = useCallback(() => {
    if (!currentPlaylistId || !playlists[currentPlaylistId]) return null;
    return playlists[currentPlaylistId];
  }, [currentPlaylistId, playlists]);

  // Charger une playlist pour une émotion spécifique
  const loadPlaylistForEmotion = useCallback((emotion: string) => {
    const normalizedEmotion = emotion.toLowerCase();
    
    if (playlists[normalizedEmotion]) {
      setCurrentPlaylistId(normalizedEmotion);
      return playlists[normalizedEmotion];
    } else if (playlists['neutral']) {
      // Fallback sur la playlist neutre si l'émotion n'existe pas
      setCurrentPlaylistId('neutral');
      toast({
        title: "Playlist indisponible",
        description: `La playlist pour "${emotion}" n'existe pas. Utilisation de la playlist neutre.`,
      });
      return playlists['neutral'];
    } else {
      toast({
        title: "Erreur de musique",
        description: "Impossible de charger une playlist. Veuillez réessayer.",
        variant: "destructive"
      });
      return null;
    }
  }, [playlists, toast]);

  return {
    playlists,
    setPlaylists,
    currentPlaylistId,
    setCurrentPlaylistId,
    getCurrentPlaylist,
    loadPlaylistForEmotion
  };
};

export { EMOTION_PLAYLISTS, getPlaylistByEmotion };
export default usePlaylistManager;
