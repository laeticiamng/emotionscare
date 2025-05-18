
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Plus, ArrowDown } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Message } from '@/types/support';
import { v4 as uuidv4 } from 'uuid';
import { getSupportResponse } from '@/services/chatService';

const PremiumSupportAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour, je suis votre assistant premium. Comment puis-je vous aider aujourd'hui ?",
      sender: "assistant",
      timestamp: new Date(),
      emotion: "neutral"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  const emotions = ["frustré", "confus", "satisfait", "curieux"];
  const randomEmotion = () => emotions[Math.floor(Math.random() * emotions.length)];
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await getSupportResponse(userMessage.content);

      const assistantResponse: Message = {
        id: uuidv4(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date(),
        emotion: response.emotion || randomEmotion()
      };

      setMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      const fallback: Message = {
        id: uuidv4(),
        content: "Désolé, une erreur est survenue. Veuillez réessayer plus tard.",
        sender: 'assistant',
        timestamp: new Date(),
        emotion: 'neutral'
      };
      setMessages(prev => [...prev, fallback]);
      console.error('Support assistant error:', error);
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Assistant Premium</span>
          <Button variant="ghost" size="sm" onClick={scrollToBottom}>
            <ArrowDown className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pb-2">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 
                ${message.sender === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"}`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </CardContent>
      
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Posez votre question..."
            className="min-h-[2.5rem] max-h-[7.5rem] resize-none"
          />
          <div className="flex flex-col space-y-2">
            <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PremiumSupportAssistant;
