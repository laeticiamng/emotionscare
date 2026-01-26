import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

interface CoachMessageProps {
  message: ChatMessage & { isLoading?: boolean };
  isLast?: boolean;
}

const CoachMessage: React.FC<CoachMessageProps> = ({
  message,
}) => {
  const isCoach = message.sender === 'assistant' || message.sender === 'system';
  const content = message.content || message.text || '';
  
  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isCoach ? "justify-start" : "justify-end"
    )}>
      {isCoach && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </Avatar>
      )}
      
      <div className={cn(
        "px-4 py-3 rounded-lg max-w-[80%]",
        isCoach 
          ? "bg-muted text-foreground" 
          : "bg-primary text-primary-foreground",
        message.isLoading && "animate-pulse"
      )}>
        {content}
      </div>
      
      {!isCoach && (
        <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
};

export default CoachMessage;
