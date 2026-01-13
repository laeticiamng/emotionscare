/**
 * GuildChatPanel - Interface de chat de guilde en temps réel
 * TOP 20 #2 - Composant UI pour useGuildChat
 */

import React, { memo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Pin, Users, Crown, Shield, User, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Guild, GuildMember, GuildMessage } from '@/hooks/useGuildChat';

interface GuildChatPanelProps {
  guild: Guild | null;
  members: GuildMember[];
  messages: GuildMessage[];
  pinnedMessages: GuildMessage[];
  onlineCount: number;
  isMember: boolean;
  isOfficer: boolean;
  isSending: boolean;
  onSendMessage: (content: string) => Promise<GuildMessage | null>;
  onPinMessage: (messageId: string) => Promise<boolean>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const RoleIcon = ({ role }: { role: string }) => {
  switch (role) {
    case 'leader':
      return <Crown className="w-3 h-3 text-yellow-500" />;
    case 'officer':
      return <Shield className="w-3 h-3 text-blue-500" />;
    default:
      return <User className="w-3 h-3 text-muted-foreground" />;
  }
};

const MessageItem = memo(({ 
  message, 
  isOfficer,
  onPin 
}: { 
  message: GuildMessage;
  isOfficer: boolean;
  onPin: (id: string) => void;
}) => {
  const isSystem = message.message_type === 'system';
  const isAchievement = message.message_type === 'achievement';

  if (isSystem || isAchievement) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-center py-2 text-sm",
          isSystem && "text-muted-foreground italic",
          isAchievement && "text-yellow-500 font-medium"
        )}
      >
        {message.content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 py-2 group hover:bg-muted/50 px-2 rounded-lg"
    >
      <Avatar className="w-8 h-8">
        <AvatarFallback className="text-lg">
          {message.sender_avatar}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{message.sender_name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.created_at).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {message.is_pinned && (
            <Pin className="w-3 h-3 text-primary" />
          )}
        </div>
        <p className="text-sm text-foreground break-words">{message.content}</p>
      </div>

      {isOfficer && !message.is_pinned && (
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onPin(message.id)}
        >
          <Pin className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
});

MessageItem.displayName = 'MessageItem';

const MemberItem = memo(({ member }: { member: GuildMember }) => (
  <div className={cn(
    "flex items-center gap-2 py-1.5 px-2 rounded-lg",
    member.is_online ? "bg-green-500/10" : "opacity-50"
  )}>
    <div className="relative">
      <Avatar className="w-6 h-6">
        <AvatarFallback className="text-sm">
          {member.avatar_emoji}
        </AvatarFallback>
      </Avatar>
      {member.is_online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
      )}
    </div>
    <span className="text-sm truncate flex-1">{member.display_name}</span>
    <RoleIcon role={member.role} />
  </div>
));

MemberItem.displayName = 'MemberItem';

export const GuildChatPanel = memo(({
  guild,
  members,
  messages,
  pinnedMessages,
  onlineCount,
  isMember,
  isOfficer,
  isSending,
  onSendMessage,
  onPinMessage,
  messagesEndRef
}: GuildChatPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue;
    setInputValue('');
    await onSendMessage(content);
    inputRef.current?.focus();
  };

  if (!guild) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Sélectionnez une guilde pour voir le chat</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
      {/* Chat principal */}
      <Card className="lg:col-span-3 flex flex-col">
        <CardHeader className="py-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Hash className="w-5 h-5 text-muted-foreground" />
              {guild.name}
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {onlineCount} en ligne
            </Badge>
          </div>
        </CardHeader>

        {/* Messages épinglés */}
        {pinnedMessages.length > 0 && (
          <div className="bg-muted/50 p-2 border-b">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Pin className="w-3 h-3" />
              Messages épinglés
            </div>
            {pinnedMessages.slice(0, 2).map(msg => (
              <p key={msg.id} className="text-sm truncate">
                <strong>{msg.sender_name}:</strong> {msg.content}
              </p>
            ))}
          </div>
        )}

        {/* Zone de messages */}
        <ScrollArea className="flex-1 p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isOfficer={isOfficer}
                onPin={onPinMessage}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input */}
        {isMember ? (
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Envoyer un message..."
                disabled={isSending}
                className="flex-1"
              />
              <Button type="submit" disabled={isSending || !inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-4 border-t bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              Rejoignez la guilde pour participer au chat
            </p>
          </div>
        )}
      </Card>

      {/* Liste des membres */}
      <Card className="flex flex-col">
        <CardHeader className="py-3 border-b">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            Membres ({members.length})
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {/* Leaders first */}
            {members.filter(m => m.role === 'leader').map(member => (
              <MemberItem key={member.id} member={member} />
            ))}
            
            {members.filter(m => m.role === 'leader').length > 0 && 
             members.filter(m => m.role === 'officer').length > 0 && (
              <Separator className="my-2" />
            )}
            
            {/* Officers */}
            {members.filter(m => m.role === 'officer').map(member => (
              <MemberItem key={member.id} member={member} />
            ))}
            
            {members.filter(m => m.role !== 'member').length > 0 && 
             members.filter(m => m.role === 'member').length > 0 && (
              <Separator className="my-2" />
            )}
            
            {/* Members */}
            {members.filter(m => m.role === 'member').map(member => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
});

GuildChatPanel.displayName = 'GuildChatPanel';

export default GuildChatPanel;
