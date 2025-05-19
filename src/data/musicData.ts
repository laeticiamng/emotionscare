
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Music tracks data
export const musicTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Méditation Profonde',
    artist: 'Ambiance Zen',
    duration: 360,
    audioUrl: '/audio/meditation-deep.mp3',
    coverUrl: '/images/covers/meditation.jpg',
    emotion: 'calm',
    mood: ['calm'],
    album: 'Sessions Zen',
    year: 2023,
    genre: 'Ambient',
    tags: ['meditation', 'zen', 'calm']
  },
  {
    id: '2',
    title: 'Focus Mental',
    artist: 'Concentration Studio',
    duration: 480,
    audioUrl: '/audio/focus-mental.mp3',
    coverUrl: '/images/covers/focus.jpg',
    emotion: 'focused',
    mood: ['focused'],
    album: 'Concentration Maximale',
    year: 2022,
    genre: 'Instrumental',
    tags: ['focus', 'concentration', 'work']
  },
  {
    id: '3',
    title: 'Énergie Positive',
    artist: 'Mood Boosters',
    duration: 240,
    audioUrl: '/audio/energy-positive.mp3',
    coverUrl: '/images/covers/energy.jpg',
    emotion: 'happy',
    mood: ['happy'],
    album: 'Boost de Bonne Humeur',
    year: 2023,
    genre: 'Electronic',
    tags: ['happy', 'energy', 'positive']
  },
  {
    id: '4',
    title: 'Relaxation Soir',
    artist: 'Night Ambient',
    duration: 600,
    audioUrl: '/audio/relaxation-evening.mp3',
    coverUrl: '/images/covers/relaxation.jpg',
    emotion: 'relaxed',
    mood: ['relaxed'],
    album: 'Soirées Paisibles',
    year: 2021,
    genre: 'Ambient',
    tags: ['relaxation', 'evening', 'sleep']
  },
  {
    id: '5',
    title: 'Méditation Guidée',
    artist: 'Guide Zen',
    duration: 900,
    audioUrl: '/audio/guided-meditation.mp3',
    coverUrl: '/images/covers/guided.jpg',
    emotion: 'calm',
    mood: ['calm'],
    album: 'Voyage Intérieur',
    year: 2022,
    genre: 'Guided',
    tags: ['meditation', 'guided', 'mindfulness']
  }
];

// Explicitly export allTracks to fix the import error
export const allTracks = musicTracks;

// Music presets
export const musicPresets = [
  { id: 'calm', name: 'Calme', color: '#c4e0f3', trackIds: ['1', '5'] },
  { id: 'focus', name: 'Concentration', color: '#d4c4f3', trackIds: ['2'] },
  { id: 'happy', name: 'Joyeux', color: '#f8e9c1', trackIds: ['3'] },
  { id: 'energetic', name: 'Énergique', color: '#c8f4d5', trackIds: ['3'] },
  { id: 'relaxed', name: 'Relaxant', color: '#f9d8d3', trackIds: ['4'] }
];

// Mock playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-calm',
    name: 'Ambiance Calme',
    title: 'Ambiance Calme',
    description: 'Une sélection de morceaux apaisants pour la relaxation et la méditation.',
    emotion: 'calm',
    mood: 'calm',
    tracks: musicTracks.filter(track => track.emotion === 'calm' || (track.mood && track.mood.includes('calm'))),
    coverImage: '/images/playlists/calm.jpg',
    coverUrl: '/images/playlists/calm.jpg',
    cover: '/images/playlists/calm.jpg',
    tags: ['meditation', 'relaxation', 'calm']
  },
  {
    id: 'playlist-focus',
    name: 'Concentration',
    title: 'Concentration',
    description: 'Améliorez votre concentration et productivité avec ces morceaux.',
    emotion: 'focused',
    mood: 'focused',
    tracks: musicTracks.filter(track => track.emotion === 'focused' || (track.mood && track.mood.includes('focused'))),
    coverImage: '/images/playlists/focus.jpg',
    coverUrl: '/images/playlists/focus.jpg',
    cover: '/images/playlists/focus.jpg',
    tags: ['focus', 'work', 'concentration']
  },
  {
    id: 'playlist-happy',
    name: 'Bonne Humeur',
    title: 'Bonne Humeur',
    description: 'Une playlist énergisante pour remonter le moral et apporter de la joie.',
    emotion: 'happy',
    mood: 'happy',
    tracks: musicTracks.filter(track => track.emotion === 'happy' || (track.mood && track.mood.includes('happy'))),
    coverImage: '/images/playlists/happy.jpg',
    coverUrl: '/images/playlists/happy.jpg',
    cover: '/images/playlists/happy.jpg',
    tags: ['happy', 'mood', 'positive']
  }
];

export default {
  tracks: musicTracks,
  playlists: mockPlaylists,
  presets: musicPresets
};
