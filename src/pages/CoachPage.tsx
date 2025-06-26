
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { 
  Send, 
  MessageSquareText, 
  UserIcon, 
  Bot, 
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  Heart,
  Brain,
  Zap,
  Clock,
  Star,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type?: 'text' | 'exercise' | 'recommendation';
}

interface CoachSession {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  category: 'breathing' | 'meditation' | 'motivation' | 'stress';
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  date?: Date;
  icon: string;
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis votre coach IA personnel. Comment vous sentez-vous aujourd'hui ?",
      sender: 'coach',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('chat');
  const { toast } = useToast();

  const [sessions] = useState<CoachSession[]>([
    {
      id: '1',
      title: 'Respiration Profonde',
      duration: 10,
      completed: true,
      category: 'breathing',
      description: 'Exercice de respiration pour réduire le stress'
    },
    {
      id: '2',
      title: 'Méditation Guidée',
      duration: 15,
      completed: false,
      category: 'meditation',
      description: 'Méditation pour la clarté mentale'
    },
    {
      id: '3',
      title: 'Boost de Motivation',
      duration: 8,
      completed: false,
      category: 'motivation',
      description: 'Session pour retrouver la motivation'
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Premier Pas',
      description: 'Première session avec le coach',
      achieved: true,
      date: new Date(),
      icon: '🎉'
    },
    {
      id: '2',
      title: 'Régularité',
      description: '7 jours consécutifs avec le coach',
      achieved: false,
      icon: '🔥'
    },
    {
      id: '3',
      title: 'Zen Master',
      description: '50 sessions de méditation complétées',
      achieved: false,
      icon: '🧘'
    }
  ]);

  const quickQuestions = [
    "Comment puis-je gérer mon stress ?",
    "J'ai besoin de motivation",
    "Aide-moi à méditer",
    "Je me sens anxieux",
    "Exercices de respiration"
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Je comprends votre situation. Voici quelques conseils personnalisés pour vous aider.",
        "C'est tout à fait normal de ressentir cela. Essayons ensemble un exercice de respiration.",
        "Vous faites preuve de courage en partageant cela. Voici des stratégies qui peuvent vous aider.",
        "Je suis là pour vous accompagner. Commençons par identifier ce qui vous préoccupe le plus."
      ];

      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'coach',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startSession = (session: CoachSession) => {
    toast({
      title: "Session Démarrée",
      description: `${session.title} - ${session.duration} minutes`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Coach IA Personnel
          </h1>
          <p className="text-xl text-muted-foreground">
            Votre accompagnateur intelligent pour le bien-être émotionnel
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progrès
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Planification
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Succès
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">Coach IA</CardTitle>
                        <CardDescription>
                          {isProcessing ? 'En train d\'écrire...' : 'En ligne'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-3 ${
                          message.sender === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          {message.sender === 'user' ? (
                            <UserIcon className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isProcessing && (
                      <div className="flex justify-center py-4">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Textarea
                        placeholder="Écrivez votre message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isProcessing}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Questions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      État Émotionnel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Bien-être général</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Niveau de stress</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} className="h-2" />
                      
                      <div className="text-center pt-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          État Stable
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <Badge variant={session.completed ? 'default' : 'secondary'}>
                        {session.completed ? 'Terminé' : 'À faire'}
                      </Badge>
                    </div>
                    <CardDescription>{session.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {session.duration} minutes
                      </div>
                      <div className="flex items-center gap-2">
                        {session.category === 'breathing' && <Zap className="h-4 w-4 text-blue-500" />}
                        {session.category === 'meditation' && <Brain className="h-4 w-4 text-purple-500" />}
                        {session.category === 'motivation' && <Target className="h-4 w-4 text-green-500" />}
                        <span className="text-sm capitalize">{session.category}</span>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => startSession(session)}
                        variant={session.completed ? 'outline' : 'default'}
                      >
                        {session.completed ? 'Refaire' : 'Commencer'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sessions Complétées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">24</div>
                  <p className="text-sm text-muted-foreground">Ce mois-ci</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temps Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">6h 45m</div>
                  <p className="text-sm text-muted-foreground">D'accompagnement</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Série Actuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">12</div>
                  <p className="text-sm text-muted-foreground">Jours consécutifs</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Planification des Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sessions Programmées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Méditation Matinale</div>
                    <div className="text-sm text-muted-foreground">Demain - 8h00</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Check-up Émotionnel</div>
                    <div className="text-sm text-muted-foreground">Vendredi - 18h30</div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Programmer une nouvelle session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${achievement.achieved ? 'border-primary bg-primary/5' : 'opacity-50'}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {achievement.achieved && achievement.date && (
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Obtenu le {achievement.date.toLocaleDateString()}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default CoachPage;
