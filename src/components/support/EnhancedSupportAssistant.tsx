// @ts-nocheck

import React, { useState, useRef, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSupport } from "@/contexts/SupportContext";
import { AnimatePresence, motion } from 'framer-motion';
import { Message } from '@/types/support';
import { Bot, Send, Clock, ThumbsUp, ChevronDown, ChevronUp, HelpCircle, User, MessageSquare } from "lucide-react";

const EnhancedSupportAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmotion, setShowEmotion] = useState(true);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, clearHistory } = useSupport();
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    setInput('');
    setIsTyping(true);
    
    try {
      await sendMessage(input);
      
      // Simulate typing effect
      setTimeout(() => {
        setIsTyping(false);
        scrollToBottom();
      }, 1000);
    } catch (error) {
      logger.error('Error sending message', error as Error, 'UI');
      toast({
        title: "Une erreur est survenue",
        description: "Impossible d'envoyer votre message. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsTyping(false);
    }
  };

  const getEmotionEmoji = (emotion?: string) => {
    switch(emotion?.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'curious': return '🤔';
      case 'confident': return '💪';
      case 'helpful': return '🤗';
      case 'neutral': return '😐';
      default: return '🤖';
    }
  };

  const handleSatisfactionRating = (rating: number) => {
    setSatisfaction(rating);
    toast({
      title: "Merci pour votre feedback !",
      description: "Votre évaluation nous aide à améliorer notre service.",
      variant: "success"
    });
  };

  const formatTimestamp = (timestamp: string | Date) => {
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center">
                Assistant Premium
                <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">IA</Badge>
              </CardTitle>
              <CardDescription>Votre compagnon d'assistance personnalisé</CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowEmotion(!showEmotion)}
            className="text-xs"
          >
            {showEmotion ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showEmotion ? "Masquer émotions" : "Voir émotions"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> Assistance
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" /> FAQ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat">
            <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {messages.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-muted-foreground py-10"
                  >
                    <Bot className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                    <p>Comment puis-je vous aider aujourd'hui ?</p>
                  </motion.div>
                )}
                
                {messages.map((msg: Message, index) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-start gap-2 max-w-[85%]">
                      {msg.sender !== 'user' && (
                        <div className="bg-primary/20 p-1.5 rounded-full h-7 w-7 flex items-center justify-center mt-0.5">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      
                      <div className={`p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {msg.content}
                      </div>
                      
                      {msg.sender === 'user' && (
                        <div className="bg-muted/80 p-1.5 rounded-full h-7 w-7 flex items-center justify-center mt-0.5">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-9 mt-1 text-xs text-muted-foreground">
                      <span>{formatTimestamp(msg.timestamp)}</span>
                      {msg.emotion && showEmotion && msg.sender === 'assistant' && (
                        <span className="flex items-center gap-1 bg-primary/5 px-1.5 rounded-full">
                          {getEmotionEmoji(msg.emotion)}
                          <span className="capitalize">{msg.emotion}</span>
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="self-start"
                  >
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/20 p-1.5 rounded-full h-7 w-7 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1 items-center h-4">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"/>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}/>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}/>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>
            
            {messages.length > 0 && (
              <div className="px-4 py-2 border-t border-muted flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Évaluez notre assistance
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={satisfaction === rating ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleSatisfactionRating(rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Comment pouvons-nous vous aider ?"
                disabled={isTyping}
                className="flex-grow"
              />
              <Button type="submit" disabled={isTyping || !input.trim()} size="icon" aria-label="Envoyer le message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="faq" className="p-0">
            <div className="h-80 overflow-y-auto p-4">
              <Input 
                placeholder="Rechercher dans la FAQ..." 
                className="mb-4"
              />
              
              <div className="space-y-4">
                <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="font-medium flex items-center justify-between">
                    <span>Comment modifier mes préférences ?</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="font-medium flex items-center justify-between">
                    <span>Comment télécharger mes données ?</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="font-medium flex items-center justify-between">
                    <span>Comment fonctionne l'analyse émotionnelle ?</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="font-medium flex items-center justify-between">
                    <span>Comment contacter l'équipe de support ?</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Vous ne trouvez pas de réponse ? 
                <Button variant="link" className="p-0 h-auto ml-1">Contactez-nous</Button>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-4 py-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" /> 
          <span>Temps de réponse moyen : 2 min</span>
        </div>
        <div className="flex items-center text-xs">
          <ThumbsUp className="h-3 w-3 mr-1 text-primary" />
          <span>98% de satisfaction</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedSupportAssistant;
