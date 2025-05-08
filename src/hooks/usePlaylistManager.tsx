
import { useState, useEffect, useCallback } from 'react';
import { Track, Playlist } from '@/services/music/types';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { convertMusicTrackToTrack, convertTrackToMusicTrack,
         convertMusicPlaylistToPlaylist, convertPlaylistToMusicPlaylist } from '@/services/music/converters';
import { useToast } from '@/hooks/use-toast';

// Playlists prédéfinies pour les différentes émotions
const EMOTION_PLAYLISTS: Record<string, MusicPlaylist> = {
  happy: {
    id: 'happy-playlist',
    name: 'Playlist Joyeuse',
    emotion: 'happy',
    tracks: [
      {
        id: 'happy-1',
        title: 'Sunshine Melody',
        artist: 'Happy Vibes',
        duration: 180,
        audioUrl: 'https://example.com/happy1.mp3',
        url: 'https://example.com/happy1.mp3',
        coverUrl: 'https://example.com/happy1.jpg'
      },
      {
        id: 'happy-2',
        title: 'Dancing Mood',
        artist: 'Positive Notes',
        duration: 210,
        audioUrl: 'https://example.com/happy2.mp3',
        url: 'https://example.com/happy2.mp3',
        coverUrl: 'https://example.com/happy2.jpg'
      }
    ]
  },
  calm: {
    id: 'calm-playlist',
    name: 'Playlist Apaisante',
    emotion: 'calm',
    tracks: [
      {
        id: 'calm-1',
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        duration: 240,
        audioUrl: 'https://example.com/calm1.mp3',
        url: 'https://example.com/calm1.mp3',
        coverUrl: 'https://example.com/calm1.jpg'
      },
      {
        id: 'calm-2',
        title: 'Forest Serenity',
        artist: 'Relaxation Masters',
        duration: 300,
        audioUrl: 'https://example.com/calm2.mp3',
        url: 'https://example.com/calm2.mp3',
        coverUrl: 'https://example.com/calm2.jpg'
      }
    ]
  },
  focused: {
    id: 'focused-playlist',
    name: 'Playlist Concentration',
    emotion: 'focused',
    tracks: [
      {
        id: 'focused-1',
        title: 'Deep Focus',
        artist: 'Concentration Project',
        duration: 280,
        audioUrl: 'https://example.com/focused1.mp3',
        url: 'https://example.com/focused1.mp3',
        coverUrl: 'https://example.com/focused1.jpg'
      },
      {
        id: 'focused-2',
        title: 'Study Session',
        artist: 'Brain Waves',
        duration: 320,
        audioUrl: 'https://example.com/focused2.mp3',
        url: 'https://example.com/focused2.mp3',
        coverUrl: 'https://example.com/focused2.jpg'
      }
    ]
  },
  energetic: {
    id: 'energetic-playlist',
    name: 'Playlist Énergique',
    emotion: 'energetic',
    tracks: [
      {
        id: 'energetic-1',
        title: 'Power Up',
        artist: 'Energy Boost',
        duration: 190,
        audioUrl: 'https://example.com/energetic1.mp3',
        url: 'https://example.com/energetic1.mp3',
        coverUrl: 'https://example.com/energetic1.jpg'
      },
      {
        id: 'energetic-2',
        title: 'Workout Rhythm',
        artist: 'High Intensity',
        duration: 220,
        audioUrl: 'https://example.com/energetic2.mp3',
        url: 'https://example.com/energetic2.mp3',
        coverUrl: 'https://example.com/energetic2.jpg'
      }
    ]
  },
  neutral: {
    id: 'neutral-playlist',
    name: 'Playlist Neutre',
    emotion: 'neutral',
    tracks: [
      {
        id: 'neutral-1',
        title: 'Ambient Background',
        artist: 'Neutral Tones',
        duration: 240,
        audioUrl: 'https://example.com/neutral1.mp3',
        url: 'https://example.com/neutral1.mp3',
        coverUrl: 'https://example.com/neutral1.jpg'
      },
      {
        id: 'neutral-2',
        title: 'Easy Listening',
        artist: 'Smooth Sounds',
        duration: 260,
        audioUrl: 'https://example.com/neutral2.mp3',
        url: 'https://example.com/neutral2.mp3',
        coverUrl: 'https://example.com/neutral2.jpg'
      }
    ]
  }
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

export default usePlaylistManager;
