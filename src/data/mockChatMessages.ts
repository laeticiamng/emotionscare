// @ts-nocheck

import { v4 as uuidv4 } from 'uuid';
// @ts-nocheck
import { ChatMessage, ChatConversation } from '@/types/chat';

// Create conversation IDs
const conversationId1 = uuidv4();
const conversationId2 = uuidv4();
const conversationId3 = uuidv4();

// Mock chat messages for UI development and testing
export const mockChatMessages: ChatMessage[] = [
  {
    id: uuidv4(),
    sender: 'assistant',
    content: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    text: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    timestamp: new Date(Date.now() - 3600000),
    conversationId: conversationId1
  },
  {
    id: uuidv4(),
    sender: 'user',
    content: "Je me sens un peu stressé à cause du travail.",
    text: "Je me sens un peu stressé à cause du travail.",
    timestamp: new Date(Date.now() - 3300000),
    conversationId: conversationId1
  },
  {
    id: uuidv4(),
    sender: 'assistant',
    content: "Je comprends que le stress professionnel puisse être difficile. Avez-vous essayé des exercices de respiration ou de méditation? Ils peuvent être très efficaces pour gérer le stress au travail.",
    text: "Je comprends que le stress professionnel puisse être difficile. Avez-vous essayé des exercices de respiration ou de méditation? Ils peuvent être très efficaces pour gérer le stress au travail.",
    timestamp: new Date(Date.now() - 3000000),
    conversationId: conversationId1
  },
  {
    id: uuidv4(),
    sender: 'user',
    content: "Pas récemment. Tu peux me suggérer quelque chose de simple?",
    text: "Pas récemment. Tu peux me suggérer quelque chose de simple?",
    timestamp: new Date(Date.now() - 2700000),
    conversationId: conversationId1
  },
  {
    id: uuidv4(),
    sender: 'assistant',
    content: "Bien sûr! Voici un exercice simple de respiration que vous pouvez faire à votre bureau: respirez profondément par le nez pendant 4 secondes, retenez votre souffle pendant 4 secondes, puis expirez lentement par la bouche pendant 6 secondes. Répétez cela 5 fois. Cela peut vous aider à diminuer rapidement votre niveau de stress.",
    text: "Bien sûr! Voici un exercice simple de respiration que vous pouvez faire à votre bureau: respirez profondément par le nez pendant 4 secondes, retenez votre souffle pendant 4 secondes, puis expirez lentement par la bouche pendant 6 secondes. Répétez cela 5 fois. Cela peut vous aider à diminuer rapidement votre niveau de stress.",
    timestamp: new Date(Date.now() - 2400000),
    conversationId: conversationId1
  },
];

// Mock conversations
export const mockConversations: ChatConversation[] = [
  {
    id: conversationId1,
    title: 'Gestion du stress',
    messages: mockChatMessages.slice(0, 5),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2400000).toISOString(),
    lastMessage: "Voici un exercice simple de respiration...",
    participants: ['user-1', 'assistant']
  },
  {
    id: conversationId2,
    title: 'Amélioration du sommeil',
    messages: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    lastMessage: "Je vous recommande d'essayer une routine de relaxation avant le coucher...",
    participants: ['user-1', 'assistant']
  },
  {
    id: conversationId3,
    title: 'Exercices de pleine conscience',
    messages: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    lastMessage: "La pleine conscience consiste à porter délibérément attention au moment présent...",
    participants: ['user-1', 'assistant']
  }
];
