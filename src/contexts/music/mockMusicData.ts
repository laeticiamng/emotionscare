
/**
 * MOCK DATA
 * Ce fichier respecte strictement les types officiels MusicTrack et MusicPlaylist
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { MusicTrack, MusicPlaylist } from '@/types/music';
import { v4 as uuidv4 } from 'uuid';

// Tracks de musique fictifs
export const mockMusicTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Ocean Calm',
    artist: 'Nature Sounds',
    audioUrl: '/audio/ocean-calm.mp3',
    coverUrl: '/images/music/ocean.jpg',
    duration: 245,
    emotion: 'calm',
    intensity: 0.3,
    album: 'Nature Relaxation',
    year: 2022,
    tags: ['ocean', 'calm', 'nature']
  },
  {
    id: '2',
    title: 'Forest Meditation',
    artist: 'Relaxation Masters',
    audioUrl: '/audio/forest-meditation.mp3',
    coverUrl: '/images/music/forest.jpg',
    duration: 320,
    emotion: 'calm',
    intensity: 0.2,
    album: 'Deep Relaxation',
    year: 2021,
    tags: ['forest', 'meditation', 'nature']
  },
  {
    id: '3',
    title: 'Energy Boost',
    artist: 'Workout Music',
    audioUrl: '/audio/energy-boost.mp3',
    coverUrl: '/images/music/energy.jpg',
    duration: 195,
    emotion: 'energetic',
    intensity: 0.8,
    album: 'Workout Hits',
    year: 2023,
    tags: ['workout', 'energy', 'motivation']
  },
  {
    id: '4',
    title: 'Deep Focus',
    artist: 'Concentration Zone',
    audioUrl: '/audio/deep-focus.mp3',
    coverUrl: '/images/music/focus.jpg',
    duration: 380,
    emotion: 'focus',
    intensity: 0.5,
    album: 'Study Sessions',
    year: 2022,
    tags: ['focus', 'study', 'concentration']
  },
  {
    id: '5',
    title: 'Raindrops',
    artist: 'Nature Sounds',
    audioUrl: '/audio/raindrops.mp3',
    coverUrl: '/images/music/rain.jpg',
    duration: 290,
    emotion: 'calm',
    intensity: 0.4,
    album: 'Nature Relaxation',
    year: 2022,
    tags: ['rain', 'calm', 'nature']
  },
  {
    id: '6',
    title: 'Morning Joy',
    artist: 'Happy Tunes',
    audioUrl: '/audio/morning-joy.mp3',
    coverUrl: '/images/music/morning.jpg',
    duration: 210,
    emotion: 'happy',
    intensity: 0.6,
    album: 'Positive Vibes',
    year: 2023,
    tags: ['happy', 'morning', 'joy']
  },
  {
    id: '7',
    title: 'Evening Reflection',
    artist: 'Calm Composers',
    audioUrl: '/audio/evening-reflection.mp3',
    coverUrl: '/images/music/evening.jpg',
    duration: 340,
    emotion: 'melancholic',
    intensity: 0.4,
    album: 'Reflective Moments',
    year: 2021,
    tags: ['evening', 'reflection', 'calm']
  },
  {
    id: '8',
    title: 'Productivity Flow',
    artist: 'Concentration Zone',
    audioUrl: '/audio/productivity-flow.mp3',
    coverUrl: '/images/music/productivity.jpg',
    duration: 360,
    emotion: 'focus',
    intensity: 0.7,
    album: 'Deep Work',
    year: 2022,
    tags: ['productivity', 'focus', 'flow']
  }
];

// Playlists par émotion
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-calm',
    name: 'Calme et Sérénité',
    title: 'Calme et Sérénité',
    description: 'Des sons apaisants pour retrouver la paix intérieure',
    coverImage: '/images/music/playlist-calm.jpg',
    emotion: 'calm',
    tracks: mockMusicTracks.filter(t => t.emotion === 'calm')
  },
  {
    id: 'playlist-focus',
    name: 'Concentration Maximale',
    title: 'Concentration Maximale',
    description: 'Musique idéale pour les sessions de travail intense',
    coverImage: '/images/music/playlist-focus.jpg',
    emotion: 'focus',
    tracks: mockMusicTracks.filter(t => t.emotion === 'focus')
  },
  {
    id: 'playlist-energy',
    name: 'Boost d\'Énergie',
    title: 'Boost d\'Énergie',
    description: 'Des rythmes entraînants pour retrouver votre dynamisme',
    coverImage: '/images/music/playlist-energy.jpg',
    emotion: 'energetic',
    tracks: mockMusicTracks.filter(t => t.emotion === 'energetic')
  },
  {
    id: 'playlist-happy',
    name: 'Joie et Bonne Humeur',
    title: 'Joie et Bonne Humeur',
    description: 'Des mélodies positives pour égayer votre journée',
    coverImage: '/images/music/playlist-happy.jpg',
    emotion: 'happy',
    tracks: mockMusicTracks.filter(t => t.emotion === 'happy')
  },
  {
    id: 'playlist-melancholy',
    name: 'Moments de Réflexion',
    title: 'Moments de Réflexion',
    description: 'Une ambiance douce pour les moments de contemplation',
    coverImage: '/images/music/playlist-melancholy.jpg',
    emotion: 'melancholic',
    tracks: mockMusicTracks.filter(t => t.emotion === 'melancholic')
  }
];

// Fonction pour obtenir les données de musique
export function getMockMusicData() {
  return {
    tracks: mockMusicTracks,
    playlists: mockPlaylists
  };
}

// Fonction d'aide pour créer un nouveau morceau
export function createTrack(data: Partial<MusicTrack>): MusicTrack {
  return {
    id: uuidv4(),
    title: 'Sans titre',
    artist: 'Inconnu',
    duration: 180,
    audioUrl: '',
    ...data
  };
}
