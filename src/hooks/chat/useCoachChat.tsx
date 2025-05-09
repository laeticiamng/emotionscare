
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';
import { useCoachChatActions } from './useCoachChatActions';

/**
 * Main hook for coach chat functionality
 */
export function useCoachChat(initialQuestion?: string) {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState('');
  
  // Initialize conversation ID
  const conversationId = useState(`conv-${uuidv4()}`)[0];
  
  // Use specialized hooks
  const { 
    addUserMessage, 
    addAIResponse, 
    simulateTyping, 
    clearMessages 
  } = useCoachChatActions(conversationId);

  // Handle sending a message
  const handleSendMessage = useCallback((messageContent?: string) => {
    const content = messageContent || userMessage;
    
    if (!content.trim()) return;
    
    // Add user message to chat
    const newUserMessage = addUserMessage(content);
    setMessages(prev => [...prev, newUserMessage]);
    
    // Clear input field if using the input value
    if (!messageContent) {
      setUserMessage('');
    }
    
    // Show typing indicator
    setIsLoading(true);
    setTypingIndicator('Le coach est en train de répondre...');
    
    // Simulate AI response (would connect to an API in production)
    const responsePromise = new Promise<string>(resolve => {
      setTimeout(() => {
        const responses = [
          "Je comprends votre préoccupation. Avez-vous essayé de prendre quelques minutes de méditation?",
          "C'est une excellente question. Essayons de trouver ensemble des solutions adaptées à votre situation.",
          "Votre bien-être est important. Je vous suggère de prendre un moment pour vous aujourd'hui.",
          "Merci de partager cela avec moi. Comment vous sentez-vous à ce sujet maintenant?",
          "Il est normal de ressentir cela. Quelles stratégies vous ont aidé dans le passé?"
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1500);
    });
    
    // Add AI response when ready
    responsePromise.then(response => {
      const botMessage = addAIResponse(response);
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setTypingIndicator('');
    });
    
  }, [userMessage, addUserMessage, addAIResponse]);
  
  // Regenerate the last AI response
  const handleRegenerate = useCallback(() => {
    // Remove the last bot message
    const lastBotIndex = [...messages].reverse().findIndex(msg => msg.sender === 'bot');
    
    if (lastBotIndex === -1) return;
    
    // Remove the last response
    const actualIndex = messages.length - 1 - lastBotIndex;
    const newMessages = messages.slice(0, actualIndex);
    setMessages(newMessages);
    
    // Show typing indicator
    setIsLoading(true);
    setTypingIndicator('Le coach réfléchit à une nouvelle réponse...');
    
    // Simulate a new response
    const responsePromise = new Promise<string>(resolve => {
      setTimeout(() => {
        const responses = [
          "En réfléchissant davantage, je pense que nous pourrions explorer d'autres approches...",
          "Permettez-moi de reformuler ma réponse pour être plus précis...",
          "Une autre perspective pourrait être de considérer...",
          "En fait, il y a peut-être une meilleure façon d'aborder cette situation...",
          "J'ai une autre suggestion qui pourrait mieux répondre à votre question..."
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 2000);
    });
    
    // Add the new AI response
    responsePromise.then(response => {
      const botMessage = addAIResponse(response);
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setTypingIndicator('');
    });
  }, [messages, addAIResponse]);
  
  // Handle user typing
  const handleUserTyping = useCallback(() => {
    // Could implement realtime typing indicators here
  }, []);
  
  // Handle typing errors
  const handleTypingError = useCallback((error: Error) => {
    console.error('Typing error:', error);
    setTypingIndicator('');
    setIsLoading(false);
  }, []);
  
  // Reset messages
  const resetMessages = useCallback(() => {
    clearMessages();
    setMessages([]);
  }, [clearMessages]);
  
  // Process initial question if provided
  useEffect(() => {
    if (initialQuestion && messages.length === 0) {
      console.log('Processing initial question:', initialQuestion);
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion, handleSendMessage, messages.length]);
  
  // Handle key down events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  return {
    messages,
    setMessages,
    userMessage,
    setUserMessage,
    isLoading,
    typingIndicator,
    handleSendMessage,
    handleKeyDown,
    handleRegenerate,
    handleUserTyping,
    handleTypingError,
    resetMessages
  };
}
