import React, { useEffect } from 'react';
import CoachChatInterface from './CoachChatInterface';
import { useChatMessages } from '@/hooks/chat/useChatMessages';
import { useCoachChat } from '@/hooks/chat/useCoachChat';
import { useConversations } from '@/hooks/chat/useConversations';
import { ChatConversation, ChatMessage } from '@/types/chat';

interface CoachChatContainerProps {
  defaultPrompt?: string;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
}

const CoachChatContainer: React.FC<CoachChatContainerProps> = ({
  defaultPrompt,
  onMessageSent,
  onResponseReceived,
}) => {
  const {
    messages: coachMessages,
    sendMessage: sendCoachMessage,
    isProcessing,
    addMessage: addCoachMessage,
  } = useCoachChat();

  const {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    loadConversations,
    selectConversation,
    createConversation,
    setMessages,
  } = useConversations();

  useEffect(() => {
    // Charge la conversation par défaut ou crée une nouvelle
    const initChat = async () => {
      await loadConversations();
      
      if (conversations.length === 0) {
        await createConversation("Nouvelle conversation avec Coach");
      }
    };
    
    initChat();
  }, []);

  useEffect(() => {
    if (defaultPrompt && !isProcessing) {
      sendMessage(defaultPrompt);
    }
  }, [defaultPrompt]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return null;
    
    onMessageSent?.(message);
    
    const response = await sendCoachMessage(message);
    
    if (response && onResponseReceived) {
      onResponseReceived(response);
    }
    
    return response || null;
  };

  return (
    <CoachChatInterface
      messages={coachMessages as any}
      sendMessage={sendMessage}
      isProcessing={isProcessing}
    />
  );
};

export default CoachChatContainer;
