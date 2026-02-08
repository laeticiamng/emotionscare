// @ts-nocheck

// Constantes globales de l'application
export const APP_CONFIG = {
  name: 'EmotionsCare',
  version: '1.0.0',
  author: 'EmotionsCare Team',
  description: 'Plateforme de régulation émotionnelle dédiée aux étudiants en santé et aux professionnels du soin',
  tagline: 'Prendre soin de celles et ceux qui prennent soin.',
  subtitle: 'Une plateforme de régulation émotionnelle dédiée aux étudiants en santé et aux professionnels du soin.',
  url: 'https://emotionscare.com',
  target: {
    primary: 'Étudiants en santé et professionnels du soin',
    b2c: ['Étudiants en santé', 'Infirmiers', 'Médecins', 'Aides-soignants', 'Psychologues'],
    b2b: ['Facultés de médecine', 'Hôpitaux', 'Cliniques', 'EHPAD', 'Centres de santé']
  }
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUDIT: '/audit',
  
  // Modules émotionnels
  BOSS_LEVEL: '/boss-level',
  MOOD_MIXER: '/mood-mixer',
  AMBITION_ARCADE: '/ambition-arcade',
  BOUNCE_BACK: '/bounce-back',
  STORY_SYNTH: '/story-synth',
  FLASH_GLOW: '/flash-glow',
  AR_FILTERS: '/ar-filters',
  BUBBLE_BEAT: '/bubble-beat',
  SCREEN_SILK: '/screen-silk',
  VR_GALACTIC: '/vr-galactic',
  
  // Analytics
  JOURNAL: '/journal',
  MUSIC_THERAPY: '/music-therapy',
  EMOTION_SCAN: '/emotion-scan',
  BREATHWORK: '/breathwork',
  VR_BREATHING: '/vr-breathing',
  
  // Profil & Settings
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PRIVACY: '/privacy',
  
  // Support
  HELP: '/help',
  FEEDBACK: '/feedback'
} as const;

export const COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    900: '#0c4a6e'
  },
  emotion: {
    joy: '#fbbf24',
    calm: '#34d399', 
    energy: '#f59e0b',
    focus: '#8b5cf6',
    stress: '#ef4444'
  }
} as const;
