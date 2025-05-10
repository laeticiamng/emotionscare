
// Mapping des émotions vers les types de musique
export const EMOTION_TO_MUSIC_MAP: Record<string, string> = {
  'happy': 'energetic',
  'joyful': 'energetic',
  'excited': 'energetic',
  'content': 'calm',
  'neutral': 'neutral',
  'sad': 'calm',
  'anxious': 'calm',
  'stressed': 'calm',
  'angry': 'calm',
  'frustrated': 'calm',
  'fearful': 'calm',
  'tired': 'relaxing',
  'calm': 'relaxing',
  'relaxed': 'relaxing',
  'bored': 'energetic',
  'default': 'neutral'
};

// Fonction pour mapper une émotion à un type de musique
export const mapEmotionToMusicType = (emotion: string): string => {
  const lowerEmotion = emotion.toLowerCase();
  return EMOTION_TO_MUSIC_MAP[lowerEmotion] || EMOTION_TO_MUSIC_MAP.default;
};

export default {
  EMOTION_TO_MUSIC_MAP,
  mapEmotionToMusicType
};
