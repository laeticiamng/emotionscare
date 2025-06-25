
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Bot, User, Heart, Brain, Lightbulb, Target, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'suggestion' | 'exercise' | 'question';
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis votre coach IA personnel. Je suis là pour vous accompagner dans votre parcours de bien-être. Comment vous sentez-vous aujourd\'hui ?',
      isBot: true,
      timestamp: new Date(),
      type: 'question'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const coachModes = [
    {
      id: 'wellness',
      name: 'Coach Bien-être',
      description: 'Accompagnement personnalisé pour votre santé mentale',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      active: true
    },
    {
      id: 'productivity',
      name: 'Coach Productivité',
      description: 'Optimisez votre efficacité et votre focus',
      icon: Target,
      color: 'from-blue-500 to-purple-500',
      active: false
    },
    {
      id: 'mindfulness',
      name: 'Coach Pleine Conscience',
      description: 'Développez votre présence et votre sérénité',
      icon: Brain,
      color: 'from-green-500 to-teal-500',
      active: false
    }
  ];

  const quickSuggestions = [
    'Je me sens stressé au travail',
    'J\'ai du mal à me concentrer',
    'Comment mieux gérer mes émotions ?',
    'Techniques de relaxation rapide',
    'Améliorer ma confiance en moi'
  ];

  const coachingTopics = [
    {
      title: 'Gestion du Stress',
      description: 'Techniques et stratégies pour réduire le stress',
      sessions: 12,
      duration: '15-20 min',
      icon: '🧘‍♀️'
    },
    {
      title: 'Confiance en Soi',
      description: 'Renforcer l\'estime de soi et l\'assurance',
      sessions: 8,
      duration: '10-15 min',
      icon: '💪'
    },
    {
      title: 'Relations Interpersonnelles',
      description: 'Améliorer la communication et les relations',
      sessions: 10,
      duration: '20-25 min',
      icon: '🤝'
    },
    {
      title: 'Équilibre Vie-Travail',
      description: 'Trouver l\'harmonie entre vie pro et perso',
      sessions: 6,
      duration: '25-30 min',
      icon: '⚖️'
    }
  ];

  const recentSessions = [
    { date: 'Aujourd\'hui', topic: 'Gestion de l\'anxiété', duration: '18 min', rating: 5 },
    { date: 'Hier', topic: 'Techniques de respiration', duration: '12 min', rating: 4 },
    { date: 'Il y a 2 jours', topic: 'Confiance au travail', duration: '22 min', rating: 5 },
    { date: 'Il y a 3 jours', topic: 'Méditation guidée', duration: '15 min', rating: 4 }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler la réponse du coach IA
    setTimeout(() => {
      const botResponse = generateCoachResponse(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse.content,
        isBot: true,
        timestamp: new Date(),
        type: botResponse.type
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateCoachResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('stress') || input.includes('anxieux') || input.includes('tendu')) {
      return {
        content: 'Je comprends que vous ressentez du stress. C\'est une réaction naturelle, mais nous pouvons travailler ensemble pour la gérer. Essayons un exercice de respiration : inspirez profondément pendant 4 secondes, retenez pendant 4 secondes, puis expirez pendant 6 secondes. Répétez cela 5 fois. Comment vous sentez-vous après ?',
        type: 'exercise' as const
      };
    }
    
    if (input.includes('confiance') || input.includes('estime') || input.includes('doute')) {
      return {
        content: 'La confiance en soi se construit petit à petit. Pouvez-vous me parler d\'un accomplissement récent, même petit, dont vous êtes fier ? Reconnaître nos réussites est le premier pas vers une meilleure estime de soi.',
        type: 'question' as const
      };
    }
    
    if (input.includes('travail') || input.includes('bureau') || input.includes('collègue')) {
      return {
        content: 'Les défis professionnels peuvent être sources de stress. Avez-vous identifié ce qui vous préoccupe le plus dans votre environnement de travail ? Est-ce la charge de travail, les relations, ou autre chose ?',
        type: 'question' as const
      };
    }

    return {
      content: 'Je vous écoute et je suis là pour vous aider. Pouvez-vous me donner plus de détails sur ce que vous ressentez ? Plus vous partagez, mieux je peux vous accompagner.',
      type: 'question' as const
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coach IA Personnel</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre accompagnateur intelligent pour un bien-être optimal et une croissance personnelle
          </p>
        </motion.div>

        <Tabs defaultValue="chat" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="chat">Coaching</TabsTrigger>
            <TabsTrigger value="programs">Programmes</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="progress">Progrès</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Coach Modes */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Modes de Coaching</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {coachModes.map((mode) => (
                      <div
                        key={mode.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          mode.active 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <mode.icon className={`h-5 w-5 mr-2 ${
                            mode.active ? 'text-indigo-600' : 'text-gray-600'
                          }`} />
                          <span className="font-semibold text-sm">{mode.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{mode.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Suggestions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-indigo-600" />
                      Session de Coaching
                    </CardTitle>
                    <CardDescription>
                      Partagez vos préoccupations et recevez des conseils personnalisés
                    </CardDescription>
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
                            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                          >
                            <div className={`max-w-[80%] ${
                              message.isBot 
                                ? 'bg-indigo-100 text-indigo-900' 
                                : 'bg-blue-500 text-white'
                            } rounded-lg p-3`}>
                              <div className="flex items-start space-x-2">
                                {message.isBot && (
                                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                )}
                                {!message.isBot && (
                                  <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm">{message.content}</p>
                                  {message.type && (
                                    <Badge className="mt-2 text-xs" variant="secondary">
                                      {message.type === 'exercise' && <Heart className="h-3 w-3 mr-1" />}
                                      {message.type === 'suggestion' && <Lightbulb className="h-3 w-3 mr-1" />}
                                      {message.type === 'question' && <Brain className="h-3 w-3 mr-1" />}
                                      {message.type}
                                    </Badge>
                                  )}
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
                          <div className="bg-indigo-100 text-indigo-900 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Bot className="h-4 w-4" />
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Partagez vos pensées..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                        disabled={isTyping}
                      />
                      <Button 
                        onClick={() => sendMessage(inputMessage)}
                        disabled={isTyping || !inputMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="programs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coachingTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{topic.icon}</span>
                          <div>
                            <CardTitle className="text-lg">{topic.title}</CardTitle>
                            <CardDescription>{topic.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>{topic.sessions} sessions</span>
                        <span>{topic.duration} par session</span>
                      </div>
                      <Button className="w-full">Commencer le Programme</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Sessions Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{session.topic}</h3>
                        <p className="text-sm text-gray-600">{session.date} • {session.duration}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < session.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="ml-4">
                          Revoir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Votre Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">24</div>
                        <div className="text-sm text-gray-600">Sessions Complétées</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">78%</div>
                        <div className="text-sm text-gray-600">Objectifs Atteints</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">15</div>
                      <div className="text-sm text-gray-600">Jours Consécutifs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Domaines d'Amélioration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { skill: 'Gestion du stress', progress: 85 },
                      { skill: 'Confiance en soi', progress: 72 },
                      { skill: 'Communication', progress: 68 },
                      { skill: 'Équilibre vie-travail', progress: 91 }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{item.skill}</span>
                          <span className="font-semibold">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoachPage;
