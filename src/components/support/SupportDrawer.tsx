
import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HeadphonesIcon, MessageCircle, Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Sample quick responses for the mini chat
const QUICK_RESPONSES = [
  {
    question: "Comment modifier mon mot de passe ?",
    answer: "Vous pouvez modifier votre mot de passe dans les paramètres de votre compte. Accédez à votre profil, puis à Sécurité."
  },
  {
    question: "Comment partager mes résultats ?",
    answer: "Pour partager vos résultats avec un professionnel, utilisez la fonction \"Partage\" accessible depuis votre rapport d'analyse."
  }
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
}

const SupportDrawer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour 👋 Comment puis-je vous aider aujourd'hui ?",
      sender: 'assistant'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Je vous recommande de visiter notre section d'assistance complète pour une aide plus détaillée. Cliquez sur 'Support complet' ci-dessous.",
        sender: 'assistant'
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  const handleQuickQuestion = (question: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Find and show the answer
    const response = QUICK_RESPONSES.find(item => item.question === question);
    
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response?.answer || "Je vous recommande de visiter notre support complet pour plus d'informations détaillées.",
        sender: 'assistant'
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };
  
  const goToFullSupport = () => {
    navigate('/support');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full border-primary"
          aria-label="Support"
        >
          <HeadphonesIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="border-b pb-2">
          <DrawerTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Assistance Rapide
          </DrawerTitle>
          <DrawerDescription>
            Besoin d'aide ? Votre assistant est à votre disposition.
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <ScrollArea className="h-[40vh]">
            <div className="space-y-4">
              {messages.map(message => (
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
                      message.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                  >
                    {message.content}
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
            </div>
          </ScrollArea>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Questions fréquentes :</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_RESPONSES.map((item, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleQuickQuestion(item.question)}
                >
                  {item.question}
                </Badge>
              ))}
            </div>
          </div>
          
          <form 
            className="flex gap-2" 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Input
              placeholder="Votre question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </form>
        </div>
        
        <DrawerFooter className="border-t">
          <Button onClick={goToFullSupport} variant="default" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Support Complet
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SupportDrawer;
