import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatInterfaceProps {
  title?: string;
  initialMessages?: ChatMessage[];
  onSendMessage: (message: string) => Promise<any>;
  onRegenerate?: () => Promise<any>;
  onBackClick?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  systemMessageContent?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  title = "Assistant IA",
  initialMessages = [],
  onSendMessage,
  onRegenerate,
  onBackClick,
  placeholder = "Écrivez votre message ici...",
  className = "",
  autoFocus = true,
  systemMessageContent
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Add system message if provided
  useEffect(() => {
    if (systemMessageContent && messages.length === 0) {
      setMessages([
        {
          id: "system-message",
          content: systemMessageContent,
          sender: "system",
          role: "system",
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, [systemMessageContent, messages.length]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await onSendMessage(inputValue);
      
      if (response) {
        // If response is already a ChatMessage, add it directly
        if (response.id && response.content && response.sender) {
          setMessages(prevMessages => [...prevMessages, response]);
        } 
        // Otherwise, create a new assistant message
        else {
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            content: typeof response === 'string' ? response : JSON.stringify(response),
            sender: "assistant",
            timestamp: new Date().toISOString(),
          };
          setMessages(prevMessages => [...prevMessages, assistantMessage]);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRegenerate = async () => {
    if (!onRegenerate || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await onRegenerate();
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la régénération de la réponse",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine message style based on sender
  const getMessageStyle = (message: ChatMessage) => {
    switch (message.sender) {
      case 'user':
        return "bg-primary/10 ml-auto max-w-[80%] md:max-w-[70%] rounded-lg p-3";
      case 'assistant':
        return "bg-muted max-w-[80%] md:max-w-[70%] rounded-lg p-3";
      case 'system':
        return "bg-accent/20 max-w-full rounded-lg p-3 text-center";
      default:
        return "bg-muted max-w-[80%] md:max-w-[70%] rounded-lg p-3";
    }
  };

  return (
    <Card className={`flex flex-col h-full max-h-[600px] ${className}`}>
      <CardHeader className="px-4 py-3 border-b flex flex-row items-center gap-2">
        {onBackClick && (
          <Button variant="ghost" size="icon" onClick={onBackClick}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={getMessageStyle(message)}>
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted max-w-[80%] md:max-w-[70%] rounded-lg p-3">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-4 w-60 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
          
          {onRegenerate && messages.length > 1 && (
            <Button
              onClick={handleRegenerate}
              disabled={isLoading}
              variant="outline"
              size="icon"
              title="Régénérer la dernière réponse"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
