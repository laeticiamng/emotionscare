
import { VRSessionTemplate } from '@/types';

export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    title: 'Méditation en forêt',
    description: 'Session de méditation relaxante dans un cadre forestier',
    thumbnailUrl: '/images/vr/forest.jpg',
    thumbnail: '/images/vr/forest.jpg', // pour compatibilité
    duration: 600, // 10 minutes
    category: 'meditation',
    tags: ['relaxation', 'nature', 'débutant'],
    completionRate: 87,
    completion_rate: 87, // pour compatibilité
    recommendedMood: 'stressed',
    recommended_mood: 'stressed', // pour compatibilité
    emotionTarget: 'calm',
    emotion_target: 'calm', // pour compatibilité
    difficulty: 'débutant',
    preview_url: '/images/vr/forest-preview.jpg',
    is_audio_only: false,
    audio_url: '/audio/forest-meditation.mp3',
    audioUrl: '/audio/forest-meditation.mp3', // Format camelCase
    benefits: ['Réduction du stress', 'Amélioration du sommeil'],
    theme: 'nature',
    emotion: 'calm'
  },
  {
    id: '2',
    title: 'Plage tranquille',
    description: 'Détendez-vous au son des vagues sur une plage paradisiaque',
    thumbnailUrl: '/images/vr/beach.jpg',
    thumbnail: '/images/vr/beach.jpg',
    duration: 900, // 15 minutes
    category: 'relaxation',
    tags: ['plage', 'mer', 'détente'],
    completionRate: 92,
    completion_rate: 92,
    recommendedMood: 'anxious',
    recommended_mood: 'anxious',
    emotionTarget: 'calm',
    emotion_target: 'calm',
    difficulty: 'facile',
    preview_url: '/images/vr/beach-preview.jpg',
    is_audio_only: false,
    audio_url: '/audio/beach-waves.mp3',
    audioUrl: '/audio/beach-waves.mp3',
    benefits: ['Apaisement mental', 'Relaxation profonde'],
    theme: 'ocean',
    emotion: 'peaceful'
  }
];

export default mockVRTemplates;
