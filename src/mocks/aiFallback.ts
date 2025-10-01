// @ts-nocheck

/**
 * MOCK DATA
 * Ce fichier respecte strictement le type officiel EmotionResult
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

// Mock analysis data for fallback when AI services fail

export const mockAnalysis = {
  emotion: "neutral",
  confidence: 0.7,
  feedback: "Votre état émotionnel semble neutre. Il n'y a pas assez d'information pour une analyse plus précise.",
  recommendations: [
    "Prenez un moment pour réfléchir à votre journée",
    "Essayez une session de méditation de 5 minutes",
    "Écoutez une musique que vous aimez"
  ],
  transcript: ""
};

export const mockEmotions = [
  {
    id: "emotion-1",
    userId: "user-1",
    user_id: "user-1", // For backwards compatibility
    timestamp: new Date().toISOString(),
    date: new Date().toISOString(), // For backwards compatibility
    emotion: "happy",
    confidence: 0.85,
    score: 0.85, // For backwards compatibility
    text: "Je me sens très bien aujourd'hui !",
    emojis: ["😊", "🎉"],
    feedback: "Vous semblez être de bonne humeur. Profitez de cette énergie positive !",
    intensity: 0.85,
    source: "text",
  },
  {
    id: "emotion-2",
    userId: "user-1",
    user_id: "user-1", // For backwards compatibility
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    date: new Date(Date.now() - 86400000).toISOString(), // For backwards compatibility
    emotion: "calm",
    confidence: 0.75,
    score: 0.7, // For backwards compatibility
    text: "Journée tranquille et productive",
    emojis: ["😌"],
    feedback: "Vous êtes dans un état calme et équilibré. C'est idéal pour la concentration.",
    intensity: 0.7,
    source: "text",
  }
];

// Add the missing createFallbackEmotion function
export const createFallbackEmotion = (userId: string = 'user-1') => {
  return {
    id: `emotion-${Date.now()}`,
    userId: userId,
    user_id: userId, // For backwards compatibility
    timestamp: new Date().toISOString(),
    date: new Date().toISOString(), // For backwards compatibility
    emotion: "neutral",
    confidence: 0.6,
    score: 0.65, // For backwards compatibility
    text: "Analyse par défaut",
    emojis: ["😐"],
    feedback: "Nous n'avons pas pu analyser précisément votre état émotionnel.",
    intensity: 0.6,
    source: "system",
  };
};
