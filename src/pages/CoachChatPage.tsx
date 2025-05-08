
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import { useCoachChat } from '@/hooks/chat/useCoachChat';
import { useChatHistory } from '@/hooks/chat/useChatHistory';
import { useToast } from '@/hooks/use-toast';
import CoachChatContainer from '@/components/coach/CoachChatContainer';
import { ChatMessage } from '@/types/chat';
import { Loader } from 'lucide-react';

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
  const { toast } = useToast();
  const { 
    loadMessages, 
    activeConversationId, 
    setActiveConversationId,
    isLoading: isLoadingHistory
  } = useChatHistory();
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  
  // Watch for active conversation changes
  useEffect(() => {
    if (activeConversationId && activeConversationId !== currentConversationId) {
      setCurrentConversationId(activeConversationId);
      handleLoadConversation(activeConversationId);
    }
  }, [activeConversationId]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Process any initial question from navigation state
  useEffect(() => {
    const state = location.state as { initialQuestion?: string } | undefined;
    if (state?.initialQuestion) {
      // Reset conversation state when coming with a new question
      setActiveConversationId(null);
      setCurrentConversationId(null);
      resetMessages();
      handleSendMessage(state.initialQuestion);
      
      // Clear the state to prevent re-sending on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle loading conversation
  const handleLoadConversation = async (conversationId: string) => {
    try {
      setIsLoadingConversation(true);
      console.log('Loading conversation:', conversationId);
      const loadedMessages = await loadMessages(conversationId);
      if (loadedMessages.length > 0) {
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
    if (message) {
      handleSendMessage(message);
    } else {
      handleSendMessage();
    }
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
        />
      </div>
    </ProtectedLayout>
  );
};

export default CoachChatPage;
