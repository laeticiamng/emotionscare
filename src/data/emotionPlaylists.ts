
import { MusicPlaylist } from "@/types/music";
import { mockTracks } from "@/contexts/music/mockMusicData";

// Helper function to filter tracks by emotion
const filterTracksByEmotion = (emotion: string) => {
  return mockTracks.filter(track => {
    const trackEmotion = track.emotion || track.mood || '';
    const trackTags = track.tags || [];
    return trackEmotion.toLowerCase().includes(emotion.toLowerCase()) || 
           trackTags.some(tag => tag.toLowerCase().includes(emotion.toLowerCase()));
  });
};

// Create playlists by emotion
export const emotionPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-calm",
    title: "Calme et Sérénité",
    description: "Des mélodies douces pour retrouver votre calme intérieur",
    coverUrl: "/images/playlists/calm.jpg",
    tracks: filterTracksByEmotion("calm"),
    emotion: "calm",
    creator: "EmotionsCare",
  },
  {
    id: "playlist-focus",
    title: "Concentration Profonde",
    description: "Boostez votre productivité avec ces morceaux focus",
    coverUrl: "/images/playlists/focus.jpg",
    tracks: filterTracksByEmotion("focus"),
    emotion: "focused",
    creator: "EmotionsCare",
  },
  {
    id: "playlist-energy",
    title: "Énergie Positive",
    description: "Retrouvez votre dynamisme avec cette sélection énergique",
    coverUrl: "/images/playlists/energy.jpg",
    tracks: filterTracksByEmotion("energy"),
    emotion: "energetic",
    creator: "EmotionsCare",
  },
  {
    id: "playlist-relax",
    title: "Relaxation Totale",
    description: "Laissez-vous porter par ces sons relaxants",
    coverUrl: "/images/playlists/relax.jpg",
    tracks: filterTracksByEmotion("relax"),
    emotion: "relaxed",
    creator: "EmotionsCare",
  },
];

// Helper function to get a playlist by emotion
export function getPlaylistByEmotion(emotion: string): MusicPlaylist | null {
  // Try to match exact emotion
  const exactMatch = emotionPlaylists.find(playlist => 
    playlist.emotion?.toLowerCase() === emotion.toLowerCase()
  );
  
  if (exactMatch) return exactMatch;
  
  // Map similar emotions
  const emotionMappings: Record<string, string[]> = {
    'calm': ['peaceful', 'tranquil', 'serene'],
    'relaxed': ['chill', 'rest', 'calm'],
    'focused': ['concentration', 'attention', 'work'],
    'energetic': ['upbeat', 'dynamic', 'motivating'],
    'happy': ['joy', 'upbeat', 'cheerful'],
    'sad': ['melancholic', 'gentle', 'blue'],
    'anxious': ['calming', 'soothing'],
    'stressed': ['calming', 'relaxing']
  };
  
  // Look for similar emotions
  for (const [key, synonyms] of Object.entries(emotionMappings)) {
    if (synonyms.includes(emotion.toLowerCase())) {
      const match = emotionPlaylists.find(playlist => 
        playlist.emotion?.toLowerCase() === key.toLowerCase()
      );
      if (match) return match;
    }
  }
  
  // Default to calm if no match found
  return emotionPlaylists.find(playlist => 
    playlist.emotion?.toLowerCase() === 'calm'
  ) || emotionPlaylists[0] || null;
}
