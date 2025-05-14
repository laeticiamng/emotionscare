import { VRSessionTemplate } from '@/types/vr';

export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    name: 'Ocean Meditation',
    description: 'Relax to the sound of waves and guided meditation',
    duration: 600, // 10 minutes
    type: 'meditation',
    thumbnail: '/images/vr/ocean-meditation.jpg',
    videoUrl: '/videos/vr/ocean-meditation.mp4',
    emotion: 'calm',
    title: 'Ocean Meditation',
    audio_url: '/audio/meditation/ocean.mp3',
    preview_url: '/images/vr/ocean-meditation-preview.jpg',
    is_audio_only: false,
    difficulty: 'beginner',
    theme: 'nature',
    tags: ['meditation', 'ocean', 'relaxation'] // Add tags field
  },
  {
    id: '2',
    name: 'Forest Walk',
    description: 'A calming walk through a lush green forest',
    duration: 900, // 15 minutes
    type: 'relaxation',
    thumbnail: '/images/vr/forest-walk.jpg',
    videoUrl: '/videos/vr/forest-walk.mp4',
    emotion: 'calm',
    title: 'Forest Walk',
    audio_url: '/audio/relaxation/forest.mp3',
    preview_url: '/images/vr/forest-walk-preview.jpg',
    is_audio_only: false,
    difficulty: 'beginner',
    theme: 'nature',
    tags: ['relaxation', 'forest', 'nature'] // Add tags field
  },
  {
    id: '3',
    name: 'Mountain View',
    description: 'Enjoy the serene view from a high mountain peak',
    duration: 1200, // 20 minutes
    type: 'scenic',
    thumbnail: '/images/vr/mountain-view.jpg',
    videoUrl: '/videos/vr/mountain-view.mp4',
    emotion: 'joy',
    title: 'Mountain View',
    audio_url: '/audio/scenic/mountain.mp3',
    preview_url: '/images/vr/mountain-view-preview.jpg',
    is_audio_only: false,
    difficulty: 'intermediate',
    theme: 'nature',
    tags: ['scenic', 'mountain', 'nature'] // Add tags field
  },
  {
    id: '4',
    name: 'Sunset Beach',
    description: 'Watch a beautiful sunset on a tropical beach',
    duration: 720, // 12 minutes
    type: 'relaxation',
    thumbnail: '/images/vr/sunset-beach.jpg',
    videoUrl: '/videos/vr/sunset-beach.mp4',
    emotion: 'joy',
    title: 'Sunset Beach',
    audio_url: '/audio/relaxation/beach.mp3',
    preview_url: '/images/vr/sunset-beach-preview.jpg',
    is_audio_only: false,
    difficulty: 'beginner',
    theme: 'nature',
    tags: ['relaxation', 'beach', 'nature'] // Add tags field
  }
];
