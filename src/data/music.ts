
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const musicTracks: MusicTrack[] = [
  {
    id: "track-1",
    title: "Serenity Flow",
    artist: "Ambient Dreams",
    albumTitle: "Peaceful Moments",
    coverUrl: "/music/covers/serenity.jpg",
    audioUrl: "/music/tracks/serenity-flow.mp3",
    duration: 240,
    emotion: "calm",
    tags: ["calm", "ambient", "peaceful"],
    category: ["relax"]
  },
  {
    id: "track-2",
    title: "Rhythmic Drive",
    artist: "Electro Pulse",
    albumTitle: "Night Moves",
    coverUrl: "/music/covers/rhythmic.jpg",
    audioUrl: "/music/tracks/rhythmic-drive.mp3",
    duration: 210,
    emotion: "energetic",
    tags: ["electronic", "dance", "high-energy"],
    category: ["energy"]
  },
  {
    id: "track-3",
    title: "Mellow Sunrise",
    artist: "Acoustic Shores",
    albumTitle: "Golden Hues",
    coverUrl: "/music/covers/mellow.jpg",
    audioUrl: "/music/tracks/mellow-sunrise.mp3",
    duration: 270,
    emotion: "happy",
    tags: ["acoustic", "folk", "upbeat"],
    category: ["mood"]
  },
  {
    id: "track-4",
    title: "Deep Focus",
    artist: "Zenith Zone",
    albumTitle: "Inner Space",
    coverUrl: "/music/covers/deepfocus.jpg",
    audioUrl: "/music/tracks/deep-focus.mp3",
    duration: 300,
    emotion: "focused",
    tags: ["ambient", "instrumental", "concentration"],
    category: ["focus"]
  },
  {
    id: "track-5",
    title: "Dream Weaver",
    artist: "Lunar Tides",
    albumTitle: "Nightfall Serenade",
    coverUrl: "/music/covers/dreamweaver.jpg",
    audioUrl: "/music/tracks/dream-weaver.mp3",
    duration: 330,
    emotion: "sleepy",
    tags: ["ambient", "soothing", "night"],
    category: ["sleep"]
  },
  {
    id: "track-6",
    title: "Mindful Meditation",
    artist: "Tranquil Temple",
    albumTitle: "Silent Echoes",
    coverUrl: "/music/covers/meditation.jpg",
    audioUrl: "/music/tracks/mindful-meditation.mp3",
    duration: 360,
    emotion: "meditative",
    tags: ["instrumental", "spiritual", "calm"],
    category: ["meditation"]
  }
];

export const musicPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-1",
    title: "Calm & Relaxed",
    description: "Gentle tracks to help you unwind and find peace",
    coverUrl: "/music/playlists/calm.jpg",
    tracks: [],
    category: "relax",
    mood: "calm"
  },
  {
    id: "playlist-2",
    title: "Energy Boost",
    description: "Uplifting music to energize your day",
    coverUrl: "/music/playlists/energy.jpg",
    tracks: [],
    category: "energy",
    mood: "energetic"
  },
  {
    id: "playlist-3",
    title: "Happy Vibes",
    description: "Feel-good tunes to brighten your mood",
    coverUrl: "/music/playlists/happy.jpg",
    tracks: [],
    category: "mood",
    mood: "happy"
  },
  {
    id: "playlist-4",
    title: "Focus Zone",
    description: "Instrumental tracks for enhanced concentration",
    coverUrl: "/music/playlists/focus.jpg",
    tracks: [],
    category: "focus",
    mood: "focused"
  },
  {
    id: "playlist-5",
    title: "Sleep Sanctuary",
    description: "Soothing sounds to guide you into a peaceful sleep",
    coverUrl: "/music/playlists/sleep.jpg",
    tracks: [],
    category: "sleep",
    mood: "sleepy"
  },
  {
    id: "playlist-6",
    title: "Meditation Moments",
    description: "Ambient soundscapes for mindful meditation",
    coverUrl: "/music/playlists/meditation.jpg",
    tracks: [],
    category: "meditation",
    mood: "meditative"
  }
];

// Fix the getPlaylistByMood function
export const getPlaylistByMood = (mood: string): MusicPlaylist | undefined => {
  return musicPlaylists.find(playlist => 
    playlist.emotion === mood || 
    playlist.mood === mood
  );
};
