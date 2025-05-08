
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/chat';
import { useCoach } from '@/hooks/coach/useCoach';
import { useActivity } from '@/hooks/useActivity';
import { useMediaQuery } from '@/hooks/use-media-query';
import ChatHeader from '@/components/coach/ChatHeader';
import ChatMessageList from '@/components/coach/ChatMessageList';
import ChatInputForm from '@/components/coach/ChatInputForm';

const CoachChatPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const { toast } = useToast();
  const { askQuestion, generateRecommendation } = useCoach();
  const { logActivity } = useActivity();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Récupérer la question initiale des paramètres de navigation
  useEffect(() => {
    const state = location.state as { initialQuestion?: string } | undefined;
    if (state?.initialQuestion) {
      handleSendMessage(state.initialQuestion);
    }
  }, [location.state]);
  
  const handleUserTyping = useCallback(() => {
    // Show typing indicator
    if (!typingIndicator) {
      setTypingIndicator('Vous êtes en train d\'écrire...');
    }
    
    // Clear previous timer
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    
    // Set new timer to clear typing indicator after 1.5 seconds of inactivity
    const timer = setTimeout(() => {
      setTypingIndicator(null);
    }, 1500);
    
    setTypingTimer(timer);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [typingIndicator, typingTimer]);
  
  const handleSendMessage = async (messageText: string = userMessage) => {
    if (!messageText.trim()) return;
    
    // Clear typing indicator
    if (typingTimer) clearTimeout(typingTimer);
    setTypingIndicator(null);
    
    // Ajouter le message de l'utilisateur
    const userMessageObj: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessageObj]);
    setUserMessage('');
    setIsLoading(true);
    
    try {
      // Log d'activité
      logActivity('coach_chat', { message: messageText });
      
      // Obtenir une réponse du coach IA
      const response = await askQuestion(messageText);
      
      // Ajouter la réponse du coach
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message to coach:', error);
      toast({
        title: "Erreur",
        description: "Impossible de communiquer avec le coach IA. Veuillez réessayer.",
        variant: "destructive"
      });
      
      // Ajouter un message d'erreur
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Je suis désolé, mais je rencontre des difficultés techniques. Veuillez réessayer plus tard.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRegenerate = async () => {
    // Récupérer le dernier message de l'utilisateur
    const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
    if (!lastUserMessage) return;
    
    setIsLoading(true);
    
    try {
      // Log
      logActivity('coach_regenerate', { originalMessageId: lastUserMessage.id });
      
      // Obtenir une nouvelle réponse
      const response = await askQuestion(lastUserMessage.text);
      
      // Ajouter la nouvelle réponse
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
      toast({
        title: "Nouvelle réponse générée",
        description: "Une nouvelle réponse a été générée pour votre question."
      });
    } catch (error) {
      console.error('Error regenerating response:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer une nouvelle réponse.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cleanup of typing timer when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [typingTimer]);

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-2 md:px-4 py-2 md:py-4 max-w-4xl h-[80vh] flex flex-col">
        <Card className="flex-grow flex flex-col overflow-hidden p-0 shadow-premium">
          <ChatHeader onBackClick={() => navigate(-1)} />
          <ChatMessageList 
            messages={messages} 
            isLoading={isLoading} 
            typingIndicator={typingIndicator || undefined}
          />
          <ChatInputForm
            userMessage={userMessage}
            isLoading={isLoading}
            onUserMessageChange={setUserMessage}
            onSendMessage={() => handleSendMessage()}
            onRegenerate={handleRegenerate}
            hasMessages={messages.length > 1}
            onKeyDown={handleKeyDown}
            onTyping={handleUserTyping}
          />
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default CoachChatPage;
