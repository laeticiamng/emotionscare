
import { MusicPlaylist } from '@/types/music';
import { relaxingNatureSounds, focusBeats, energyBoost, calmMeditation } from './music';

// Pour les playlists d'émotion, nous allons utiliser un objet avec mood comme tableau ou string
export const joyPlaylist: MusicPlaylist = {
  id: 'joy-playlist-001',
  title: 'Joie et Bonheur',
  description: 'Musique pour célébrer et amplifier vos moments de joie',
  cover: '/images/music/joy-cover.jpg',
  tracks: relaxingNatureSounds.tracks.slice(0, 4),
  mood: ['joy', 'happiness', 'excitement'],
  emotion: 'joy',
  category: ['happiness', 'energy'],
  author: 'EmotionsCare'
};

export const calmPlaylist: MusicPlaylist = {
  id: 'calm-playlist-001',
  title: 'Calme et Sérénité',
  description: 'Sons relaxants pour retrouver calme et équilibre',
  cover: '/images/music/calm-cover.jpg',
  tracks: calmMeditation.tracks,
  mood: ['calm', 'peaceful', 'serene'],
  emotion: 'calm',
  category: ['relaxation', 'meditation'],
  author: 'EmotionsCare'
};

export const sadnessPlaylist: MusicPlaylist = {
  id: 'sadness-playlist-001',
  title: 'Mélancolie Apaisante',
  description: 'Musique qui accompagne et transforme la tristesse',
  cover: '/images/music/sadness-cover.jpg',
  tracks: calmMeditation.tracks.slice(0, 2),
  mood: ['sadness', 'melancholy', 'reflection'],
  emotion: 'sadness',
  category: ['sadness', 'meditation'],
  author: 'EmotionsCare'
};

export const angerPlaylist: MusicPlaylist = {
  id: 'anger-playlist-001',
  title: 'Canalisez l\'Énergie',
  description: 'Musique pour transformer la colère en énergie positive',
  cover: '/images/music/anger-cover.jpg',
  tracks: energyBoost.tracks,
  mood: ['anger', 'energy', 'transformation'],
  emotion: 'anger',
  category: ['energy', 'focus'],
  author: 'EmotionsCare'
};

export const emotionPlaylists: Record<string, MusicPlaylist> = {
  joy: joyPlaylist,
  calm: calmPlaylist,
  sadness: sadnessPlaylist,
  anger: angerPlaylist,
};

// Fonction utilitaire pour obtenir une playlist par émotion
export const getPlaylistByEmotion = (emotion: string): MusicPlaylist | null => {
  const normalizedEmotion = emotion.toLowerCase();
  // Correspondance entre les émotions détectées et nos playlists disponibles
  const emotionMap: Record<string, string> = {
    joy: 'joy',
    happiness: 'joy',
    excited: 'joy',
    calm: 'calm',
    peaceful: 'calm',
    sad: 'sadness',
    sadness: 'sadness',
    melancholy: 'sadness',
    anger: 'anger',
    frustration: 'anger',
    anxious: 'calm',
    anxiety: 'calm',
    fear: 'calm',
    neutral: 'calm',
  };

  const playlistKey = emotionMap[normalizedEmotion] || 'calm';
  return emotionPlaylists[playlistKey] || null;
};
