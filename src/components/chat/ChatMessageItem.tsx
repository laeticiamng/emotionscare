
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatMessageItemProps {
  message: ChatMessage;
  className?: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, className }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start', className)}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessageItem;
