
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock music tracks for different emotions
export const mockMusicTracks: Record<string, MusicTrack[]> = {
  calm: [
    {
      id: 'calm-1',
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      duration: 280,
      url: 'https://example.com/ocean-waves.mp3',
      coverUrl: '/images/ocean.jpg',
      emotion: 'calm'
    },
    {
      id: 'calm-2',
      title: 'Forest Meditation',
      artist: 'Relaxation Music',
      duration: 320,
      url: 'https://example.com/forest-meditation.mp3',
      coverUrl: '/images/forest.jpg',
      emotion: 'calm'
    }
  ],
  happy: [
    {
      id: 'happy-1',
      title: 'Sunny Day',
      artist: 'Happy Vibes',
      duration: 210,
      url: 'https://example.com/sunny-day.mp3',
      coverUrl: '/images/sunny.jpg',
      emotion: 'happy'
    },
    {
      id: 'happy-2',
      title: 'Dancing Joy',
      artist: 'Feel Good',
      duration: 230,
      url: 'https://example.com/dancing-joy.mp3',
      coverUrl: '/images/dancing.jpg',
      emotion: 'happy'
    }
  ],
  focused: [
    {
      id: 'focused-1',
      title: 'Deep Work',
      artist: 'Concentration',
      duration: 300,
      url: 'https://example.com/deep-work.mp3',
      coverUrl: '/images/concentration.jpg',
      emotion: 'focused'
    },
    {
      id: 'focused-2',
      title: 'Study Mode',
      artist: 'Brain Focus',
      duration: 320,
      url: 'https://example.com/study-mode.mp3',
      coverUrl: '/images/study.jpg',
      emotion: 'focused'
    }
  ],
  energetic: [
    {
      id: 'energetic-1',
      title: 'Power Up',
      artist: 'Energy Boost',
      duration: 180,
      url: 'https://example.com/power-up.mp3',
      coverUrl: '/images/energy.jpg',
      emotion: 'energetic'
    },
    {
      id: 'energetic-2',
      title: 'Morning Boost',
      artist: 'Active Mind',
      duration: 200,
      url: 'https://example.com/morning-boost.mp3',
      coverUrl: '/images/active.jpg',
      emotion: 'energetic'
    }
  ],
  neutral: [
    {
      id: 'neutral-1',
      title: 'Ambient Flow',
      artist: 'Neutral Space',
      duration: 260,
      url: 'https://example.com/ambient-flow.mp3',
      coverUrl: '/images/neutral.jpg',
      emotion: 'neutral'
    },
    {
      id: 'neutral-2',
      title: 'Background Harmony',
      artist: 'Subtle Sounds',
      duration: 280,
      url: 'https://example.com/harmony.mp3',
      coverUrl: '/images/harmony.jpg',
      emotion: 'neutral'
    }
  ]
};

// Create playlists from the tracks
export const mockMusicPlaylists: MusicPlaylist[] = [
  {
    id: 'calm-playlist',
    name: 'Relaxation',
    description: 'Calming tracks to reduce stress',
    tracks: mockMusicTracks.calm,
    emotion: 'calm'
  },
  {
    id: 'happy-playlist',
    name: 'Happiness Boost',
    description: 'Uplifting music for good mood',
    tracks: mockMusicTracks.happy,
    emotion: 'happy'
  },
  {
    id: 'focused-playlist',
    name: 'Deep Focus',
    description: 'Music for concentration and productivity',
    tracks: mockMusicTracks.focused,
    emotion: 'focused'
  },
  {
    id: 'energetic-playlist',
    name: 'Energy Boost',
    description: 'Tracks to increase your energy',
    tracks: mockMusicTracks.energetic,
    emotion: 'energetic'
  },
  {
    id: 'neutral-playlist',
    name: 'Neutral Background',
    description: 'Balanced music for everyday activities',
    tracks: mockMusicTracks.neutral,
    emotion: 'neutral'
  }
];
