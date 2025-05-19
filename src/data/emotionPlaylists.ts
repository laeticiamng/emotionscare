
import { MusicPlaylist } from '@/types/music';

// Sample playlists for different emotions
export const emotionPlaylists: MusicPlaylist[] = [
  {
    id: 'calm-1',
    name: 'Calme Zen',
    title: 'Calme Zen',
    description: 'Une sélection de morceaux apaisants et zen pour vous aider à vous détendre',
    emotion: 'calm',
    coverImage: '/images/covers/calm.jpg',
    source: 'curated',
    mood: ['calm', 'relaxed', 'peaceful'],
    tracks: [
      {
        id: 'calm-track-1',
        title: 'Méditation du Matin',
        artist: 'ZenMasters',
        duration: 240,
        url: '/audio/samples/calm-1.mp3',
        cover: '/images/covers/calm-1.jpg',
        genre: 'Ambient',
        mood: ['calm', 'meditation'],
        album: 'Calm Sessions'
      },
      {
        id: 'calm-track-2',
        title: 'Forêt Paisible',
        artist: 'Nature Sounds',
        duration: 320,
        url: '/audio/samples/calm-2.mp3',
        cover: '/images/covers/calm-2.jpg',
        genre: 'Nature',
        mood: ['calm', 'nature'],
        album: 'Forest Sounds'
      }
    ]
  },
  {
    id: 'focus-1',
    name: 'Concentration Profonde',
    title: 'Concentration Profonde',
    description: 'Musique idéale pour améliorer votre concentration et productivité',
    emotion: 'focus',
    coverImage: '/images/covers/focus.jpg',
    source: 'curated',
    mood: ['focus', 'concentration', 'productivity'],
    tracks: [
      {
        id: 'focus-track-1',
        title: 'Deep Focus',
        artist: 'BrainWave',
        duration: 280,
        url: '/audio/samples/focus-1.mp3',
        cover: '/images/covers/focus-1.jpg',
        genre: 'Electronic',
        mood: ['focus', 'concentration'],
        album: 'Focus Sessions'
      },
      {
        id: 'focus-track-2',
        title: 'Study Flow',
        artist: 'MindTunes',
        duration: 310,
        url: '/audio/samples/focus-2.mp3',
        cover: '/images/covers/focus-2.jpg',
        genre: 'Instrumental',
        mood: ['focus', 'study'],
        album: 'Productivity Mix'
      }
    ]
  },
  {
    id: 'energy-1',
    name: 'Boost d\'Énergie',
    title: 'Boost d\'Énergie',
    description: 'Des rythmes dynamiques pour vous motiver et stimuler votre énergie',
    emotion: 'energetic',
    coverImage: '/images/covers/energy.jpg',
    source: 'curated',
    mood: ['energetic', 'upbeat', 'motivated'],
    tracks: [
      {
        id: 'energy-track-1',
        title: 'Morning Boost',
        artist: 'EnergyBeats',
        duration: 190,
        url: '/audio/samples/energy-1.mp3',
        cover: '/images/covers/energy-1.jpg',
        genre: 'Dance',
        mood: ['energetic', 'upbeat'],
        album: 'Energy Mix'
      },
      {
        id: 'energy-track-2',
        title: 'Workout Power',
        artist: 'FitTunes',
        duration: 225,
        url: '/audio/samples/energy-2.mp3',
        cover: '/images/covers/energy-2.jpg',
        genre: 'Electronic',
        mood: ['energetic', 'workout'],
        album: 'Fitness Beats'
      }
    ]
  },
  {
    id: 'happy-1',
    name: 'Joie & Bonne Humeur',
    title: 'Joie & Bonne Humeur',
    description: 'Une sélection de morceaux joyeux pour égayer votre journée',
    emotion: 'happy',
    coverImage: '/images/covers/happy.jpg',
    source: 'curated',
    mood: ['happy', 'joyful', 'cheerful'],
    tracks: [
      {
        id: 'happy-track-1',
        title: 'Sunny Day',
        artist: 'HappyTunes',
        duration: 210,
        url: '/audio/samples/happy-1.mp3',
        cover: '/images/covers/happy-1.jpg',
        genre: 'Pop',
        mood: ['happy', 'cheerful'],
        album: 'Happy Days'
      },
      {
        id: 'happy-track-2',
        title: 'Good Vibes',
        artist: 'PositiveBeats',
        duration: 195,
        url: '/audio/samples/happy-2.mp3',
        cover: '/images/covers/happy-2.jpg',
        genre: 'Indie Pop',
        mood: ['happy', 'positive'],
        album: 'Feel Good Mix'
      }
    ]
  }
];

export default emotionPlaylists;
