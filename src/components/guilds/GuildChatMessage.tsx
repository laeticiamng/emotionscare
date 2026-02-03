/**
 * GuildChatMessage - Message dans le chat de guilde
 * Affiche un message avec avatar, nom et horodatage
 */

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Crown, Shield, Star, Bot } from 'lucide-react';

type MessageType = 'text' | 'system' | 'achievement' | 'event';
type UserRole = 'leader' | 'officer' | 'member';

interface GuildChatMessageProps {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  content: string;
  messageType: MessageType;
  userRole?: UserRole;
  createdAt: string;
  isCurrentUser?: boolean;
}

export const GuildChatMessage: React.FC<GuildChatMessageProps> = ({
  id,
  userId,
  displayName,
  avatarUrl,
  content,
  messageType,
  userRole,
  createdAt,
  isCurrentUser = false,
}) => {
  const getRoleIcon = () => {
    switch (userRole) {
      case 'leader':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'officer':
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case 'leader':
        return (
          <Badge variant="outline" className="h-4 text-[10px] gap-0.5 border-primary/50 text-primary">
            <Crown className="h-2.5 w-2.5" />
            Chef
          </Badge>
        );
      case 'officer':
        return (
          <Badge variant="outline" className="h-4 text-[10px] gap-0.5 border-accent-foreground/50 text-accent-foreground">
            <Shield className="h-2.5 w-2.5" />
            Officier
          </Badge>
        );
      default:
        return null;
    }
  };

  // System message
  if (messageType === 'system') {
    return (
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          <Bot className="h-3 w-3" />
          <span>{content}</span>
        </div>
      </div>
    );
  }

  // Achievement message
  if (messageType === 'achievement') {
    return (
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{content}</span>
        </div>
      </div>
    );
  }

  // Event message
  if (messageType === 'event') {
    return (
      <div className="flex justify-center py-2">
        <div className="text-sm text-center bg-accent/50 px-4 py-2 rounded-lg max-w-md">
          <span>{content}</span>
        </div>
      </div>
    );
  }

  // Regular text message
  return (
    <div className={cn(
      'flex gap-3 py-2 px-2 rounded-lg transition-colors hover:bg-muted/30',
      isCurrentUser && 'flex-row-reverse'
    )}>
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-xs">
          {displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        'flex-1 min-w-0',
        isCurrentUser && 'text-right'
      )}>
        <div className={cn(
          'flex items-center gap-2 mb-0.5',
          isCurrentUser && 'flex-row-reverse'
        )}>
          <span className="font-medium text-sm">{displayName}</span>
          {getRoleBadge()}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { 
              addSuffix: true, 
              locale: fr 
            })}
          </span>
        </div>
        
        <div className={cn(
          'inline-block px-3 py-2 rounded-2xl max-w-[80%]',
          isCurrentUser 
            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
            : 'bg-muted rounded-tl-sm'
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuildChatMessage;
