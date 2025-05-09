
import { Emotion } from '@/types';

// Get coach recommendations based on user emotions
export async function getCoachRecommendations(userId: string): Promise<string[]> {
  try {
    // In a real implementation, this would call an API
    // For now, return static recommendations
    return [
      "Prenez une pause de 5 minutes toutes les heures pour vous étirer",
      "Pratiquez la respiration profonde pendant 2 minutes en cas de stress",
      "Buvez suffisamment d'eau tout au long de la journée"
    ];
  } catch (error) {
    console.error('Error getting coach recommendations:', error);
    return [];
  }
}

// Process emotions to generate insights
export async function processEmotions(emotions: Emotion[]): Promise<{
  primaryEmotion: string;
  averageScore: number;
  trend: 'improving' | 'declining' | 'stable';
}> {
  if (!emotions.length) {
    return {
      primaryEmotion: 'neutral',
      averageScore: 50,
      trend: 'stable'
    };
  }

  const sortedEmotions = [...emotions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Count occurrences of each emotion
  const emotionCounts = sortedEmotions.reduce((acc, emotion) => {
    acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get the most frequent emotion
  const primaryEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Calculate average score
  const averageScore = Math.round(
    sortedEmotions.reduce((sum, emotion) => sum + emotion.score, 0) / sortedEmotions.length
  );
  
  // Determine trend by comparing newest vs oldest entries
  const oldestScore = sortedEmotions[sortedEmotions.length - 1].score;
  const newestScore = sortedEmotions[0].score;
  let trend: 'improving' | 'declining' | 'stable';
  
  if (newestScore - oldestScore > 10) {
    trend = 'improving';
  } else if (oldestScore - newestScore > 10) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }
  
  return {
    primaryEmotion,
    averageScore,
    trend
  };
}

// Trigger coach events based on emotion analysis
export async function triggerCoachEvent(
  eventType: 'scan_complete' | 'trend_change' | 'low_score' | 'reminder',
  data: any
): Promise<{
  message: string;
  recommendations: string[];
}> {
  // Generate appropriate response based on event type
  switch(eventType) {
    case 'scan_complete':
      return {
        message: `J'ai analysé votre état émotionnel. Vous semblez vous sentir ${data.emotion}.`,
        recommendations: [
          "Prenez un moment pour réfléchir à votre ressenti",
          "Considérez les facteurs qui ont influencé votre humeur aujourd'hui",
          "Notez vos émotions dans votre journal pour suivre vos tendances"
        ]
      };
      
    case 'trend_change':
      return {
        message: `J'ai remarqué un changement dans votre bien-être émotionnel. Votre score moyen a ${data.direction === 'up' ? 'augmenté' : 'diminué'} de ${data.amount} points.`,
        recommendations: data.direction === 'up' ? [
          "Continuez vos pratiques positives actuelles",
          "Partagez vos succès avec votre cercle de confiance",
          "Réfléchissez à ce qui a contribué à cette amélioration"
        ] : [
          "Prenez du temps pour vous reposer",
          "Parlez à un proche de confiance",
          "Essayez une séance de méditation guidée"
        ]
      };
      
    case 'low_score':
      return {
        message: "Je constate que votre niveau de bien-être est bas aujourd'hui. Comment puis-je vous aider?",
        recommendations: [
          "Essayez une séance de respiration profonde de 5 minutes",
          "Écoutez notre playlist spéciale relaxation",
          "Prenez une pause de vos écrans pendant 30 minutes"
        ]
      };
      
    case 'reminder':
      return {
        message: "Voici votre rappel quotidien pour prendre soin de votre bien-être.",
        recommendations: [
          "N'oubliez pas de faire une pause régulière",
          "Hydratez-vous tout au long de la journée",
          "Prenez quelques minutes pour vous étirer"
        ]
      };
      
    default:
      return {
        message: "Je suis là pour vous aider à améliorer votre bien-être.",
        recommendations: []
      };
  }
}

// Coach service object for query operations
export const coachService = {
  async askQuestion(question: string): Promise<string> {
    // In a real implementation, this would call a ChatGPT-style API
    console.log("Asking coach:", question);
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock response
    if (question.toLowerCase().includes('stress')) {
      return "Pour gérer le stress, je vous recommande de pratiquer la respiration profonde pendant quelques minutes. Inspirez lentement par le nez pendant 4 secondes, retenez votre souffle pendant 4 secondes, puis expirez lentement par la bouche pendant 6 secondes.";
    } else if (question.toLowerCase().includes('dormir') || question.toLowerCase().includes('sommeil')) {
      return "Pour améliorer votre sommeil, essayez d'établir une routine régulière avant de vous coucher. Évitez les écrans une heure avant le coucher, maintenez votre chambre fraîche et sombre, et considérez des techniques de relaxation comme la méditation.";
    } else if (question.toLowerCase().includes('fatigue')) {
      return "La fatigue peut avoir plusieurs causes. Assurez-vous de dormir suffisamment, de bien vous hydrater et de maintenir une alimentation équilibrée. De petites pauses régulières pendant votre journée de travail peuvent également aider à maintenir votre niveau d'énergie.";
    } else {
      return "Merci pour votre question. Pour améliorer votre bien-être, je vous recommande de prendre des pauses régulières, de pratiquer la pleine conscience et de vous assurer que vous vous accordez du temps pour les activités qui vous apportent de la joie. N'hésitez pas à me poser des questions spécifiques sur la gestion du stress, le sommeil ou l'équilibre travail-vie personnelle.";
    }
  }
};
