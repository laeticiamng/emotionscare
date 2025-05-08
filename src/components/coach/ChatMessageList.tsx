
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, typingIndicator]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div 
      className="flex-grow overflow-y-auto p-4 space-y-4" 
      role="log" 
      aria-live="polite"
    >
      {messages.map((msg) => (
        <div 
          key={msg.id}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[85%] md:max-w-[75%] rounded-lg px-4 py-2 ${
              msg.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs opacity-70 mt-1 text-right">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted max-w-[85%] md:max-w-[75%] rounded-lg px-4 py-2">
            <div className="flex space-x-2" aria-label="Coach est en train d'écrire...">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}

      {typingIndicator && !isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted/50 max-w-[85%] md:max-w-[75%] rounded-lg px-4 py-2">
            <p className="text-sm text-muted-foreground">{typingIndicator}</p>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
