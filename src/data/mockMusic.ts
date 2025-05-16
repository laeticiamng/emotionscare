
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const mockTracks: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Deep Concentration',
    artist: 'Focus Mind',
    album: 'Productivity Sessions',
    duration: 240,
    url: 'https://example.com/track1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop',
    emotionalTone: 'Focus',
    mood: 'Calm',
    tags: ['concentration', 'work', 'study']
  },
  {
    id: 'track-2',
    title: 'Calm Waters',
    artist: 'Ocean Sounds',
    album: 'Nature Ambience',
    duration: 320,
    url: 'https://example.com/track2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop',
    emotionalTone: 'Relaxed',
    mood: 'Peaceful',
    tags: ['calm', 'nature', 'meditation']
  },
  {
    id: 'track-3',
    title: 'Energy Boost',
    artist: 'Motivation Music',
    album: 'Get Moving',
    duration: 180,
    url: 'https://example.com/track3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop',
    emotionalTone: 'Energetic',
    mood: 'Uplifting',
    tags: ['energy', 'motivation', 'workout']
  },
  {
    id: 'track-4',
    title: 'Creative Flow',
    artist: 'Imagination Streams',
    album: 'Idea Generation',
    duration: 290,
    url: 'https://example.com/track4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1513682121497-80211f36a7d3?q=80&w=2076&auto=format&fit=crop',
    emotionalTone: 'Creative',
    mood: 'Inspired',
    tags: ['creativity', 'inspiration', 'brainstorming']
  },
  {
    id: 'track-5',
    title: 'Sleep Well',
    artist: 'Dream Makers',
    album: 'Night Tunes',
    duration: 450,
    url: 'https://example.com/track5.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=2070&auto=format&fit=crop',
    emotionalTone: 'Peaceful',
    mood: 'Sleepy',
    tags: ['sleep', 'night', 'relaxation']
  }
];

export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'pl-1',
    title: 'Musique de concentration',
    description: 'Parfait pour le travail et l\'étude',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop',
    tracks: [mockTracks[0], mockTracks[3]],
    category: 'Focus',
    mood: 'Concentration'
  },
  {
    id: 'pl-2',
    title: 'Détente Profonde',
    description: 'Pour les moments de relaxation',
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop',
    tracks: [mockTracks[1], mockTracks[4]],
    category: 'Relaxation',
    mood: 'Calme'
  },
  {
    id: 'pl-3',
    title: 'Énergie Positive',
    description: 'Boostez votre moral et votre énergie',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop',
    tracks: [mockTracks[2]],
    category: 'Motivation',
    mood: 'Énergique'
  }
];
