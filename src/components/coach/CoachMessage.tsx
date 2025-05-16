
import React from 'react';
import { format } from 'date-fns';
import { ChatMessage } from '@/types/coach';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
  className?: string;
}

const CoachMessage: React.FC<CoachMessageProps> = ({
  message,
  isLast = false,
  className
}) => {
  const isUser = message.sender === 'user' || message.role === 'user';
  
  // Format timestamp if available
  const formattedTime = message.timestamp 
    ? format(new Date(message.timestamp), 'HH:mm')
    : '';
    
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "flex gap-2",
        isUser ? "flex-row-reverse" : "flex-row",
        "max-w-[80%]"
      )}>
        {/* Avatar */}
        <Avatar className={cn(
          "h-8 w-8",
          isUser ? "bg-primary/20" : "bg-secondary"
        )}>
          {isUser ? (
            <>
              <AvatarFallback>U</AvatarFallback>
              <User className="h-4 w-4" />
            </>
          ) : (
            <>
              <AvatarFallback>C</AvatarFallback>
              <AvatarImage src="/avatar-coach.png" alt="Coach" />
            </>
          )}
        </Avatar>
        
        {/* Message bubble */}
        <div className={cn(
          "py-2 px-4 rounded-2xl",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none",
          isLast && "mb-8"
        )}>
          <div className="text-sm whitespace-pre-wrap">
            {message.content || message.text}
          </div>
          
          {formattedTime && (
            <div className={cn(
              "text-[10px] mt-1 text-right",
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachMessage;
