
import { useState, useEffect, useCallback } from 'react';
import { useCoachMessages } from './useCoachMessages';
import { useTypingIndicator } from './useTypingIndicator';
import { useCoachChatActions } from './useCoachChatActions';
import { useChatStatus } from './useChatStatus';

/**
 * Main hook for coach chat functionality
 * This hook orchestrates the other specialized hooks
 */
export function useCoachChat(initialQuestion?: string) {
  const [userMessage, setUserMessage] = useState('');
  
  // Use specialized hooks
  const { messages, setMessages, addMessage, resetMessages } = useCoachMessages();
  const { typingIndicator, handleUserTyping, clearTypingIndicator } = useTypingIndicator();
  const { sendMessage, regenerateResponse, isLoading } = useChatStatus();
  const { handleSendMessage, handleRegenerate } = useCoachChatActions({
    userMessage,
    messages,
    sendMessage,
    regenerateResponse,
    addMessage,
    clearTypingIndicator,
    setUserMessage
  });
  
  // Process initial question if provided
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion, handleSendMessage]);
  
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
    resetMessages
  };
}
