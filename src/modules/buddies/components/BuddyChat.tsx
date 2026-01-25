/**
 * Chat entre buddies
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Smile
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { BuddyMessage, BuddyProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BuddyChatProps {
  buddy: BuddyProfile;
  messages: BuddyMessage[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<any>;
  onBack?: () => void;
  onStartCall?: () => void;
  onStartVideo?: () => void;
}

export const BuddyChat: React.FC<BuddyChatProps> = ({
  buddy,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  onStartCall,
  onStartVideo
}) => {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(input.trim());
      setInput('');
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  const STATUS_COLORS: Record<string, string> = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400'
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="py-3 border-b">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={buddy.avatar_url || undefined} />
              <AvatarFallback>{buddy.display_name?.charAt(0) || 'B'}</AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
              STATUS_COLORS[buddy.availability_status]
            )} />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold">{buddy.display_name || 'Buddy'}</h3>
            <p className="text-xs text-muted-foreground">
              {buddy.availability_status === 'online' ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>

          <div className="flex gap-1">
            {onStartCall && (
              <Button variant="ghost" size="icon" onClick={onStartCall}>
                <Phone className="h-4 w-4" />
              </Button>
            )}
            {onStartVideo && (
              <Button variant="ghost" size="icon" onClick={onStartVideo}>
                <Video className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => {
                const isOwn = message.sender_id === currentUserId;
                const showDate = index === 0 || 
                  new Date(messages[index - 1].created_at).toDateString() !== 
                  new Date(message.created_at).toDateString();

                return (
                  <React.Fragment key={message.id}>
                    {showDate && (
                      <div className="flex items-center gap-2 py-2">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), 'dd MMMM', { locale: fr })}
                        </span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2",
                        isOwn && "flex-row-reverse"
                      )}
                    >
                      {!isOwn && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={buddy.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {buddy.display_name?.charAt(0) || 'B'}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={cn(
                        "max-w-[75%]",
                        isOwn && "items-end"
                      )}>
                        <div 
                          className={cn(
                            "px-4 py-2 rounded-2xl",
                            isOwn 
                              ? "bg-primary text-primary-foreground rounded-br-md" 
                              : "bg-muted rounded-bl-md"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>

                        <div className={cn(
                          "flex items-center gap-1 mt-1 px-1",
                          isOwn ? "justify-end" : "justify-start"
                        )}>
                          <span className="text-[10px] text-muted-foreground">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </span>
                          {isOwn && message.is_read && (
                            <span className="text-[10px] text-blue-500">✓✓</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>

            {messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Commencez la conversation !</p>
                <p className="text-xs mt-1">Dites bonjour à {buddy.display_name} 👋</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Smile className="h-5 w-5" />
            </Button>
            <Input
              ref={inputRef}
              placeholder="Votre message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              disabled={sending}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!input.trim() || sending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuddyChat;
