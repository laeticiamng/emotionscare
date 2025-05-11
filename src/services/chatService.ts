import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatConversation, ChatResponse } from '@/types/chat';

// Mock function to simulate getting AI response
export const getAIResponse = async (message: string): Promise<ChatResponse> => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockResponse: ChatResponse = {
    id: uuidv4(),
    content: "Bonjour, comment puis-je vous aider aujourd'hui?",
    role: "assistant",
    timestamp: new Date().toISOString(),
    follow_up_questions: [
      "Comment vous sentez-vous aujourd'hui?",
      "Avez-vous besoin d'aide avec quelque chose en particulier?"
    ]
  };

  return mockResponse;
};

// Mock function to simulate processing chat
export const processChatResponse = async (message: string): Promise<ChatResponse> => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockResponse: ChatResponse = {
    id: uuidv4(),
    content: "Je suis là pour vous aider à gérer vos émotions.",
    role: "assistant",
    timestamp: new Date().toISOString(),
    follow_up_questions: [
      "Comment puis-je vous aider?",
      "Avez-vous des questions?"
    ]
  };

  return mockResponse;
};

// Mock function to simulate creating a chat conversation
export const createChatConversation = async (userId: string): Promise<ChatConversation> => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockConversation: ChatConversation = {
    id: uuidv4(),
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Nouvelle conversation",
    last_message: "Bonjour!",
    last_message_time: new Date().toISOString()
  };

  return mockConversation;
};

// Mock function to simulate sending a chat message
export const sendChatMessage = async (conversationId: string, message: string, sender: string): Promise<ChatResponse> => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockResponse: ChatResponse = {
    id: uuidv4(),
    content: message,
    role: sender === 'user' ? 'user' : 'assistant',
    timestamp: new Date().toISOString(),
    follow_up_questions: [
      "Comment puis-je vous aider davantage?",
      "Avez-vous d'autres préoccupations?"
    ]
  };

  return mockResponse;
};
