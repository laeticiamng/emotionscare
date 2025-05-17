
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Exemple de messages pour la démo
    const demoMessages = [
      {
        id: '1',
        text: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        role: 'assistant' as const
      },
      {
        id: '2',
        text: 'Je me sens un peu anxieux. Pourriez-vous me suggérer des techniques de respiration ?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        role: 'user' as const
      },
      {
        id: '3',
        text: 'Bien sûr ! La technique 4-7-8 est très efficace. Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez lentement pendant 8 secondes. Essayez cela 3-4 fois.',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        role: 'assistant' as const
      },
      {
        id: '4',
        text: 'Merci, ça aide beaucoup !',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        role: 'user' as const
      }
    ];

    setMessages(demoMessages);
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const resetMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    addMessage,
    resetMessages
  };
};
