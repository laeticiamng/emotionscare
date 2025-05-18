
import { MusicTrack, MusicPlaylist } from "@/types/music";

export function getMockMusicData() {
  const tracks: MusicTrack[] = [
    {
      id: "1",
      title: "Peaceful Mind",
      artist: "Ambient Sounds",
      duration: 180,
      audioUrl: "/sounds/peaceful-mind.mp3",
      url: "/sounds/peaceful-mind.mp3",
      src: "/sounds/peaceful-mind.mp3",
      coverImage: "/images/music/peaceful-cover.jpg",
      cover: "/images/music/peaceful-cover.jpg",
      emotion: "calm",
      intensity: 0.5,
      category: "meditation"
    },
    {
      id: "2",
      title: "Focus Flow",
      artist: "Deep Concentration",
      duration: 240,
      audioUrl: "/sounds/focus-flow.mp3",
      url: "/sounds/focus-flow.mp3",
      src: "/sounds/focus-flow.mp3",
      coverImage: "/images/music/focus-cover.jpg",
      cover: "/images/music/focus-cover.jpg",
      emotion: "focus",
      intensity: 0.7,
      category: "productivity"
    },
    {
      id: "3",
      title: "Morning Energy",
      artist: "Positive Vibes",
      duration: 190,
      audioUrl: "/sounds/morning-energy.mp3", 
      url: "/sounds/morning-energy.mp3",
      src: "/sounds/morning-energy.mp3",
      coverImage: "/images/music/energy-cover.jpg",
      cover: "/images/music/energy-cover.jpg",
      emotion: "energetic",
      intensity: 0.8,
      category: "motivation"
    },
    {
      id: "4",
      title: "Evening Relaxation",
      artist: "Sleep Well",
      duration: 300,
      audioUrl: "/sounds/evening-relax.mp3",
      url: "/sounds/evening-relax.mp3",
      src: "/sounds/evening-relax.mp3",
      coverImage: "/images/music/relax-cover.jpg",
      cover: "/images/music/relax-cover.jpg",
      emotion: "relax",
      intensity: 0.3,
      category: "sleep"
    }
  ];

  const playlists: MusicPlaylist[] = [
    {
      id: "pl-1",
      name: "Calmness",
      title: "Musique pour la sérénité",
      tracks: [tracks[0], tracks[3]],
      description: "Des sons apaisants pour retrouver le calme",
      emotion: "calm"
    },
    {
      id: "pl-2",
      name: "Productivity",
      title: "Musique pour la concentration",
      tracks: [tracks[1]],
      description: "Des rythmes pour rester concentré et productif",
      emotion: "focus"
    },
    {
      id: "pl-3",
      name: "Energy",
      title: "Musique pour l'énergie",
      tracks: [tracks[2]],
      description: "Des mélodies pour vous donner de l'énergie",
      emotion: "energetic"
    },
    {
      id: "pl-4",
      name: "Sleep",
      title: "Musique pour s'endormir",
      tracks: [tracks[3], tracks[0]],
      description: "Des sons doux pour faciliter votre endormissement",
      emotion: "relax"
    },
    {
      id: "pl-5",
      name: "Happy",
      title: "Musique joyeuse",
      tracks: [tracks[2], tracks[1]],
      description: "Des sons positifs pour améliorer votre humeur",
      emotion: "happy"
    }
  ];

  return { tracks, playlists };
}

export const mockMusicTracks = getMockMusicData().tracks;
export const mockPlaylists = getMockMusicData().playlists;
