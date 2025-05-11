
import { VRSessionTemplate } from '@/types';

// Mock VR session templates
export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    template_id: 'forest-meditation',
    title: 'Forest Meditation',
    theme: 'nature',
    name: 'Forest Meditation',
    description: 'Experience the tranquility of a forest meditation session with birds singing and leaves rustling.',
    duration: 300, // 5 minutes
    category: 'meditation',
    is_audio_only: false,
    preview_url: '/videos/forest-preview.mp4',
    audio_url: '/audio/forest-meditation.mp3',
    difficulty: 'easy',
    emotions: ['calm', 'peaceful'],
    tags: ['reduce stress', 'improve focus'],
    benefits: ['reduce stress', 'improve focus'],
    popularity: 100,
    level: 'beginner',
    recommended_mood: 'stressed'
  },
  {
    id: '2',
    template_id: 'ocean-relaxation',
    title: 'Ocean Relaxation',
    theme: 'water',
    name: 'Ocean Relaxation',
    description: 'Let the gentle waves and ocean sounds wash away your stress in this relaxing session.',
    duration: 600, // 10 minutes
    category: 'relaxation',
    is_audio_only: true,
    preview_url: '/videos/ocean-preview.mp4',
    audio_url: '/audio/ocean-waves.mp3',
    difficulty: 'easy',
    emotions: ['calm', 'peaceful'],
    tags: ['reduce anxiety', 'improve sleep'],
    benefits: ['reduce anxiety', 'improve sleep'],
    popularity: 80,
    level: 'beginner',
    recommended_mood: 'anxious'
  },
  {
    id: '3',
    template_id: 'mindfulness-practice',
    title: 'Mindfulness Practice',
    theme: 'mindfulness',
    name: 'Mindfulness Practice',
    description: 'A guided mindfulness practice to help you stay present and aware of your thoughts and feelings.',
    duration: 900, // 15 minutes
    category: 'mindfulness',
    is_audio_only: false,
    preview_url: '/videos/mindfulness-preview.mp4',
    audio_url: '/audio/mindfulness-practice.mp3',
    difficulty: 'medium',
    emotions: ['focused', 'grounded'],
    tags: ['improve focus', 'reduce rumination'],
    benefits: ['improve focus', 'reduce rumination'],
    popularity: 75,
    level: 'intermediate',
    recommended_mood: 'distracted'
  },
  {
    id: '4',
    template_id: 'energy-boost',
    title: 'Energy Boost',
    theme: 'energy',
    name: 'Energy Boost',
    description: 'A quick energizing session to boost your mood and motivation.',
    duration: 180, // 3 minutes
    category: 'energy',
    is_audio_only: false,
    preview_url: '/videos/energy-preview.mp4',
    audio_url: '/audio/energy-boost.mp3',
    difficulty: 'easy',
    emotions: ['energized', 'motivated'],
    tags: ['increase energy', 'improve mood'],
    benefits: ['increase energy', 'improve mood'],
    popularity: 90,
    level: 'beginner',
    recommended_mood: 'tired'
  }
];
