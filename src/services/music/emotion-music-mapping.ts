
// Mapping des émotions vers les types de musique
export const EMOTION_TO_MUSIC_MAP: Record<string, string> = {
  'happy': 'energetic',
  'joyful': 'energetic',
  'excited': 'energetic',
  'content': 'calm',
  'neutral': 'neutral',
  'sad': 'calm',
  'sadness': 'calm',
  'anxious': 'calm',
  'stressed': 'calm',
  'angry': 'calm',
  'anger': 'calm',
  'frustrated': 'calm',
  'fearful': 'calm',
  'fear': 'calm',
  'tired': 'relaxing',
  'calm': 'relaxing',
  'relaxed': 'relaxing',
  'bored': 'energetic',
  'joy': 'energetic', // Ajouté pour compatibilité
  'surprise': 'energetic', // Ajouté
  'disgust': 'calm', // Ajouté
  'default': 'neutral'
};

// Fonction pour mapper une émotion à un type de musique
export const mapEmotionToMusicType = (emotion: string): string => {
  if (!emotion) return EMOTION_TO_MUSIC_MAP.default;
  
  const lowerEmotion = emotion.toLowerCase();
  return EMOTION_TO_MUSIC_MAP[lowerEmotion] || EMOTION_TO_MUSIC_MAP.default;
};

// Fonction avancée qui prend en compte l'intensité émotionnelle
export const getAdvancedMusicRecommendation = (emotion: string, intensity: number = 0.5): string => {
  const musicType = mapEmotionToMusicType(emotion);
  
  // Adjustments based on intensity (0-1)
  if (intensity > 0.8) {
    // Pour des émotions très intenses
    switch (musicType) {
      case 'energetic': 
        return 'upbeat';
      case 'calm': 
        return 'deep-calm';
      case 'relaxing': 
        return 'deep-relaxation';
      default: 
        return musicType;
    }
  } else if (intensity < 0.3) {
    // Pour des émotions de faible intensité
    switch (musicType) {
      case 'energetic': 
        return 'light-energetic';
      case 'calm': 
        return 'ambient';
      case 'relaxing': 
        return 'background';
      default: 
        return 'ambient';
    }
  }
  
  return musicType;
};

export default {
  EMOTION_TO_MUSIC_MAP,
  mapEmotionToMusicType,
  getAdvancedMusicRecommendation
};
