
import { MusicPlaylist, MusicTrack } from '@/types';

// Create mock tracks for testing purposes
const meditationTracks: MusicTrack[] = [
  {
    id: 'med-1',
    title: 'Breathing Calm',
    artist: 'Nature Sounds',
    duration: 300,
    url: '/audio/meditation/breathing-calm.mp3',
    cover: '/images/music/meditation/breathing-calm.jpg',
    emotion: 'calm',
    category: 'meditation'
  },
  {
    id: 'med-2',
    title: 'Ocean Waves',
    artist: 'Ocean Sounds',
    duration: 360,
    url: '/audio/meditation/ocean-waves.mp3',
    cover: '/images/music/meditation/ocean-waves.jpg',
    emotion: 'peaceful',
    category: 'meditation'
  },
  {
    id: 'med-3',
    title: 'Forest Morning',
    artist: 'Nature Sounds',
    duration: 420,
    url: '/audio/meditation/forest-morning.mp3',
    cover: '/images/music/meditation/forest-morning.jpg',
    emotion: 'refreshed',
    category: 'meditation'
  }
];

const focusTracks: MusicTrack[] = [
  {
    id: 'focus-1',
    title: 'Deep Focus',
    artist: 'Concentration Music',
    duration: 600,
    url: '/audio/focus/deep-focus.mp3',
    cover: '/images/music/focus/deep-focus.jpg',
    emotion: 'focused',
    category: 'focus'
  },
  {
    id: 'focus-2',
    title: 'Study Session',
    artist: 'Brain Waves',
    duration: 720,
    url: '/audio/focus/study-session.mp3',
    cover: '/images/music/focus/study-session.jpg',
    emotion: 'attentive',
    category: 'focus'
  }
];

const energyTracks: MusicTrack[] = [
  {
    id: 'energy-1',
    title: 'Morning Boost',
    artist: 'Energy Flow',
    duration: 240,
    url: '/audio/energy/morning-boost.mp3',
    cover: '/images/music/energy/morning-boost.jpg',
    emotion: 'energized',
    category: 'energy'
  },
  {
    id: 'energy-2',
    title: 'Power Up',
    artist: 'Motivation Mix',
    duration: 280,
    url: '/audio/energy/power-up.mp3',
    cover: '/images/music/energy/power-up.jpg',
    emotion: 'motivated',
    category: 'energy'
  }
];

// Create mock playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'meditation',
    name: 'Méditation et calme',
    tracks: meditationTracks,
    emotion: 'calm',
    category: 'meditation',
    description: 'Des sons apaisants pour méditer et se relaxer',
    coverUrl: '/images/music/playlists/meditation.jpg'
  },
  {
    id: 'focus',
    name: 'Concentration et travail',
    tracks: focusTracks,
    emotion: 'focused',
    category: 'focus',
    description: 'Musique pour améliorer votre concentration et productivité',
    coverUrl: '/images/music/playlists/focus.jpg'
  },
  {
    id: 'energy',
    name: 'Énergie et motivation',
    tracks: energyTracks,
    emotion: 'energized',
    category: 'energy',
    description: 'Donnez-vous un coup de boost avec cette playlist énergisante',
    coverUrl: '/images/music/playlists/energy.jpg'
  }
];

// All tracks combined
export const allTracks: MusicTrack[] = [
  ...meditationTracks,
  ...focusTracks,
  ...energyTracks
];

export default { mockPlaylists, allTracks };
