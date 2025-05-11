
import { VRSessionTemplate } from '@/types';

export const mockVRTemplatesData: VRSessionTemplate[] = [
  {
    id: 'template-1',
    template_id: 'template-1',
    title: 'Plage tranquille',
    theme: 'Plage tranquille',
    name: 'Plage tranquille',
    description: 'Relaxation sur une plage tranquille avec le son des vagues et une vue panoramique sur l\'océan.',
    duration: 5,
    category: 'relaxation',
    preview_url: 'https://www.youtube.com/embed/LXb3EKWsInQ',
    is_audio_only: false,
    audio_url: '/audio/beach.mp3', // Added missing required property
    difficulty: 'easy',
    completion_rate: 85,
    emotions: ['calm', 'peaceful'],
    benefits: ['Réduction du stress', 'Amélioration du sommeil'],
    tags: ['nature', 'water', 'relaxation'],
    popularity: 95,
    recommended_mood: 'stressed'
  },
  {
    id: 'template-2',
    template_id: 'template-2',
    title: 'Méditation en forêt',
    theme: 'Méditation en forêt',
    name: 'Méditation en forêt',
    description: 'Une session de méditation guidée au milieu d\'une forêt paisible avec des sons naturels.',
    duration: 10,
    category: 'meditation',
    preview_url: 'https://www.youtube.com/embed/ReYbOqwJk6I',
    is_audio_only: false,
    audio_url: '/audio/forest.mp3', // Added missing required property
    difficulty: 'medium',
    completion_rate: 72,
    emotions: ['mindful', 'focused'],
    benefits: ['Clarté mentale', 'Réduction de l\'anxiété'],
    tags: ['nature', 'forest', 'meditation'],
    popularity: 88,
    recommended_mood: 'anxious'
  },
  {
    id: 'template-3',
    template_id: 'template-3',
    title: 'Méditation guidée',
    theme: 'Méditation guidée',
    name: 'Méditation guidée',
    description: 'Une méditation guidée audio uniquement pour se reconnecter avec soi-même et réduire le stress.',
    duration: 15,
    category: 'meditation',
    is_audio_only: true,
    audio_url: '/audio/guided-meditation.mp3',
    difficulty: 'easy',
    completion_rate: 65,
    emotions: ['peaceful', 'relaxed'],
    benefits: ['Réduction du stress', 'Amélioration du bien-être'],
    tags: ['audio', 'meditation', 'guided'],
    popularity: 75,
    recommended_mood: 'overwhelmed'
  },
  {
    id: 'template-4',
    template_id: 'template-4',
    title: 'Respiration en montagne',
    theme: 'Respiration en montagne',
    name: 'Respiration en montagne',
    description: 'Exercices de respiration avec vue panoramique sur des montagnes majestueuses.',
    duration: 8,
    category: 'breathing',
    preview_url: 'https://www.youtube.com/embed/21qNxnCS8WU',
    is_audio_only: false,
    audio_url: '/audio/mountain.mp3', // Added missing required property
    difficulty: 'easy',
    completion_rate: 78,
    emotions: ['energized', 'balanced'],
    benefits: ['Amélioration de la concentration', 'Augmentation de l\'énergie'],
    tags: ['mountains', 'breathing', 'energy'],
    popularity: 82,
    recommended_mood: 'tired'
  }
];

export default mockVRTemplatesData;
