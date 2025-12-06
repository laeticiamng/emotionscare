// @ts-nocheck
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const musicTracks: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Calm Waters',
    artist: 'Ocean Sounds',
    url: '/audio/calm-waters.mp3',
    audioUrl: '/audio/calm-waters.mp3',
    duration: 180,
    emotion: 'calm',
    mood: 'relaxed',
    intensity: 0.3,
    coverUrl: '/images/covers/calm-waters.jpg',
    tags: ['nature', 'meditation', 'sleep'],
    category: ['relax']
  },
  {
    id: 'track-2',
    title: 'Deep Focus',
    artist: 'Brain Waves',
    url: '/audio/deep-focus.mp3',
    audioUrl: '/audio/deep-focus.mp3',
    duration: 240,
    emotion: 'focused',
    mood: 'concentrated',
    intensity: 0.5,
    coverUrl: '/images/covers/deep-focus.jpg',
    tags: ['focus', 'work', 'study'],
    category: ['focus']
  },
  {
    id: 'track-3',
    title: 'Energy Boost',
    artist: 'Workout Mix',
    url: '/audio/energy-boost.mp3',
    audioUrl: '/audio/energy-boost.mp3',
    duration: 160,
    emotion: 'energetic',
    mood: 'motivated',
    intensity: 0.8,
    coverUrl: '/images/covers/energy-boost.jpg',
    tags: ['workout', 'energy', 'motivation'],
    category: ['energy']
  },
  {
    id: 'track-4',
    title: 'Peaceful Mind',
    artist: 'Meditation Masters',
    url: '/audio/peaceful-mind.mp3',
    audioUrl: '/audio/peaceful-mind.mp3',
    duration: 300,
    emotion: 'peaceful',
    mood: 'calm',
    intensity: 0.2,
    coverUrl: '/images/covers/peaceful-mind.jpg',
    tags: ['meditation', 'relax', 'mindfulness'],
    category: ['meditation']
  },
  {
    id: 'track-5',
    title: 'Happy Vibes',
    artist: 'Joy Makers',
    url: '/audio/happy-vibes.mp3',
    audioUrl: '/audio/happy-vibes.mp3',
    duration: 200,
    emotion: 'happy',
    mood: 'joyful',
    intensity: 0.7,
    coverUrl: '/images/covers/happy-vibes.jpg',
    tags: ['happy', 'joyful', 'uplifting'],
    category: ['mood']
  },
  {
    id: 'track-6',
    title: 'Emotional Release',
    artist: 'Soul Therapy',
    url: '/audio/emotional-release.mp3',
    audioUrl: '/audio/emotional-release.mp3',
    duration: 280,
    emotion: 'sad',
    mood: 'reflective',
    intensity: 0.4,
    coverUrl: '/images/covers/emotional-release.jpg',
    tags: ['emotional', 'reflective', 'cathartic'],
    category: ['mood']
  }
];

export const musicPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-1',
    title: 'Relaxation Collection',
    name: 'Relaxation Collection',
    description: 'Soothing sounds to help you relax and unwind',
    coverUrl: '/images/covers/relaxation.jpg',
    tracks: musicTracks.filter(track => 
      (Array.isArray(track.category) && track.category.includes('relax')) || 
      track.emotion === 'calm' || 
      track.emotion === 'peaceful'
    ),
    emotion: 'calm',
    mood: 'relaxed',
    category: ['relax']
  },
  {
    id: 'playlist-2',
    title: 'Focus & Productivity',
    name: 'Focus & Productivity',
    description: 'Music designed to enhance concentration and productivity',
    coverUrl: '/images/covers/focus.jpg',
    tracks: musicTracks.filter(track => 
      (Array.isArray(track.category) && track.category.includes('focus')) || 
      track.emotion === 'focused'
    ),
    emotion: 'focused',
    mood: 'concentrated',
    category: ['focus']
  },
  {
    id: 'playlist-3',
    title: 'Energy & Motivation',
    name: 'Energy & Motivation',
    description: 'Boost your energy and find motivation',
    coverUrl: '/images/covers/energy.jpg',
    tracks: musicTracks.filter(track => 
      (Array.isArray(track.category) && track.category.includes('energy')) || 
      track.emotion === 'energetic'
    ),
    emotion: 'energetic',
    mood: 'motivated',
    category: ['energy']
  },
  {
    id: 'playlist-4',
    title: 'Sleep & Dreams',
    name: 'Sleep & Dreams',
    description: 'Gentle sounds to help you fall asleep',
    coverUrl: '/images/covers/sleep.jpg',
    tracks: musicTracks.filter(track => 
      (Array.isArray(track.category) && track.category.includes('sleep')) || 
      track.emotion === 'sleepy'
    ),
    emotion: 'sleepy',
    mood: 'drowsy',
    category: ['sleep']
  },
  {
    id: 'playlist-5',
    title: 'Happy Mood',
    name: 'Happy Mood',
    description: 'Music to lift your spirits',
    coverUrl: '/images/covers/happy.jpg',
    tracks: musicTracks.filter(track => track.emotion === 'happy'),
    emotion: 'happy',
    mood: 'joyful',
    category: ['mood']
  },
  {
    id: 'playlist-6',
    title: 'Emotional Journey',
    name: 'Emotional Journey',
    description: 'Music for emotional release',
    coverUrl: '/images/covers/emotional.jpg',
    tracks: musicTracks.filter(track => track.emotion === 'sad'),
    emotion: 'sad',
    mood: 'reflective',
    category: ['mood']
  }
];

// Helper function to find playlist by mood
export const findPlaylistByMood = (mood: string): MusicPlaylist | undefined => {
  return musicPlaylists.find(playlist => 
    playlist.mood === mood || 
    playlist.emotion === mood || 
    (Array.isArray(playlist.category) && playlist.category.includes(mood))
  );
};
