
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatResponse } from '@/types/chat';

export const useChatProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserMessage = (content: string): ChatMessage => {
    return {
      id: uuidv4(),
      content: content,
      text: content,
      sender: "user",
      role: "user",
      timestamp: new Date().toISOString(),
      conversation_id: "default" // Utilisez une valeur appropriée ou passez-la en paramètre
    };
  };

  const createAssistantMessage = (content: any): ChatMessage => {
    return {
      id: uuidv4(),
      content: content,
      text: content,
      sender: "assistant",
      role: "assistant",
      timestamp: new Date().toISOString(),
      conversation_id: "default" // Utilisez une valeur appropriée ou passez-la en paramètre
    };
  };

  const createErrorMessage = (errorMessage: string): ChatMessage => {
    return {
      id: uuidv4(),
      content: errorMessage,
      text: errorMessage,
      sender: "assistant",
      role: "assistant",
      timestamp: new Date().toISOString(),
      conversation_id: "default", // Utilisez une valeur appropriée
      isError: true
    };
  };

  const appendUserMessage = (userMessage: string, setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
    const message = {
      id: uuidv4(),
      content: userMessage,
      text: userMessage,
      sender: "user", 
      role: "user",
      timestamp: new Date().toISOString(),
      conversation_id: "default" // Utilisez une valeur appropriée
    };
    
    setMessages(prevMessages => [...prevMessages, message]);
    return message;
  };

  return {
    isProcessing,
    error,
    setIsProcessing,
    setError,
    createUserMessage,
    createAssistantMessage,
    createErrorMessage,
    appendUserMessage
  };
};

export default useChatProcessing;
