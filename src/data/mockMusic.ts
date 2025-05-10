
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock music tracks for different emotions
export const mockMusicTracks: Record<string, MusicTrack[]> = {
  happy: [
    {
      id: 'happy-1',
      title: 'Sunshine Vibes',
      artist: 'Positive Energy',
      duration: 180,
      url: '/audio/happy-1.mp3',
      coverUrl: '/images/covers/happy-1.jpg',
      emotion: 'happy',
      genre: 'pop',
      intensity: 0.8
    },
    {
      id: 'happy-2',
      title: 'Upbeat Journey',
      artist: 'Good Mood',
      duration: 210,
      url: '/audio/happy-2.mp3',
      coverUrl: '/images/covers/happy-2.jpg',
      emotion: 'happy',
      genre: 'electronic',
      intensity: 0.7
    }
  ],
  calm: [
    {
      id: 'calm-1',
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      duration: 240,
      url: '/audio/calm-1.mp3',
      coverUrl: '/images/covers/calm-1.jpg',
      emotion: 'calm',
      genre: 'ambient',
      intensity: 0.3
    },
    {
      id: 'calm-2',
      title: 'Meditation Melody',
      artist: 'Peaceful Mind',
      duration: 300,
      url: '/audio/calm-2.mp3',
      coverUrl: '/images/covers/calm-2.jpg',
      emotion: 'calm',
      genre: 'ambient',
      intensity: 0.2
    }
  ],
  sad: [
    {
      id: 'sad-1',
      title: 'Rainy Day',
      artist: 'Gentle Melancholy',
      duration: 270,
      url: '/audio/sad-1.mp3',
      coverUrl: '/images/covers/sad-1.jpg',
      emotion: 'sad',
      genre: 'acoustic',
      intensity: 0.5
    },
    {
      id: 'sad-2',
      title: 'Solitude',
      artist: 'Deep Feelings',
      duration: 260,
      url: '/audio/sad-2.mp3',
      coverUrl: '/images/covers/sad-2.jpg',
      emotion: 'sad',
      genre: 'piano',
      intensity: 0.6
    }
  ],
  angry: [
    {
      id: 'angry-1',
      title: 'Release',
      artist: 'Catharsis',
      duration: 180,
      url: '/audio/angry-1.mp3',
      coverUrl: '/images/covers/angry-1.jpg',
      emotion: 'angry',
      genre: 'rock',
      intensity: 0.8
    },
    {
      id: 'angry-2',
      title: 'Transform',
      artist: 'Energy Shift',
      duration: 200,
      url: '/audio/angry-2.mp3',
      coverUrl: '/images/covers/angry-2.jpg',
      emotion: 'angry',
      genre: 'electronic',
      intensity: 0.9
    }
  ],
  neutral: [
    {
      id: 'neutral-1',
      title: 'Balance',
      artist: 'Mindful Focus',
      duration: 220,
      url: '/audio/neutral-1.mp3',
      coverUrl: '/images/covers/neutral-1.jpg',
      emotion: 'neutral',
      genre: 'lofi',
      intensity: 0.4
    },
    {
      id: 'neutral-2',
      title: 'Clarity',
      artist: 'Present Moment',
      duration: 240,
      url: '/audio/neutral-2.mp3',
      coverUrl: '/images/covers/neutral-2.jpg',
      emotion: 'neutral',
      genre: 'ambient',
      intensity: 0.5
    }
  ],
  focus: [
    {
      id: 'focus-1',
      title: 'Deep Work',
      artist: 'Concentration',
      duration: 320,
      url: '/audio/focus-1.mp3',
      coverUrl: '/images/covers/focus-1.jpg',
      emotion: 'focus',
      genre: 'electronic',
      intensity: 0.6
    },
    {
      id: 'focus-2',
      title: 'Flow State',
      artist: 'Productivity',
      duration: 280,
      url: '/audio/focus-2.mp3',
      coverUrl: '/images/covers/focus-2.jpg',
      emotion: 'focus',
      genre: 'minimal',
      intensity: 0.5
    }
  ]
};

