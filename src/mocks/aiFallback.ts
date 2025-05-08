
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
    user_id: "user-1",
    date: new Date().toISOString(),
    emotion: "happy",
    score: 85,
    text: "Je me sens très bien aujourd'hui !",
    emojis: "😊🎉",
    ai_feedback: "Vous semblez être de bonne humeur. Profitez de cette énergie positive !",
    confidence: 0.85,
    source: "scan",
    is_confidential: false
  },
  {
    id: "emotion-2",
    user_id: "user-1",
    date: new Date(Date.now() - 86400000).toISOString(),
    emotion: "calm",
    score: 70,
    text: "Journée tranquille et productive",
    emojis: "😌",
    ai_feedback: "Vous êtes dans un état calme et équilibré. C'est idéal pour la concentration.",
    confidence: 0.75,
    source: "scan",
    is_confidential: false
  }
];

// Add the missing createFallbackEmotion function
export const createFallbackEmotion = (userId: string = 'user-1') => {
  return {
    id: `emotion-${Date.now()}`,
    user_id: userId,
    date: new Date().toISOString(),
    emotion: "neutral",
    score: 65,
    text: "Analyse par défaut",
    emojis: "😐",
    ai_feedback: "Nous n'avons pas pu analyser précisément votre état émotionnel.",
    confidence: 0.6,
    source: "fallback"
  };
};
