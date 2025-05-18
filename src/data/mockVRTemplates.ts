
import { VRSessionTemplate } from '@/types/vr';

const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    title: 'Méditation en forêt',
    description: 'Une session paisible dans un environnement forestier relaxant',
    imageUrl: '/images/vr/forest-meditation.jpg',
    duration: 10, // Durée en minutes
    category: 'meditation',
    level: 'beginner',
    popularity: 4.8,
    moodTag: ['calm', 'peaceful'],
    environment: 'forest',
    audioUrl: '/audio/forest-ambience.mp3',
    goals: ['Réduire le stress', 'Améliorer la concentration'],
    userCount: 1240
  },
  {
    id: '2',
    title: 'Plage tropicale',
    description: 'Évadez-vous sur une plage paradisiaque avec le son des vagues',
    imageUrl: '/images/vr/tropical-beach.jpg',
    duration: 15, // Durée en minutes
    category: 'relaxation',
    level: 'beginner',
    popularity: 4.9,
    moodTag: ['relaxed', 'peaceful'],
    environment: 'beach',
    audioUrl: '/audio/ocean-waves.mp3',
    goals: ['Relaxation profonde', 'Réduction de l\'anxiété'],
    userCount: 1835
  },
  {
    id: '3',
    title: 'Montagne enneigée',
    description: 'Une expérience méditative dans un paysage montagneux hivernal',
    imageUrl: '/images/vr/snowy-mountain.jpg',
    duration: 20, // Durée en minutes
    category: 'mindfulness',
    level: 'intermediate',
    popularity: 4.7,
    moodTag: ['focused', 'inspired'],
    environment: 'mountain',
    audioUrl: '/audio/mountain-wind.mp3',
    goals: ['Clarté mentale', 'Prise de conscience'],
    userCount: 987
  },
  {
    id: '4',
    title: 'Jardin japonais',
    description: 'Un moment de sérénité dans un jardin zen traditionnel',
    imageUrl: '/images/vr/japanese-garden.jpg',
    duration: 25, // Durée en minutes
    category: 'meditation',
    level: 'intermediate',
    popularity: 4.6,
    moodTag: ['peaceful', 'balanced'],
    environment: 'garden',
    audioUrl: '/audio/zen-garden.mp3',
    goals: ['Équilibre mental', 'Harmonie intérieure'],
    userCount: 756
  },
  {
    id: '5',
    title: 'Orage tropical',
    description: 'Expérience immersive d\'un orage tropical depuis un abri confortable',
    imageUrl: '/images/vr/tropical-storm.jpg',
    duration: 30, // Durée en minutes
    category: 'sleep',
    level: 'beginner',
    popularity: 4.5,
    moodTag: ['cozy', 'reflective'],
    environment: 'tropical',
    audioUrl: '/audio/rain-thunder.mp3',
    goals: ['Amélioration du sommeil', 'Relaxation profonde'],
    userCount: 1432
  },
  {
    id: '6',
    title: 'Canyon au coucher de soleil',
    description: 'Contemplez un magnifique coucher de soleil dans un canyon désertique',
    imageUrl: '/images/vr/desert-canyon.jpg',
    duration: 15, // Durée en minutes
    category: 'relaxation',
    level: 'beginner',
    popularity: 4.7,
    moodTag: ['inspired', 'peaceful'],
    environment: 'desert',
    audioUrl: '/audio/desert-wind.mp3',
    goals: ['Inspiration créative', 'Apaisement mental'],
    userCount: 891
  }
];

export default mockVRTemplates;
