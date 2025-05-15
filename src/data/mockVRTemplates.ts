import { VRSessionTemplate } from '@/types/types';

export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: 'vr-1',
    name: 'Relaxation plage',
    title: 'Relaxation plage',
    description: 'Détendez-vous sur une plage paisible avec le son des vagues',
    duration: 300,
    type: 'relaxation',
    thumbnail: '/images/vr/beach.jpg',
    videoUrl: '/videos/beach-relaxation.mp4',
    emotion: 'calm',
    completion_rate: 85,
    recommended_mood: 50, // Conversion en number
    benefits: ['Réduction du stress', 'Amélioration du sommeil', 'Clarté mentale'],
    is_audio_only: false
  },
  {
    id: 'vr-2',
    name: 'Méditation forêt',
    title: 'Méditation forêt',
    description: 'Une méditation guidée dans une forêt apaisante',
    duration: 600,
    type: 'meditation',
    thumbnail: '/images/vr/forest.jpg',
    videoUrl: '/videos/forest-meditation.mp4',
    emotion: 'mindful',
    completion_rate: 72,
    recommended_mood: 60, // Conversion en number
    benefits: ['Focus amélioré', 'Réduction de l\'anxiété', 'Présence'],
    is_audio_only: false
  },
  {
    id: 'vr-3',
    name: 'Respiration guidée',
    title: 'Respiration guidée',
    description: 'Exercices de respiration pour trouver le calme intérieur',
    duration: 180,
    type: 'breathing',
    thumbnail: '/images/vr/breathing.jpg',
    audio_url: '/audio/guided-breathing.mp3',
    emotion: 'focused',
    completion_rate: 95,
    recommended_mood: 40, // Conversion en number
    benefits: ['Réduction immédiate du stress', 'Meilleure concentration', 'Équilibre'],
    is_audio_only: true
  },
  {
    id: 'vr-4',
    name: 'Visualisation positive',
    title: 'Visualisation positive',
    description: 'Imaginez votre succès et votre bien-être futur',
    duration: 450,
    type: 'visualization',
    thumbnail: '/images/vr/visualization.jpg',
    videoUrl: '/videos/positive-visualization.mp4',
    emotion: 'motivated',
    completion_rate: 68,
    recommended_mood: 70, // Conversion en number
    benefits: ['Augmentation de la motivation', 'Confiance en soi', 'Optimisme'],
    is_audio_only: false
  }
];

export default mockVRTemplates;
