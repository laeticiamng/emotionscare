
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatHeader from '@/components/coach/ChatHeader';
import ChatMessageList from '@/components/coach/ChatMessageList';
import ChatInputForm from '@/components/coach/ChatInputForm';
import ConversationDrawer from '@/components/coach/ConversationDrawer';
import ConversationList from '@/components/coach/ConversationList';
import { useChatHistory } from '@/hooks/chat/useChatHistory';
import { ChatMessage } from '@/types/chat';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface CoachChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  typingIndicator: string | null;
  userMessage: string;
  onUserMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onRegenerate: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onUserTyping: () => void;
}

const CoachChatContainer: React.FC<CoachChatContainerProps> = ({
  messages,
  isLoading,
  typingIndicator,
  userMessage,
  onUserMessageChange,
  onSendMessage,
  onRegenerate,
  onKeyDown,
  onUserTyping
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const {
    conversations,
    activeConversationId,
    deleteConversation,
    loadMessages,
    setActiveConversationId,
    error,
    retryLoadConversations
  } = useChatHistory();

  // Handle loading conversation
  const handleLoadConversation = async (conversationId: string) => {
    const loadedMessages = await loadMessages(conversationId);
    if (isMobile) {
      setDrawerOpen(false);
    }
    return loadedMessages;
  };

  // Start new conversation
  const handleNewConversation = () => {
    setActiveConversationId(null);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleBackClick = () => {
    navigate('/coach');
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
          onBackClick={handleBackClick} 
          title={
            activeConversationId 
              ? conversations.find(c => c.id === activeConversationId)?.title || "Coach IA Personnel"
              : "Coach IA Personnel"
          }
          actions={
            isMobile && (
              <ConversationDrawer
                isOpen={drawerOpen}
                onOpenChange={setDrawerOpen}
                renderContent={renderConversationList}
              />
            )
          }
        />
        
        {error && (
          <Alert variant="destructive" className="m-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={retryLoadConversations}>
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <ChatMessageList 
          messages={messages} 
          isLoading={isLoading} 
          typingIndicator={typingIndicator || undefined}
        />
        <ChatInputForm
          userMessage={userMessage}
          isLoading={isLoading}
          onUserMessageChange={onUserMessageChange}
          onSendMessage={onSendMessage}
          onRegenerate={onRegenerate}
          hasMessages={messages.length > 1}
          onKeyDown={onKeyDown}
          onTyping={onUserTyping}
        />
      </Card>
    </div>
  );
};

export default CoachChatContainer;
