import React, { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TypewriterEffect from '@/components/chat/TypewriterEffect';
import { User } from 'lucide-react';

interface EnhancedCoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
  showTimestamp?: boolean;
  animateText?: boolean;
  emotion?: string;
  className?: string;
  fontSize?: number;
}

// Mapping for emotional responses
const emotionAvatars: Record<string, { emoji: string, color: string }> = {
  happy: { emoji: '😊', color: 'bg-warning/10' },
  excited: { emoji: '🎉', color: 'bg-warning/20' },
  calm: { emoji: '😌', color: 'bg-primary/10' },
  thoughtful: { emoji: '🤔', color: 'bg-accent/10' },
  concerned: { emoji: '😟', color: 'bg-muted' },
  default: { emoji: '🧠', color: 'bg-primary/10' },
};

const getEmotionFromText = (text: string): string => {
  // Simple emotion detection from text - in real app, this would use NLP
  if (/excellent|bravo|super|génial|félicitations/i.test(text)) return 'excited';
  if (/heureux|content|joie|sourire/i.test(text)) return 'happy';
  if (/calme|respire|détente|zen/i.test(text)) return 'calm';
  if (/peut-être|penser|réfléchir|analyser/i.test(text)) return 'thoughtful';
  if (/inquiet|stress|peur|angoisse/i.test(text)) return 'concerned';
  return 'default';
};

const EnhancedCoachMessage: React.FC<EnhancedCoachMessageProps> = ({
  message,
  isLast = false,
  showTimestamp = true,
  animateText = true,
  emotion: explicitEmotion,
  className,
  fontSize = 1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isUser = message.sender === 'user';
  
  // Determine the emotion for the avatar
  const emotion = explicitEmotion || 
    (isUser ? 'default' : getEmotionFromText(message.content || ''));
  
  const avatarInfo = emotionAvatars[emotion] || emotionAvatars.default;
  
  // Format the timestamp
  const timestamp = message.timestamp
    ? format(new Date(message.timestamp), 'HH:mm', { locale: fr })
    : '';
  
  // Animation effect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={cn(
        "flex gap-3 mb-4 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        isUser ? "flex-row-reverse" : "",
        className
      )}
      style={{ fontSize: `${fontSize * 100}%` }}
    >
      <div className="flex-shrink-0 mt-1">
        <Avatar className={cn(
          "h-8 w-8", 
          isUser ? "" : avatarInfo.color
        )}>
          {isUser ? (
            <>
              <AvatarImage src="/images/avatars/user.png" alt="Utilisateur" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/images/avatars/coach.png" alt="Coach IA" />
              <AvatarFallback>
                <span role="img" aria-label="Coach">
                  {avatarInfo.emoji}
                </span>
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </div>
      
      <div className={cn(
        "flex flex-col max-w-[85%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-2.5 break-words",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none dark:bg-muted/80",
          "transition-all hover:shadow-md"
        )}>
          {isUser || !animateText ? (
            <p>{message.content}</p>
          ) : (
            <TypewriterEffect 
              text={message.content || ''} 
              speed={30}
              delay={200}
            />
          )}
        </div>
        
        {showTimestamp && (
          <span className="text-xs text-muted-foreground mt-1 px-2">{timestamp}</span>
        )}
      </div>
    </div>
  );
};

export default EnhancedCoachMessage;
