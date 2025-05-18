
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Conversation } from '@/types/chat';

// Générer des horodatages récents
const generateRecentTime = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

// Messages de démonstration
export const mockChatMessages: ChatMessage[] = [
  {
    id: uuidv4(),
    text: "Bonjour, comment puis-je vous aider aujourd'hui ?",
    sender: "assistant",
    timestamp: generateRecentTime(10),
    conversationId: "conv-1"
  },
  {
    id: uuidv4(),
    text: "Je me sens un peu stressé par mon travail.",
    sender: "user",
    timestamp: generateRecentTime(9),
    conversationId: "conv-1"
  },
  {
    id: uuidv4(),
    text: "Je comprends. Le stress au travail est courant. Pouvez-vous me dire ce qui vous stresse particulièrement ?",
    sender: "assistant",
    timestamp: generateRecentTime(8),
    conversationId: "conv-1"
  },
  {
    id: uuidv4(),
    text: "J'ai beaucoup de projets à gérer en même temps et les délais sont serrés.",
    sender: "user",
    timestamp: generateRecentTime(7),
    conversationId: "conv-1"
  },
  {
    id: uuidv4(),
    text: "La gestion de multiples projets avec des délais serrés peut être difficile. Avez-vous essayé des techniques de gestion du temps ou de priorisation ?",
    sender: "assistant",
    timestamp: generateRecentTime(6),
    conversationId: "conv-1"
  }
];

// Conversations de démonstration
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Discussion sur le stress au travail",
    messages: mockChatMessages.filter(m => m.conversationId === "conv-1"),
    created_at: generateRecentTime(10),
    updated_at: generateRecentTime(6),
    createdAt: generateRecentTime(10),
    updatedAt: generateRecentTime(6),
    user_id: "user-123",
    lastMessage: "La gestion de multiples projets avec des délais serrés peut être difficile. Avez-vous essayé des techniques de gestion du temps ou de priorisation ?"
  },
  {
    id: "conv-2",
    title: "Conseils pour améliorer le sommeil",
    messages: [],
    created_at: generateRecentTime(1440), // Il y a 1 jour
    updated_at: generateRecentTime(1380),
    createdAt: generateRecentTime(1440),
    updatedAt: generateRecentTime(1380),
    user_id: "user-123",
    lastMessage: "Essayez d'établir une routine régulière de sommeil et d'éviter les écrans avant de vous coucher."
  },
  {
    id: "conv-3",
    title: "Techniques de méditation",
    messages: [],
    created_at: generateRecentTime(2880), // Il y a 2 jours
    updated_at: generateRecentTime(2820),
    createdAt: generateRecentTime(2880),
    updatedAt: generateRecentTime(2820),
    user_id: "user-123",
    lastMessage: "La méditation de pleine conscience peut vous aider à vous concentrer sur le moment présent."
  }
];

export default mockChatMessages;
