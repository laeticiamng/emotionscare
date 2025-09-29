
import React, { useEffect, useRef } from 'react';
import useChat from '@/hooks/useChat';
import { ChatMessage } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import ChatMessageItem from './ChatMessageItem';

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  readOnly?: boolean;
  className?: string;
  input?: string;
  setInput?: (text: string) => void;
  handleInputChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialMessages = [],
  onSendMessage,
  readOnly = false,
  className = '',
  input: controlledInput,
  setInput: setControlledInput,
  handleInputChange: controlledChange,
  handleSubmit: controlledSubmit
}) => {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    handleInputChange,
    handleSubmit
  } = useChat({ initialMessages });

  const currentInput = controlledInput ?? input;
  const updateInput = setControlledInput ?? setInput;
  const onChangeInput = controlledChange ?? handleInputChange;
  const submitHandler = controlledSubmit ?? handleSubmit;
  
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
    if (!currentInput.trim()) return;
    
    // Either use the custom handler or the internal chat state
    if (onSendMessage) {
      onSendMessage(currentInput);
      updateInput('');
    } else {
      sendMessage(currentInput);
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
            <ChatMessageItem key={message.id} message={message} />
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
              value={currentInput}
              onChange={onChangeInput}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="min-h-[60px]"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!currentInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChatInterface;
