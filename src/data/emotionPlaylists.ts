// @ts-nocheck
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock emotion music playlists
export const emotionPlaylists: MusicPlaylist[] = [
  {
    id: "calm-playlist",
    title: "Calming Melodies",
    name: "Calming Melodies", // Adding name property to match the type
    description: "Relaxing melodies to help you calm down and destress",
    coverUrl: "/images/music/calm-cover.jpg",
    tracks: [
      {
        id: "calm-1",
        title: "Gentle Waves",
        artist: "Ocean Sounds",
        url: "/audio/gentle-waves.mp3",
        duration: 240,
        emotion: "calm",
        mood: "peaceful"
      },
      {
        id: "calm-2",
        title: "Soft Rain",
        artist: "Nature Collective",
        url: "/audio/soft-rain.mp3",
        duration: 300,
        emotion: "calm",
        mood: "relaxed"
      },
      {
        id: "calm-3",
        title: "Piano Lullaby",
        artist: "Sleepy Keys",
        url: "/audio/piano-lullaby.mp3",
        duration: 280,
        emotion: "calm",
        mood: "soothing"
      }
    ],
    emotion: "calm",
    creator: "EmotionsCare"
  },
  {
    id: "happy-playlist",
    title: "Uplifting Tunes",
    name: "Uplifting Tunes", // Adding name property to match the type
    description: "Positive music to boost your mood and energy levels",
    coverUrl: "/images/music/happy-cover.jpg",
    tracks: [
      {
        id: "happy-1",
        title: "Sunshine Days",
        artist: "Mood Lifters",
        url: "/audio/sunshine-days.mp3",
        duration: 198,
        emotion: "happy",
        mood: "energetic"
      },
      {
        id: "happy-2",
        title: "Walking on Air",
        artist: "Joyful Beats",
        url: "/audio/walking-on-air.mp3",
        duration: 210,
        emotion: "happy",
        mood: "cheerful"
      },
      {
        id: "happy-3",
        title: "Good Vibes",
        artist: "Positive Flow",
        url: "/audio/good-vibes.mp3",
        duration: 225,
        emotion: "happy",
        mood: "optimistic"
      }
    ],
    emotion: "happy",
    creator: "EmotionsCare"
  },
  {
    id: "focus-playlist",
    title: "Deep Concentration",
    name: "Deep Concentration", // Adding name property to match the type
    description: "Enhance your focus and productivity with these tracks",
    coverUrl: "/images/music/focus-cover.jpg",
    tracks: [
      {
        id: "focus-1",
        title: "Clear Mind",
        artist: "Concentration",
        url: "/audio/clear-mind.mp3",
        duration: 320,
        emotion: "focus",
        mood: "determined"
      },
      {
        id: "focus-2",
        title: "Study Session",
        artist: "Brain Boost",
        url: "/audio/study-session.mp3",
        duration: 360,
        emotion: "focus",
        mood: "attentive"
      },
      {
        id: "focus-3",
        title: "Work Mode",
        artist: "Productivity",
        url: "/audio/work-mode.mp3",
        duration: 340,
        emotion: "focus",
        mood: "efficient"
      }
    ],
    emotion: "focus",
    creator: "EmotionsCare"
  },
  {
    id: "sleep-playlist",
    title: "Sleep Soundscapes",
    name: "Sleep Soundscapes", // Adding name property to match the type
    description: "Peaceful sounds to help you drift into a restful sleep",
    coverUrl: "/images/music/sleep-cover.jpg",
    tracks: [
      {
        id: "sleep-1",
        title: "Night Dreams",
        artist: "Sleep Well",
        url: "/audio/night-dreams.mp3",
        duration: 450,
        emotion: "sleep",
        mood: "relaxed"
      },
      {
        id: "sleep-2",
        title: "Gentle Breeze",
        artist: "Dream Weaver",
        url: "/audio/gentle-breeze.mp3",
        duration: 480,
        emotion: "sleep",
        mood: "peaceful"
      },
      {
        id: "sleep-3",
        title: "Starry Night",
        artist: "Slumber Party",
        url: "/audio/starry-night.mp3",
        duration: 420,
        emotion: "sleep",
        mood: "calming"
      }
    ],
    emotion: "sleep",
    creator: "EmotionsCare"
  }
];
