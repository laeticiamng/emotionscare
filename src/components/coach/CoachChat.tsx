
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CoachChatInput from './CoachChatInput';
import CoachMessage from './CoachMessage';
import CoachCharacter from './CoachCharacter';
import { useCoachChat } from '@/hooks/useCoachChat';
import { CoachChatProps } from '@/types/coach';
import { ScrollArea } from '@/components/ui/scroll-area';

const CoachChat: React.FC<CoachChatProps> = ({
  initialQuestion,
  simpleMode = false,
  className,
  onBackClick
}) => {
  const {
    messages,
    isLoading,
    typingIndicator,
    userMessage,
    setUserMessage,
    handleSendMessage,
    handleRegenerate,
    handleKeyDown
  } = useCoachChat(initialQuestion);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingIndicator]);
  
  // Determine coach's current mood based on the last message
  const determineCoachMood = () => {
    if (messages.length === 0) return 'neutral';
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'user') return 'focused';
    
    const content = (lastMessage.text || lastMessage.content || '').toLowerCase();
    
    if (content.includes('merci') || content.includes('super') || content.includes('excellent')) {
      return 'happy';
    } else if (content.includes('désolé') || content.includes('problème') || content.includes('erreur')) {
      return 'sad';
    } else if (content.includes('respire') || content.includes('calme') || content.includes('détend')) {
      return 'calm';
    } else if (content.includes('stress') || content.includes('anxiété') || content.includes('inquiétude')) {
      return 'anxious';
    } else {
      return 'neutral';
    }
  };
  
  return (
    <Card className={`flex flex-col h-full overflow-hidden ${className}`}>
      <CardHeader className="border-b shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackClick && (
              <Button variant="ghost" size="icon" onClick={onBackClick}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center">
              <CoachCharacter 
                mood={determineCoachMood()} 
                speaking={isLoading} 
                size="sm" 
              />
              <CardTitle className="ml-3">Coach IA</CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-1">
          {messages.map((msg, index) => (
            <CoachMessage 
              key={msg.id}
              message={msg} 
              isLast={index === messages.length - 1}
            />
          ))}
          
          {/* Typing indicator */}
          {isLoading && typingIndicator && (
            <div className="animate-fade-in text-sm flex items-center gap-2 text-muted-foreground pl-12 mt-1">
              <div className="loading-dots">
                <div className="bg-primary-foreground"></div>
                <div className="bg-primary-foreground"></div>
                <div className="bg-primary-foreground"></div>
              </div>
              {typingIndicator}
            </div>
          )}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t shrink-0">
        <CoachChatInput
          message={userMessage}
          setMessage={setUserMessage}
          onSend={handleSendMessage}
          onRegenerate={handleRegenerate}
          isLoading={isLoading}
          onKeyDown={handleKeyDown}
          canRegenerate={messages.length > 1}
          placeholder="Écrivez votre message au coach IA..."
        />
      </div>
    </Card>
  );
};

export default CoachChat;
