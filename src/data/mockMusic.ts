
/**
 * MOCK DATA
 * Ce fichier respecte strictement les types officiels MusicTrack et MusicPlaylist
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { MusicTrack, MusicPlaylist } from '@/types/music';
import { v4 as uuidv4 } from 'uuid';

export const mockTracks: MusicTrack[] = [
  {
    id: "track-1",
    title: "Méditation calmante",
    artist: "Relax Studio",
    url: "/audio/meditation.mp3",
    duration: 240,
    audioUrl: "/audio/meditation.mp3",
    coverUrl: "/images/calm-cover.jpg",
    album: "Collection calme",
    year: 2023,
    genre: "Ambient",
    emotion: "calm",
    tags: ["meditation", "calm", "relax"]
  },
  {
    id: "track-2",
    title: "Énergie matinale",
    artist: "Morning Vibes",
    url: "/audio/energy.mp3",
    duration: 180,
    audioUrl: "/audio/energy.mp3",
    coverUrl: "/images/energy-cover.jpg",
    album: "Start the Day",
    year: 2023,
    genre: "Electronic",
    emotion: "energetic",
    tags: ["morning", "energy", "motivation"]
  },
  {
    id: "track-3",
    title: "Focus profond",
    artist: "Concentration Beats",
    url: "/audio/focus.mp3",
    duration: 300,
    audioUrl: "/audio/focus.mp3",
    coverUrl: "/images/focus-cover.jpg",
    album: "Deep Work",
    year: 2022,
    genre: "Instrumental",
    emotion: "focus",
    tags: ["focus", "work", "study"]
  },
  {
    id: "track-4",
    title: "Happy Vibes",
    artist: "Joy Sounds",
    url: "/audio/happy.mp3",
    duration: 210,
    audioUrl: "/audio/happy.mp3",
    coverUrl: "/images/happy-cover.jpg",
    album: "Good Mood",
    year: 2023,
    genre: "Pop",
    emotion: "happy",
    tags: ["happy", "joy", "positive"]
  },
  {
    id: "track-5",
    title: "Mélancolie douce",
    artist: "Reflective Soul",
    url: "/audio/melancholy.mp3",
    duration: 270,
    audioUrl: "/audio/melancholy.mp3",
    coverUrl: "/images/melancholy-cover.jpg",
    album: "Inner Thoughts",
    year: 2022,
    genre: "Acoustic",
    emotion: "melancholic",
    tags: ["melancholy", "reflection", "calm"]
  }
];

export const mockPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-calm",
    title: "Moments calmes",
    name: "Moments calmes",
    tracks: mockTracks.filter(track => track.emotion === "calm"),
    description: "Une collection de morceaux pour la relaxation",
    coverImage: "/images/calm-playlist.jpg",
    emotion: "calm"
  },
  {
    id: "playlist-energy",
    title: "Boost d'énergie",
    name: "Boost d'énergie",
    tracks: mockTracks.filter(track => track.emotion === "energetic"),
    description: "Musique motivante pour démarrer la journée",
    coverImage: "/images/energy-playlist.jpg",
    emotion: "energetic"
  },
  {
    id: "playlist-focus",
    title: "Concentration maximale",
    name: "Concentration maximale",
    tracks: mockTracks.filter(track => track.emotion === "focus"),
    description: "Pour les sessions de travail intensif",
    coverImage: "/images/focus-playlist.jpg",
    emotion: "focus"
  },
  {
    id: "playlist-happy",
    title: "Bonheur quotidien",
    name: "Bonheur quotidien",
    tracks: mockTracks.filter(track => track.emotion === "happy"),
    description: "Des morceaux joyeux pour égayer votre journée",
    coverImage: "/images/happy-playlist.jpg",
    emotion: "happy"
  },
  {
    id: "playlist-melancholic",
    title: "Réflexions profondes",
    name: "Réflexions profondes",
    tracks: mockTracks.filter(track => track.emotion === "melancholic"),
    description: "Musique contemplative pour les moments calmes",
    coverImage: "/images/melancholic-playlist.jpg",
    emotion: "melancholic"
  }
];

// Fonction pour récupérer les données musicales mockées
export const getMockMusicData = () => {
  return {
    tracks: mockTracks,
    playlists: mockPlaylists
  };
};
