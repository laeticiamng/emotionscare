
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
import ConversationList from '@/components/coach/ConversationList';
import { useChatHistory } from '@/hooks/chat/useChatHistory';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { MessageSquareDashed, Menu } from 'lucide-react';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const { toast } = useToast();
  const { askQuestion, generateRecommendation } = useCoach();
  const { logActivity } = useActivity();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const {
    conversations,
    activeConversationId,
    createConversation,
    deleteConversation,
    loadMessages,
    saveMessages,
    setActiveConversationId
  } = useChatHistory();
  
  // Save messages when they change
  useEffect(() => {
    if (messages.length > 1) { // Only save if there are user messages
      saveMessages(messages);
    }
  }, [messages, saveMessages]);
  
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
      
      // Ensure we have an active conversation
      if (!activeConversationId) {
        await createConversation(messageText.substring(0, 50));
      }
      
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

  // Handle loading conversation
  const handleLoadConversation = async (conversationId: string) => {
    try {
      const loadedMessages = await loadMessages(conversationId);
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
        if (isMobile) {
          setDrawerOpen(false);
        }
      } else {
        toast({
          title: "Conversation vide",
          description: "Cette conversation ne contient pas de messages."
        });
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la conversation.",
        variant: "destructive"
      });
    }
  };

  // Start new conversation
  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([
      {
        id: '1',
        text: 'Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const renderConversationList = () => (
    <ConversationList
      conversations={conversations}
      activeConversationId={activeConversationId}
      onConversationSelect={handleLoadConversation}
      onNewConversation={handleNewConversation}
      onDeleteConversation={deleteConversation}
    />
  );

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-2 md:px-4 py-2 md:py-4 max-w-6xl h-[80vh] flex flex-col">
        <div className="flex h-full gap-4">
          {/* Conversations sidebar for desktop */}
          {!isMobile && (
            <div className="hidden md:block w-64 h-full">
              {renderConversationList()}
            </div>
          )}
          
          {/* Main chat area */}
          <Card className="flex-grow flex flex-col overflow-hidden p-0 shadow-premium relative">
            <ChatHeader 
              onBackClick={() => navigate(-1)} 
              title={
                activeConversationId 
                  ? conversations.find(c => c.id === activeConversationId)?.title || "Coach IA Personnel"
                  : "Coach IA Personnel"
              }
              actions={
                isMobile && (
                  <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu de conversation</span>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="h-[80vh]">
                        {renderConversationList()}
                      </div>
                    </DrawerContent>
                  </Drawer>
                )
              }
            />
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
      </div>
    </ProtectedLayout>
  );
};

export default CoachChatPage;
