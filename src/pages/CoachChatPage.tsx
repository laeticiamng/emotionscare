
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import { useCoachChat } from '@/hooks/chat/useCoachChat';
import { useChatHistory } from '@/hooks/chat/useChatHistory';
import { useToast } from '@/hooks/use-toast';
import CoachChatContainer from '@/components/coach/CoachChatContainer';

const CoachChatPage = () => {
  const { 
    messages, 
    setMessages,
    userMessage, 
    setUserMessage, 
    isLoading, 
    typingIndicator,
    handleSendMessage, 
    handleKeyDown, 
    handleRegenerate,
    handleUserTyping,
    resetMessages
  } = useCoachChat();

  const location = useLocation();
  const { toast } = useToast();
  const { loadMessages } = useChatHistory();
  
  // Process any initial question from navigation state
  useEffect(() => {
    const state = location.state as { initialQuestion?: string } | undefined;
    if (state?.initialQuestion) {
      handleSendMessage(state.initialQuestion);
    }
  }, [location.state]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle loading conversation
  const handleLoadConversation = async (conversationId: string) => {
    try {
      const loadedMessages = await loadMessages(conversationId);
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
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

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-2 md:px-4 py-2 md:py-4 max-w-6xl h-[80vh] flex flex-col">
        <CoachChatContainer
          messages={messages}
          isLoading={isLoading}
          typingIndicator={typingIndicator}
          userMessage={userMessage}
          onUserMessageChange={setUserMessage}
          onSendMessage={() => handleSendMessage()}
          onRegenerate={handleRegenerate}
          onKeyDown={handleKeyDown}
          onUserTyping={handleUserTyping}
        />
      </div>
    </ProtectedLayout>
  );
};

export default CoachChatPage;
