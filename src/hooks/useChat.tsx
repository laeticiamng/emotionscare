
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ChatMessage, 
  ChatHookResult, 
  UseChatOptions,
  normalizeChatMessage
} from '@/types/chat';

export function useChat({
  initialMessages = [],
  conversationId = uuidv4(),
  initialConversationId,
  onResponse
}: UseChatOptions = {}): ChatHookResult {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");

  // Use initialConversationId if provided, otherwise use conversationId
  const activeConversationId = initialConversationId || conversationId;

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return Promise.resolve();

    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId: activeConversationId
    };

    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    
    try {
      setIsTyping(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create assistant response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: `Response to: "${content}"`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        conversationId: activeConversationId
      };
      
      // Add assistant message to the chat
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Notify caller if callback provided
      if (onResponse) {
        onResponse(assistantMessage);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }

    return Promise.resolve();
  }, [activeConversationId, onResponse]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  }, [input, sendMessage]);

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit
  };
}

export default useChat;
