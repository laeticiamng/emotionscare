
import { VRSessionTemplate } from '@/types/vr';

// Sample VR session templates
export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: 'vr-template-1',
    name: 'Ocean Meditation',
    title: 'Ocean Meditation',
    description: 'Immerse yourself in the calming sounds and visuals of the ocean for deep relaxation.',
    thumbnailUrl: '/images/vr/ocean-meditation.jpg',
    duration: 10,
    difficulty: 'beginner', // Corrigé de "Beginner"
    category: 'Meditation',
    tags: ['relaxation', 'beach', 'ocean'],
    immersionLevel: 'Deep',
    goalType: 'Relaxation',
    interactive: false
  },
  {
    id: 'vr-template-2',
    name: 'Mountain Retreat',
    title: 'Mountain Retreat',
    description: 'Experience the serenity of mountain landscapes with guided breathing exercises.',
    thumbnailUrl: '/images/vr/mountain-retreat.jpg',
    duration: 15,
    difficulty: 'intermediate', // Corrigé de "Intermediate"
    category: 'Meditation',
    tags: ['mountains', 'nature', 'breathing'],
    immersionLevel: 'Medium',
    goalType: 'Focus',
    interactive: false
  },
  {
    id: 'vr-template-3',
    name: 'Forest Mindfulness',
    title: 'Forest Mindfulness',
    description: 'Walk through a serene forest with interactive elements to focus your attention.',
    thumbnailUrl: '/images/vr/forest-mindfulness.jpg',
    duration: 20,
    difficulty: 'intermediate', // Corrigé de "Intermediate"
    category: 'Mindfulness',
    tags: ['forest', 'nature', 'attention'],
    immersionLevel: 'High',
    goalType: 'Awareness',
    interactive: true
  },
  {
    id: 'vr-template-4',
    name: 'Energy Boost',
    title: 'Energy Boost',
    description: 'A vivid experience with upbeat visuals and sounds to increase your energy levels.',
    thumbnailUrl: '/images/vr/energy-boost.jpg',
    duration: 10,
    difficulty: 'beginner', // Corrigé de "All Levels"
    category: 'Energy',
    tags: ['energy', 'vitality', 'morning'],
    immersionLevel: 'Medium',
    goalType: 'Energy',
    interactive: true
  }
];
