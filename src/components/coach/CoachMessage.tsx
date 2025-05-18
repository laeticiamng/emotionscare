
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CoachMessageProps {
  message: ChatMessage;
  avatar?: string;
}

const CoachMessage: React.FC<CoachMessageProps> = ({ message, avatar }) => {
  // Check if the message is from the user (handle both sender and role properties)
  const isUser = message.sender === 'user' || message.role === 'user';
  
  // Get message content (handle both text and content properties)
  const content = message.content || message.text || '';
  
  // Format timestamp
  const formattedTime = message.timestamp ? 
    formatDistanceToNow(new Date(message.timestamp), { addSuffix: true, locale: fr }) : 
    '';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-end gap-2">
          <div>
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl max-w-[280px] break-words">
              {content}
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {formattedTime}
            </div>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-4">
      <div className="flex items-end gap-2">
        <Avatar className="h-8 w-8">
          {avatar && <AvatarImage src={avatar} alt="Coach" />}
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <div>
          <div className="bg-muted px-4 py-2 rounded-2xl max-w-[280px] break-words">
            {message.isLoading ? (
              <div className="flex items-center">
                <span className="animate-pulse">...</span>
              </div>
            ) : (
              content
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachMessage;
