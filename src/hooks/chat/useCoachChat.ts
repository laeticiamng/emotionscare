
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { useChatMessages } from './useChatMessages';

export const useCoachChat = () => {
  const { messages, addMessage, clearMessages } = useChatMessages();
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = useCallback(async (content: string, sender: 'user' | 'coach' = 'user') => {
    if (sender === 'user') {
      addMessage({ content, sender: 'user' });
    }

    if (sender === 'user') {
      setIsProcessing(true);
      
      // Simulate coach response
      setTimeout(() => {
        const responses = [
          "Je comprends ce que vous ressentez. Pouvez-vous me parler davantage de cette situation ?",
          "C'est tout à fait normal de ressentir cela. Avez-vous déjà vécu quelque chose de similaire ?",
          "Merci de partager cela avec moi. Que pensez-vous qui pourrait vous aider dans cette situation ?",
          "Vos sentiments sont valides. Comment vous sentez-vous maintenant en en parlant ?",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage({ content: randomResponse, sender: 'coach' });
        setIsProcessing(false);
      }, 1000 + Math.random() * 2000);
    } else {
      addMessage({ content, sender });
    }

    return content;
  }, [addMessage]);

  return {
    messages,
    sendMessage,
    isProcessing,
    clearMessages,
    addMessage,
  };
};
