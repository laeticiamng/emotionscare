
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

type MessageSender = 'user' | 'assistant' | 'system';

export const useMessageHandling = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState(uuidv4());

  const addMessage = useCallback((content: string, sender: MessageSender) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content,
      text: content,
      sender,
      role: sender,
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, [conversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(uuidv4());
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter(msg => msg.id !== messageId));
  }, []);

  return {
    messages,
    conversationId,
    addMessage,
    clearMessages,
    removeMessage,
    setConversationId
  };
};
