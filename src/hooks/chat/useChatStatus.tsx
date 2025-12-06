import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export const generateSystemMessage = (
  text: string,
  conversationId: string
): ChatMessage => {
  return {
    id: uuidv4(),
    conversationId: conversationId,
    text, // Keep for backward compatibility
    content: text,
    sender: 'system',
    role: 'system',
    timestamp: new Date().toISOString()
  };
};

export const generateUserMessage = (
  text: string,
  conversationId: string
): ChatMessage => {
  return {
    id: uuidv4(),
    conversationId: conversationId,
    text, // Keep for backward compatibility
    content: text,
    sender: 'user',
    role: 'user',
    timestamp: new Date().toISOString()
  };
};

export const generateAssistantMessage = (
  text: string,
  conversationId: string
): ChatMessage => {
  return {
    id: uuidv4(),
    conversationId: conversationId,
    text, // Keep for backward compatibility
    content: text,
    sender: 'assistant',
    role: 'assistant',
    timestamp: new Date().toISOString()
  };
};

export const useChatStatus = () => {
  return {
    generateSystemMessage,
    generateUserMessage,
    generateAssistantMessage
  };
};

export default useChatStatus;
