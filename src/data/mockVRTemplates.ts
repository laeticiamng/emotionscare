
import { VRSessionTemplate } from '@/types';

// Mock VR session templates
export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    name: 'Ocean Calm',
    title: 'Ocean Calm',
    description: 'Une immersion relaxante sur une plage au coucher de soleil avec le son apaisant des vagues.',
    duration: 5,
    theme: 'Relaxation',
    is_audio_only: false,
    preview_url: '/images/vr/ocean-preview.jpg',
    audio_url: '/audio/ocean-waves.mp3',
    category: 'relaxation',
    difficulty: 'easy', // Updated from 'beginner'
    tags: ['relaxation', 'débutant', 'plage', 'nature'],
    benefits: ['Réduction de l\'anxiété', 'Calme mental', 'Détente musculaire'],
    emotions: ['calme', 'sérénité', 'paix'],
    popularity: 92,
    emotion_target: 'calme',
    thumbnail: '/images/vr/ocean-preview.jpg', // Ajouté pour compatibilité
    intensity: 'low', // Ajouté pour compatibilité
  },
  {
    id: '2',
    name: 'Méditation Guidée',
    title: 'Méditation Guidée',
    description: 'Une session de méditation guidée pour débutants, avec focus sur la respiration et la pleine conscience.',
    duration: 10,
    theme: 'Méditation',
    is_audio_only: true,
    preview_url: '/images/vr/meditation-preview.jpg',
    audio_url: '/audio/guided-meditation.mp3',
    category: 'meditation',
    difficulty: 'easy',
    tags: ['méditation', 'débutant', 'guidée', 'respiration'],
    benefits: ['Amélioration de la concentration', 'Réduction du stress', 'Clarté mentale'],
    emotions: ['paix', 'concentration', 'présence'],
    popularity: 85,
    emotion_target: 'concentration',
    thumbnail: '/images/vr/meditation-preview.jpg', // Ajouté pour compatibilité
    intensity: 'low', // Ajouté pour compatibilité
  },
  {
    id: '3',
    name: 'Forêt Enchantée',
    title: 'Forêt Enchantée',
    description: 'Une promenade virtuelle dans une forêt luxuriante avec des sons d\'oiseaux et une légère brise.',
    duration: 15,
    theme: 'Nature',
    is_audio_only: false,
    preview_url: '/images/vr/forest-preview.jpg',
    audio_url: '/audio/forest-sounds.mp3',
    category: 'nature',
    difficulty: 'medium', // Updated from 'intermediate'
    tags: ['nature', 'forêt', 'arbres', 'oiseaux'],
    benefits: ['Connexion avec la nature', 'Rafraîchissement mental', 'Inspiration'],
    emotions: ['émerveillement', 'curiosité', 'joie'],
    popularity: 78,
    emotion_target: 'émerveillement',
    thumbnail: '/images/vr/forest-preview.jpg', // Ajouté pour compatibilité
    intensity: 'medium', // Ajouté pour compatibilité
  },
  {
    id: '4',
    name: 'Respiration 4-7-8',
    title: 'Respiration 4-7-8',
    description: 'Une technique de respiration pour réduire l\'anxiété et favoriser l\'endormissement.',
    duration: 5,
    theme: 'Respiration',
    is_audio_only: true,
    preview_url: '/images/vr/breathing-preview.jpg',
    audio_url: '/audio/breathing-exercise.mp3',
    category: 'breathing',
    difficulty: 'easy',
    tags: ['respiration', 'anxiété', 'sommeil'],
    benefits: ['Réduction de l\'anxiété', 'Amélioration du sommeil', 'Régulation du système nerveux'],
    emotions: ['calme', 'détente', 'apaisement'],
    popularity: 95,
    emotion_target: 'calme',
    thumbnail: '/images/vr/breathing-preview.jpg', // Ajouté pour compatibilité
    intensity: 'low', // Ajouté pour compatibilité
  }
];

// Export for backwards compatibility
export { mockVRTemplates as mockVRTemplatesData };
