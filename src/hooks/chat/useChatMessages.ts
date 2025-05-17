
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Exemple de messages pour la démo
    const demoMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
        text: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        role: 'assistant',
        conversation_id: 'demo'
      },
      {
        id: '2',
        content: 'Je me sens un peu anxieux. Pourriez-vous me suggérer des techniques de respiration ?',
        text: 'Je me sens un peu anxieux. Pourriez-vous me suggérer des techniques de respiration ?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        role: 'user',
        conversation_id: 'demo'
      },
      {
        id: '3',
        content: 'Bien sûr ! La technique 4-7-8 est très efficace. Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez lentement pendant 8 secondes. Essayez cela 3-4 fois.',
        text: 'Bien sûr ! La technique 4-7-8 est très efficace. Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez lentement pendant 8 secondes. Essayez cela 3-4 fois.',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        role: 'assistant',
        conversation_id: 'demo'
      },
      {
        id: '4',
        content: 'Merci, ça aide beaucoup !',
        text: 'Merci, ça aide beaucoup !',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        role: 'user',
        conversation_id: 'demo'
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
