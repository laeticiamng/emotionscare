
import { VRSessionTemplate } from '@/types';

// Mock VR Session Templates
export const mockVRTemplatesData: VRSessionTemplate[] = [
  {
    id: '1',
    template_id: '1',
    theme: 'Forêt apaisante',
    title: 'Promenade en forêt',
    duration: 5,
    preview_url: 'https://www.youtube.com/embed/BHACKCNDMW8',
    description: 'Une immersion en forêt pour apaiser l\'esprit et calmer les pensées agitées.',
    is_audio_only: false, // Added required field
    recommended_mood: 'calm'
  },
  {
    id: '2',
    template_id: '2',
    theme: 'Plage relaxante',
    title: 'Bord de mer',
    duration: 7,
    preview_url: 'https://www.youtube.com/embed/LTZqYzu3jQo',
    description: 'Écoutez le bruit des vagues et ressentez la brise marine pour une détente profonde.',
    is_audio_only: false, // Added required field
    recommended_mood: 'calm'
  },
  {
    id: '3',
    template_id: '3',
    theme: 'Méditation guidée',
    title: 'Méditation pleine conscience',
    duration: 10,
    preview_url: 'https://www.youtube.com/embed/O-6f5wQXSu8',
    is_audio_only: true,
    audio_url: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-1821.mp3',
    description: 'Une séance de méditation guidée pour développer votre pleine conscience.',
    recommended_mood: 'focused'
  },
  {
    id: '4',
    template_id: '4',
    theme: 'Respiration profonde',
    title: 'Exercices de respiration',
    duration: 3,
    preview_url: '',
    is_audio_only: true,
    audio_url: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-1821.mp3',
    description: 'Des exercices de respiration pour réduire le stress et l\'anxiété.',
    recommended_mood: 'calm'
  },
];
