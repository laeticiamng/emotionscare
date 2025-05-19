
import { MusicPlaylist } from '@/types/music';

export const emotionPlaylists: MusicPlaylist[] = [
  {
    id: 'happy-01',
    name: 'Joie Légère',
    title: 'Joie Légère',
    description: 'Une playlist joyeuse pour les moments positifs',
    emotion: 'joie',
    source: 'curated',
    coverImage: '/images/covers/happy-1.jpg',
    mood: ['joie', 'légèreté'],
    tracks: [
      {
        id: 'happy-track-1',
        title: 'Sunny Day',
        artist: 'Happy Band',
        duration: 183,
        url: '/audio/samples/happy1.mp3',
        audioUrl: '/audio/samples/happy1.mp3',
        cover: '/images/covers/happy-1.jpg',
        coverUrl: '/images/covers/happy-1.jpg',
        emotion: 'joie',
        mood: ['joie'],
        genre: 'Pop',
        album: 'Happy Moments',
        tags: ['joie', 'énergie', 'positif']
      },
      {
        id: 'happy-track-2',
        title: 'Jump Around',
        artist: 'Happiness Project',
        duration: 210,
        url: '/audio/samples/happy2.mp3',
        audioUrl: '/audio/samples/happy2.mp3',
        cover: '/images/covers/happy-2.jpg',
        coverUrl: '/images/covers/happy-2.jpg',
        emotion: 'joie',
        mood: ['joie', 'énergie'],
        genre: 'Pop',
        album: 'Happy Days',
        tags: ['joie', 'danse', 'énergie']
      }
    ]
  },
  {
    id: 'calm-01',
    name: 'Calme Profond',
    title: 'Calme Profond',
    description: 'Musique apaisante pour la relaxation',
    emotion: 'calme',
    source: 'curated',
    coverImage: '/images/covers/calm-1.jpg',
    mood: ['calme', 'sérénité'],
    tracks: [
      {
        id: 'calm-track-1',
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        duration: 240,
        url: '/audio/samples/calm1.mp3',
        audioUrl: '/audio/samples/calm1.mp3',
        cover: '/images/covers/calm-1.jpg',
        coverUrl: '/images/covers/calm-1.jpg',
        emotion: 'calme',
        mood: ['calme'],
        genre: 'Ambient',
        album: 'Peaceful Moments',
        tags: ['calme', 'nature', 'relaxation']
      },
      {
        id: 'calm-track-2',
        title: 'Mountain Air',
        artist: 'Serenity',
        duration: 210,
        url: '/audio/samples/calm2.mp3',
        audioUrl: '/audio/samples/calm2.mp3',
        cover: '/images/covers/calm-2.jpg',
        coverUrl: '/images/covers/calm-2.jpg',
        emotion: 'calme',
        mood: ['calme', 'sérénité'],
        genre: 'Ambient',
        album: 'Mountain Retreat',
        tags: ['calme', 'zen', 'méditation']
      }
    ]
  },
  {
    id: 'sad-01',
    name: 'Mélancolie Douce',
    title: 'Mélancolie Douce',
    description: 'Pour les moments de réflexion et introspection',
    emotion: 'tristesse',
    source: 'curated',
    coverImage: '/images/covers/sad-1.jpg',
    mood: ['tristesse', 'mélancolie'],
    tracks: [
      {
        id: 'sad-track-1',
        title: 'Rainy Day',
        artist: 'Melancholy',
        duration: 195,
        url: '/audio/samples/sad1.mp3',
        audioUrl: '/audio/samples/sad1.mp3',
        cover: '/images/covers/sad-1.jpg',
        coverUrl: '/images/covers/sad-1.jpg',
        emotion: 'tristesse',
        mood: ['tristesse'],
        genre: 'Piano',
        album: 'Reflections',
        tags: ['tristesse', 'piano', 'introspection']
      },
      {
        id: 'sad-track-2',
        title: 'Memories',
        artist: 'Nostalgic',
        duration: 228,
        url: '/audio/samples/sad2.mp3',
        audioUrl: '/audio/samples/sad2.mp3',
        cover: '/images/covers/sad-2.jpg',
        coverUrl: '/images/covers/sad-2.jpg',
        emotion: 'tristesse',
        mood: ['tristesse', 'nostalgie'],
        genre: 'Acoustic',
        album: 'Looking Back',
        tags: ['tristesse', 'souvenir', 'mélancolie']
      }
    ]
  },
  {
    id: 'energetic-01',
    name: 'Énergie Pure',
    title: 'Énergie Pure',
    description: 'Musique motivante pour se dépasser',
    emotion: 'énergie',
    source: 'curated',
    coverImage: '/images/covers/energy-1.jpg',
    mood: ['énergie', 'motivation'],
    tracks: [
      {
        id: 'energy-track-1',
        title: 'Power Up',
        artist: 'Motivators',
        duration: 180,
        url: '/audio/samples/energy1.mp3',
        audioUrl: '/audio/samples/energy1.mp3',
        cover: '/images/covers/energy-1.jpg',
        coverUrl: '/images/covers/energy-1.jpg',
        emotion: 'énergie',
        mood: ['énergie'],
        genre: 'Electronic',
        album: 'High Energy',
        tags: ['énergie', 'sport', 'motivation']
      },
      {
        id: 'energy-track-2',
        title: 'Push Forward',
        artist: 'Workout Kings',
        duration: 195,
        url: '/audio/samples/energy2.mp3',
        audioUrl: '/audio/samples/energy2.mp3',
        cover: '/images/covers/energy-2.jpg',
        coverUrl: '/images/covers/energy-2.jpg',
        emotion: 'énergie',
        mood: ['énergie', 'détermination'],
        genre: 'Rock',
        album: 'No Limits',
        tags: ['énergie', 'entraînement', 'puissance']
      }
    ]
  }
];
