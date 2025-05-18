
import { MusicPlaylist, MusicTrack } from '@/types/music';

// Tracks de musique fictives pour les tests
export const mockMusicTracks: MusicTrack[] = [
  {
    id: 'track-001',
    title: 'Méditation matinale',
    artist: 'Zen Masters',
    album: 'Sérénité Quotidienne',
    duration: 180,
    audioUrl: '/audio/meditation-morning.mp3',
    coverUrl: '/images/music/cover-meditation.jpg',
    emotion: 'calm',
    genre: 'ambient',
    tags: ['meditation', 'morning', 'calm']
  },
  {
    id: 'track-002',
    title: 'Flux océanique',
    artist: 'Nature Sounds',
    album: 'Sons de la nature',
    duration: 240,
    audioUrl: '/audio/ocean-flow.mp3',
    coverUrl: '/images/music/cover-ocean.jpg',
    emotion: 'calm',
    genre: 'nature',
    tags: ['ocean', 'waves', 'relax']
  },
  {
    id: 'track-003',
    title: 'Réveil dynamique',
    artist: 'Energy Beats',
    album: 'Morning Boost',
    duration: 160,
    audioUrl: '/audio/energy-wake.mp3',
    coverUrl: '/images/music/cover-energy.jpg',
    emotion: 'energetic',
    genre: 'electronic',
    tags: ['morning', 'energy', 'motivation']
  }
];

// Playlists fictives pour les tests
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-calm',
    name: 'Calme et sérénité',
    description: 'Musiques apaisantes pour retrouver votre calme intérieur',
    emotion: 'calm',
    tracks: mockMusicTracks.filter(track => track.emotion === 'calm'),
    coverUrl: '/images/music/playlist-calm.jpg',
    tags: ['calm', 'relax', 'meditation']
  },
  {
    id: 'playlist-energy',
    name: 'Boost d\'énergie',
    description: 'Musiques dynamiques pour booster votre énergie',
    emotion: 'energetic',
    tracks: mockMusicTracks.filter(track => track.emotion === 'energetic'),
    coverUrl: '/images/music/playlist-energy.jpg',
    tags: ['energy', 'workout', 'motivation']
  }
];