// Create mock playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'happy-playlist',
    name: 'Happy Vibes',
    description: 'Uplifting tracks to boost your mood',
    tracks: mockMusicTracks.happy,
    coverUrl: '/images/playlists/happy.jpg',
    emotion: 'happy',
    createdAt: new Date().toISOString()
  },
  {
    id: 'calm-playlist',
    name: 'Calming Sounds',
    description: 'Relaxing music for peace and tranquility',
    tracks: mockMusicTracks.calm,
    coverUrl: '/images/playlists/calm.jpg',
    emotion: 'calm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sad-playlist',
    name: 'Melancholy Moments',
    description: 'Music that acknowledges your feelings',
    tracks: mockMusicTracks.sad,
    coverUrl: '/images/playlists/sad.jpg',
    emotion: 'sad',
    createdAt: new Date().toISOString()
  },
  {
    id: 'angry-playlist',
    name: 'Energy Release',
    description: 'Transform tension into positive energy',
    tracks: mockMusicTracks.angry,
    coverUrl: '/images/playlists/angry.jpg',
    emotion: 'angry',
    createdAt: new Date().toISOString()
  },
  {
    id: 'focus-playlist',
    name: 'Deep Focus',
    description: 'Music for concentration and productivity',
    tracks: mockMusicTracks.focus,
    coverUrl: '/images/playlists/focus.jpg',
    emotion: 'focus',
    createdAt: new Date().toISOString()
  }
];

// Function to get a playlist by emotion
export const getPlaylistByEmotion = (emotion: string): MusicPlaylist => {
  const normalizedEmotion = emotion.toLowerCase();
  const directMatch = mockPlaylists.find(p => p.emotion === normalizedEmotion);
  
  if (directMatch) return directMatch;
  
  // Map emotions to playlist categories
  const emotionMap: Record<string, string> = {
    happy: 'happy',
    joyful: 'happy',
    excited: 'happy',
    content: 'happy',
    
    calm: 'calm',
    peaceful: 'calm',
    relaxed: 'calm',
    serene: 'calm',
    
    sad: 'sad',
    melancholy: 'sad',
    depressed: 'sad',
    down: 'sad',
    
    angry: 'angry',
    frustrated: 'angry',
    irritated: 'angry',
    annoyed: 'angry',
    
    anxious: 'calm', // Anxious people often need calming music
    stressed: 'calm',
    
    neutral: 'focus',
    focused: 'focus'
  };
  
  const mappedEmotion = emotionMap[normalizedEmotion] || 'focus'; // Default to focus
  return mockPlaylists.find(p => p.emotion === mappedEmotion) || mockPlaylists[0];
};

// Function to get tracks by emotion
export const getTracksByEmotion = (emotion: string): MusicTrack[] => {
  const normalizedEmotion = emotion.toLowerCase();
  
  if (mockMusicTracks[normalizedEmotion]) {
    return mockMusicTracks[normalizedEmotion];
  }
  
  // Map emotions to track categories similar to the playlist mapping
  const emotionMap: Record<string, string> = {
    happy: 'happy',
    joyful: 'happy',
    excited: 'happy',
    
    calm: 'calm',
    peaceful: 'calm',
    relaxed: 'calm',
    
    sad: 'sad',
    melancholy: 'sad',
    depressed: 'sad',
    
    angry: 'angry',
    frustrated: 'angry',
    irritated: 'angry',
    
    anxious: 'calm',
    stressed: 'calm',
    
    neutral: 'focus',
    focused: 'focus'
  };
  
  const mappedEmotion = emotionMap[normalizedEmotion] || 'focus';
  return mockMusicTracks[mappedEmotion] || mockMusicTracks.neutral;
};
