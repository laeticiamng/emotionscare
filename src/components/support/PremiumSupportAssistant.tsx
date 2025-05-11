
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Plus, ArrowDown } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Message } from '@/types/support';
import { v4 as uuidv4 } from 'uuid';

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate assistant response after a short delay
    setTimeout(() => {
      const detectedEmotion = randomEmotion();
      
      // Generate contextual response based on input and detected emotion
      let responseContent = '';
      if (inputValue.toLowerCase().includes('mot de passe')) {
        responseContent = "Pour réinitialiser votre mot de passe, vous pouvez utiliser la fonctionnalité \"Mot de passe oublié\" sur la page de connexion. Je peux vous guider à travers ce processus si vous le souhaitez.";
      } else if (inputValue.toLowerCase().includes('compte') || inputValue.toLowerCase().includes('inscription')) {
        responseContent = "Je serais ravi de vous aider avec votre compte. Pourriez-vous me préciser quelle information vous recherchez ou quel problème vous rencontrez ?";
      } else if (inputValue.toLowerCase().includes('bug') || inputValue.toLowerCase().includes('problème')) {
        responseContent = "Je suis désolé d'apprendre que vous rencontrez un problème. Pouvez-vous me décrire plus précisément ce qui se passe ? Captures d'écran et étapes pour reproduire le problème sont toujours utiles.";
      } else if (inputValue.toLowerCase().includes('merci')) {
        responseContent = "C'est avec plaisir que je vous aide ! N'hésitez pas si vous avez d'autres questions.";
      } else {
        responseContent = "Merci pour votre message. Notre équipe d'experts se penche sur votre demande. Puis-je vous demander plus de détails pour mieux vous aider ?";
      }
      
      const assistantResponse: Message = {
        id: uuidv4(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
        emotion: detectedEmotion
      };
      
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
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
