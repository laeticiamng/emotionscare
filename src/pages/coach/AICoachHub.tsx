import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle, Send, Mic, MicOff, Settings, Clock,
  Brain, Heart, Target, TrendingUp, BookOpen, Calendar,
  User, Bot, Sparkles, Zap, Award, BarChart3, 
  Coffee, Moon, Sun, Activity, CheckCircle, Plus,
  ArrowRight, Star, ThumbsUp, ThumbsDown, Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'voice' | 'suggestion' | 'plan';
  metadata?: {
    emotions?: string[];
    confidence?: number;
    suggestions?: string[];
  };
}

interface CoachingPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  sessions: number;
  completedSessions: number;
  category: 'wellness' | 'productivity' | 'relationships' | 'personal-growth';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  nextSession?: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: string;
  progress: number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

interface DailyInsight {
  id: string;
  title: string;
  message: string;
  category: 'motivation' | 'tip' | 'reflection' | 'challenge';
  icon: React.ElementType;
  color: string;
}

export const AICoachHub: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const coachingPlans: CoachingPlan[] = [
    {
      id: '1',
      title: 'Gestion du Stress Quotidien',
      description: 'Techniques avancées pour réduire le stress et améliorer la résilience',
      duration: '4 semaines',
      progress: 65,
      sessions: 12,
      completedSessions: 8,
      category: 'wellness',
      difficulty: 'intermediate',
      nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Productivité Optimisée',
      description: 'Maximiser votre efficacité et atteindre vos objectifs professionnels',
      duration: '6 semaines',
      progress: 30,
      sessions: 18,
      completedSessions: 5,
      category: 'productivity',
      difficulty: 'advanced',
      nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Communication Assertive',
      description: 'Développer vos compétences relationnelles et votre confiance',
      duration: '3 semaines',
      progress: 90,
      sessions: 9,
      completedSessions: 8,
      category: 'relationships',
      difficulty: 'beginner'
    }
  ];

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Méditation quotidienne',
      description: '15 minutes de méditation chaque matin',
      target: '30 jours consécutifs',
      progress: 73,
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'active'
    },
    {
      id: '2',
      title: 'Améliorer le sommeil',
      description: 'Coucher avant 23h et dormir 8h par nuit',
      target: '7-8h par nuit',
      progress: 45,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      status: 'active'
    }
  ];

  const dailyInsights: DailyInsight[] = [
    {
      id: '1',
      title: 'Conseil du jour',
      message: 'Prenez 3 respirations profondes avant chaque réunion importante',
      category: 'tip',
      icon: Coffee,
      color: 'text-yellow-500'
    },
    {
      id: '2',
      title: 'Réflexion',
      message: 'Quelle est une chose pour laquelle vous êtes reconnaissant aujourd\'hui ?',
      category: 'reflection',
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      id: '3',
      title: 'Défi du jour',
      message: 'Essayez une nouvelle technique de relaxation ce soir',
      category: 'challenge',
      icon: Target,
      color: 'text-blue-500'
    }
  ];

  const quickSuggestions = [
    'Comment puis-je gérer mon stress au travail ?',
    'Aide-moi à créer une routine matinale',
    'Quels sont mes progrès cette semaine ?',
    'Comment améliorer ma confiance en moi ?'
  ];

  const [conversationStats] = useState({
    totalSessions: 47,
    averageDuration: 12,
    improvementScore: 78,
    goalsAchieved: 12
  });

  // Messages initiaux
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: 'Bonjour ! Je suis votre coach IA personnel. Comment puis-je vous aider aujourd\'hui à améliorer votre bien-être ?',
        sender: 'ai',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text'
      },
      {
        id: '2',
        content: 'J\'ai remarqué que vous aviez eu une semaine productive ! Félicitations pour avoir maintenu votre routine de méditation. 🎉',
        sender: 'ai',
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
        type: 'suggestion',
        metadata: {
          emotions: ['satisfaction', 'motivation'],
          confidence: 0.92
        }
      }
    ]);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulation de la réponse IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `C'est une excellente question ! Basé sur votre profil et vos objectifs actuels, je recommande de commencer par des techniques de respiration guidée. Voulez-vous que nous explorions cela ensemble ?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          confidence: 0.89,
          suggestions: [
            'Commencer un exercice de respiration',
            'Créer un plan personnalisé',
            'Voir mes progrès récents'
          ]
        }
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Simulation
    setTimeout(() => {
      setIsRecording(false);
      toast({
        title: "Message vocal reçu",
        description: "Traitement de votre message vocal en cours...",
      });
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wellness': return Heart;
      case 'productivity': return Target;
      case 'relationships': return User;
      case 'personal-growth': return TrendingUp;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-medium text-primary">Coach IA Personnel</span>
        </div>
        <h1 className="text-4xl font-bold">Centre de Coaching Intelligent</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Votre assistant personnel alimenté par l'IA pour un développement personnel optimal. 
          Conseils personnalisés, suivi des objectifs et coaching adaptatif 24/7.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{conversationStats.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions de coaching</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{conversationStats.averageDuration}min</p>
            <p className="text-xs text-muted-foreground">Durée moyenne</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{conversationStats.improvementScore}%</p>
            <p className="text-xs text-muted-foreground">Score de progression</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{conversationStats.goalsAchieved}</p>
            <p className="text-xs text-muted-foreground">Objectifs atteints</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenu principal */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Assistant Coach IA</CardTitle>
                  <p className="text-sm text-muted-foreground">En ligne • Répond en temps réel</p>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  IA Avancée
                </Badge>
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {message.sender === 'ai' && message.metadata?.confidence && (
                              <Badge variant="secondary" className="text-xs ml-2">
                                {Math.round(message.metadata.confidence * 100)}% sûr
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {message.metadata?.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.metadata.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="mr-2 mb-1 text-xs"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {message.sender === 'ai' && (
                        <div className="flex flex-col space-y-1 ml-2 order-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Suggestions rapides */}
              <div className="p-4 border-t">
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Posez votre question au coach IA..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessage)}
                    className="flex-1"
                  />
                  <Button
                    onClick={startVoiceRecording}
                    variant={isRecording ? 'destructive' : 'outline'}
                    size="icon"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button onClick={() => sendMessage(newMessage)} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Insights du jour */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sun className="w-5 h-5 mr-2" />
                Insights du jour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyInsights.map((insight) => (
                <div key={insight.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start space-x-2">
                    <insight.icon className={`w-4 h-4 mt-0.5 ${insight.color}`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Objectifs actuels */}
          <Card>
            <CardHeader className="flex-row items-center space-y-0">
              <CardTitle className="text-lg">Mes Objectifs</CardTitle>
              <Button size="sm" variant="ghost" className="ml-auto">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(goal.priority)}`}
                    >
                      {goal.priority}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progrès</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-1" />
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/coach/goals')}
              >
                Voir tous mes objectifs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Plans de coaching */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plans Actifs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coachingPlans.slice(0, 2).map((plan) => {
                const IconComponent = getCategoryIcon(plan.category);
                return (
                  <div key={plan.id} className="p-3 rounded-lg border">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{plan.title}</h4>
                        <p className="text-xs text-muted-foreground">{plan.duration}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Session {plan.completedSessions}/{plan.sessions}</span>
                            <span>{plan.progress}%</span>
                          </div>
                          <Progress value={plan.progress} className="h-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/coach/plans')}
              >
                Tous mes plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AICoachHub;