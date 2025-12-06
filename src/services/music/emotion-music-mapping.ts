// @ts-nocheck

// Mappage des émotions vers des types de musique appropriés
export const EMOTION_TO_MUSIC_MAP: Record<string, string> = {
  'calm': 'ambient',
  'energetic': 'upbeat',
  'creative': 'instrumental',
  'reflective': 'classical',
  'happy': 'pop',
  'sad': 'acoustic',
  'anxious': 'lo-fi',
  'focused': 'concentration',
  'motivated': 'electronic',
  'relaxed': 'nature',
  // Cette valeur par défaut est utilisée si l'émotion n'est pas reconnue
  'default': 'ambient'
};

// Intensités d'ambiance disponibles
export const AMBIENCE_INTENSITY = {
  subtle: 'subtle',
  moderate: 'moderate',
  immersive: 'immersive'
} as const;
