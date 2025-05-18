
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export interface UseChatProps {
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: ChatMessage) => void;
}

export const useChat = ({ initialMessages = [], onSendMessage }: UseChatProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string, sender: 'user' | 'assistant' = 'user') => {
    if (!text.trim()) return;
    
    // Créer un nouveau message
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      sender,
      timestamp: new Date().toISOString()
    };
    
    // Ajouter à l'état local
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Réinitialiser le champ de saisie si c'est un message utilisateur
    if (sender === 'user') {
      setInput('');
    }
    
    // Appeler le callback si fourni
    if (onSendMessage) {
      onSendMessage(newMessage);
    }
    
    return newMessage;
  }, [onSendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
    }
  }, [input, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    sendMessage,
    handleInputChange,
    handleSubmit,
    clearMessages
  };
};

export default useChat;
