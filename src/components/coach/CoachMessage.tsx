
import React, { useState } from 'react';
import { ChatMessage } from '@/types/coach';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, CheckCheck } from 'lucide-react';

interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
}

const CoachMessage: React.FC<CoachMessageProps> = ({ message, isLast = false }) => {
  const [copied, setCopied] = useState(false);
  const isBot = message.sender === 'coach' || message.sender === 'assistant';
  const messageText = message.text || message.content || '';

  const handleCopy = () => {
    if (!messageText) return;
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`py-2 px-1 ${isLast ? 'pb-4' : ''} animate-fade-in`}>
      <div className={`flex items-start gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
        {/* Avatar */}
        <Avatar className={`${isBot ? 'bg-primary/10' : 'bg-secondary/10'} h-8 w-8 rounded-full`}>
          {isBot ? (
            <>
              <AvatarFallback>IA</AvatarFallback>
              <AvatarImage src="/coach-avatar.png" alt="Coach AI" />
            </>
          ) : (
            <AvatarFallback>
              {message.sender?.substring(0, 1)?.toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Message Content */}
        <div 
          className={`relative p-3 rounded-lg ${
            isBot 
              ? 'bg-muted text-foreground' 
              : 'bg-primary text-primary-foreground'
          } shadow-sm max-w-[calc(100%-4rem)]`}
        >
          <p className="whitespace-pre-wrap text-sm break-words leading-relaxed">
            {messageText}
          </p>
          
          {isBot && messageText.length > 50 && (
            <div className="mt-1.5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
                title="Copier le message"
              >
                {copied ? (
                  <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachMessage;
