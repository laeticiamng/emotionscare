
/**
 * MOCK DATA
 * Ce fichier respecte strictement le type officiel VRSessionTemplate
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { VRSessionTemplate } from '@/types/vr';

export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    title: 'Méditation en forêt',
    description: 'Session de méditation relaxante dans un cadre forestier',
    thumbnailUrl: '/images/vr/forest.jpg',
    duration: 600, // 10 minutes
    category: 'meditation',
    tags: ['relaxation', 'nature', 'débutant'],
    difficulty: 'débutant',
    audioTrack: '/audio/forest-meditation.mp3',
    environment: 'forest',
    immersionLevel: 'medium',
    goalType: 'meditation',
    interactive: false,
    recommendedFor: ['stress', 'anxiety']
  },
  {
    id: '2',
    title: 'Plage tranquille',
    description: 'Détendez-vous au son des vagues sur une plage paradisiaque',
    thumbnailUrl: '/images/vr/beach.jpg',
    duration: 900, // 15 minutes
    category: 'relaxation',
    tags: ['plage', 'mer', 'détente'],
    difficulty: 'facile',
    audioTrack: '/audio/beach-waves.mp3',
    environment: 'beach',
    immersionLevel: 'high',
    goalType: 'relaxation',
    interactive: false,
    recommendedFor: ['anxiety', 'stress']
  }
];

export default mockVRTemplates;
