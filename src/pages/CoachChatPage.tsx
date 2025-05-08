
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import { useCoachChat } from '@/hooks/chat/useCoachChat';
import { useChatHistory } from '@/hooks/chat/useChatHistory';
import { useToast } from '@/hooks/use-toast';
import CoachChatContainer from '@/components/coach/CoachChatContainer';
import { Loader, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const CoachChatPage = () => {
  // Get the coach chat functionality
  const { 
    messages, 
    setMessages,
    userMessage, 
    setUserMessage, 
    isLoading: isLoadingChat, 
    typingIndicator,
    handleSendMessage, 
    handleKeyDown, 
    handleRegenerate,
    handleUserTyping,
    resetMessages
  } = useCoachChat();

  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    loadMessages, 
    activeConversationId, 
    setActiveConversationId,
    isLoading: isLoadingHistory,
    error: chatHistoryError,
    retryLoadConversations
  } = useChatHistory();
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Watch for active conversation changes
  useEffect(() => {
    if (activeConversationId && activeConversationId !== currentConversationId) {
      setCurrentConversationId(activeConversationId);
      handleLoadConversation(activeConversationId);
    }
  }, [activeConversationId, currentConversationId]); 
  
  // Process any initial question from navigation state
  useEffect(() => {
    const state = location.state as { initialQuestion?: string } | undefined;
    if (state?.initialQuestion) {
      // Reset conversation state when coming with a new question
      setActiveConversationId(null);
      setCurrentConversationId(null);
      resetMessages();
      setError(null);
      
      // Using setTimeout to ensure state updates complete before sending message
      setTimeout(() => {
        handleSendMessage(state.initialQuestion);
      }, 100);
      
      // Clear the state to prevent re-sending on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setActiveConversationId, resetMessages, handleSendMessage]); 

  // Handle loading conversation
  const handleLoadConversation = async (conversationId: string) => {
    try {
      setIsLoadingConversation(true);
      setError(null);
      console.log('Loading conversation:', conversationId);
      const loadedMessages = await loadMessages(conversationId);
      if (loadedMessages && loadedMessages.length > 0) {
        console.log('Loaded messages:', loadedMessages.length);
        setMessages(loadedMessages);
      } else {
        toast({
          title: "Conversation vide",
          description: "Cette conversation ne contient pas de messages."
        });
        resetMessages();
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError("Impossible de charger la conversation. Veuillez réessayer.");
      toast({
        title: "Erreur",
        description: "Impossible de charger la conversation.",
        variant: "destructive"
      });
      resetMessages();
    } finally {
      setIsLoadingConversation(false);
    }
  };

  // Function to handle sending a new message or an initial question
  const handleSendChatMessage = (message?: string) => {
    try {
      setError(null);
      if (message) {
        handleSendMessage(message);
      } else {
        handleSendMessage();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError("Impossible d'envoyer votre message. Veuillez réessayer.");
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message.",
        variant: "destructive"
      });
    }
  };
  
  // Function to handle the back button
  const handleBackClick = () => {
    navigate('/coach');
  };
  
  const isLoading = isLoadingChat || isLoadingHistory || isLoadingConversation;

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-2 md:px-4 py-2 md:py-4 max-w-6xl h-[80vh] flex flex-col">
        {isLoading && (
          <div className="fixed top-4 right-4 bg-primary/20 p-2 rounded-full z-50">
            <Loader className="animate-spin text-primary h-6 w-6" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setError(null)}
              >
                Fermer
              </Button>
            </div>
          </Alert>
        )}

        <CoachChatContainer
          messages={messages}
          isLoading={isLoading}
          typingIndicator={typingIndicator}
          userMessage={userMessage}
          onUserMessageChange={setUserMessage}
          onSendMessage={handleSendChatMessage}
          onRegenerate={handleRegenerate}
          onKeyDown={handleKeyDown}
          onUserTyping={handleUserTyping}
          onBackClick={handleBackClick}
          error={chatHistoryError}
          retryLoadConversations={retryLoadConversations}
        />
      </div>
    </ProtectedLayout>
  );
};

export default CoachChatPage;
