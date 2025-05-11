
import { ChatResponse } from '@/types/music';

export async function getChatResponse(query: string): Promise<ChatResponse> {
  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sample responses based on query content
  if (query.toLowerCase().includes('bonjour') || query.toLowerCase().includes('salut')) {
    return {
      text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      follow_up_questions: [
        "Comment vous sentez-vous ?",
        "Souhaitez-vous explorer vos émotions ?",
        "Avez-vous besoin d'aide pour la méditation ?"
      ],
      sentiment: "neutral"
    };
  }
  
  if (
    query.toLowerCase().includes('triste') || 
    query.toLowerCase().includes('déprimé') ||
    query.toLowerCase().includes('mal')
  ) {
    return {
      text: "Je suis désolé d'apprendre que vous ne vous sentez pas bien. C'est normal de traverser des moments difficiles. Voulez-vous essayer une session de méditation guidée pour vous aider à vous sentir mieux ?",
      follow_up_questions: [
        "Depuis combien de temps vous sentez-vous ainsi ?",
        "Qu'est-ce qui pourrait vous remonter le moral ?",
        "Aimeriez-vous parler de ce qui vous préoccupe ?"
      ],
      sentiment: "empathetic"
    };
  }
  
  if (
    query.toLowerCase().includes('heureux') || 
    query.toLowerCase().includes('content') ||
    query.toLowerCase().includes('bien')
  ) {
    return {
      text: "Je suis ravi d'entendre que vous vous sentez bien ! C'est une excellente occasion de renforcer cette énergie positive. Peut-être souhaitez-vous explorer une activité créative ou partager votre bonheur avec quelqu'un ?",
      follow_up_questions: [
        "Qu'est-ce qui vous rend particulièrement heureux aujourd'hui ?",
        "Comment pourriez-vous maintenir cette bonne humeur ?",
        "Avez-vous pensé à noter ce moment dans votre journal émotionnel ?"
      ],
      sentiment: "positive"
    };
  }
  
  // Default response
  return {
    text: "Merci pour votre message. Comment puis-je vous aider davantage avec votre bien-être émotionnel aujourd'hui ?",
    follow_up_questions: [
      "Souhaitez-vous explorer vos émotions actuelles ?",
      "Avez-vous essayé notre nouvelle fonctionnalité de méditation guidée ?",
      "Puis-je vous suggérer des activités pour améliorer votre humeur ?"
    ],
    sentiment: "neutral"
  };
}

// Export the ChatService
const ChatService = {
  getChatResponse
};

export { ChatService };
