
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
}

const CoachMessage: React.FC<CoachMessageProps> = ({ 
  message,
  isLast = false
}) => {
  const isCoach = message.sender === 'coach' || message.sender === 'assistant' || message.role === 'assistant';
  const content = message.content || message.text || '';
  // Safely access isLoading by checking if it exists on the message
  const isLoading = message.isLoading || false;
  
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
        isLoading && "animate-pulse"
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
