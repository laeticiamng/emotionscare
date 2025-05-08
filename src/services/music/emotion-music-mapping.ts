
// Mapping des émotions vers des types de musique
export const EMOTION_TO_MUSIC_MAP: Record<string, string> = {
  'happy': 'happy',
  'excited': 'energetic',
  'joyful': 'happy',
  'sad': 'calm',
  'anxious': 'calm',
  'stressed': 'calm',
  'angry': 'calm',
  'calm': 'calm',
  'relaxed': 'calm',
  'neutral': 'neutral',
  'focused': 'focused',
  'default': 'neutral'
};

/**
 * Convertit une émotion en type de musique recommandée
 */
export function mapEmotionToMusicType(emotion: string): string {
  const normalizedEmotion = emotion.toLowerCase();
  return EMOTION_TO_MUSIC_MAP[normalizedEmotion] || EMOTION_TO_MUSIC_MAP.default;
}

/**
 * Détermine si une émotion est positive
 */
export function isPositiveEmotion(emotion: string): boolean {
  const positiveEmotions = ['happy', 'excited', 'joyful', 'calm', 'relaxed'];
  return positiveEmotions.includes(emotion.toLowerCase());
}

/**
 * Obtient une description pour une émotion donnée
 */
export function getEmotionDescription(emotion: string): string {
  const descriptions: Record<string, string> = {
    'happy': 'Des mélodies positives pour maintenir votre bonne humeur',
    'calm': 'Des sons apaisants pour favoriser la détente et la sérénité',
    'focused': 'Des rythmes soutenus pour améliorer votre concentration',
    'energetic': 'Des tempos dynamiques pour stimuler votre énergie',
    'neutral': 'Une ambiance équilibrée adaptée à votre journée'
  };

  const musicType = mapEmotionToMusicType(emotion);
  return descriptions[musicType] || descriptions.neutral;
}
