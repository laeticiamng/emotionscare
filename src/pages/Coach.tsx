
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Bot, User, Lightbulb, Heart, Zap, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const Coach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre coach IA personnel. Comment vous sentez-vous aujourd\'hui ? Parlons de ce qui vous préoccupe ou de vos objectifs de bien-être.',
      timestamp: new Date(),
      suggestions: [
        'Je me sens stressé au travail',
        'J\'ai des difficultés à dormir',
        'Je veux améliorer ma confiance en moi',
        'Comment gérer mon anxiété ?'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Appel à l'API OpenAI via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { 
          message: content,
          context: messages.slice(-5) // Garder les 5 derniers messages pour le contexte
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || 'Je rencontre des difficultés techniques. Pouvez-vous reformuler votre question ?',
        timestamp: new Date(),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur coach IA:', error);
      
      // Réponse de fallback si l'API n'est pas disponible
      const fallbackResponses = [
        'C\'est tout à fait compréhensible de ressentir cela. Prenons un moment pour explorer ces émotions ensemble.',
        'Merci de partager cela avec moi. Chaque émotion est valide et importante.',
        'Je vous entends. Parlons de stratégies concrètes qui pourraient vous aider.',
        'Votre bien-être est important. Que diriez-vous d\'essayer une technique de respiration ?'
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date(),
        suggestions: [
          'Exercices de respiration',
          'Techniques de relaxation',
          'Conseils de gestion du stress',
          'Méditation guidée'
        ]
      };

      setMessages(prev => [...prev, botMessage]);
      toast.error('Mode hors ligne activé. Fonctionnalités limitées.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const quickTips = [
    {
      icon: Heart,
      title: 'Respiration 4-7-8',
      description: 'Inspirez 4s, retenez 7s, expirez 8s',
      color: 'bg-red-500'
    },
    {
      icon: Brain,
      title: 'Méditation guidée',
      description: '5 minutes de pleine conscience',
      color: 'bg-purple-500'
    },
    {
      icon: Zap,
      title: 'Exercice rapide',
      description: 'Activité physique de 2 minutes',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Coach IA Personnel</h1>
        <p className="text-muted-foreground">
          Votre accompagnateur intelligent pour le bien-être émotionnel
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Conversation
              </CardTitle>
              <CardDescription>
                Partagez vos préoccupations et recevez des conseils personnalisés
              </CardDescription>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-3' 
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 mr-3'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      
                      {/* Message Content */}
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs opacity-70">Suggestions :</p>
                            <div className="flex flex-wrap gap-1">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-auto py-1 px-2"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Quick Tips Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lightbulb className="h-5 w-5 mr-2" />
                Conseils rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => handleSuggestionClick(tip.title)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <tip.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">État de la session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Messages échangés</span>
                  <Badge variant="secondary">{messages.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Durée</span>
                  <Badge variant="secondary">
                    {Math.floor((new Date().getTime() - messages[0]?.timestamp.getTime()) / 60000)} min
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mode</span>
                  <Badge variant="outline">Coach personnel</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Coach;
