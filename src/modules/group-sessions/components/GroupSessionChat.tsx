/**
 * Chat en temps réel pour les sessions de groupe
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Smile, 
  Pin,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { GroupSessionMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GroupSessionChatProps {
  messages: GroupSessionMessage[];
  currentUserId?: string;
  onSendMessage: (content: string, replyToId?: string) => Promise<any>;
  onReaction?: (messageId: string, emoji: string) => void;
  disabled?: boolean;
}

const QUICK_REACTIONS = ['❤️', '👍', '👏', '🙏', '✨', '🔥'];

export const GroupSessionChat: React.FC<GroupSessionChatProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  onReaction,
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSendMessage(input.trim());
      setInput('');
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="py-3 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Chat de session
          <span className="text-xs text-muted-foreground ml-auto">
            {messages.length} messages
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => {
                const isOwn = message.user_id === currentUserId;
                const isSystem = message.message_type === 'system';
                const showDate = index === 0 || 
                  new Date(messages[index - 1].created_at).toDateString() !== 
                  new Date(message.created_at).toDateString();

                return (
                  <React.Fragment key={message.id}>
                    {showDate && (
                      <div className="flex items-center gap-2 py-2">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), 'dd MMMM yyyy', { locale: fr })}
                        </span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "flex gap-2",
                        isOwn && "flex-row-reverse",
                        isSystem && "justify-center"
                      )}
                    >
                      {isSystem ? (
                        <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                          {message.content}
                        </div>
                      ) : (
                        <>
                          {!isOwn && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-xs bg-primary/10">
                                {message.user_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className={cn(
                            "group relative max-w-[75%]",
                            isOwn && "items-end"
                          )}>
                            {!isOwn && (
                              <span className="text-xs text-muted-foreground mb-1 block">
                                {message.user_name || 'Anonyme'}
                              </span>
                            )}

                            <div 
                              className={cn(
                                "px-3 py-2 rounded-2xl relative",
                                isOwn 
                                  ? "bg-primary text-primary-foreground rounded-br-md" 
                                  : "bg-muted rounded-bl-md"
                              )}
                            >
                              {message.is_pinned && (
                                <Pin className="absolute -top-2 -right-2 h-4 w-4 text-amber-500" />
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            </div>

                            <div className={cn(
                              "flex items-center gap-1 mt-1",
                              isOwn ? "justify-end" : "justify-start"
                            )}>
                              <span className="text-[10px] text-muted-foreground">
                                {format(new Date(message.created_at), 'HH:mm')}
                              </span>

                              {/* Reactions */}
                              {message.reactions && message.reactions.length > 0 && (
                                <div className="flex gap-0.5 ml-1">
                                  {message.reactions.slice(0, 3).map((r, i) => (
                                    <span key={i} className="text-xs">{r.emoji}</span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Quick Reactions Button */}
                            {onReaction && (
                              <div className={cn(
                                "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
                                isOwn ? "-left-8" : "-right-8"
                              )}>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => setShowReactions(
                                    showReactions === message.id ? null : message.id
                                  )}
                                >
                                  <Smile className="h-4 w-4" />
                                </Button>

                                {showReactions === message.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                      "absolute top-full mt-1 bg-popover border rounded-lg shadow-lg p-1 flex gap-0.5 z-10",
                                      isOwn ? "right-0" : "left-0"
                                    )}
                                  >
                                    {QUICK_REACTIONS.map(emoji => (
                                      <button
                                        key={emoji}
                                        className="p-1 hover:bg-muted rounded transition-colors text-base"
                                        onClick={() => {
                                          onReaction(message.id, emoji);
                                          setShowReactions(null);
                                        }}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>

            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucun message pour l'instant</p>
                <p className="text-xs mt-1">Soyez le premier à dire bonjour !</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder={disabled ? "Chat désactivé" : "Votre message..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled || sending}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!input.trim() || disabled || sending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupSessionChat;
