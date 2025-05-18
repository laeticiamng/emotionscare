
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const mockMusicTracks: MusicTrack[] = [
  {
    id: "1",
    title: "Calming Waves",
    artist: "Ocean Sounds",
    duration: 180,
    audioUrl: "/audio/calming-waves.mp3",
    coverUrl: "/images/ocean.jpg",
    emotion: "calm",
    category: "nature",
    tags: ["relaxation", "sleep", "meditation"],
    genre: "ambient",
    album: "Nature Sounds Vol.1",
    year: 2023
  },
  {
    id: "2",
    title: "Happy Morning",
    artist: "Sunrise Vibes",
    duration: 210,
    audioUrl: "/audio/happy-morning.mp3",
    coverUrl: "/images/sunrise.jpg",
    emotion: "happy",
    category: "upbeat",
    tags: ["morning", "motivation", "positive"],
    genre: "acoustic",
    album: "Morning Playlist",
    year: 2023
  },
  {
    id: "3",
    title: "Focus Flow",
    artist: "Mind Clarity",
    duration: 240,
    audioUrl: "/audio/focus-flow.mp3",
    coverUrl: "/images/focus.jpg",
    emotion: "focus",
    category: "productivity",
    tags: ["concentration", "work", "study"],
    genre: "electronic",
    album: "Deep Focus",
    year: 2023
  }
];

export const mockPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-calm",
    name: "Calming Collection",
    description: "Peaceful sounds to help you relax and unwind",
    tracks: mockMusicTracks.filter(track => track.emotion === "calm" || track.category === "nature"),
    emotion: "calm",
    category: "relaxation",
    coverUrl: "/images/playlist-calm.jpg",
    coverImage: "/images/playlist-calm.jpg",
    tags: ["relax", "peace", "meditation"]
  },
  {
    id: "playlist-happy",
    name: "Happiness Boost",
    description: "Upbeat tracks to brighten your mood",
    tracks: mockMusicTracks.filter(track => track.emotion === "happy" || track.category === "upbeat"),
    emotion: "happy",
    category: "mood",
    coverUrl: "/images/playlist-happy.jpg",
    coverImage: "/images/playlist-happy.jpg",
    tags: ["happy", "energy", "positive"]
  },
  {
    id: "playlist-focus",
    name: "Deep Concentration",
    description: "Music designed to help you focus and be productive",
    tracks: mockMusicTracks.filter(track => track.emotion === "focus" || track.category === "productivity"),
    emotion: "focus",
    category: "productivity",
    coverUrl: "/images/playlist-focus.jpg",
    coverImage: "/images/playlist-focus.jpg",
    tags: ["focus", "work", "concentration"]
  }
];
