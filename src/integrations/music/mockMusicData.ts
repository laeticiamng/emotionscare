
/**
 * MOCK DATA
 * Ce fichier respecte strictement les types officiels MusicTrack et MusicPlaylist
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

export const mockMusicTracks = [
  {
    id: '1',
    title: 'Peaceful Mind',
    artist: 'Ambient Sounds',
    duration: 180,
    audioUrl: '/sounds/peaceful-mind.mp3',
    coverUrl: '/images/music/peaceful-cover.jpg',
    emotion: 'calm',
    category: 'meditation'
  },
  {
    id: '2',
    title: 'Focus Flow',
    artist: 'Deep Concentration',
    duration: 240,
    audioUrl: '/sounds/focus-flow.mp3',
    coverUrl: '/images/music/focus-cover.jpg',
    emotion: 'focus',
    category: 'productivity'
  },
  {
    id: '3',
    title: 'Morning Energy',
    artist: 'Positive Vibes',
    duration: 190,
    audioUrl: '/sounds/morning-energy.mp3',
    coverUrl: '/images/music/energy-cover.jpg',
    emotion: 'energetic',
    category: 'motivation'
  },
  {
    id: '4',
    title: 'Evening Relaxation',
    artist: 'Sleep Well',
    duration: 300,
    audioUrl: '/sounds/evening-relax.mp3',
    coverUrl: '/images/music/relax-cover.jpg',
    emotion: 'relax',
    category: 'sleep'
  }
];

export default mockMusicTracks;
