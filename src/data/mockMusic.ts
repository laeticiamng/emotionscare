import { MusicPlaylist, MusicTrack } from '@/types/music';

export const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Calm Waters',
    artist: 'Ocean Sounds',
    url: '/audio/calm-waters.mp3',
    coverUrl: '/images/covers/calm-waters.jpg',
    duration: 180,
    emotion: 'calm',
    genre: 'ambient',  // Change to string instead of array
    category: 'relaxation'
  },
  {
    id: '2',
    title: 'Morning Meditation',
    artist: 'Zen Masters',
    url: '/audio/morning-meditation.mp3',
    coverUrl: '/images/covers/morning-meditation.jpg',
    duration: 240,
    emotion: 'peaceful',
    genre: 'meditation',  // Change to string instead of array
    category: 'focus'
  },
  {
    id: '3',
    title: 'Uplifting Piano',
    artist: 'Emily Carter',
    url: '/audio/uplifting-piano.mp3',
    coverUrl: '/images/covers/uplifting-piano.jpg',
    duration: 210,
    emotion: 'joyful',
    genre: 'classical',  // Change to string instead of array
    category: 'motivation'
  },
  {
    id: '4',
    title: 'Forest Walk',
    artist: 'Nature Collective',
    url: '/audio/forest-walk.mp3',
    coverUrl: '/images/covers/forest-walk.jpg',
    duration: 300,
    emotion: 'serene',
    genre: 'nature',  // Change to string instead of array
    category: 'relaxation'
  },
  {
    id: '5',
    title: 'Focus Flow',
    artist: 'Brainwave Bliss',
    url: '/audio/focus-flow.mp3',
    coverUrl: '/images/covers/focus-flow.jpg',
    duration: 270,
    emotion: 'focused',
    genre: 'electronic',  // Change to string instead of array
    category: 'focus'
  },
  {
    id: '6',
    title: 'Evening Calm',
    artist: 'Lofi Lounge',
    url: '/audio/evening-calm.mp3',
    coverUrl: '/images/covers/evening-calm.jpg',
    duration: 200,
    emotion: 'relaxed',
    genre: 'lofi',  // Change to string instead of array
    category: 'sleep'
  },
  {
    id: '7',
    title: 'Dream State',
    artist: 'Sleepy Sounds',
    url: '/audio/dream-state.mp3',
    coverUrl: '/images/covers/dream-state.jpg',
    duration: 330,
    emotion: 'peaceful',
    genre: 'ambient',  // Change to string instead of array
    category: 'sleep'
  }
];

export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'relaxation',
    title: 'Relaxation',  // Add title property
    name: 'Relaxation', 
    tracks: mockTracks.filter(track => track.category === 'relaxation' || track.emotion === 'calm'),
    coverUrl: '/images/covers/relaxation-playlist.jpg',
    description: 'Des sons apaisants pour vous aider à vous détendre',
    category: 'relaxation'
  },
  {
    id: 'focus',
    title: 'Focus',  // Add title property
    name: 'Focus',
    tracks: mockTracks.filter(track => track.category === 'focus' || track.mood === 'concentration'),
    coverUrl: '/images/covers/focus-playlist.jpg',
    description: 'De la musique pour améliorer votre concentration',
    category: 'focus'
  },
  {
    id: 'sleep',
    title: 'Sleep',  // Add title property
    name: 'Sleep',
    tracks: mockTracks.filter(track => track.mood === 'sleepy' || track.mood === 'peaceful'),
    coverUrl: '/images/covers/sleep-playlist.jpg',
    description: 'Sons relaxants pour vous aider à vous endormir',
    category: 'sleep'
  }
];
