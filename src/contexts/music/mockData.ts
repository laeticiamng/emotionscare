
import { MusicTrack, MusicPlaylist } from "@/types/music";

export const mockTracks: MusicTrack[] = [
  {
    id: "track-1",
    title: "Calm Water",
    artist: "Relaxation Artist",
    duration: 195,
    src: "/audio/calm-water.mp3",
    audioUrl: "/audio/calm-water.mp3",
    coverImage: "/images/calm-water.jpg",
    emotion: "calm",
    intensity: 2,
    category: "meditation"
  },
  {
    id: "track-2",
    title: "Happy Day",
    artist: "Positive Vibes",
    duration: 184,
    src: "/audio/happy-day.mp3",
    audioUrl: "/audio/happy-day.mp3",
    coverImage: "/images/happy-day.jpg",
    emotion: "joy",
    intensity: 4,
    category: "motivation"
  },
  {
    id: "track-3",
    title: "Sunset Dreams",
    artist: "Chill Waves",
    duration: 232,
    src: "/audio/sunset-dreams.mp3",
    audioUrl: "/audio/sunset-dreams.mp3",
    coverImage: "/images/sunset.jpg",
    emotion: "relaxed",
    intensity: 3,
    category: "sleep"
  },
  {
    id: "track-4",
    title: "Energy Boost",
    artist: "Power Up",
    duration: 156,
    src: "/audio/energy-boost.mp3",
    audioUrl: "/audio/energy-boost.mp3",
    coverImage: "/images/energy.jpg",
    emotion: "energetic",
    intensity: 5,
    category: "workout"
  }
];

export const mockPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-1",
    name: "Relaxation Collection",
    description: "Perfect for meditation and relaxation",
    coverImage: "/images/relaxation.jpg",
    emotion: "calm",
    tracks: mockTracks.filter(t => t.category === "meditation" || t.emotion === "calm")
  },
  {
    id: "playlist-2",
    name: "Energy & Joy",
    description: "Boost your mood and energy",
    coverImage: "/images/energy.jpg",
    emotion: "joy",
    tracks: mockTracks.filter(t => t.emotion === "joy" || t.emotion === "energetic")
  },
  {
    id: "playlist-3",
    name: "Sleep Sounds",
    description: "Gentle sounds to help you sleep",
    coverImage: "/images/sleep.jpg",
    emotion: "relaxed",
    tracks: mockTracks.filter(t => t.category === "sleep")
  }
];
