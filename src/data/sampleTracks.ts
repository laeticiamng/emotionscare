/**
 * Pistes audio de démonstration (domaine public)
 */
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Utilisation de fichiers audio libres de droits
export const sampleTracks: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Peaceful Morning',
    artist: 'Ambient Sounds',
    duration: 180,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Ambient',
    mood: 'calm',
  },
  {
    id: 'track-2',
    title: 'Focus Flow',
    artist: 'Concentration Music',
    duration: 240,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Lo-Fi',
    mood: 'focus',
  },
  {
    id: 'track-3',
    title: 'Energy Boost',
    artist: 'Workout Beats',
    duration: 200,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Electronic',
    mood: 'energy',
  },
  {
    id: 'track-4',
    title: 'Joyful Moments',
    artist: 'Happy Tunes',
    duration: 195,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Pop',
    mood: 'joy',
  },
  {
    id: 'track-5',
    title: 'Deep Relaxation',
    artist: 'Meditation Guide',
    duration: 300,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Meditation',
    mood: 'calm',
  },
  {
    id: 'track-6',
    title: 'Creative Spark',
    artist: 'Inspiration Waves',
    duration: 210,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Classical',
    mood: 'focus',
  },
];

export const samplePlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-calm',
    name: 'Calme & Sérénité',
    description: 'Musiques apaisantes pour la relaxation et la méditation',
    tracks: sampleTracks.filter(t => t.mood === 'calm'),
    mood: 'calm',
  },
  {
    id: 'playlist-focus',
    name: 'Concentration Maximale',
    description: 'Restez concentré avec ces morceaux instrumentaux',
    tracks: sampleTracks.filter(t => t.mood === 'focus'),
    mood: 'focus',
  },
  {
    id: 'playlist-energy',
    name: 'Boost d\'Énergie',
    description: 'Musiques dynamiques pour booster votre journée',
    tracks: sampleTracks.filter(t => t.mood === 'energy' || t.mood === 'joy'),
    mood: 'energy',
  },
  {
    id: 'playlist-all',
    name: 'Toutes les pistes',
    description: 'L\'intégrale de notre bibliothèque musicale',
    tracks: sampleTracks,
  },
];

export default { sampleTracks, samplePlaylists };
