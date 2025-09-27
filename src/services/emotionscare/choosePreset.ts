
// Sélecteur de preset EmotionsCare basé sur l'analyse émotionnelle Hume
import { HumeEmotionScore } from './humeClient';
import { EMOTIONSCARE_PRESETS, EmotionsCarePreset } from './presets';

// Map pour l'accès rapide par tag
const TAG_TO_PRESET = new Map<string, EmotionsCarePreset>(
  EMOTIONSCARE_PRESETS.map(p => [p.tag, p])
);

// Fonction de distance Jaro-Winkler simplifiée
function jaroWinklerDistance(a: string, b: string): number {
  if (a === b) return 1;
  
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  
  // Calcul des caractères en commun
  const common = [...aLower].filter(ch => bLower.includes(ch)).length;
  const maxLength = Math.max(aLower.length, bLower.length);
  
  if (maxLength === 0) return 0;
  
  return common / maxLength;
}

// Mapping des émotions Hume vers les tags de presets
const EMOTION_MAPPING: Record<string, string[]> = {
  'joy': ['happy upbeat', 'joyful cheerful', 'euphoric blissful'],
  'happiness': ['happy upbeat', 'joyful cheerful', 'optimistic bright'],
  'excitement': ['excited energetic', 'euphoric blissful', 'wild free'],
  'sadness': ['sad melancholic', 'heartbroken sorrowful', 'lonely solitude'],
  'anger': ['angry furious', 'frustrated annoyed', 'rebellious defiant'],
  'fear': ['fearful scared', 'anxious worried', 'overwhelmed stressed'],
  'surprise': ['surprised shocked', 'wonder amazed', 'curious exploring'],
  'disgust': ['disgusted repulsed', 'frustrated annoyed', 'bored indifferent'],
  'contempt': ['disgusted repulsed', 'frustrated annoyed', 'envious jealous'],
  'pride': ['pride confident', 'victorious triumphant', 'accomplished satisfied'],
  'shame': ['ashamed guilty', 'embarrassed awkward', 'lonely solitude'],
  'guilt': ['ashamed guilty', 'heartbroken sorrowful', 'regretful'],
  'love': ['love romantic', 'gratitude thankful', 'connected unity'],
  'gratitude': ['gratitude thankful', 'love romantic', 'hopeful inspiring'],
  'hope': ['hopeful inspiring', 'optimistic bright', 'dawn hopeful'],
  'relief': ['relieved liberated', 'acceptance peace', 'recovery renewal'],
  'anxiety': ['anxious worried', 'stressed overwhelmed', 'fearful scared'],
  'calm': ['calm peaceful', 'relaxed serene', 'tranquil soothing'],
  'peace': ['calm peaceful', 'acceptance peace', 'meditative zen'],
  'serenity': ['relaxed serene', 'tranquil soothing', 'meditative zen'],
  'nostalgia': ['nostalgic wistful', 'autumn nostalgic', 'rainy melancholic'],
  'loneliness': ['lonely solitude', 'nostalgic wistful', 'sad melancholic'],
  'confusion': ['confused uncertain', 'overwhelmed stressed', 'unknown mixed'],
  'determination': ['determined strong', 'motivated driven', 'strength resilience'],
  'confidence': ['pride confident', 'determined strong', 'victorious triumphant'],
  'empathy': ['empathy compassion', 'love romantic', 'connected unity'],
  'creativity': ['creative inspired', 'playful whimsical', 'wonder amazed'],
  'spirituality': ['spiritual divine', 'transcendent elevated', 'mystical magical'],
  'contentment': ['acceptance peace', 'gratitude thankful', 'neutral balanced'],
  'enthusiasm': ['excited energetic', 'motivated driven', 'adventurous bold'],
  'melancholy': ['sad melancholic', 'nostalgic wistful', 'autumn nostalgic'],
  'passion': ['passionate intense', 'love romantic', 'competitive fierce'],
  'tranquility': ['tranquil soothing', 'calm peaceful', 'meditative zen'],
  'inspiration': ['hopeful inspiring', 'creative inspired', 'transcendent elevated']
};

export function choosePreset(emotions: HumeEmotionScore[]): EmotionsCarePreset {
  if (!emotions || emotions.length === 0) {
    return EMOTIONSCARE_PRESETS[0]; // Default preset
  }

  // Trier les émotions par score décroissant
  const sortedEmotions = emotions.sort((a, b) => b.score - a.score);
  
  // 1. Essayer de trouver un match direct avec le mapping d'émotions
  for (const emotion of sortedEmotions.slice(0, 3)) { // Prendre les 3 émotions les plus fortes
    const emotionName = emotion.name.toLowerCase();
    const mappedTags = EMOTION_MAPPING[emotionName];
    
    if (mappedTags) {
      for (const tag of mappedTags) {
        const preset = TAG_TO_PRESET.get(tag);
        if (preset) {
          console.log(`🎵 EmotionsCare: Selected preset "${tag}" for emotion "${emotionName}" (score: ${emotion.score})`);
          return preset;
        }
      }
    }
  }

  // 2. Fallback: utiliser la distance Jaro-Winkler pour trouver le preset le plus proche
  const topEmotion = sortedEmotions[0];
  let bestMatch = EMOTIONSCARE_PRESETS[0];
  let bestScore = 0;

  for (const preset of EMOTIONSCARE_PRESETS) {
    const similarity = jaroWinklerDistance(preset.tag, topEmotion.name);
    if (similarity > bestScore) {
      bestScore = similarity;
      bestMatch = preset;
    }
  }

  console.log(`🎵 EmotionsCare: Fallback preset "${bestMatch.tag}" for emotion "${topEmotion.name}" (similarity: ${bestScore})`);
  return bestMatch;
}

// Fonction pour obtenir plusieurs presets basés sur un mélange d'émotions
export function chooseMixedPresets(emotions: HumeEmotionScore[], count = 3): EmotionsCarePreset[] {
  if (!emotions || emotions.length === 0) {
    return EMOTIONSCARE_PRESETS.slice(0, count);
  }

  const selectedPresets: EmotionsCarePreset[] = [];
  const usedTags = new Set<string>();
  
  const sortedEmotions = emotions.sort((a, b) => b.score - a.score);

  for (const emotion of sortedEmotions) {
    if (selectedPresets.length >= count) break;
    
    const emotionName = emotion.name.toLowerCase();
    const mappedTags = EMOTION_MAPPING[emotionName];
    
    if (mappedTags) {
      for (const tag of mappedTags) {
        if (usedTags.has(tag)) continue;
        
        const preset = TAG_TO_PRESET.get(tag);
        if (preset) {
          selectedPresets.push(preset);
          usedTags.add(tag);
          break;
        }
      }
    }
  }

  // Compléter avec des presets par défaut si nécessaire
  while (selectedPresets.length < count) {
    for (const preset of EMOTIONSCARE_PRESETS) {
      if (!usedTags.has(preset.tag)) {
        selectedPresets.push(preset);
        usedTags.add(preset.tag);
        break;
      }
    }
  }

  return selectedPresets;
}
