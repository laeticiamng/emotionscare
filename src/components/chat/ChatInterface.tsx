
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  isTyping?: boolean;
  typingMessage?: string;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  sendMessage,
  isTyping = false,
  typingMessage = "L'IA est en train d'écrire...",
  className,
}) => {
  const [message, setMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Gérer l'autoscroll et l'affichage du bouton de défilement
  useEffect(() => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      const handleScroll = () => {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        setShowScrollButton(!isNearBottom);
      };
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", className)}>
      <CardContent className="flex flex-col h-full p-0">
        {/* Messages Container */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-center">
                Démarrer une nouvelle conversation
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex max-w-[80%] rounded-lg p-4",
                  msg.sender === "user" || msg.sender_type === "user"
                    ? "bg-primary/10 ml-auto"
                    : "bg-muted mr-auto"
                )}
              >
                <span className="whitespace-pre-wrap">{msg.content || msg.text}</span>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="bg-muted rounded-lg p-4 max-w-[80%] animate-pulse">
              <span className="text-sm text-muted-foreground">{typingMessage}</span>
            </div>
          )}

          {/* Element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-24 right-6 rounded-full shadow-md"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Plus className="h-5 w-5" />
            </Button>
            <div className="relative flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Saisissez votre message..."
                className="pr-12 min-h-[80px] resize-none"
              />
              <Button
                className="absolute bottom-2 right-2"
                size="icon"
                disabled={!message.trim()}
                onClick={handleSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
