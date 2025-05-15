
import { VRSessionTemplate } from '@/types';

export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    title: 'Méditation en forêt',
    description: 'Une expérience immersive dans une forêt paisible avec des sons naturels apaisants.',
    thumbnailUrl: '/images/vr/forest-meditation.jpg',
    duration: 10,
    category: 'meditation',
    tags: ['détente', 'nature', 'méditation'],
    completionRate: 0.8,
    recommendedMood: 'anxious',
    emotion: 'calm',
    difficulty: 'débutant'
  },
  {
    id: '2',
    title: 'Plage tropicale',
    description: 'Échappez au stress quotidien avec cette expérience sur une plage tropicale idyllique.',
    thumbnailUrl: '/images/vr/beach.jpg',
    duration: 15,
    category: 'relaxation',
    tags: ['plage', 'océan', 'relaxation'],
    completionRate: 0.5,
    recommendedMood: 'stressed',
    emotion: 'calm',
    difficulty: 'débutant'
  },
  {
    id: '3',
    title: 'Ascension de montagne',
    description: 'Une expérience motivante de randonnée virtuelle avec des vues panoramiques à couper le souffle.',
    thumbnailUrl: '/images/vr/mountain.jpg',
    duration: 20,
    category: 'motivation',
    tags: ['montagne', 'aventure', 'motivation'],
    completionRate: 0.3,
    recommendedMood: 'sad',
    emotion: 'joy',
    difficulty: 'intermédiaire'
  },
  {
    id: '4',
    title: 'Méditation guidée',
    description: 'Une méditation guidée par un expert pour vous aider à atteindre un état de pleine conscience.',
    thumbnailUrl: '/images/vr/guided-meditation.jpg',
    duration: 12,
    category: 'meditation',
    tags: ['méditation', 'guidé', 'pleine conscience'],
    completionRate: 0.9,
    recommendedMood: 'anxious',
    emotion: 'calm',
    difficulty: 'débutant'
  },
  {
    id: '5',
    title: 'Session de respiration profonde',
    description: 'Techniques de respiration profonde pour réduire l\'anxiété et augmenter la concentration.',
    thumbnailUrl: '/images/vr/breathing.jpg',
    duration: 8,
    category: 'breathing',
    tags: ['respiration', 'anxiété', 'concentration'],
    completionRate: 0.7,
    recommendedMood: 'stressed',
    emotion: 'focused',
    difficulty: 'tous niveaux'
  },
  {
    id: '6',
    title: 'Voyage sous-marin',
    description: 'Explorez les merveilles de l\'océan dans cette aventure sous-marine relaxante.',
    thumbnailUrl: '/images/vr/underwater.jpg',
    duration: 18,
    category: 'exploration',
    tags: ['océan', 'découverte', 'détente'],
    completionRate: 0.6,
    recommendedMood: 'bored',
    emotion: 'joy',
    difficulty: 'intermédiaire'
  }
];

export default mockVRTemplates;
