
import React from 'react';
import { ChatMessage } from '@/types/chat';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  typingIndicator?: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading, typingIndicator }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
        >
          <div 
            className={`inline-block p-3 rounded-lg max-w-[80%] ${
              message.sender === 'user'
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            {message.content || ""}
          </div>
        </div>
      ))}
      
      {isLoading && typingIndicator && (
        <div className="mb-4">
          <div className="inline-block p-3 rounded-lg bg-muted">
            <div className="flex items-center">
              <span className="mr-2">{typingIndicator}</span>
              <span className="animate-pulse">...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessageList;
