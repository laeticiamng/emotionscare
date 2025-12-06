
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Define mock tracks
export const mockTracks: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Calm Waters',
    artist: 'Ocean Sounds',
    audioUrl: '/audio/calm-waters.mp3',
    url: '/audio/calm-waters.mp3',
    coverUrl: '/images/covers/calm-waters.jpg',
    duration: 180,
    emotion: 'calm',
    mood: 'relaxed',
    intensity: 0.3,
    tags: ['nature', 'meditation', 'sleep'],
    category: ['relax']
  },
  {
    id: 'track-2',
    title: 'Deep Focus',
    artist: 'Brain Waves',
    audioUrl: '/audio/deep-focus.mp3',
    url: '/audio/deep-focus.mp3',
    coverUrl: '/images/covers/deep-focus.jpg',
    duration: 240,
    emotion: 'focused',
    mood: 'concentrated',
    intensity: 0.5,
    tags: ['focus', 'work', 'study'],
    category: ['focus']
  },
  {
    id: 'track-3',
    title: 'Energy Boost',
    artist: 'Workout Mix',
    audioUrl: '/audio/energy-boost.mp3',
    url: '/audio/energy-boost.mp3',
    coverUrl: '/images/covers/energy-boost.jpg',
    duration: 160,
    emotion: 'energetic',
    mood: 'motivated',
    intensity: 0.8,
    tags: ['workout', 'energy', 'motivation'],
    category: ['energy']
  },
  {
    id: 'track-4',
    title: 'Peaceful Mind',
    artist: 'Meditation Masters',
    audioUrl: '/audio/peaceful-mind.mp3',
    url: '/audio/peaceful-mind.mp3',
    coverUrl: '/images/covers/peaceful-mind.jpg',
    duration: 300,
    emotion: 'peaceful',
    mood: 'calm',
    intensity: 0.2,
    tags: ['meditation', 'relax', 'mindfulness'],
    category: ['meditation']
  },
  {
    id: 'track-5',
    title: 'Happy Vibes',
    artist: 'Joy Makers',
    audioUrl: '/audio/happy-vibes.mp3',
    url: '/audio/happy-vibes.mp3',
    coverUrl: '/images/covers/happy-vibes.jpg',
    duration: 200,
    emotion: 'happy',
    mood: 'joyful',
    intensity: 0.7,
    tags: ['happy', 'joyful', 'uplifting'],
    category: ['mood']
  },
  {
    id: 'track-6',
    title: 'Emotional Release',
    artist: 'Soul Therapy',
    audioUrl: '/audio/emotional-release.mp3',
    url: '/audio/emotional-release.mp3',
    coverUrl: '/images/covers/emotional-release.jpg',
    duration: 280,
    emotion: 'sad',
    mood: 'reflective',
    intensity: 0.4,
    tags: ['emotional', 'reflective', 'cathartic'],
    category: ['mood']
  },
  {
    id: 'track-7',
    title: 'Stress Relief',
    artist: 'Anxiety Free',
    audioUrl: '/audio/stress-relief.mp3',
    url: '/audio/stress-relief.mp3',
    coverUrl: '/images/covers/stress-relief.jpg',
    duration: 320,
    emotion: 'relaxed',
    mood: 'calm',
    intensity: 0.3,
    tags: ['stress', 'anxiety', 'relief'],
    category: ['relax']
  },
  {
    id: 'track-8',
    title: 'Dream Journey',
    artist: 'Sleep Well',
    audioUrl: '/audio/dream-journey.mp3',
    url: '/audio/dream-journey.mp3',
    coverUrl: '/images/covers/dream-journey.jpg',
    duration: 360,
    emotion: 'sleepy',
    mood: 'drowsy',
    intensity: 0.1,
    tags: ['sleep', 'dreams', 'night'],
    category: ['sleep']
  }
];

// Define mock playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-1',
    title: 'Relaxation Collection',
    name: 'Relaxation Collection',
    description: 'Soothing sounds to help you relax and unwind',
    coverUrl: '/images/covers/relaxation.jpg',
    coverImage: '/images/covers/relaxation.jpg',
    tracks: mockTracks.filter(track => 
      (Array.isArray(track.category) && track.category.includes('relax')) || 
      track.emotion === 'calm' || 
      track.emotion === 'peaceful'
    ),
    emotion: 'calm',
    mood: 'relaxed',
    tags: ['relax', 'calm', 'peace'],
    category: ['relax']
  },
  {
    id: 'playlist-2',
    title: 'Focus & Productivity',
    name: 'Focus & Productivity',
    description: 'Music designed to enhance concentration and productivity',
    coverUrl: '/images/covers/focus.jpg',
    coverImage: '/images/covers/focus.jpg',
    tracks: mockTracks.filter(track => 
      (Array.isArray(track.category) && track.category.includes('focus')) || 
      track.emotion === 'focused'
    ),
    emotion: 'focused',
    mood: 'concentrated',
    tags: ['focus', 'work', 'study'],
    category: ['focus']
  },
  {
    id: 'playlist-3',
    title: 'Energy & Motivation',
    name: 'Energy & Motivation',
    description: 'Boost your energy and find motivation',
    coverUrl: '/images/covers/energy.jpg',
    coverImage: '/images/covers/energy.jpg',
    tracks: mockTracks.filter(track => 
      (Array.isArray(track.category) && track.category.includes('energy')) || 
      track.emotion === 'energetic' ||
      track.emotion === 'happy'
    ),
    emotion: 'energetic',
    mood: 'motivated',
    tags: ['energy', 'motivation', 'workout'],
    category: ['energy']
  },
  {
    id: 'playlist-4',
    title: 'Sleep & Dreams',
    name: 'Sleep & Dreams',
    description: 'Gentle sounds to help you fall asleep',
    coverUrl: '/images/covers/sleep.jpg',
    coverImage: '/images/covers/sleep.jpg',
    tracks: mockTracks.filter(track => 
      (Array.isArray(track.category) && track.category.includes('sleep')) || 
      track.emotion === 'sleepy'
    ),
    emotion: 'sleepy',
    mood: 'drowsy',
    tags: ['sleep', 'night', 'dreams'],
    category: ['sleep']
  }
];
