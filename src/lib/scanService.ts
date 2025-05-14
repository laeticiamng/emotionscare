
import { EmotionResult, Emotion } from '@/types/emotion';

// Mock emotion analysis service
export async function analyzeEmotion(analysisData: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Déterminer l'émotion en fonction des données
  let emotion = 'neutral';
  let score = 5;
  
  if (analysisData.text) {
    // Analyse basique du texte
    const text = analysisData.text.toLowerCase();
    
    if (text.includes('content') || text.includes('heureux') || text.includes('joie')) {
      emotion = 'joy';
      score = 8;
    } else if (text.includes('triste') || text.includes('déprimé')) {
      emotion = 'sadness';
      score = 3;
    } else if (text.includes('peur') || text.includes('anxiet') || text.includes('stress')) {
      emotion = 'fear';
      score = 2;
    } else if (text.includes('colère') || text.includes('énervé') || text.includes('frustré')) {
      emotion = 'anger';
      score = 2;
    } else if (text.includes('calme') || text.includes('serein') || text.includes('paix')) {
      emotion = 'calm';
      score = 7;
    }
  }
  
  // Prendre en compte les emojis
  if (analysisData.emojis) {
    if (analysisData.emojis.includes('😊') || analysisData.emojis.includes('😁')) {
      emotion = 'joy';
      score = 8;
    } else if (analysisData.emojis.includes('😔') || analysisData.emojis.includes('😢')) {
      emotion = 'sadness';
      score = 3;
    } else if (analysisData.emojis.includes('😨') || analysisData.emojis.includes('😰')) {
      emotion = 'fear';
      score = 2;
    } else if (analysisData.emojis.includes('😡') || analysisData.emojis.includes('😠')) {
      emotion = 'anger';
      score = 2;
    } else if (analysisData.emojis.includes('😌') || analysisData.emojis.includes('😇')) {
      emotion = 'calm';
      score = 7;
    }
  }
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    emotion: emotion,
    primaryEmotion: emotion,
    dominantEmotion: emotion,
    score: score,
    text: analysisData.text || '',
    emojis: analysisData.emojis || '',
    feedback: generateFeedback(emotion, score),
    ai_feedback: generateFeedback(emotion, score),
    source: analysisData.text ? 'text' : analysisData.audio_url ? 'audio' : 'manual',
    user_id: analysisData.user_id,
    confidence: 0.85,
    intensity: score / 10,
    recommendations: generateRecommendations(emotion),
    timestamp: new Date().toISOString(),
    date: new Date().toISOString()
  };
}

// Enregistrer une émotion
export async function saveEmotion(emotion: Emotion): Promise<Emotion> {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simuler la sauvegarde et renvoyer avec un ID généré si nécessaire
  const savedEmotion = {
    ...emotion,
    id: emotion.id || Math.random().toString(36).substring(2, 15),
    date: emotion.date || new Date().toISOString()
  };
  
  return savedEmotion;
}

// Générer des recommandations basées sur l'émotion
function generateRecommendations(emotion: string): string[] {
  const recommendations: Record<string, string[]> = {
    joy: [
      "Partagez votre joie avec un proche",
      "Noter 3 choses dont vous êtes reconnaissant",
      "Écoutez votre musique préférée"
    ],
    sadness: [
      "Appelez un ami ou un membre de votre famille",
      "Faites une promenade en plein air",
      "Écoutez une musique apaisante",
      "Écrivez vos pensées dans un journal"
    ],
    fear: [
      "Pratiquez des exercices de respiration",
      "Méditez pendant 10 minutes",
      "Notez vos inquiétudes et examinez-les objectivement",
      "Parlez à un ami de confiance"
    ],
    anger: [
      "Comptez jusqu'à 10 avant de réagir",
      "Faites de l'exercice physique",
      "Notez ce qui vous met en colère",
      "Prenez une douche chaude"
    ],
    calm: [
      "Prenez le temps d'apprécier ce moment",
      "Pratiquez la gratitude",
      "Notez les facteurs qui contribuent à votre calme"
    ],
    neutral: [
      "Essayez une activité créative",
      "Faites une pause méditative",
      "Connectez-vous avec un ami"
    ]
  };
  
  return recommendations[emotion] || recommendations.neutral;
}

// Générer un feedback basé sur l'émotion
function generateFeedback(emotion: string, score: number): string {
  const feedbacks: Record<string, string> = {
    joy: "Vous semblez être dans un état de joie. C'est fantastique ! Profitez de cette énergie positive pour accomplir des tâches créatives ou pour partager votre enthousiasme avec d'autres.",
    sadness: "Vous semblez ressentir de la tristesse. C'est une émotion normale que nous ressentons tous. Prenez le temps de vous reposer et soyez bienveillant envers vous-même.",
    fear: "Vous semblez ressentir de l'anxiété ou de la peur. Essayez de prendre quelques respirations profondes et de vous concentrer sur le moment présent.",
    anger: "Vous semblez ressentir de la colère. Cette émotion peut être canalisée positivement. Considérez l'exercice physique ou l'écriture pour libérer cette tension.",
    calm: "Vous semblez être dans un état de calme. C'est un excellent moment pour pratiquer la pleine conscience ou pour réfléchir à vos objectifs.",
    neutral: "Votre état émotionnel semble être neutre. C'est un bon moment pour se recentrer et décider de la direction que vous souhaitez prendre pour le reste de la journée."
  };
  
  return feedbacks[emotion] || feedbacks.neutral;
}

// Obtenir l'historique des émotions
export async function getEmotionsHistory(userId: string): Promise<Emotion[]> {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Retourner des données simulées
  return [
    {
      id: '1',
      user_id: userId,
      date: new Date(Date.now() - 86400000 * 1).toISOString(), // Hier
      emotion: 'joy',
      score: 8,
      text: "J'ai passé une excellente journée aujourd'hui !",
      emojis: '😊',
      ai_feedback: "Vous êtes dans un excellent état d'esprit. Profitez de cette énergie positive !"
    },
    {
      id: '2',
      user_id: userId,
      date: new Date(Date.now() - 86400000 * 2).toISOString(), // Avant-hier
      emotion: 'calm',
      score: 7,
      text: "Journée tranquille et productive.",
      emojis: '😌',
      ai_feedback: "Vous êtes calme et centré, c'est un excellent état pour prendre des décisions importantes."
    },
    {
      id: '3',
      user_id: userId,
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      emotion: 'sadness',
      score: 4,
      text: "Je me sens un peu abattu aujourd'hui.",
      emojis: '😔',
      ai_feedback: "Il est normal de se sentir triste parfois. Prenez soin de vous et n'hésitez pas à parler à quelqu'un."
    }
  ];
}
