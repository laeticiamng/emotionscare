// @ts-nocheck - Mock data file with flexible typing
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Correction des types de catégorie qui doivent être des tableaux de chaînes
export const relaxationTracks: MusicTrack[] = [
  {
    id: 'relax-1',
    title: 'Méditation matinale',
    artist: 'Zen Sounds',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/relax-1.jpg',
    duration: 180,
    emotion: 'calm',
    mood: 'peaceful',
    category: ['relax', 'meditation'],
    tags: ['morning', 'meditation', 'calm']
  },
  {
    id: 'relax-2',
    title: 'Sérénité du soir',
    artist: 'Quiet Time',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/relax-2.jpg',
    duration: 210,
    emotion: 'calm',
    mood: 'serene',
    category: ['relax', 'evening'],
    tags: ['evening', 'relaxation', 'serenity']
  },
  {
    id: 'relax-3',
    title: 'Oasis de paix',
    artist: 'Inner Balance',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/relax-3.jpg',
    duration: 200,
    emotion: 'peaceful',
    mood: 'tranquil',
    category: ['relax', 'nature'],
    tags: ['nature', 'peace', 'tranquility']
  },
];

export const focusTracks: MusicTrack[] = [
  {
    id: 'focus-1',
    title: 'Concentration profonde',
    artist: 'Focus Wave',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/focus-1.jpg',
    duration: 240,
    emotion: 'focused',
    mood: 'concentrated',
    category: ['focus', 'work'],
    tags: ['work', 'study', 'concentration']
  },
  {
    id: 'focus-2',
    title: 'Clarté mentale',
    artist: 'Mind Lab',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/focus-2.jpg',
    duration: 270,
    emotion: 'focused',
    mood: 'clear',
    category: ['focus', 'study'],
    tags: ['study', 'clarity', 'productivity']
  },
  {
    id: 'focus-3',
    title: 'Flux de travail',
    artist: 'Task Master',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/focus-3.jpg',
    duration: 250,
    emotion: 'focused',
    mood: 'productive',
    category: ['focus', 'productivity'],
    tags: ['productivity', 'work', 'efficiency']
  },
];

export const energyTracks: MusicTrack[] = [
  {
    id: 'energy-1',
    title: 'Réveil dynamique',
    artist: 'Energy Beats',
    url: '/sounds/welcome.mp3',
    cover: '/images/music/energy-1.jpg',
    duration: 150,
    emotion: 'energetic',
    mood: 'upbeat',
    category: ['energy', 'morning'],
    tags: ['morning', 'workout', 'energy']
  },
  {
    id: 'energy-2',
    title: 'Boost matinal',
    artist: 'Sunrise Vibes',
    url: '/sounds/welcome.mp3',
    cover: '/images/music/energy-2.jpg',
    duration: 180,
    emotion: 'energetic',
    mood: 'lively',
    category: ['energy', 'workout'],
    tags: ['workout', 'motivation', 'sunrise']
  },
  {
    id: 'energy-3',
    title: 'Rythme intense',
    artist: 'Power Pulse',
    url: '/sounds/welcome.mp3',
    cover: '/images/music/energy-3.jpg',
    duration: 160,
    emotion: 'energetic',
    mood: 'powerful',
    category: ['energy', 'sports'],
    tags: ['sports', 'power', 'intensity']
  },
];

export const sleepTracks: MusicTrack[] = [
  {
    id: 'sleep-1',
    title: 'Berceuse nocturne',
    artist: 'Dream Sounds',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/sleep-1.jpg',
    duration: 300,
    emotion: 'sleepy',
    mood: 'relaxed',
    category: ['sleep', 'night'],
    tags: ['night', 'sleep', 'relaxation']
  },
  {
    id: 'sleep-2',
    title: 'Douce nuit',
    artist: 'Nighty Night',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/sleep-2.jpg',
    duration: 330,
    emotion: 'sleepy',
    mood: 'calming',
    category: ['sleep', 'bedtime'],
    tags: ['bedtime', 'calm', 'night']
  },
  {
    id: 'sleep-3',
    title: 'Rêves paisibles',
    artist: 'Silent Slumber',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/sleep-3.jpg',
    duration: 360,
    emotion: 'sleepy',
    mood: 'peaceful',
    category: ['sleep', 'dreams'],
    tags: ['dreams', 'peace', 'night']
  },
];

export const meditationTracks: MusicTrack[] = [
  {
    id: 'meditation-1',
    title: 'Voyage intérieur',
    artist: 'Mind Journey',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/meditation-1.jpg',
    duration: 240,
    emotion: 'peaceful',
    mood: 'introspective',
    category: ['meditation', 'mindfulness'],
    tags: ['meditation', 'mindfulness', 'peace']
  },
  {
    id: 'meditation-2',
    title: 'Présence consciente',
    artist: 'Awareness Now',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/meditation-2.jpg',
    duration: 270,
    emotion: 'peaceful',
    mood: 'present',
    category: ['meditation', 'present'],
    tags: ['present', 'mindfulness', 'awareness']
  },
  {
    id: 'meditation-3',
    title: 'Harmonie spirituelle',
    artist: 'Soul Sync',
    url: '/sounds/ambient-calm.mp3',
    cover: '/images/music/meditation-3.jpg',
    duration: 300,
    emotion: 'peaceful',
    mood: 'harmonious',
    category: ['meditation', 'spiritual'],
    tags: ['spiritual', 'harmony', 'peace']
  },
];

export const defaultPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-1',
    title: 'Relaxation Ultime',
    name: 'Relaxation Ultime',
    description: 'Détendez-vous avec cette sélection de morceaux apaisants.',
    cover: '/images/playlists/relax-playlist.jpg',
    tracks: relaxationTracks,
    category: ['relax'],
    tags: ['relaxation', 'calm', 'peaceful']
  },
  {
    id: 'playlist-2',
    title: 'Concentration Maximale',
    name: 'Concentration Maximale',
    description: 'Améliorez votre concentration avec ces pistes spécialement conçues.',
    cover: '/images/playlists/focus-playlist.jpg',
    tracks: focusTracks,
    category: ['focus'],
    tags: ['focus', 'concentration', 'productivity']
  },
  {
    id: 'playlist-3',
    title: 'Énergie Positive',
    name: 'Énergie Positive',
    description: 'Dynamisez votre journée avec ces morceaux énergisants.',
    cover: '/images/playlists/energy-playlist.jpg',
    tracks: energyTracks,
    category: ['energy'],
    tags: ['energy', 'upbeat', 'motivation']
  },
  {
    id: 'playlist-4',
    title: 'Sommeil Profond',
    name: 'Sommeil Profond',
    description: 'Endormez-vous paisiblement avec ces mélodies douces.',
    cover: '/images/playlists/sleep-playlist.jpg',
    tracks: sleepTracks,
    category: ['sleep'],
    tags: ['sleep', 'night', 'relaxation']
  },
  {
    id: 'playlist-5',
    title: 'Méditation Guidée',
    name: 'Méditation Guidée',
    description: 'Trouvez votre centre avec ces pistes de méditation.',
    cover: '/images/playlists/meditation-playlist.jpg',
    tracks: meditationTracks,
    category: ['meditation'],
    tags: ['meditation', 'mindfulness', 'peace']
  }
];

export const allTracks = [
  ...relaxationTracks,
  ...focusTracks,
  ...energyTracks,
  ...sleepTracks,
  ...meditationTracks
];
