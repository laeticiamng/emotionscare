
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { mapAudioUrlToUrl } from '@/utils/musicCompatibility';

// Corrected mock tracks with url property
export const mockTracks: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Sérénité du matin',
    artist: 'Nature Sounds',
    audioUrl: '/audio/morning-serenity.mp3',
    url: '/audio/morning-serenity.mp3',
    coverUrl: '/images/covers/nature-morning.jpg',
    duration: 180,
    emotion: 'calm',
    intensity: 3,
    album: 'Sons de la Nature',
    year: 2022,
    tags: ['calm', 'morning', 'nature']
  },
  {
    id: 'track-2',
    title: 'Méditation profonde',
    artist: 'Zen Master',
    audioUrl: '/audio/deep-meditation.mp3',
    url: '/audio/deep-meditation.mp3',
    coverUrl: '/images/covers/meditation.jpg',
    duration: 240,
    emotion: 'relaxed',
    intensity: 2,
    album: 'Méditation Zen',
    year: 2021,
    tags: ['relaxed', 'zen', 'meditation']
  },
  {
    id: 'track-3',
    title: 'Énergie matinale',
    artist: 'Wake Up',
    audioUrl: '/audio/morning-energy.mp3',
    url: '/audio/morning-energy.mp3',
    coverUrl: '/images/covers/energy.jpg',
    duration: 195,
    emotion: 'energetic',
    intensity: 8,
    album: 'Réveil Énergique',
    year: 2023,
    tags: ['energetic', 'morning', 'motivation']
  },
  {
    id: 'track-4',
    title: 'Focus optimal',
    artist: 'Concentration',
    audioUrl: '/audio/optimal-focus.mp3',
    url: '/audio/optimal-focus.mp3',
    coverUrl: '/images/covers/focus.jpg',
    duration: 320,
    emotion: 'focused',
    intensity: 6,
    album: 'Concentration Maximale',
    year: 2022,
    tags: ['focused', 'work', 'productivity']
  },
  {
    id: 'track-5',
    title: 'Apaisement nocturne',
    artist: 'Night Sounds',
    audioUrl: '/audio/night-calm.mp3',
    url: '/audio/night-calm.mp3',
    coverUrl: '/images/covers/night.jpg',
    duration: 360,
    emotion: 'relaxed',
    intensity: 2,
    album: 'Nuits Tranquilles',
    year: 2021,
    tags: ['relaxed', 'night', 'sleep']
  },
  {
    id: 'track-6',
    title: 'Joie matinale',
    artist: 'Happy Day',
    audioUrl: '/audio/morning-joy.mp3',
    url: '/audio/morning-joy.mp3',
    coverUrl: '/images/covers/joy.jpg',
    duration: 210,
    emotion: 'happy',
    intensity: 7,
    album: 'Jours Heureux',
    year: 2023,
    tags: ['happy', 'morning', 'joy']
  },
  {
    id: 'track-7',
    title: 'Nostalgie douce',
    artist: 'Memory Lane',
    audioUrl: '/audio/sweet-nostalgia.mp3',
    url: '/audio/sweet-nostalgia.mp3',
    coverUrl: '/images/covers/nostalgia.jpg',
    duration: 285,
    emotion: 'melancholic',
    intensity: 4,
    album: 'Souvenirs',
    year: 2020,
    tags: ['melancholic', 'memories', 'reflection']
  },
  {
    id: 'track-8',
    title: 'Calme intérieur',
    artist: 'Peace Within',
    audioUrl: '/audio/inner-peace.mp3',
    url: '/audio/inner-peace.mp3',
    coverUrl: '/images/covers/peace.jpg',
    duration: 330,
    emotion: 'calm',
    intensity: 2,
    album: 'Paix Intérieure',
    year: 2022,
    tags: ['calm', 'peaceful', 'balance']
  }
];

// Define the compatible format for tracks
export const compatibleTrack = {
  id: 'track-demo',
  title: 'Démonstration',
  artist: 'EmotionsCare',
  url: '/audio/demo.mp3',
  cover: '/images/covers/demo.jpg',
  coverUrl: '/images/covers/demo.jpg',
  coverImage: '/images/covers/demo.jpg',
  duration: 120,
  audioUrl: '/audio/demo.mp3',
  src: '/audio/demo.mp3',
  track_url: '/audio/demo.mp3',
  album: 'Démos',
  year: 2023,
  tags: ['demo', 'showcase'],
  genre: 'Ambient',
  emotion: 'neutral',
  mood: 'calm',
  category: ['demo', 'ambient'],
  intensity: 5,
  name: 'Démonstration'
};

// Make sure all tracks are compatible
export const allTracks: MusicTrack[] = mockTracks.map(mapAudioUrlToUrl);

// Playlists for different emotions
export const mockMusicPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-calm',
    title: 'Moments de calme',
    description: 'Une sélection de musiques apaisantes pour retrouver votre sérénité',
    coverUrl: '/images/covers/calm-playlist.jpg',
    tracks: mockTracks.filter(track => ['calm', 'relaxed'].includes(track.emotion || '')),
    emotion: 'calm',
    mood: ['calm', 'peaceful'],
    category: ['relaxation', 'wellness'],
    tags: ['calm', 'meditation', 'relax']
  },
  {
    id: 'playlist-energy',
    title: 'Boost d\'énergie',
    description: 'Des morceaux dynamiques pour vous donner un regain d\'énergie',
    coverUrl: '/images/covers/energy-playlist.jpg',
    tracks: mockTracks.filter(track => ['energetic', 'happy'].includes(track.emotion || '')),
    emotion: 'energetic',
    mood: ['energetic', 'upbeat'],
    category: ['motivation', 'fitness'],
    tags: ['energy', 'workout', 'motivation']
  },
  {
    id: 'playlist-focus',
    title: 'Concentration maximale',
    description: 'La musique idéale pour rester concentré pendant votre travail',
    coverUrl: '/images/covers/focus-playlist.jpg',
    tracks: mockTracks.filter(track => ['focused'].includes(track.emotion || '')),
    emotion: 'focused',
    mood: ['focused', 'concentrated'],
    category: ['work', 'study'],
    tags: ['focus', 'productivity', 'concentration']
  },
  {
    id: 'playlist-relax',
    title: 'Détente profonde',
    description: 'Plongez dans un état de relaxation optimale avec cette sélection',
    coverUrl: '/images/covers/relax-playlist.jpg',
    tracks: mockTracks.filter(track => ['relaxed', 'calm'].includes(track.emotion || '')),
    emotion: 'relaxed',
    mood: ['relaxed', 'tranquil'],
    category: ['sleep', 'wellness'],
    tags: ['relax', 'chill', 'unwind']
  }
];
