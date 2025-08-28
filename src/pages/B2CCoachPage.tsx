import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Mic, MicOff, Bot, User, Heart, 
         Brain, Target, Lightbulb, BookOpen, Clock, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'exercise';
}

interface CoachSession {
  id: string;
  title: string;
  date: string;
  duration: string;
  topic: string;
  messages: number;
}

const B2CCoachPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [coachMode, setCoachMode] = useState<'empathetic' | 'motivational' | 'analytical'>('empathetic');
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
      messages: 18
    },
    {
      id: '2',
      title: 'Améliorer ma confiance',
      date: 'Hier',
      duration: '30 min',
      topic: 'Confiance',
      messages: 22
    },
    {
      id: '3',
      title: 'Équilibre vie pro/perso',
      date: 'Il y a 2 jours',
      duration: '20 min',
      topic: 'Équilibre',
      messages: 15
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
          timestamp: new Date()
        },
        {
          id: '2',
          content: 'Comment vous sentez-vous aujourd\'hui ? Y a-t-il quelque chose de particulier dont vous aimeriez parler ?',
          sender: 'coach',
          timestamp: new Date()
        }
      ];
      setMessages(welcomeMessages);
    }
  }, []);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (content: string = currentMessage) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulation de réponse du coach
    setTimeout(() => {
      const coachResponse = generateCoachResponse(content);
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: coachResponse,
        sender: 'coach',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateCoachResponse = (userMessage: string): string => {
    const responses = {
      empathetic: [
        "Je comprends que ce soit difficile pour vous. Vos sentiments sont tout à fait valides.",
        "Merci de partager cela avec moi. Comment puis-je vous soutenir davantage ?",
        "C'est courageux de votre part d'exprimer ces émotions. Vous n'êtes pas seul(e) dans cette situation.",
        "Je sens que c'est important pour vous. Prenez votre temps pour me raconter.",
      ],
      motivational: [
        "Vous avez déjà fait un grand pas en reconnaissant cette situation ! C'est le début du changement.",
        "Je crois en votre capacité à surmonter cela. Quels sont vos points forts sur lesquels nous pouvons nous appuyer ?",
        "Chaque défi est une opportunité de grandir. Comment pourriez-vous transformer cette difficulté en force ?",
        "Vous êtes plus resilient(e) que vous ne le pensez. Rappelons-nous vos succès passés.",
      ],
      analytical: [
        "Analysons cette situation ensemble. Quels sont les facteurs principaux qui contribuent à ce problème ?",
        "Identifions les solutions concrètes. Quelles options avez-vous déjà envisagées ?",
        "Établissons un plan d'action étape par étape. Quelle serait la première action réalisable ?",
        "Examinons les causes et effets. Y a-t-il des schémas récurrents que vous avez remarqués ?",
      ]
    };

    const modeResponses = responses[coachMode];
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  };

  const startVoiceInput = () => {
    setIsListening(!isListening);
    // Ici on intégrerait l'API de reconnaissance vocale
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setCurrentMessage("Message vocal transcrit automatiquement");
      }, 3000);
    }
  };

  const handleQuickTopic = (topic: string) => {
    const topicMessages = {
      stress: "Je me sens stressé(e) en ce moment et j'aimerais apprendre à mieux gérer cette situation.",
      motivation: "J'ai du mal à rester motivé(e) ces derniers temps. Pouvez-vous m'aider à retrouver ma motivation ?",
      relationships: "J'ai des difficultés dans mes relations personnelles et j'aimerais en parler.",
      work: "Mon environnement de travail me pose des défis et j'aimerais des conseils.",
      sleep: "J'ai des problèmes de sommeil qui affectent mon bien-être quotidien.",
      confidence: "Je manque de confiance en moi et j'aimerais travailler sur cet aspect."
    };
    
    sendMessage(topicMessages[topic as keyof typeof topicMessages]);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/b2c/dashboard')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coach IA Personnel</h1>
              <p className="text-gray-600">Accompagnement personnalisé pour votre bien-être</p>
            </div>
          </div>
          
          {/* Sélecteur de mode du coach */}
          <div className="flex gap-2">
            {Object.entries(coachModes).map(([mode, config]) => (
              <Button
                key={mode}
                variant={coachMode === mode ? "default" : "outline"}
                onClick={() => setCoachMode(mode as any)}
                className="flex flex-col items-center gap-1 h-auto py-2 px-3"
                size="sm"
              >
                <span className="text-lg">{config.icon}</span>
                <span className="text-xs">{config.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone de chat principale */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Coach {coachModes[coachMode].name}
                  </CardTitle>
                  <Badge className={`${coachModes[coachMode].color} text-white`}>
                    En ligne
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{coachModes[coachMode].description}</p>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-start gap-2 mb-2">
                        {message.sender === 'coach' ? (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.sender === 'coach' ? 'Coach IA' : 'Vous'}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-xs opacity-50 mt-2 block">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span className="text-sm text-gray-600">Le coach est en train d'écrire...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              
              {/* Zone de saisie */}
              <div className="border-t p-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Tapez votre message ici..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="resize-none"
                    />
                  </div>
                  <Button
                    onClick={startVoiceInput}
                    variant="outline"
                    size="sm"
                    className={isListening ? 'bg-red-100 border-red-300' : ''}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button onClick={() => sendMessage()} disabled={!currentMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Sujets rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Sujets rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {quickTopics.map((topic) => (
                    <Button
                      key={topic.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickTopic(topic.id)}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <span className="text-lg">{topic.icon}</span>
                      <span className="text-xs text-center leading-tight">{topic.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions d'exercices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Exercices suggérés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'Respiration 4-7-8', duration: '5 min', type: 'Relaxation' },
                  { title: 'Gratitude quotidienne', duration: '3 min', type: 'Mindfulness' },
                  { title: 'Scan corporel', duration: '10 min', type: 'Méditation' }
                ].map((exercise, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{exercise.title}</h4>
                      <Badge variant="secondary" className="text-xs">{exercise.type}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {exercise.duration}
                    </div>
                    <Button size="sm" variant="ghost" className="w-full mt-2 text-xs">
                      Commencer l'exercice
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sessions récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Sessions récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm line-clamp-1">{session.title}</h4>
                      <Button variant="ghost" size="sm" className="w-5 h-5 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>{session.date} • {session.duration}</div>
                      <div>{session.messages} messages • Sujet: {session.topic}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Vos progrès
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">15</div>
                  <div className="text-xs text-gray-600">Sessions complétées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">8h 23min</div>
                  <div className="text-xs text-gray-600">Temps d'accompagnement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">73%</div>
                  <div className="text-xs text-gray-600">Amélioration bien-être</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CCoachPage;