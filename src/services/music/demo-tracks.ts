/**
 * 🎵 DÉMONSTRATION - TRACKS MUSICALES
 * Données de démonstration pour les fonctionnalités musicales
 */

import { MusicTrack } from '@/types/music';

export const demoTracks: MusicTrack[] = [
  {
    id: 'demo-calm-1',
    title: 'Océan Tranquille',
    artist: 'Nature Sounds AI',
    duration: 240,
    url: '/audio/demo/ocean-calm.mp3',
    emotion: 'calm',
    genre: 'ambient',
    bpm: 60,
    energy: 0.2,
    valence: 0.7,
    coverUrl: '/images/covers/ocean-calm.jpg'
  },
  {
    id: 'demo-energetic-1',
    title: 'Énergie Matinale',
    artist: 'AI Motivator',
    duration: 180,
    url: '/audio/demo/morning-energy.mp3',
    emotion: 'energetic',
    genre: 'electronic',
    bpm: 128,
    energy: 0.8,
    valence: 0.9,
    coverUrl: '/images/covers/morning-energy.jpg'
  },
  {
    id: 'demo-happy-1',
    title: 'Rayons de Soleil',
    artist: 'Positive Vibes AI',
    duration: 200,
    url: '/audio/demo/sunshine-rays.mp3',
    emotion: 'happy',
    genre: 'pop',
    bpm: 110,
    energy: 0.7,
    valence: 0.9,
    coverUrl: '/images/covers/sunshine.jpg'
  },
  {
    id: 'demo-focused-1',
    title: 'Concentration Profonde',
    artist: 'Focus AI',
    duration: 300,
    url: '/audio/demo/deep-focus.mp3',
    emotion: 'focused',
    genre: 'ambient',
    bpm: 70,
    energy: 0.4,
    valence: 0.5,
    coverUrl: '/images/covers/focus.jpg'
  },
  {
    id: 'demo-sad-1',
    title: 'Mélodie Réconfortante',
    artist: 'Healing AI',
    duration: 220,
    url: '/audio/demo/comforting-melody.mp3',
    emotion: 'sad',
    genre: 'classical',
    bpm: 55,
    energy: 0.3,
    valence: 0.4,
    coverUrl: '/images/covers/comfort.jpg'
  },
  {
    id: 'demo-relaxed-1',
    title: 'Détente Totale',
    artist: 'Zen AI',
    duration: 360,
    url: '/audio/demo/total-relaxation.mp3',
    emotion: 'relaxed',
    genre: 'meditation',
    bpm: 45,
    energy: 0.1,
    valence: 0.8,
    coverUrl: '/images/covers/zen.jpg'
  }
];

export const demoPlaylists = {
  calm: demoTracks.filter(track => ['calm', 'relaxed'].includes(track.emotion)),
  energetic: demoTracks.filter(track => ['energetic', 'happy'].includes(track.emotion)),
  focused: demoTracks.filter(track => ['focused'].includes(track.emotion)),
  emotional: demoTracks.filter(track => ['sad'].includes(track.emotion))
};

export default demoTracks;