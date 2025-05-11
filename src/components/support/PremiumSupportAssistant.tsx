
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/support';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Users, Phone, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const analyzeEmotion = (text: string): string => {
  // Simple emotion detection - in a real app would use more sophisticated analysis
  const emotions = {
    happy: ['happy', 'glad', 'joy', 'excited', 'wonderful', 'great'],
    sad: ['sad', 'upset', 'unhappy', 'disappointed', 'sorry'],
    angry: ['angry', 'frustrated', 'annoyed', 'mad', 'irritated'],
    confused: ['confused', 'unsure', 'don\'t understand', 'unclear', 'help'],
    neutral: []
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return emotion;
    }
  }
  
  return 'neutral';
};

const PremiumSupportAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      content: "Bonjour ! Je suis votre assistant premium personnel. Comment puis-je vous aider aujourd'hui ?",
      sender: "assistant",
      timestamp: new Date(),
      emotion: "neutral"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCallOption, setShowCallOption] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [expertAvailable, setExpertAvailable] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Detect when human assistance might be needed
  useEffect(() => {
    if (messages.length > 3) {
      const lastTwoUserMessages = messages
        .filter(m => m.sender === 'user')
        .slice(-2);
      
      if (lastTwoUserMessages.length === 2 && 
          (lastTwoUserMessages[0].emotion === 'angry' || lastTwoUserMessages[0].emotion === 'confused') &&
          (lastTwoUserMessages[1].emotion === 'angry' || lastTwoUserMessages[1].emotion === 'confused')) {
        setShowCallOption(true);
      }
    }
  }, [messages]);
  
  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Detect emotion in user message
    const emotion = analyzeEmotion(inputValue);
    
    // Add user message
    const newUserMessage: Message = {
      id: uuidv4(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      emotion
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      let response = "";
      
      // Generate contextual response based on emotion and content
      if (emotion === 'angry') {
        response = "Je comprends votre frustration. Laissez-moi vous aider à résoudre ce problème rapidement. Pourriez-vous me donner plus de détails ?";
      } else if (emotion === 'confused') {
        response = "Je vois que cela peut être déroutant. Essayons de clarifier ensemble. Que souhaitez-vous accomplir exactement ?";
      } else if (emotion === 'sad') {
        response = "Je suis désolé d'apprendre cela. Prenons le temps de résoudre cette situation ensemble. Comment puis-je vous aider ?";
      } else if (emotion === 'happy') {
        response = "Je suis ravi de voir que vous êtes satisfait ! Y a-t-il autre chose que je puisse faire pour vous aujourd'hui ?";
      } else {
        response = "Merci pour ces informations. Comment puis-je vous aider davantage avec cela ?";
      }
      
      // Add assistant response
      const newAssistantMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
        emotion: "neutral"
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      setIsTyping(false);
      
      // Show feedback request after a few exchanges
      if (messages.length > 4 && !showFeedback) {
        setTimeout(() => setShowFeedback(true), 1000);
      }
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleCallExpert = () => {
    toast({
      title: "Connexion avec un expert",
      description: "Un expert va vous contacter dans les prochaines minutes",
    });
    
    // Add system message
    const systemMessage: Message = {
      id: uuidv4(),
      content: "Votre demande a été transmise à un expert qui va vous contacter sous peu. Un de nos spécialistes est en train de consulter votre historique de conversation pour vous offrir l'aide la plus adaptée.",
      sender: "assistant",
      timestamp: new Date(),
      emotion: "neutral"
    };
    
    setMessages(prev => [...prev, systemMessage]);
    setShowCallOption(false);
  };
  
  const handleFeedback = (positive: boolean) => {
    toast({
      title: positive ? "Merci pour votre retour positif !" : "Merci pour votre retour",
      description: positive 
        ? "Nous sommes heureux d'avoir pu vous aider" 
        : "Nous allons faire de notre mieux pour améliorer notre assistance",
    });
    setShowFeedback(false);
  };
  
  // Get message style based on sender and emotion
  const getMessageStyle = (message: Message) => {
    if (message.sender === 'assistant') {
      return "bg-primary/10 text-foreground";
    }
    
    // Style based on emotion
    switch (message.emotion) {
      case 'angry':
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200";
      case 'sad':
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200";
      case 'happy':
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200";
      case 'confused':
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200";
      default:
        return "bg-muted/50 text-foreground";
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto h-[500px] flex flex-col shadow-lg border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Assistant Premium
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            {expertAvailable ? "Experts disponibles" : "Réponse rapide"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg max-w-[85%] ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'} ${getMessageStyle(message)}`}
            >
              {message.content}
              <div className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg max-w-[85%] bg-primary/10 mr-auto"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </motion.div>
          )}
          
          {showCallOption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-primary/5 border border-primary/10 w-full"
            >
              <p className="text-sm mb-2">Besoin d'une assistance personnalisée ?</p>
              <div className="flex gap-2">
                <Button size="sm" variant="default" onClick={handleCallExpert} className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Parler à un expert
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCallOption(false)}>
                  Continuer avec l'IA
                </Button>
              </div>
            </motion.div>
          )}
          
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-muted/50 w-full text-center"
            >
              <p className="text-sm mb-2">Cette réponse vous a-t-elle été utile ?</p>
              <div className="flex justify-center gap-4">
                <Button size="sm" variant="ghost" onClick={() => handleFeedback(true)} className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  Oui
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleFeedback(false)} className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4" />
                  Non
                </Button>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez votre message..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PremiumSupportAssistant;
