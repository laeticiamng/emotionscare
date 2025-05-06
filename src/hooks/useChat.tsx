
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const addUserMessage = (text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  };

  const addBotMessage = (text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  };

  const processMessage = async (text: string) => {
    setIsLoading(true);
    
    try {
      // Récupérer le contexte émotionnel de l'utilisateur
      const userContext = await getUserContext(user?.id);
      
      // Appel à la fonction Edge Supabase
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: text,
          userContext
        }
      });
      
      if (error) throw error;
      
      const response = data.response;
      
      return {
        response,
        intent: determineIntent(text, response)
      };
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de contacter l'assistant IA pour le moment.",
        variant: "destructive"
      });
      
      return {
        response: "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre demande. Veuillez réessayer plus tard.",
        intent: "error"
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour déterminer l'intention de l'utilisateur
  const determineIntent = (userText: string, aiResponse: string) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('vr') || lowerText.includes('pause') || aiResponse.toLowerCase().includes('session vr')) {
      return "vr_session";
    } else if (lowerText.includes('musique') || lowerText.includes('playlist') || aiResponse.toLowerCase().includes('playlist')) {
      return "music_playlist";
    } else if (lowerText.includes('merci') || lowerText.includes('thanks')) {
      return "gratitude";
    } else if (lowerText.includes('stress') || lowerText.includes('anxiété')) {
      return "stress_management";
    } else {
      return "general";
    }
  };

  // Récupérer le contexte émotionnel de l'utilisateur
  const getUserContext = async (userId?: string) => {
    if (!userId) return null;
    
    try {
      const { data: emotions } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(3);
      
      if (!emotions || emotions.length === 0) return null;
      
      // Calculer un score moyen
      const avgScore = emotions.reduce((acc, emotion) => acc + (emotion.score || 50), 0) / emotions.length;
      
      // Récupérer les émotions récentes
      const recentEmotions = emotions.map(e => e.emotion).join(', ');
      
      return {
        recentEmotions,
        currentScore: Math.round(avgScore),
        lastEmotionDate: emotions[0].date
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return null;
    }
  };

  const clearMessages = () => {
    setMessages([{
      id: '1',
      text: "Bonjour ! Je suis l'assistant EmotionsCare prêt à vous aider. Que puis-je faire pour vous aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  return {
    messages,
    isLoading,
    addUserMessage,
    addBotMessage,
    processMessage,
    clearMessages
  };
}
