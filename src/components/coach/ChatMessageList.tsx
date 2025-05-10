
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  typingIndicator?: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages, 
  isLoading, 
  typingIndicator 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingIndicator]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-center">
            Commencez une nouvelle conversation avec le coach IA pour obtenir de l'aide 
            sur votre bien-être émotionnel.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex max-w-[85%] md:max-w-[75%] rounded-lg p-4",
              (message.sender === 'user' || message.sender_type === 'user')
                ? "bg-primary/10 ml-auto" 
                : "bg-muted mr-auto"
            )}
          >
            <span className="whitespace-pre-wrap">{message.text || message.content}</span>
          </div>
        ))
      )}
      
      {/* Typing indicator */}
      {typingIndicator && (
        <div className="bg-muted rounded-lg p-4 max-w-[75%] animate-pulse">
          <span className="text-sm text-muted-foreground">{typingIndicator}</span>
        </div>
      )}
      
      {/* Element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
