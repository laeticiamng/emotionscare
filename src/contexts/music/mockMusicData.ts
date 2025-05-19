import { MusicTrack, MusicPlaylist } from '@/types/music';

export const mockTracks: MusicTrack[] = [
  {
    id: "mock-track-1",
    title: "Endless Calm",
    artist: "DeepFlow",
    coverUrl: "/images/music/calm1.jpg",
    audioUrl: "/audio/calm1.mp3",
    duration: 180,
    emotion: "calm",
    intensity: 3,
    tags: "calm,gentle,peaceful",
    albumTitle: '',
  },
  {
    id: "mock-track-2",
    title: "Focus Zone",
    artist: "BrainSync",
    coverUrl: "/images/music/focus1.jpg",
    audioUrl: "/audio/focus1.mp3",
    duration: 210,
    emotion: "focus",
    intensity: 5,
    tags: "focus,study,concentration",
    albumTitle: '',
  },
  {
    id: "mock-track-3",
    title: "Energy Boost",
    artist: "PowerBeats",
    coverUrl: "/images/music/energy1.jpg",
    audioUrl: "/audio/energy1.mp3",
    duration: 150,
    emotion: "energy",
    intensity: 7,
    tags: "energy,workout,motivation",
    albumTitle: '',
  },
  {
    id: "mock-track-4",
    title: "Dream Weaver",
    artist: "SleepCycle",
    coverUrl: "/images/music/sleep1.jpg",
    audioUrl: "/audio/sleep1.mp3",
    duration: 240,
    emotion: "sleep",
    intensity: 2,
    tags: "sleep,relax,night",
    albumTitle: '',
  },
  {
    id: "mock-track-5",
    title: "Inner Peace",
    artist: "ZenMaster",
    coverUrl: "/images/music/meditation1.jpg",
    audioUrl: "/audio/meditation1.mp3",
    duration: 300,
    emotion: "meditation",
    intensity: 4,
    tags: "meditation,yoga,mindfulness",
    albumTitle: '',
  },
  {
    id: "mock-track-6",
    title: "Mellow Mood",
    artist: "ChillWave",
    coverUrl: "/images/music/mood1.jpg",
    audioUrl: "/audio/mood1.mp3",
    duration: 200,
    emotion: "mood",
    intensity: 6,
    tags: "mood,chill,vibes",
    albumTitle: '',
  }
];

export const mockPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-calm",
    title: "Calm Collection",
    description: "Gentle sounds for peaceful moments",
    coverUrl: "/images/playlists/calm.jpg",
    tracks: [],
    mood: "calm",
    category: "relax"
  },
  {
    id: "playlist-focus",
    title: "Focus Tracks",
    description: "Music to enhance your concentration",
    coverUrl: "/images/playlists/focus.jpg",
    tracks: [],
    mood: "focus",
    category: "focus"
  },
  {
    id: "playlist-energy",
    title: "Energy Playlist",
    description: "Uplifting beats to power your day",
    coverUrl: "/images/playlists/energy.jpg",
    tracks: [],
    mood: "energy",
    category: "energy"
  },
  {
    id: "playlist-sleep",
    title: "Sleep Sounds",
    description: "Soothing melodies for a restful night",
    coverUrl: "/images/playlists/sleep.jpg",
    tracks: [],
    mood: "sleep",
    category: "sleep"
  },
  {
    id: "playlist-meditation",
    title: "Meditation Mix",
    description: "Ambient textures for inner peace",
    coverUrl: "/images/playlists/meditation.jpg",
    tracks: [],
    mood: "meditation",
    category: "meditation"
  },
  {
    id: "playlist-mood",
    title: "Mood Booster",
    description: "Eclectic tracks to lift your spirits",
    coverUrl: "/images/playlists/mood.jpg",
    tracks: [],
    mood: "mood",
    category: "mood"
  }
];
