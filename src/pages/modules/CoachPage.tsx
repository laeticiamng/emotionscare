/**
 * CoachPage - Module de coach IA
 * Interface conversationnelle avec un coach virtuel
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Brain, 
  MessageCircle, 
  Lightbulb,
  Heart,
  Zap,
  Clock,
  User,
  Bot,
  Mic,
  Image,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type: 'text' | 'suggestion' | 'exercise';
  metadata?: {
    mood?: string;
    confidence?: number;
    suggestions?: string[];
  };
}

interface CoachPersonality {
  id: string;
  name: string;
  description: string;
  avatar: string;
  specialties: string[];
  tone: string;
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentCoach, setCurrentCoach] = useState<CoachPersonality | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const coaches: CoachPersonality[] = [
    {
      id: 'emma',
      name: 'Emma',
      description: 'Coach empathique spécialisée en gestion du stress',
      avatar: '👩‍⚕️',
      specialties: ['Stress', 'Anxiété', 'Relaxation'],
      tone: 'Empathique et bienveillant'
    },
    {
      id: 'alex',
      name: 'Alex',
      description: 'Coach motivationnel pour l\'énergie et la productivité',
      avatar: '🧑‍💼',
      specialties: ['Motivation', 'Énergie', 'Objectifs'],
      tone: 'Dynamique et encourageant'
    },
    {
      id: 'zen',
      name: 'Zen',
      description: 'Maître de méditation et mindfulness',
      avatar: '🧘‍♀️',
      specialties: ['Méditation', 'Pleine conscience', 'Équilibre'],
      tone: 'Calme et sage'
    }
  ];

  const quickSuggestions = [
    "Je me sens stressé aujourd'hui",
    "Comment améliorer ma concentration ?",
    "J'ai besoin de motivation",
    "Peux-tu me guider dans une méditation ?",
    "Comment mieux gérer mes émotions ?"
  ];

  useEffect(() => {
    if (!currentCoach) {
      setCurrentCoach(coaches[0]);
      // Message d'accueil
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Bonjour ! Je suis ${coaches[0].name}, votre coach IA personnalisé. Je suis là pour vous accompagner dans votre parcours de bien-être émotionnel. Comment puis-je vous aider aujourd'hui ?`,
        sender: 'coach',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simuler la réponse du coach
    setTimeout(() => {
      const responses = [
        {
          content: "Je comprends votre préoccupation. Prenons quelques instants pour explorer cela ensemble. Pouvez-vous me dire ce qui vous préoccupe le plus en ce moment ?",
          suggestions: ["Parlons de stress", "Exercice de respiration", "Technique de relaxation"]
        },
        {
          content: "C'est tout à fait normal de ressentir cela. Voici quelques techniques qui pourraient vous aider. Voulez-vous que nous commencions par un exercice simple ?",
          suggestions: ["Exercice guidé", "Conseils pratiques", "Planifier ensemble"]
        },
        {
          content: "Excellente question ! Votre bien-être est important. Basé sur ce que vous me dites, je recommande de commencer par petites étapes. Que diriez-vous d'essayer ceci ?",
          suggestions: ["Commencer maintenant", "En savoir plus", "Autres options"]
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse.content,
        sender: 'coach',
        timestamp: new Date(),
        type: 'suggestion',
        metadata: {
          suggestions: randomResponse.suggestions,
          confidence: 85 + Math.floor(Math.random() * 15)
        }
      };

      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const selectCoach = (coach: CoachPersonality) => {
    setCurrentCoach(coach);
    const switchMessage: Message = {
      id: Date.now().toString(),
      content: `Bonjour ! Je suis ${coach.name}. ${coach.description}. Comment puis-je vous aider aujourd'hui ?`,
      sender: 'coach',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, switchMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Brain className="h-8 w-8 text-green-600" />
            Coach IA Personnel
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Votre accompagnement personnalisé pour le bien-être émotionnel
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Coaches */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choisir votre coach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coaches.map((coach) => (
                  <div
                    key={coach.id}
                    onClick={() => selectCoach(coach)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      currentCoach?.id === coach.id 
                        ? 'bg-primary/10 border-2 border-primary' 
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{coach.avatar}</div>
                      <div className="flex-1">
                        <div className="font-medium">{coach.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {coach.specialties.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggestions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(suggestion)}
                    className="w-full text-left justify-start h-auto py-2 px-3"
                  >
                    <span className="text-xs">{suggestion}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{currentCoach?.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{currentCoach?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {currentCoach?.tone}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      En ligne
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8 shrink-0">
                          {message.sender === 'user' ? (
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                          ) : (
                            <AvatarFallback>{currentCoach?.avatar}</AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div className={`space-y-2 ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`rounded-lg p-3 ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            {message.metadata?.confidence && (
                              <div className="text-xs opacity-70 mt-1">
                                Confiance: {message.metadata.confidence}%
                              </div>
                            )}
                          </div>
                          
                          {message.metadata?.suggestions && (
                            <div className="flex flex-wrap gap-2">
                              {message.metadata.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => sendMessage(suggestion)}
                                  className="text-xs"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          <div className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{currentCoach?.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3 flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Tapez votre message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;