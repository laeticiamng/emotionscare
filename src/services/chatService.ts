
import { ChatResponse } from '@/types/music';

/**
 * Obtient une réponse AI pour un message utilisateur
 */
export const getChatResponse = async (message: string): Promise<ChatResponse> => {
  // Simuler une réponse pour la démonstration
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Analyse basique de sentiment pour la démonstration
  let sentiment = 'neutral';
  if (message.toLowerCase().includes('heureux') || message.toLowerCase().includes('content') || message.toLowerCase().includes('bien')) {
    sentiment = 'happy';
  } else if (message.toLowerCase().includes('triste') || message.toLowerCase().includes('mal') || message.toLowerCase().includes('pas bien')) {
    sentiment = 'sad';
  } else if (message.toLowerCase().includes('stressé') || message.toLowerCase().includes('anxieux')) {
    sentiment = 'anxious';
  }
  
  const responses: Record<string, string> = {
    happy: "Je suis ravi que vous vous sentiez bien ! C'est une excellente nouvelle. Souhaitez-vous explorer des activités qui pourraient prolonger cet état de bien-être ?",
    sad: "Je comprends que vous ne vous sentiez pas au mieux. C'est normal d'avoir des hauts et des bas. Souhaitez-vous que je vous suggère des activités qui pourraient vous aider à vous sentir mieux ?",
    anxious: "Je perçois que vous êtes stressé. Respirez profondément. Souhaiteriez-vous essayer une courte séance de respiration guidée ou de méditation pour vous aider à vous détendre ?",
    neutral: "Merci de partager cela avec moi. Comment puis-je vous aider aujourd'hui ? Souhaitez-vous explorer des exercices de bien-être, discuter de vos émotions, ou autre chose ?"
  };
  
  return {
    text: responses[sentiment] || responses.neutral,
    sentiment: sentiment,
    follow_up_questions: [
      "Comment vous sentez-vous généralement ces derniers jours ?",
      "Qu'est-ce qui vous aide habituellement quand vous vous sentez ainsi ?",
      "Souhaitez-vous explorer des activités pour améliorer votre bien-être ?"
    ]
  };
};

// Exporter le module par défaut pour la compatibilité
export default {
  getChatResponse
};
