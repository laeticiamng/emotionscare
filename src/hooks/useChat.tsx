
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

  const processMessage = (text: string) => {
    // Here we could add more advanced processing logic
    // such as AI integration or command recognition
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('vr') || lowerText.includes('pause')) {
      return {
        response: "Voulez-vous lancer une session VR pour une pause détente ?",
        intent: "vr_session"
      };
    } else if (lowerText.includes('musique') || lowerText.includes('playlist')) {
      return {
        response: "Quelle ambiance musicale vous ferait plaisir aujourd'hui ?",
        intent: "music_playlist"
      };
    } else if (lowerText.includes('merci') || lowerText.includes('thanks')) {
      return {
        response: "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.",
        intent: "gratitude"
      };
    } else {
      return {
        response: "Comment puis-je vous aider avec la gestion de vos émotions aujourd'hui ? Je peux vous proposer une session VR ou une playlist adaptée à votre humeur.",
        intent: "general"
      };
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
    addUserMessage,
    addBotMessage,
    processMessage,
    clearMessages
  };
}
