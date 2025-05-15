
import { MusicTrack, MusicPlaylist } from '@/types';

// Mock music tracks
export const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Méditation Guidée',
    artist: 'Sarah Mindful',
    duration: 600, // 10 minutes
    coverUrl: '/images/music/meditation.jpg',
    audioUrl: '/audio/meditation-guided.mp3',
    category: 'Méditation',
    mood: ['calm', 'peaceful']
  },
  {
    id: '2',
    title: 'Respiration profonde',
    artist: 'Zen Master',
    duration: 300, // 5 minutes
    coverUrl: '/images/music/breathing.jpg',
    audioUrl: '/audio/deep-breathing.mp3',
    category: 'Respiration',
    mood: ['anxious', 'stressed']
  },
  {
    id: '3',
    title: 'Sommeil réparateur',
    artist: 'Night Harmony',
    duration: 1800, // 30 minutes
    coverUrl: '/images/music/sleep.jpg',
    audioUrl: '/audio/sleep-aid.mp3',
    category: 'Sommeil',
    mood: ['tired', 'peaceful']
  },
  {
    id: '4',
    title: 'Focus & Concentration',
    artist: 'Mind Clarity',
    duration: 1200, // 20 minutes
    coverUrl: '/images/music/focus.jpg',
    audioUrl: '/audio/deep-focus.mp3',
    category: 'Productivité',
    mood: ['focused', 'creative']
  },
  {
    id: '5',
    title: 'Relaxation Profonde',
    artist: 'Ocean Waves',
    duration: 1500, // 25 minutes
    coverUrl: '/images/music/relax.jpg',
    audioUrl: '/audio/deep-relaxation.mp3',
    category: 'Relaxation',
    mood: ['stressed', 'anxious']
  },
  {
    id: '6',
    title: 'Énergie Positive',
    artist: 'Bright Morning',
    duration: 480, // 8 minutes
    coverUrl: '/images/music/energy.jpg',
    audioUrl: '/audio/positive-energy.mp3',
    category: 'Motivation',
    mood: ['sad', 'unmotivated']
  },
  {
    id: '7',
    title: 'Acceptation & Lâcher-Prise',
    artist: 'Mindfulness Journey',
    duration: 900, // 15 minutes
    coverUrl: '/images/music/acceptance.jpg',
    audioUrl: '/audio/acceptance.mp3',
    category: 'Pleine conscience',
    mood: ['reflective', 'anxious']
  }
];

// Mock playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'p1',
    name: 'Méditation quotidienne',
    tracks: mockTracks.filter(track => track.category === 'Méditation' || track.category === 'Pleine conscience'),
    coverUrl: '/images/playlists/meditation.jpg',
    description: 'Collection de méditations pour tous les jours',
    category: 'Méditation'
  },
  {
    id: 'p2',
    name: 'Aide au sommeil',
    tracks: mockTracks.filter(track => track.category === 'Sommeil' || track.mood.includes('peaceful')),
    coverUrl: '/images/playlists/sleep.jpg',
    description: 'Sons apaisants pour mieux dormir',
    category: 'Sommeil'
  },
  {
    id: 'p3',
    name: 'Gestion du stress',
    tracks: mockTracks.filter(track => track.mood.includes('anxious') || track.mood.includes('stressed')),
    coverUrl: '/images/playlists/stress.jpg',
    description: 'Réduisez votre niveau de stress et d\'anxiété',
    category: 'Bien-être'
  }
];

export default {
  tracks: mockTracks,
  playlists: mockPlaylists
};
