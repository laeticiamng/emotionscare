
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Mic, Phone, Mail, MessageCircle, Send, HeadphonesIcon, Sparkles, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  emotion?: string;
  isTyping?: boolean;
}

const PremiumSupportAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [supportMode, setSupportMode] = useState<'chat' | 'call' | 'email'>('chat');
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Add welcome message on component mount
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: "Bonjour 👋 Je suis votre assistant premium personnel. Comment puis-je vous aider aujourd'hui ?",
        sender: 'assistant',
        timestamp: new Date(),
        emotion: 'friendly'
      }
    ]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message to assistant
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Add typing indicator
    const typingIndicatorId = `typing-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: typingIndicatorId,
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    }]);
    
    try {
      // Analyze emotion first
      const emotionAnalysis = await analyzeEmotionFromText(inputValue);
      setDetectedEmotion(emotionAnalysis.primaryEmotion);
      
      // Get assistant response
      const response = await getPremiumResponse(inputValue, emotionAnalysis.primaryEmotion);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId));
      
      // Simulate typing effect for premium feel
      setIsTypingEffect(true);
      let displayedText = '';
      const words = response.content.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        displayedText += words[i] + ' ';
        const partialMessage = {
          id: response.id,
          content: displayedText,
          sender: 'assistant',
          timestamp: new Date(),
          emotion: emotionAnalysis.primaryEmotion
        };
        
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== response.id);
          return [...filtered, partialMessage];
        });
        
        // Random delay between 50-150ms per word for natural typing feel
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
      }
      
      setIsTypingEffect(false);
    } catch (error) {
      console.error('Error getting assistant response:', error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de contacter l'assistant pour le moment. Un spécialiste va vous contacter.",
        variant: "destructive"
      });
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId));
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze emotion from user text
  const analyzeEmotionFromText = async (text: string): Promise<{primaryEmotion: string, intensity: number}> => {
    try {
      // Call emotion analysis function
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: text,
          model: "gpt-4o-mini",
          temperature: 0.2,
          max_tokens: 100,
          top_p: 1.0,
          module: "emotion-analysis"
        }
      });
      
      if (error) throw error;
      
      // Parse response - in a real app, this would be more sophisticated
      const response = data.response || '';
      
      // Very simple emotion extraction - would be more sophisticated in production
      const emotions = ['happy', 'sad', 'angry', 'frustrated', 'confused', 'neutral', 'anxious', 'concerned'];
      let primaryEmotion = 'neutral';
      
      for (const emotion of emotions) {
        if (response.toLowerCase().includes(emotion)) {
          primaryEmotion = emotion;
          break;
        }
      }
      
      return {
        primaryEmotion,
        intensity: 0.8 // Default intensity
      };
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      return {
        primaryEmotion: 'neutral',
        intensity: 0.5
      };
    }
  };

  // Get premium response from AI
  const getPremiumResponse = async (message: string, emotion: string): Promise<Message> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: message,
          userContext: {
            detectedEmotion: emotion
          },
          model: "gpt-4o",
          temperature: 0.5,
          max_tokens: 1000,
          top_p: 1.0,
          module: "premium-support"
        }
      });
      
      if (error) throw error;
      
      return {
        id: Date.now().toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(),
        emotion: emotion
      };
    } catch (error) {
      console.error('Error getting premium response:', error);
      
      return {
        id: Date.now().toString(),
        content: "Je suis désolé, mais je rencontre des difficultés à répondre à votre demande. Un spécialiste va vous contacter très rapidement pour vous aider.",
        sender: 'assistant',
        timestamp: new Date(),
        emotion: 'concerned'
      };
    }
  };

  // Handle mode switching
  const handleSwitchMode = (mode: 'chat' | 'call' | 'email') => {
    setSupportMode(mode);
    
    if (mode === 'call') {
      toast({
        title: "Demande d'appel initiée",
        description: "Un spécialiste va vous contacter dans les prochaines minutes",
        duration: 5000
      });
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Votre demande d'appel a été enregistrée. Un spécialiste va vous contacter dans les prochaines minutes. Vous pouvez continuer à utiliser le chat en attendant.",
        sender: 'assistant',
        timestamp: new Date(),
        emotion: 'friendly'
      }]);
    } else if (mode === 'email') {
      toast({
        title: "Support par email",
        description: "Envoyez-nous un email détaillé ou laissez un message ici",
        duration: 5000
      });
    }
  };

  // Get message style based on sender and emotion
  const getMessageStyle = (message: Message) => {
    if (message.sender === 'user') {
      return "bg-primary text-primary-foreground";
    } else {
      switch (message.emotion) {
        case 'happy':
          return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
        case 'sad':
        case 'concerned':
          return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
        case 'angry':
        case 'frustrated':
          return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300";
        case 'confused':
          return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
        default:
          return "bg-muted/50";
      }
    }
  };

  return (
    <Card className="w-full h-full flex flex-col shadow-premium premium-card">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Support Premium</span>
            <Badge className="ml-2" variant="outline">24/7</Badge>
          </CardTitle>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={supportMode === 'chat' ? 'default' : 'outline'} 
              onClick={() => handleSwitchMode('chat')}
              className={supportMode === 'chat' ? 'bg-primary' : ''}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:text-xs">Chat</span>
            </Button>
            <Button 
              size="sm" 
              variant={supportMode === 'call' ? 'default' : 'outline'} 
              onClick={() => handleSwitchMode('call')}
            >
              <Phone className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:text-xs">Appel</span>
            </Button>
            <Button 
              size="sm" 
              variant={supportMode === 'email' ? 'default' : 'outline'} 
              onClick={() => handleSwitchMode('email')}
            >
              <Mail className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:text-xs">Email</span>
            </Button>
          </div>
        </div>
        
        {detectedEmotion && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span>Émotion détectée:</span>
            <Badge variant="secondary">{detectedEmotion}</Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === 'assistant' && (
                  <Avatar className="h-8 w-8 mr-2">
                    <HeadphonesIcon className="h-5 w-5" />
                  </Avatar>
                )}
                
                <div 
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    getMessageStyle(message)
                  )}
                >
                  {message.isTyping ? (
                    <div className="flex space-x-1 items-center h-6">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-.3s]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-.5s]" />
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 ml-2">
                    <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-sm">
                      U
                    </div>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <form 
          className="flex w-full gap-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            disabled={isLoading || isTypingEffect}
            title="Enregistrer un message audio"
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <Input
            placeholder="Tapez votre message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || isTypingEffect}
            className="flex-1"
          />
          
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading || isTypingEffect}
            className="premium-transition hover-lift"
          >
            <Send className="h-4 w-4 mr-1" />
            Envoyer
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PremiumSupportAssistant;
