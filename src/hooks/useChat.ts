
import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  text: string;
  conversationId: string;
  sender: 'user' | 'assistant' | 'system';
  role: 'user' | 'assistant';
  timestamp: string;
}

export const useChat = ({ initialMessages = [] }: { initialMessages?: ChatMessage[] } = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      text: content,
      conversationId: 'default',
      sender: 'user',
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulation réponse IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        content: 'Merci pour votre message. Comment puis-je vous aider aujourd\'hui ?',
        text: 'Merci pour votre message. Comment puis-je vous aider aujourd\'hui ?',
        conversationId: 'default',
        sender: 'assistant',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  }, [input, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    handleInputChange,
    handleSubmit,
    clearMessages,
    isLoading
  };
};

export default useChat;
