
import { useState, useEffect, useCallback } from 'react';
import { useCoach } from '@/contexts/CoachContext';
import { ChatMessage } from '@/types/coach';
import { v4 as uuidv4 } from 'uuid';

export interface UseCoachChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  typingIndicator: string;
  userMessage: string;
  setUserMessage: (message: string) => void;
  handleSendMessage: (messageContent?: string) => void;
  handleRegenerate: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  resetMessages: () => void;
}

export const useCoachChat = (initialQuestion?: string): UseCoachChatReturn => {
  const { messages: contextMessages, loading, sendMessage, clearMessages } = useCoach();
  const [userMessage, setUserMessage] = useState('');
  const [typingIndicator, setTypingIndicator] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (contextMessages.length > 0) {
      setLocalMessages(contextMessages);
    }
  }, [contextMessages]);

  // Handle sending a message
  const handleSendMessage = useCallback((messageContent?: string) => {
    const content = messageContent || userMessage;
    
    if (!content.trim()) return;
    
    // Send message through context
    sendMessage(content);
    
    // Clear input field
    if (!messageContent) {
      setUserMessage('');
    }
    
    // Show typing indicator
    setTypingIndicator('Le coach est en train de répondre...');
  }, [userMessage, sendMessage]);

  // Handle regenerating the last AI response
  const handleRegenerate = useCallback(() => {
    // Find the last user message
    const lastUserMessageIndex = [...localMessages].reverse().findIndex(msg => msg.sender === 'user');
    
    if (lastUserMessageIndex === -1) return;
    
    // Calculate the actual index in the array
    const actualIndex = localMessages.length - 1 - lastUserMessageIndex;
    const userMessageToRepeat = localMessages[actualIndex];
    
    if (!userMessageToRepeat.text) return;
    
    // Remove all messages after the last user message
    const newMessages = localMessages.slice(0, actualIndex + 1);
    setLocalMessages(newMessages);
    
    // Resend the same user message to get a new response
    handleSendMessage(userMessageToRepeat.text);
  }, [localMessages, handleSendMessage]);

  // Handle key press events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Reset messages
  const resetMessages = useCallback(() => {
    clearMessages();
    setLocalMessages([]);
  }, [clearMessages]);

  // Process initial question if provided
  useEffect(() => {
    if (initialQuestion && localMessages.length === 0) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion, handleSendMessage, localMessages.length]);

  // Update typing indicator based on loading state
  useEffect(() => {
    if (loading) {
      setTypingIndicator('Le coach est en train de répondre...');
    } else {
      setTypingIndicator('');
    }
  }, [loading]);

  return {
    messages: localMessages,
    isLoading: loading,
    typingIndicator,
    userMessage,
    setUserMessage,
    handleSendMessage,
    handleRegenerate,
    handleKeyDown,
    resetMessages
  };
};

export default useCoachChat;
