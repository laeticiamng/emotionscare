
import { useCallback } from 'react';
import { useChatMessages } from './chat/useChatMessages';
import { useChatProcessing } from './chat/useChatProcessing';
import { useSessionManager } from './chat/useSessionManager';
import { useAuth } from '@/contexts/AuthContext';
import { useAssistant } from './chat/useAssistant';

export function useChat() {
  const { user } = useAuth();
  const { messages, addUserMessage, addBotMessage, clearMessages } = useChatMessages();
  const { sessionId, loadMessageHistory } = useSessionManager();
  const { isLoading, processMessage } = useChatProcessing(sessionId, user?.id);

  const handleSend = useCallback(async (input: string) => {
    if (input.trim() === '' || isLoading) return null;

    // Add user message
    addUserMessage(input);
    
    try {
      // Process the message with OpenAI
      const { response, intent } = await processMessage(input);
      addBotMessage(response);
      
      return { text: response, intent };
    } catch (error) {
      console.error('Error in chat processing:', error);
      return null;
    }
  }, [addUserMessage, addBotMessage, processMessage, isLoading]);

  return {
    messages,
    isLoading,
    sessionId,
    addUserMessage,
    addBotMessage,
    processMessage,
    handleSend,
    clearMessages,
    loadMessageHistory: () => loadMessageHistory(messages)
  };
}

// Re-export the Assistant hook for convenience
export { useAssistant } from './chat/useAssistant';
