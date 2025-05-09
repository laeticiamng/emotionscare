
import { VRSessionTemplate } from '@/types';

export const mockVRTemplatesData: VRSessionTemplate[] = [
  {
    id: 'forest-1',
    template_id: 'forest-1',
    theme: 'Forêt apaisante',
    title: 'Balade en forêt',
    duration: 5,
    preview_url: '/images/vr/forest.jpg',
    description: 'Une promenade immersive dans une forêt paisible, idéale pour se détendre et retrouver son calme intérieur.',
    is_audio_only: false,
    recommended_mood: 'calm',
    // Add required properties
    category: 'nature',
    benefits: ['Réduction du stress', 'Amélioration de la concentration', 'Reconnexion avec la nature'],
    emotions: ['calm', 'neutral', 'happy'],
    popularity: 95
  },
  {
    id: 'beach-1',
    template_id: 'beach-1',
    theme: 'Plage relaxante',
    title: 'Coucher de soleil sur la plage',
    duration: 7,
    preview_url: '/images/vr/beach.jpg',
    description: 'Contemplez un magnifique coucher de soleil sur une plage déserte et écoutez le bruit apaisant des vagues.',
    is_audio_only: false,
    recommended_mood: 'stressed',
    // Add required properties
    category: 'nature',
    benefits: ['Réduction de l\'anxiété', 'Détente profonde', 'Amélioration de l\'humeur'],
    emotions: ['stressed', 'sad', 'anxious'],
    popularity: 88
  },
  {
    id: 'meditation-1',
    template_id: 'meditation-1',
    theme: 'Méditation guidée',
    title: 'Méditation pleine conscience',
    duration: 10,
    preview_url: '/images/vr/meditation.jpg',
    is_audio_only: true,
    audio_url: '/audio/meditation-guidee.mp3',
    description: 'Une séance de méditation guidée pour vous aider à vous recentrer et à vivre pleinement le moment présent.',
    recommended_mood: 'anxious',
    // Add required properties
    category: 'mindfulness',
    benefits: ['Concentration améliorée', 'Réduction du stress', 'Clarté mentale'],
    emotions: ['anxious', 'stressed', 'neutral'],
    popularity: 92
  },
  {
    id: 'breathing-1',
    template_id: 'breathing-1',
    theme: 'Respiration profonde',
    title: 'Exercices de respiration',
    duration: 3,
    preview_url: '/images/vr/breathing.jpg',
    is_audio_only: true,
    audio_url: '/audio/respiration-profonde.mp3',
    description: 'Des exercices de respiration simples et efficaces pour diminuer rapidement votre niveau de stress.',
    recommended_mood: 'focused',
    // Add required properties
    category: 'breathing',
    benefits: ['Réduction immédiate du stress', 'Oxygénation du cerveau', 'Amélioration de la concentration'],
    emotions: ['focused', 'stressed', 'anxious'],
    popularity: 85
  }
];
