import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Send, Mic, MicOff, Bot, User, Heart, 
         Brain, Target, Lightbulb, BookOpen, Clock, MoreVertical, 
         TrendingUp, Zap, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'exercise' | 'goal';
}

interface CoachSession {
  id: string;
  title: string;
  date: string;
  duration: string;
  topic: string;
  messages: number;
  mood: 'improved' | 'stable' | 'needs_support';
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: 'stress' | 'confidence' | 'relationships' | 'work-life';
}

interface PersonalityInsight {
  trait: string;
  score: number;
  description: string;
  recommendations: string[];
}

const B2CCoachPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [coachMode, setCoachMode] = useState<'empathetic' | 'motivational' | 'analytical'>('empathetic');
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const coachModes = {
    empathetic: {
      name: 'Empathique',
      description: 'Écoute bienveillante et soutien émotionnel',
      icon: '💝',
      color: 'bg-pink-500'
    },
    motivational: {
      name: 'Motivationnel',
      description: 'Encouragement et fixation d\'objectifs',
      icon: '🚀',
      color: 'bg-orange-500'
    },
    analytical: {
      name: 'Analytique',
      description: 'Analyse rationnelle et solutions pratiques',
      icon: '🧠',
      color: 'bg-blue-500'
    }
  };

  const quickTopics = [
    { id: 'stress', label: 'Gestion du stress', icon: '😰' },
    { id: 'motivation', label: 'Motivation', icon: '💪' },
    { id: 'relationships', label: 'Relations', icon: '👥' },
    { id: 'work', label: 'Travail', icon: '💼' },
    { id: 'sleep', label: 'Sommeil', icon: '😴' },
    { id: 'confidence', label: 'Confiance en soi', icon: '✨' }
  ];

  const recentSessions: CoachSession[] = [
    {
      id: '1',
      title: 'Gestion du stress au travail',
      date: 'Aujourd\'hui',
      duration: '25 min',
      topic: 'Stress',
      messages: 18,
      mood: 'improved'
    },
    {
      id: '2',
      title: 'Améliorer ma confiance',
      date: 'Hier',
      duration: '30 min',
      topic: 'Confiance',
      messages: 22,
      mood: 'improved'
    },
    {
      id: '3',
      title: 'Équilibre vie pro/perso',
      date: 'Il y a 2 jours',
      duration: '20 min',
      topic: 'Équilibre',
      messages: 15,
      mood: 'stable'
    }
  ];

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Réduire le stress quotidien',
      description: 'Pratiquer 15 minutes de méditation par jour',
      progress: 75,
      deadline: '2024-02-15',
      category: 'stress'
    },
    {
      id: '2',
      title: 'Améliorer la confiance en public',
      description: 'Participer à 3 présentations ce mois',
      progress: 33,
      deadline: '2024-02-28',
      category: 'confidence'
    },
    {
      id: '3',
      title: 'Équilibre travail-famille',
      description: 'Établir des limites claires entre travail et vie privée',
      progress: 60,
      deadline: '2024-03-01',
      category: 'work-life'
    }
  ];

  const personalityInsights: PersonalityInsight[] = [
    {
      trait: 'Résilience émotionnelle',
      score: 78,
      description: 'Vous avez une bonne capacité à rebondir après les difficultés',
      recommendations: ['Continuez les exercices de gratitude', 'Pratiquez la visualisation positive']
    },
    {
      trait: 'Ouverture d\'esprit',
      score: 85,
      description: 'Vous êtes très ouverts aux nouvelles expériences et idées',
      recommendations: ['Explorez de nouvelles techniques de bien-être', 'Participez à des groupes de discussion']
    },
    {
      trait: 'Gestion du stress',
      score: 65,
      description: 'Votre gestion du stress peut être améliorée',
      recommendations: ['Techniques de respiration', 'Sessions VR de relaxation', 'Planification des pauses']
    }
  ];

  // Messages d'accueil du coach
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessages: Message[] = [
        {
          id: '1',
          content: 'Bonjour ! Je suis votre coach IA personnel. Je suis là pour vous accompagner dans votre bien-être émotionnel. 😊',
          sender: 'coach',
          timestamp: new Date(),
          type: 'text'
        },
        {
          id: '2',
          content: 'J\'ai analysé vos dernières données et je vois que vous travaillez sur la gestion du stress. Comment vous sentez-vous aujourd\'hui ?',
          sender: 'coach',
          timestamp: new Date(),
          type: 'text'
        }
      ];
      setMessages(welcomeMessages);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulation de réponse du coach IA
    setTimeout(() => {
      const coachResponse = generateCoachResponse(currentMessage, coachMode);
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateCoachResponse = (userMessage: string, mode: string): Message => {
    const responses = {
      empathetic: [
        "Je comprends ce que vous ressentez. C'est tout à fait normal d'avoir ces émotions.",
        "Merci de partager cela avec moi. Voulez-vous que nous explorions ensemble ce qui pourrait vous aider ?",
        "Vos sentiments sont valides. Prenons le temps d'analyser la situation ensemble."
      ],
      motivational: [
        "C'est formidable que vous preniez conscience de cela ! C'est le premier pas vers le changement.",
        "Vous avez déjà montré beaucoup de courage en partageant cela. Fixons-nous un objectif ensemble !",
        "Je crois en votre capacité à surmonter cela. Quelles actions concrètes pouvons-nous mettre en place ?"
      ],
      analytical: [
        "Analysons cette situation étape par étape. Quels sont les facteurs déclencheurs que vous avez identifiés ?",
        "Basé sur vos données, je recommande une approche structurée. Voici ce que je propose...",
        "Examinons les patterns dans votre comportement. Avez-vous remarqué des récurrences ?"
      ]
    };

    const modeResponses = responses[mode as keyof typeof responses];
    const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

    return {
      id: Date.now().toString(),
      content: randomResponse,
      sender: 'coach',
      timestamp: new Date(),
      type: 'text'
    };
  };

  const handleQuickTopic = (topic: any) => {
    const topicMessage = `Je voudrais parler de ${topic.label.toLowerCase()}`;
    setCurrentMessage(topicMessage);
    handleSendMessage();
  };

  const startVoiceMessage = () => {
    setIsListening(true);
    // Simulation de reconnaissance vocale
    setTimeout(() => {
      setIsListening(false);
      setCurrentMessage("Message vocal transcrit automatiquement...");
    }, 3000);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'improved': return 'text-green-600 bg-green-100';
      case 'stable': return 'text-blue-600 bg-blue-100';
      case 'needs_support': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stress': return 'bg-red-100 text-red-800';
      case 'confidence': return 'bg-blue-100 text-blue-800';
      case 'relationships': return 'bg-pink-100 text-pink-800';
      case 'work-life': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/app/home')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coach IA Personnel</h1>
              <p className="text-gray-600">Votre accompagnement bien-être personnalisé</p>
            </div>
          </div>
          
          {/* Mode du coach */}
          <div className="flex gap-2">
            {Object.entries(coachModes).map(([key, mode]) => (
              <Button
                key={key}
                variant={coachMode === key ? "default" : "outline"}
                onClick={() => setCoachMode(key as any)}
                className="flex items-center gap-2"
              >
                <span>{mode.icon}</span>
                {mode.name}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Objectifs
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chat principal */}
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        Coach {coachModes[coachMode].name}
                      </CardTitle>
                      <Badge className={coachModes[coachMode].color}>
                        {coachModes[coachMode].description}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200'
                            }`}>
                              <div className="flex items-start gap-2">
                                {message.sender === 'coach' && (
                                  <Bot className="w-4 h-4 mt-1 text-blue-600" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm">{message.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </p>
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
                          <div className="bg-white border border-gray-200 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Bot className="w-4 h-4 text-blue-600" />
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Input message */}
                    <div className="flex gap-2">
                      <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={startVoiceMessage}
                        variant="outline"
                        size="icon"
                        className={isListening ? 'bg-red-100 text-red-600' : ''}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar sujets rapides */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sujets rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickTopics.map((topic) => (
                      <Button
                        key={topic.id}
                        variant="ghost"
                        onClick={() => handleQuickTopic(topic)}
                        className="w-full justify-start text-left"
                      >
                        <span className="mr-2">{topic.icon}</span>
                        {topic.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statut aujourd'hui</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Humeur</span>
                      <Badge className="bg-green-100 text-green-800">Positive</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stress</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Modéré</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Énergie</span>
                      <Badge className="bg-blue-100 text-blue-800">Élevée</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <Card key={goal.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Échéance:</span>
                      <span className="font-medium">
                        {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <Button className="w-full" size="sm">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mettre à jour
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Profil de personnalité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {personalityInsights.map((insight, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{insight.trait}</h4>
                        <Badge variant="outline">{insight.score}/100</Badge>
                      </div>
                      <Progress value={insight.score} className="h-2" />
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium text-gray-700">Recommandations:</h5>
                        {insight.recommendations.map((rec, i) => (
                          <p key={i} className="text-xs text-gray-600">• {rec}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Évolution cette semaine
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sessions coach</span>
                        <span className="font-bold text-blue-600">+3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Objectifs atteints</span>
                        <span className="font-bold text-green-600">2/3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Humeur moyenne</span>
                        <span className="font-bold text-orange-600">+15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Suggestion du jour
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                      <p className="text-sm mb-3">
                        Basé sur votre profil, essayez une session de méditation de 10 minutes 
                        avant votre réunion importante cet après-midi.
                      </p>
                      <Button size="sm" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Programmer maintenant
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{session.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{session.topic}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bot className="w-3 h-3" />
                            {session.messages} messages
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getMoodColor(session.mood)}>
                          {session.mood === 'improved' && '📈 Amélioré'}
                          {session.mood === 'stable' && '➡️ Stable'}
                          {session.mood === 'needs_support' && '🤝 À suivre'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CCoachPage;