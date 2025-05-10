
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

/**
 * Hook pour gérer le statut du chat (chargement, erreur, etc.)
 */
export function useChatStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Process sending a message
  const sendMessage = useCallback(
    (
      text: string,
      addUserMessage: (message: ChatMessage) => void,
      addBotMessage: (message: ChatMessage) => void,
      processMessage: (text: string) => Promise<string>,
      onComplete?: () => void
    ) => {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text,
        content: text,
        sender: 'user',
        sender_id: 'user-1',
        conversation_id: 'default',
        is_read: true,
        timestamp: new Date()
      };
      addUserMessage(userMessage);
      
      // Process the message
      setIsLoading(true);
      setError(null);
      
      processMessage(text)
        .then((response) => {
          // Add bot response
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: response,
            content: response,
            sender: 'bot',
            sender_id: 'bot-1',
            conversation_id: 'default',
            is_read: true,
            timestamp: new Date()
          };
          addBotMessage(botMessage);
        })
        .catch((err) => {
          console.error('Error processing message:', err);
          setError('Failed to process message');
          
          // Add error message
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: "Je suis désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
            content: "Je suis désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
            sender: 'bot',
            sender_id: 'bot-1',
            conversation_id: 'default',
            is_read: true,
            timestamp: new Date()
          };
          addBotMessage(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
          if (onComplete) onComplete();
        });
    },
    []
  );
  
  // Process regenerating a response
  const regenerateResponse = useCallback(
    (
      messages: ChatMessage[],
      addBotMessage: (message: ChatMessage) => void,
      processMessage: (text: string) => Promise<string>
    ) => {
      // Find the last user message
      const lastUserMessage = [...messages]
        .reverse()
        .find((msg) => msg.sender === 'user');
      
      if (!lastUserMessage) {
        setError('No message to regenerate');
        return;
      }
      
      // Process the message
      setIsLoading(true);
      setError(null);
      
      processMessage(lastUserMessage.text || lastUserMessage.content)
        .then((response) => {
          // Add bot response
          const botMessage: ChatMessage = {
            id: Date.now().toString(),
            text: response,
            content: response,
            sender: 'bot',
            sender_id: 'bot-1',
            conversation_id: 'default',
            is_read: true,
            timestamp: new Date()
          };
          addBotMessage(botMessage);
        })
        .catch((err) => {
          console.error('Error regenerating response:', err);
          setError('Failed to regenerate response');
          
          // Add error message
          const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            text: "Je suis désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
            content: "Je suis désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
            sender: 'bot',
            sender_id: 'bot-1',
            conversation_id: 'default',
            is_read: true,
            timestamp: new Date()
          };
          addBotMessage(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    []
  );
  
  return {
    isLoading,
    error,
    setError,
    sendMessage,
    regenerateResponse
  };
}
