
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock music tracks
export const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Meditation Ambient',
    artist: 'Calm Studio',
    url: 'https://example.com/music/meditation.mp3',
    audioUrl: 'https://example.com/music/meditation.mp3',
    coverUrl: 'https://example.com/covers/meditation.jpg',
    duration: 180,
    emotion: 'calm',
    genre: 'ambient'
  },
  {
    id: '2',
    title: 'Uplifting Energy',
    artist: 'Happy Vibe',
    url: 'https://example.com/music/uplifting.mp3',
    audioUrl: 'https://example.com/music/uplifting.mp3',
    coverUrl: 'https://example.com/covers/uplifting.jpg',
    duration: 210,
    emotion: 'happy',
    genre: 'electronic'
  },
  {
    id: '3',
    title: 'Focus Zone',
    artist: 'Deep Concentration',
    url: 'https://example.com/music/focus.mp3',
    audioUrl: 'https://example.com/music/focus.mp3',
    coverUrl: 'https://example.com/covers/focus.jpg',
    duration: 240,
    emotion: 'focused',
    genre: 'instrumental'
  },
  {
    id: '4',
    title: 'Relaxation Waves',
    artist: 'Ocean Sounds',
    url: 'https://example.com/music/relaxation.mp3',
    audioUrl: 'https://example.com/music/relaxation.mp3',
    coverUrl: 'https://example.com/covers/relaxation.jpg',
    duration: 300,
    emotion: 'relaxed',
    genre: 'nature'
  }
];

// Mock music playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: '1',
    name: 'Calme & Sérénité',
    description: 'Une sélection de pistes pour vous aider à vous détendre',
    tracks: mockTracks.filter(track => ['calm', 'relaxed'].includes(track.emotion || '')),
    coverUrl: 'https://example.com/playlists/calm.jpg',
    emotion: 'calm',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Énergie & Motivation',
    description: 'Des pistes stimulantes pour vous donner un coup de boost',
    tracks: mockTracks.filter(track => ['happy', 'energetic'].includes(track.emotion || '')),
    coverUrl: 'https://example.com/playlists/energy.jpg',
    emotion: 'happy',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Concentration Profonde',
    description: 'Améliorez votre focus et votre productivité',
    tracks: mockTracks.filter(track => ['focused'].includes(track.emotion || '')),
    coverUrl: 'https://example.com/playlists/focus.jpg',
    emotion: 'focused',
    createdAt: new Date().toISOString()
  }
];
