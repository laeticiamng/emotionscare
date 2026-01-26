// @ts-nocheck

/**
 * MOCK DATA
 * Ce fichier respecte strictement les types officiels MusicTrack et MusicPlaylist
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { MusicPlaylist } from '@/types/music';

// Données de playlists pour diverses émotions
export const EMOTION_PLAYLISTS: Record<string, MusicPlaylist> = {
  calm: {
    id: 'calm-playlist',
    name: 'Sérénité',
    emotion: 'calm',
    description: 'Musique calme et relaxante',
    coverUrl: '/images/ocean-waves.jpg',
    coverImage: '/images/ocean-waves.jpg', // For compatibility with coverImage property
    tracks: [
      {
        id: 'calm-1',
        title: 'Ocean Waves',
        artist: 'Ambient Nature',
        duration: 240,
        audioUrl: 'https://example.com/calm1.mp3',
        coverUrl: '/images/ocean-waves.jpg',
        emotion: 'calm'
      },
      {
        id: 'calm-2',
        title: 'Forest Meditation',
        artist: 'Nature Sounds',
        duration: 300,
        audioUrl: 'https://example.com/calm2.mp3',
        coverUrl: '/images/forest-meditation.jpg',
        emotion: 'calm'
      },
      {
        id: 'calm-3',
        title: 'Gentle Rain',
        artist: 'Sleep Harmony',
        duration: 320,
        audioUrl: 'https://example.com/calm3.mp3',
        coverUrl: '/images/gentle-rain.jpg',
        emotion: 'calm'
      }
    ]
  },
  focused: {
    id: 'focused-playlist',
    name: 'Concentration',
    emotion: 'focused',
    description: 'Musique pour se concentrer',
    coverUrl: '/images/deep-focus.jpg',
    coverImage: '/images/deep-focus.jpg', // For compatibility with coverImage property
    tracks: [
      {
        id: 'focused-1',
        title: 'Deep Focus',
        artist: 'Study Music',
        duration: 280,
        audioUrl: 'https://example.com/focus1.mp3',
        coverUrl: '/images/deep-focus.jpg',
        emotion: 'focused'
      },
      {
        id: 'focused-2',
        title: 'Brain Waves',
        artist: 'Concentration',
        duration: 320,
        audioUrl: 'https://example.com/focus2.mp3',
        coverUrl: '/images/brain-waves.jpg',
        emotion: 'focused'
      },
      {
        id: 'focused-3',
        title: 'Productivity Flow',
        artist: 'Mind Works',
        duration: 300,
        audioUrl: 'https://example.com/focus3.mp3',
        coverUrl: '/images/productivity.jpg',
        emotion: 'focused'
      }
    ]
  },
  happy: {
    id: 'happy-playlist',
    name: 'Joie et Bonne Humeur',
    emotion: 'happy',
    description: 'Musique joyeuse et motivante',
    coverUrl: '/images/sunshine.jpg',
    coverImage: '/images/sunshine.jpg', // For compatibility with coverImage property
    tracks: [
      {
        id: 'happy-1',
        title: 'Sunshine Vibes',
        artist: 'Happy Tunes',
        duration: 190,
        audioUrl: 'https://example.com/happy1.mp3',
        coverUrl: '/images/sunshine.jpg',
        emotion: 'happy'
      },
      {
        id: 'happy-2',
        title: 'Dance of Joy',
        artist: 'Positive Energy',
        duration: 210,
        audioUrl: 'https://example.com/happy2.mp3',
        coverUrl: '/images/dance-joy.jpg',
        emotion: 'happy'
      },
      {
        id: 'happy-3',
        title: 'Feel Good Rhythm',
        artist: 'Mood Boosters',
        duration: 230,
        audioUrl: 'https://example.com/happy3.mp3',
        coverUrl: '/images/feel-good.jpg',
        emotion: 'happy'
      }
    ]
  },
  energetic: {
    id: 'energetic-playlist',
    name: 'Énergie',
    emotion: 'energetic',
    description: 'Musique énergisante',
    coverUrl: '/images/power-up.jpg',
    coverImage: '/images/power-up.jpg', // For compatibility with coverImage property
    tracks: [
      {
        id: 'energetic-1',
        title: 'Power Up',
        artist: 'Energy Boost',
        duration: 190,
        audioUrl: 'https://example.com/energy1.mp3',
        coverUrl: '/images/power-up.jpg',
        emotion: 'energetic'
      },
      {
        id: 'energetic-2',
        title: 'Workout Beats',
        artist: 'Fitness Sound',
        duration: 220,
        audioUrl: 'https://example.com/energy2.mp3',
        coverUrl: '/images/workout.jpg',
        emotion: 'energetic'
      },
      {
        id: 'energetic-3',
        title: 'Motivation Drive',
        artist: 'Active Mind',
        duration: 240,
        audioUrl: 'https://example.com/energy3.mp3',
        coverUrl: '/images/motivation.jpg',
        emotion: 'energetic'
      }
    ]
  },
  neutral: {
    id: 'neutral-playlist',
    name: 'Ambiance neutre',
    emotion: 'neutral',
    description: 'Musique d\'ambiance équilibrée',
    coverUrl: '/images/background.jpg',
    coverImage: '/images/background.jpg', // For compatibility with coverImage property
    tracks: [
      {
        id: 'neutral-1',
        title: 'Background Harmony',
        artist: 'Neutral Sound',
        duration: 240,
        audioUrl: 'https://example.com/neutral1.mp3',
        coverUrl: '/images/background.jpg',
        emotion: 'neutral'
      },
      {
        id: 'neutral-2',
        title: 'Balanced Tones',
        artist: 'Ambient Flow',
        duration: 260,
        audioUrl: 'https://example.com/neutral2.mp3',
        coverUrl: '/images/balanced.jpg',
        emotion: 'neutral'
      },
      {
        id: 'neutral-3',
        title: 'Easy Listening',
        artist: 'Smooth Sounds',
        duration: 280,
        audioUrl: 'https://example.com/neutral3.mp3',
        coverUrl: '/images/easy-listening.jpg',
        emotion: 'neutral'
      }
    ]
  }
};

// Récupérer toutes les playlists
export const getAllPlaylists = (): MusicPlaylist[] => {
  return Object.values(EMOTION_PLAYLISTS);
};

// Récupérer une playlist par ID
export const getPlaylistById = (id: string): MusicPlaylist | undefined => {
  return Object.values(EMOTION_PLAYLISTS).find(playlist => playlist.id === id);
};

// Récupérer une playlist par émotion
export const getPlaylistByEmotion = (emotion: string): MusicPlaylist | undefined => {
  const normalizedEmotion = emotion.toLowerCase();
  return EMOTION_PLAYLISTS[normalizedEmotion];
};
