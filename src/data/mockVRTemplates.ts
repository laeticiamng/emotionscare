
import { VRSessionTemplate } from '@/types';

// Mock VR Session Templates
export const mockVRTemplatesData: VRSessionTemplate[] = [
  {
    template_id: '1',
    theme: 'Forêt apaisante',
    duration: 5,
    preview_url: 'https://www.youtube.com/embed/BHACKCNDMW8',
  },
  {
    template_id: '2',
    theme: 'Plage relaxante',
    duration: 7,
    preview_url: 'https://www.youtube.com/embed/LTZqYzu3jQo',
  },
  {
    template_id: '3',
    theme: 'Méditation guidée',
    duration: 10,
    preview_url: 'https://www.youtube.com/embed/O-6f5wQXSu8',
    is_audio_only: true,
    audio_url: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-1821.mp3'
  },
  {
    template_id: '4',
    theme: 'Respiration profonde',
    duration: 3,
    preview_url: '',
    is_audio_only: true,
    audio_url: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-1821.mp3'
  },
];
