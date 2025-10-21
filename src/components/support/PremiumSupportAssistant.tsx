// @ts-nocheck

import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupportResponse } from '@/services/chatService';
import { Message, ChatResponse } from '@/types/support';
import { v4 as uuidv4 } from 'uuid';

interface SupportMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: string;
}

const PremiumSupportAssistant: React.FC = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: uuidv4(),
      sender: 'assistant',
      content: "Bonjour, je suis votre assistant de support premium. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
      emotion: "neutral"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: SupportMessage = {
      id: uuidv4(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await getSupportResponse(input);
      
      const assistantMessage: SupportMessage = {
        id: uuidv4(),
        sender: 'assistant',
        content: response.content || '',
        timestamp: new Date(),
        emotion: response.emotion
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      logger.error('Error getting support response', error as Error, 'UI');
      
      const errorMessage: SupportMessage = {
        id: uuidv4(),
        sender: 'assistant',
        content: "Je suis désolé, j'ai rencontré une erreur en essayant de répondre. Pouvez-vous reformuler votre question ?",
        timestamp: new Date(),
        emotion: "sad"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTimestamp = (timestamp: Date) => {
    if (typeof timestamp === 'string') {
      // Handle string timestamp by converting to Date
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center">
          <span className="mr-2">🌟</span>
          Assistant Support Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {msg.content}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatTimestamp(msg.timestamp)}
                {msg.emotion && ` • ${msg.emotion}`}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="self-start bg-muted p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"/>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}/>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}/>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Comment pouvons-nous vous aider ?"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Envoyer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PremiumSupportAssistant;
