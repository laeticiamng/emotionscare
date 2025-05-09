import { useState } from 'react';
import { ChatMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import useChatProcessing from './chat/useChatProcessing';

interface UseChatResult {
  messages: ChatMessage[];
  addMessage: (text: string, sender: 'user' | 'bot') => void;
  isProcessing: boolean;
  processAndAddMessage: (text: string) => Promise<void>;
}

const useChat = (): UseChatResult => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { isProcessing, processMessage } = useChatProcessing();

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: text,
      sender: sender,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const processAndAddMessage = async (text: string) => {
    addMessage(text, 'user');
    const response = await processMessage(text);
    addMessage(response.message, 'bot');
  };

  return {
    messages,
    addMessage,
    isProcessing,
    processAndAddMessage,
  };
};

export default useChat;
