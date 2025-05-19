
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Music tracks data
export const musicTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Méditation Profonde',
    artist: 'Ambiance Zen',
    duration: 360,
    url: '/audio/meditation-deep.mp3',
    audioUrl: '/audio/meditation-deep.mp3',
    coverUrl: '/images/covers/meditation.jpg',
    emotion: 'calm',
    mood: ['calm'],
    album: 'Sessions Zen',
    genre: 'Ambient',
    tags: ['meditation', 'zen', 'calm']
  },
  {
    id: '2',
    title: 'Focus Mental',
    artist: 'Concentration Studio',
    duration: 480,
    url: '/audio/focus-mental.mp3',
    audioUrl: '/audio/focus-mental.mp3',
    coverUrl: '/images/covers/focus.jpg',
    emotion: 'focused',
    mood: ['focused'],
    album: 'Concentration Maximale',
    genre: 'Instrumental',
    tags: ['focus', 'concentration', 'work']
  },
  {
    id: '3',
    title: 'Énergie Positive',
    artist: 'Mood Boosters',
    duration: 240,
    url: '/audio/energy-positive.mp3',
    audioUrl: '/audio/energy-positive.mp3',
    coverUrl: '/images/covers/energy.jpg',
    emotion: 'happy',
    mood: ['happy'],
    album: 'Boost de Bonne Humeur',
    genre: 'Electronic',
    tags: ['happy', 'energy', 'positive']
  },
  {
    id: '4',
    title: 'Relaxation Soir',
    artist: 'Night Ambient',
    duration: 600,
    url: '/audio/relaxation-evening.mp3',
    audioUrl: '/audio/relaxation-evening.mp3',
    coverUrl: '/images/covers/relaxation.jpg',
    emotion: 'relaxed',
    mood: ['relaxed'],
    album: 'Soirées Paisibles',
    genre: 'Ambient',
    tags: ['relaxation', 'evening', 'sleep']
  },
  {
    id: '5',
    title: 'Méditation Guidée',
    artist: 'Guide Zen',
    duration: 900,
    url: '/audio/guided-meditation.mp3',
    audioUrl: '/audio/guided-meditation.mp3',
    coverUrl: '/images/covers/guided.jpg',
    emotion: 'calm',
    mood: ['calm'],
    album: 'Voyage Intérieur',
    genre: 'Guided',
    tags: ['meditation', 'guided', 'mindfulness']
  }
];

// Explicitly export allTracks to fix the import error
export const allTracks = musicTracks;

// Define these specific playlist collections that are imported elsewhere
export const relaxingNatureSounds: MusicPlaylist = {
  id: 'relaxing-nature',
  title: 'Sons de la Nature',
  description: 'Une collection de sons naturels apaisants',
  cover: '/images/playlists/nature.jpg',
  tracks: musicTracks.filter(track => track.id === '1' || track.id === '4'),
  mood: ['calm', 'relaxed'],
  emotion: 'calm',
  category: ['relaxation', 'nature'],
  author: 'Nature Sounds'
};

export const focusBeats: MusicPlaylist = {
  id: 'focus-beats',
  title: 'Rythmes de Concentration',
  description: 'Musique pour améliorer votre concentration',
  cover: '/images/playlists/focus.jpg',
  tracks: [musicTracks.find(track => track.id === '2')!],
  mood: ['focus', 'concentration'],
  emotion: 'focused',
  category: ['focus'],
  author: 'Concentration Studio'
};

export const energyBoost: MusicPlaylist = {
  id: 'energy-boost',
  title: 'Boost d\'Énergie',
  description: 'Musique pour vous donner de l\'énergie',
  cover: '/images/playlists/energy.jpg',
  tracks: [musicTracks.find(track => track.id === '3')!],
  mood: ['energy', 'happy'],
  emotion: 'happy',
  category: ['energy'],
  author: 'Mood Boosters'
};

export const calmMeditation: MusicPlaylist = {
  id: 'calm-meditation',
  title: 'Méditation Calme',
  description: 'Musique pour la méditation et la relaxation profonde',
  cover: '/images/playlists/meditation.jpg',
  tracks: musicTracks.filter(track => track.id === '5' || track.id === '1'),
  mood: ['calm', 'meditation'],
  emotion: 'calm',
  category: ['meditation', 'relaxation'],
  author: 'Ambiance Zen'
};

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
    mood: ['calm'],
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
    mood: ['focused'],
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
    mood: ['happy'],
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
