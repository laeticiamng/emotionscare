/**
 * GuildChat - Chat en temps réel pour une guilde
 */

import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  MessageCircle,
  Users,
  Crown,
  Shield,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { GuildMessage, GuildRole } from '@/features/guilds';

interface GuildChatProps {
  messages: GuildMessage[];
  userRole?: GuildRole | null;
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const roleIcons: Record<GuildRole, React.ReactNode> = {
  leader: <Crown className="h-3 w-3 text-yellow-500" />,
  officer: <Shield className="h-3 w-3 text-blue-500" />,
  member: null
};

const GuildChat: React.FC<GuildChatProps> = memo(({
  messages,
  userRole,
  onSendMessage,
  isLoading = false,
  className
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <Card className={cn("flex flex-col h-[500px]", className)}>
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          Chat de guilde
          <Badge variant="outline" className="ml-auto">
            <Users className="h-3 w-3 mr-1" />
            {messages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucun message</p>
                <p className="text-sm">Soyez le premier à écrire !</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.message_type === 'system' && "justify-center"
                  )}
                >
                  {message.message_type === 'system' ? (
                    <div className="px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
                      {message.content}
                    </div>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {message.display_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {message.display_name}
                          </span>
                          {message.message_type === 'achievement' && (
                            <Badge variant="secondary" className="text-xs">
                              🏆 Achievement
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(message.created_at), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </span>
                        </div>
                        <p className="text-sm mt-0.5 break-words">
                          {message.content}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        {userRole && (
          <div className="flex-shrink-0 flex gap-2 mt-4 pt-4 border-t">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez un message..."
              disabled={sending}
              maxLength={500}
            />
            <Button 
              onClick={handleSend} 
              disabled={!newMessage.trim() || sending}
              size="icon"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

GuildChat.displayName = 'GuildChat';

export default GuildChat;
