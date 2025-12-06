// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquareText, UserIcon } from 'lucide-react';
import { useCoach } from '@/contexts/coach';
import { cn } from '@/lib/utils';

export interface MiniCoachProps {
  className?: string;
  quickQuestions?: string[];
}

const MiniCoach: React.FC<MiniCoachProps> = ({ className, quickQuestions = [] }) => {
  const { messages, sendMessage, isProcessing, currentEmotion } = useCoach();
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText, 'user');
      setInputText('');
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question, 'user');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Only show last 3 messages
  const displayMessages = messages.slice(-3);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Coach IA</CardTitle>
        <CardDescription>Discutez avec votre coach personnel</CardDescription>
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
                  "flex items-start gap-2 rounded-lg p-3",
                  msg.sender === 'user' 
                    ? "bg-primary-foreground ml-4" 
                    : "bg-muted mr-4"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {msg.sender === 'user' ? (
                    <UserIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <MessageSquareText className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="text-sm flex-1">{msg.content}</div>
              </div>
            ))
          )}
          {isProcessing && (
            <div className="flex justify-center py-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {quickQuestions && quickQuestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {quickQuestions.map((question, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-accent"
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
          />
          <Button 
            size="icon" 
            onClick={handleSend} 
            disabled={inputText.trim() === '' || isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MiniCoach;
