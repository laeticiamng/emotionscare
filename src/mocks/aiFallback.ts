// Fallbacks pour les analyses d'émotions quand l'API ne répond pas

import type { Emotion, EmotionResult } from '@/types';

// Types d'émotions disponibles
export type EmotionType = 'happy' | 'sad' | 'calm' | 'worried' | 'excited' | 'frustrated' | 'neutral' | 'unknown';

/**
 * Fournit un résultat d'analyse d'émotion pour le cas où l'API ne répond pas
 */
export const getFallbackEmotionAnalysis = (text?: string, emojis?: string): EmotionResult => {
  // Si nous avons du texte, essayons de faire une analyse basique
  if (text) {
    // Mots-clés positifs
    const positiveWords = ['heureux', 'content', 'bien', 'super', 'génial', 'sourire', 'positive', 'agréable', 'joie'];
    // Mots-clés négatifs
    const negativeWords = ['triste', 'mal', 'fatigué', 'stress', 'anxieux', 'inquiet', 'déprimé', 'problème', 'colère'];
    // Mots-clés calmes
    const calmWords = ['calme', 'paisible', 'serein', 'tranquille', 'zen', 'relaxant', 'repos', 'détendu'];
    // Mots-clés excitation
    const excitedWords = ['excité', 'enthousiaste', 'impatient', 'énergique', 'motivé', 'passionnant', 'adrénaline'];
    
    const textLower = text.toLowerCase();
    
    // Compter les occurrences de mots-clés dans chaque catégorie
    let positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    let negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    let calmCount = calmWords.filter(word => textLower.includes(word)).length;
    let excitedCount = excitedWords.filter(word => textLower.includes(word)).length;
    
    // Si des émojis sont présents, ajouter du poids supplémentaire
    if (emojis) {
      if (/😊|😁|😄|🙂|👍|❤️|😃|🤗/.test(emojis)) positiveCount += 2;
      if (/😢|😭|😔|😞|😥|😩|☹️|🙁/.test(emojis)) negativeCount += 2;
      if (/😌|😴|🧘|🌈|🌊|🌱/.test(emojis)) calmCount += 2;
      if (/🎉|🎊|🚀|✨|🔥|💯|⚡/.test(emojis)) excitedCount += 2;
    }
    
    // Déterminer l'émotion dominante
    const max = Math.max(positiveCount, negativeCount, calmCount, excitedCount);
    
    if (max === 0) {
      return {
        emotion: 'neutral',
        confidence: 0.6,
        transcript: text
      };
    }
    
    if (max === positiveCount) {
      return {
        emotion: excitedCount > positiveCount / 2 ? 'excited' : 'happy',
        confidence: Math.min(0.7, 0.5 + (positiveCount / 10)),
        transcript: text
      };
    }
    
    if (max === negativeCount) {
      return {
        emotion: calmCount > negativeCount / 2 ? 'worried' : 'frustrated',
        confidence: Math.min(0.7, 0.5 + (negativeCount / 10)),
        transcript: text
      };
    }
    
    if (max === calmCount) {
      return {
        emotion: 'calm',
        confidence: Math.min(0.7, 0.5 + (calmCount / 10)),
        transcript: text
      };
    }
    
    if (max === excitedCount) {
      return {
        emotion: 'excited',
        confidence: Math.min(0.7, 0.5 + (excitedCount / 10)),
        transcript: text
      };
    }
  }
  
  // Si nous avons juste des émojis
  if (emojis && !text) {
    if (/😊|😁|😄|🙂|👍|❤️|😃|🤗/.test(emojis)) {
      return {
        emotion: 'happy',
        confidence: 0.65,
        transcript: emojis
      };
    }
    if (/😢|😭|😔|😞|😥|😩|☹️|🙁/.test(emojis)) {
      return {
        emotion: 'sad',
        confidence: 0.65,
        transcript: emojis
      };
    }
    if (/😌|😴|🧘|🌈|🌊|🌱/.test(emojis)) {
      return {
        emotion: 'calm',
        confidence: 0.65,
        transcript: emojis
      };
    }
    if (/🎉|🎊|🚀|✨|🔥|💯|⚡/.test(emojis)) {
      return {
        emotion: 'excited',
        confidence: 0.65,
        transcript: emojis
      };
    }
    if (/😠|😡|😤|👎|💢|🔥/.test(emojis)) {
      return {
        emotion: 'frustrated',
        confidence: 0.65,
        transcript: emojis
      };
    }
    if (/😟|😨|😰|😧|😬|🤔/.test(emojis)) {
      return {
        emotion: 'worried',
        confidence: 0.65,
        transcript: emojis
      };
    }
  }
  
  // Fallback par défaut si nous ne pouvons pas faire d'analyse
  return {
    emotion: 'neutral',
    confidence: 0.5,
    transcript: text || emojis || ''
  };
};

/**
 * Génère un objet Emotion compatible avec l'API pour un fallback
 */
export const createFallbackEmotion = (
  userId: string,
  text?: string,
  emojis?: string,
  audioUrl?: string
): Emotion => {
  const result = getFallbackEmotionAnalysis(text, emojis);
  const score = getScoreFromEmotion(result.emotion || 'neutral');
  
  return {
    id: `fallback-${Date.now()}`,
    user_id: userId,
    date: new Date().toISOString(),
    emotion: result.emotion,
    score,
    text,
    emojis,
    audio_url: audioUrl,
    source: 'fallback',
    confidence: result.confidence,
    is_confidential: true,
    ai_feedback: getFallbackFeedback(result.emotion || 'neutral')
  };
};

/**
 * Convertit une émotion en score numérique
 */
const getScoreFromEmotion = (emotion: string): number => {
  switch (emotion) {
    case 'happy': return 80;
    case 'excited': return 85;
    case 'calm': return 75;
    case 'neutral': return 60;
    case 'worried': return 40;
    case 'frustrated': return 30;
    case 'sad': return 25;
    default: return 50;
  }
};

/**
 * Génère un feedback basique en fonction de l'émotion détectée
 */
const getFallbackFeedback = (emotion: string): string => {
  switch (emotion) {
    case 'happy':
      return "Je vois que vous êtes dans un état d'esprit positif aujourd'hui. C'est formidable ! Profitez de cette énergie pour accomplir vos objectifs.";
    case 'excited':
      return "Votre enthousiasme est palpable ! Canalisez cette énergie positive dans vos projets et n'oubliez pas de la partager avec votre entourage.";
    case 'calm':
      return "Vous semblez serein et équilibré aujourd'hui. C'est un excellent état d'esprit pour prendre des décisions réfléchies et vous concentrer sur l'essentiel.";
    case 'neutral':
      return "Votre humeur semble neutre aujourd'hui. C'est un bon moment pour prendre du recul et réfléchir à ce qui pourrait vous apporter plus de satisfaction.";
    case 'worried':
      return "Je perçois une certaine inquiétude. Avez-vous essayé quelques exercices de respiration ? Parfois, prendre un moment pour soi peut aider à clarifier les pensées.";
    case 'frustrated':
      return "La frustration que vous ressentez est compréhensible. Essayez de vous accorder une pause et peut-être de recadrer la situation sous un angle différent.";
    case 'sad':
      return "Il est normal de traverser des moments difficiles. N'hésitez pas à partager vos sentiments avec un proche ou à pratiquer une activité qui vous fait du bien.";
    default:
      return "Merci pour votre partage d'aujourd'hui. Comment puis-je vous aider à améliorer votre journée ?";
  }
};
