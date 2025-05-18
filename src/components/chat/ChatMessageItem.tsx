
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  // Format timestamp
  const formattedTime = message.timestamp ? 
    formatDistanceToNow(new Date(message.timestamp), { addSuffix: true, locale: fr }) : 
    '';
  
  // Message text content (compatibility with both text and content properties)
  const messageContent = message.text || message.content || '';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[80%]`}>
        <Avatar className={`h-8 w-8 ${isUser ? 'ml-2' : 'mr-2'}`}>
          {!isUser && (
            <AvatarImage src="/images/avatar-coach.png" alt="Coach" />
          )}
          <AvatarFallback>{isUser ? 'U' : 'C'}</AvatarFallback>
        </Avatar>
        
        <div>
          <div 
            className={`px-4 py-3 rounded-2xl ${
              isUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            <p className="text-sm">{messageContent}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1 px-1">
            {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;
