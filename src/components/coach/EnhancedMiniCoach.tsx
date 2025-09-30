// @ts-nocheck

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquareText, User, Smile, Award } from 'lucide-react';
import { useCoach } from '@/contexts/coach';
import { cn } from '@/lib/utils';
import TypewriterEffect from '@/components/chat/TypewriterEffect';
import { useToast } from '@/hooks/use-toast';
import BreathingLoader from '@/components/chat/BreathingLoader';

export interface EnhancedMiniCoachProps {
  className?: string;
  quickQuestions?: string[];
  maxMessages?: number;
  title?: string;
  description?: string;
}

const EnhancedMiniCoach: React.FC<EnhancedMiniCoachProps> = ({
  className,
  quickQuestions = [],
  maxMessages = 3,
  title = "Coach IA",
  description = "Discutez avec votre coach personnel"
}) => {
  const { messages, sendMessage, isProcessing, currentEmotion } = useCoach();
  const [inputText, setInputText] = useState('');
  const [typedMessages, setTypedMessages] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() && !isProcessing) {
      sendMessage(inputText.trim(), 'user');
      setInputText('');
      
      // Give feedback
      toast({
        title: "Message envoyé",
        description: "Votre message a été transmis au coach",
        duration: 1500,
      });
    }
  };

  const handleQuickQuestion = (question: string) => {
    if (!isProcessing) {
      sendMessage(question, 'user');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Only show last messages up to maxMessages
  const displayMessages = messages.slice(-maxMessages);

  // Track which messages have completed typing
  const handleTypeComplete = (id: string) => {
    setTypedMessages(prev => ({
      ...prev,
      [id]: true
    }));
  };

  return (
    <Card className={cn("flex flex-col", className)} data-testid="mini-coach">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {title}
            {currentEmotion && (
              <Badge variant="outline" className="text-xs font-normal">
                {currentEmotion}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {messages.length >= 5 && (
          <div className="flex-shrink-0">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>{messages.length} messages</span>
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {displayMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquareText className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>Comment puis-je vous aider aujourd'hui ?</p>
            </div>
          ) : (
            displayMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg p-3 transition-all duration-300",
                  msg.sender === 'user' 
                    ? "bg-primary text-primary-foreground ml-4" 
                    : "bg-muted mr-4"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {msg.sender === 'user' ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <MessageSquareText className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="text-sm flex-1">
                  {msg.sender !== 'user' ? (
                    <TypewriterEffect 
                      text={msg.content || ''}
                      speed={30}
                      onComplete={() => handleTypeComplete(msg.id)}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))
          )}
          {isProcessing && (
            <div className="flex items-center gap-2 rounded-lg p-3 bg-muted mr-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageSquareText className="h-4 w-4 text-primary" />
              </div>
              <BreathingLoader />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {quickQuestions && quickQuestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {quickQuestions.map((question, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Écrivez votre message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-h-[40px] h-10 py-2 resize-none"
            disabled={isProcessing}
            aria-label="Message au coach"
          />
          <Button 
            size="icon" 
            onClick={handleSend} 
            disabled={inputText.trim() === '' || isProcessing}
            aria-label="Envoyer le message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedMiniCoach;
