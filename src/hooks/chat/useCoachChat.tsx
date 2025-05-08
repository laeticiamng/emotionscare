
import { useState, useEffect, useCallback } from 'react';
import { useCoachMessages } from './useCoachMessages';
import { useTypingIndicator } from './useTypingIndicator';
import { useCoachChatActions } from './useCoachChatActions';
import { ChatMessage } from '@/types/chat';

/**
 * Main hook for coach chat functionality
 * This hook orchestrates the other specialized hooks
 */
export function useCoachChat(initialQuestion?: string) {
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use specialized hooks
  const { messages, setMessages, addMessage, resetMessages } = useCoachMessages();
  const { typingIndicator, handleUserTyping, clearTypingIndicator } = useTypingIndicator();
  const { sendMessage, regenerateResponse } = useCoachChatActions();
  
  // Add a user message
  const addUserMessage = useCallback((message: ChatMessage) => {
    addMessage(message);
  }, [addMessage]);
  
  // Add a bot message
  const addBotMessage = useCallback((message: ChatMessage) => {
    addMessage(message);
  }, [addMessage]);
  
  // Process initial question if provided
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Handle sending a message
  const handleSendMessage = useCallback((messageText: string = userMessage) => {
    sendMessage(
      messageText,
      addUserMessage,
      addBotMessage,
      setIsLoading,
      clearTypingIndicator
    );
    setUserMessage('');
  }, [userMessage, sendMessage, addUserMessage, addBotMessage, clearTypingIndicator]);
  
  // Handle key down events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // Handle regenerating a response
  const handleRegenerate = useCallback(() => {
    regenerateResponse(messages, addBotMessage, setIsLoading);
  }, [messages, regenerateResponse, addBotMessage]);

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
    resetMessages
  };
}
