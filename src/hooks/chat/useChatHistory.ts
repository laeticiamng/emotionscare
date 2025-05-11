
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types';

interface UseChatHistoryOptions {
  limit?: number;
}

export const useChatHistory = (options?: UseChatHistoryOptions) => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const limit = options?.limit || 10;

  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true);
      
      try {
        // Mock API call to fetch chat history
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock data
        setHistory(getMockChatHistory());
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatHistory();
  }, [limit]);
  
  const getMockChatHistory = (): ChatMessage[] => {
    // Mock chat history data
    return [
      {
        id: 'msg1',
        text: "Bonjour, comment puis-je vous aider aujourd'hui?",
        sender: 'coach',
        sender_type: 'ai',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        conversation_id: 'conv1',
        role: 'assistant'
      },
      {
        id: 'msg2',
        text: "Je me sens un peu stressé ces derniers jours.",
        sender: 'user',
        sender_type: 'user',
        timestamp: new Date(Date.now() - 3550000 * 24).toISOString(),
        conversation_id: 'conv1',
        role: 'user'
      },
      {
        id: 'msg3',
        text: "Je comprends. Pouvez-vous me dire ce qui vous stresse particulièrement?",
        sender: 'coach',
        sender_type: 'ai',
        timestamp: new Date(Date.now() - 3500000 * 24).toISOString(),
        conversation_id: 'conv1',
        role: 'assistant'
      },
      {
        id: 'msg4',
        text: "Mon travail et aussi ma vie personnelle. J'ai du mal à trouver un équilibre.",
        sender: 'user',
        sender_type: 'user',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        conversation_id: 'conv1',
        role: 'user'
      },
      {
        id: 'msg5',
        text: "Merci pour votre confiance. Nous allons explorer ensemble des stratégies pour mieux gérer ce stress et trouver un meilleur équilibre entre vie professionnelle et personnelle.",
        sender: 'coach',
        sender_type: 'ai',
        timestamp: new Date(Date.now() - 1700000).toISOString(),
        conversation_id: 'conv1',
        role: 'assistant'
      }
    ];
  };
  
  return {
    history,
    isLoading,
  };
};
