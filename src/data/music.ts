
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Exemples de pistes musicales
export const musicTracks: MusicTrack[] = [
  {
    id: 'track-001',
    title: 'Calm Waters',
    artist: 'Ambient Sounds',
    album: 'Nature Sounds',
    duration: 180,
    url: '/sounds/calm-waters.mp3',
    coverUrl: '/images/calm-waters.jpg',
    genre: 'ambient',
    emotion: 'calm',
    description: 'Relaxing water sounds'
  },
  {
    id: 'track-002',
    title: 'Morning Energy',
    artist: 'Dawn Breakers',
    album: 'Sunrise',
    duration: 210,
    url: '/sounds/morning-energy.mp3',
    coverUrl: '/images/sunrise.jpg',
    genre: 'uplifting',
    emotion: 'energized',
    description: 'Start your day with energy'
  },
  {
    id: 'track-003',
    title: 'Deep Focus',
    artist: 'Concentration Sounds',
    album: 'Focus',
    duration: 240,
    url: '/sounds/deep-focus.mp3',
    coverUrl: '/images/focus.jpg',
    genre: 'electronic',
    emotion: 'focused',
    description: 'Improve your concentration'
  },
];

// Exemples de playlists
const calmTracks = musicTracks.filter(track => track.emotion === 'calm');
const energizedTracks = musicTracks.filter(track => track.emotion === 'energized');
const focusedTracks = musicTracks.filter(track => track.emotion === 'focused');

export const musicPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-001',
    title: 'Détente profonde',
    name: 'Relaxation',
    description: 'Une sélection pour vous aider à vous détendre',
    coverUrl: '/images/calm-waters.jpg',
    tracks: calmTracks,
    emotion: 'calm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'playlist-002',
    title: 'Boost d\'énergie',
    name: 'Energie du matin',
    description: 'Pour bien commencer la journée',
    coverUrl: '/images/sunrise.jpg',
    tracks: energizedTracks,
    emotion: 'energized',
    createdAt: new Date().toISOString()
  },
  {
    id: 'playlist-003',
    title: 'Focus intense',
    name: 'Concentration',
    description: 'Pour rester concentré dans votre travail',
    coverUrl: '/images/focus.jpg',
    tracks: focusedTracks,
    emotion: 'focused',
    createdAt: new Date().toISOString()
  },
];
