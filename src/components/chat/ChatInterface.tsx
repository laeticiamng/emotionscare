
import React, { useState, useEffect, useRef } from 'react';
import useChat from '@/hooks/useChat';
import { ChatMessage } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  readOnly?: boolean;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialMessages = [],
  onSendMessage,
  readOnly = false,
  className = ''
}) => {
  const { 
    messages, 
    input, 
    setInput, 
    sendMessage, 
    handleInputChange, 
    handleSubmit 
  } = useChat({ initialMessages });
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Either use the custom handler or the internal chat state
    if (onSendMessage) {
      onSendMessage(input);
      setInput('');
    } else {
      sendMessage(input);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="mt-1">
                  {message.sender === 'user' ? (
                    <>
                      <AvatarFallback>U</AvatarFallback>
                      <AvatarImage src="/images/avatar.png" />
                    </>
                  ) : (
                    <>
                      <AvatarFallback>AI</AvatarFallback>
                      <AvatarImage src="/images/ai-avatar.png" />
                    </>
                  )}
                </Avatar>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.text || message.content}</p>
                  {message.timestamp && (
                    <span className={`text-xs block mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Aucun message. Commencez la conversation!</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {!readOnly && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="min-h-[60px]"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChatInterface;
