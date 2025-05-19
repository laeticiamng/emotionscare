
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Define relaxing nature sounds
export const relaxingNatureSounds: MusicPlaylist = {
  id: 'nature-sounds-001',
  title: 'Sons de la nature apaisants',
  description: 'Des sons naturels pour favoriser la détente et le calme',
  cover: '/images/music/nature-cover.jpg',
  tracks: [
    {
      id: 'rainforest-morning',
      title: 'Matin dans la forêt tropicale',
      artist: 'Nature Sounds',
      url: '/audio/rainforest-morning.mp3',
      duration: 183,
      mood: 'calm',
      category: ['relaxation', 'nature']
    },
    {
      id: 'ocean-waves',
      title: 'Vagues de l\'océan',
      artist: 'Nature Sounds',
      url: '/audio/ocean-waves.mp3',
      duration: 240,
      mood: 'calm',
      category: ['relaxation', 'nature']
    },
    {
      id: 'thunder-rain',
      title: 'Orage et pluie',
      artist: 'Nature Sounds',
      url: '/audio/thunder-rain.mp3',
      duration: 195,
      mood: 'calm',
      category: ['relaxation', 'nature']
    },
    {
      id: 'mountain-stream',
      title: 'Ruisseau de montagne',
      artist: 'Nature Sounds',
      url: '/audio/mountain-stream.mp3',
      duration: 210,
      mood: 'calm',
      category: ['relaxation', 'nature']
    }
  ],
  mood: 'calm',
  emotion: 'calm',
  category: ['relaxation', 'nature'],
  author: 'EmotionsCare'
};

// Define focus beats
export const focusBeats: MusicPlaylist = {
  id: 'focus-beats-001',
  title: 'Rythmes pour la concentration',
  description: 'Des beats modernes pour améliorer votre concentration',
  cover: '/images/music/focus-cover.jpg',
  tracks: [
    {
      id: 'lofi-study',
      title: 'Lofi Study Session',
      artist: 'Focus Beats',
      url: '/audio/lofi-study.mp3',
      duration: 225,
      mood: 'focus',
      category: ['focus', 'ambient']
    },
    {
      id: 'deep-concentration',
      title: 'Deep Concentration',
      artist: 'Focus Beats',
      url: '/audio/deep-concentration.mp3',
      duration: 192,
      mood: 'focus',
      category: ['focus', 'ambient']
    },
    {
      id: 'alpha-waves',
      title: 'Alpha Waves',
      artist: 'Focus Beats',
      url: '/audio/alpha-waves.mp3',
      duration: 240,
      mood: 'focus',
      category: ['focus', 'ambient']
    }
  ],
  mood: 'focus',
  emotion: 'focus',
  category: ['focus', 'ambient'],
  author: 'EmotionsCare'
};

// Define energy boost
export const energyBoost: MusicPlaylist = {
  id: 'energy-boost-001',
  title: 'Boost d\'énergie',
  description: 'Des morceaux dynamiques pour augmenter votre niveau d\'énergie',
  cover: '/images/music/energy-cover.jpg',
  tracks: [
    {
      id: 'morning-motivation',
      title: 'Morning Motivation',
      artist: 'Energy Boost',
      url: '/audio/morning-motivation.mp3',
      duration: 180,
      mood: 'energetic',
      category: ['energy', 'happiness']
    },
    {
      id: 'power-up',
      title: 'Power Up',
      artist: 'Energy Boost',
      url: '/audio/power-up.mp3',
      duration: 210,
      mood: 'energetic',
      category: ['energy', 'happiness']
    },
    {
      id: 'active-mind',
      title: 'Active Mind',
      artist: 'Energy Boost',
      url: '/audio/active-mind.mp3',
      duration: 195,
      mood: 'energetic',
      category: ['energy', 'happiness']
    }
  ],
  mood: 'energetic',
  emotion: 'energetic',
  category: ['energy', 'happiness'],
  author: 'EmotionsCare'
};

// Define calm meditation
export const calmMeditation: MusicPlaylist = {
  id: 'calm-meditation-001',
  title: 'Méditation calme',
  description: 'Des sons méditatifs pour retrouver sérénité et équilibre',
  cover: '/images/music/meditation-cover.jpg',
  tracks: [
    {
      id: 'zen-garden',
      title: 'Jardin Zen',
      artist: 'Meditation Masters',
      url: '/audio/zen-garden.mp3',
      duration: 240,
      mood: 'calm',
      category: ['meditation', 'relaxation']
    },
    {
      id: 'singing-bowls',
      title: 'Bols Chantants',
      artist: 'Meditation Masters',
      url: '/audio/singing-bowls.mp3',
      duration: 300,
      mood: 'calm',
      category: ['meditation', 'relaxation']
    },
    {
      id: 'healing-chakras',
      title: 'Guérison des Chakras',
      artist: 'Meditation Masters',
      url: '/audio/healing-chakras.mp3',
      duration: 360,
      mood: 'calm',
      category: ['meditation', 'relaxation']
    },
    {
      id: 'deep-breath',
      title: 'Respiration Profonde',
      artist: 'Meditation Masters',
      url: '/audio/deep-breath.mp3',
      duration: 270,
      mood: 'calm',
      category: ['meditation', 'relaxation']
    }
  ],
  mood: 'calm',
  emotion: 'calm',
  category: ['meditation', 'relaxation'],
  author: 'EmotionsCare'
};

// All playlists
export const allPlaylists = [
  relaxingNatureSounds,
  focusBeats,
  energyBoost,
  calmMeditation
];

// Random playlist generator based on mood
export const getRandomPlaylistByMood = (mood: string): MusicPlaylist | null => {
  const matchingPlaylists = allPlaylists.filter(playlist => {
    if (Array.isArray(playlist.mood)) {
      return playlist.mood.includes(mood);
    }
    return playlist.mood === mood;
  });
  
  if (matchingPlaylists.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * matchingPlaylists.length);
  return matchingPlaylists[randomIndex];
};
