import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle,
  Mic,
  MicOff,
  Brain,
  Heart,
  Sparkles,
  Send,
  User,
  Bot,
  Activity,
  Target,
  TrendingUp,
  Zap,
  Eye,
  Lightbulb,
  Compass,
  Star,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Camera,
  Monitor,
  Headphones,
  Settings,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TypewriterEffect from '@/components/chat/TypewriterEffect';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotionalTone?: string;
  biometricContext?: {
    heartRate: number;
    stress: number;
    mood: string;
  };
  aiInsights?: string[];
  suggestedActions?: string[];
  voiceNote?: {
    duration: number;
    isPlaying: boolean;
  };
}

interface CoachPersonality {
  id: string;
  name: string;
  avatar: string;
  description: string;
  speciality: string;
  tone: 'empathetic' | 'motivational' | 'analytical' | 'gentle';
  color: string;
}

interface SessionMetrics {
  duration: number;
  messagesExchanged: number;
  emotionalShift: number;
  insightsGenerated: number;
  actionItemsCreated: number;
}

const EnhancedCoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachPersonality | null>(null);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    duration: 0,
    messagesExchanged: 0,
    emotionalShift: 0,
    insightsGenerated: 0,
    actionItemsCreated: 0
  });
  const [biometrics, setBiometrics] = useState({
    heartRate: 72,
    stress: 35,
    mood: 'neutral',
    engagement: 75
  });
  const [coachMode, setCoachMode] = useState<'chat' | 'voice' | 'video'>('chat');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const coachPersonalities: CoachPersonality[] = [
    {
      id: 'emma',
      name: 'Emma',
      avatar: '👩‍💼',
      description: 'Coach empathique spécialisée dans l\'écoute active',
      speciality: 'Gestion émotionnelle',
      tone: 'empathetic',
      color: 'from-pink-400 to-rose-600'
    },
    {
      id: 'alex',
      name: 'Alex',
      avatar: '👨‍🏫',
      description: 'Motivateur énergique axé sur l\'action et les résultats',
      speciality: 'Développement personnel',
      tone: 'motivational',
      color: 'from-blue-400 to-cyan-600'
    },
    {
      id: 'sophia',
      name: 'Sophia',
      avatar: '👩‍🔬',
      description: 'Analyste comportementale basée sur les données',
      speciality: 'Analyse comportementale',
      tone: 'analytical',
      color: 'from-purple-400 to-indigo-600'
    },
    {
      id: 'zen',
      name: 'Zen',
      avatar: '🧘‍♀️',
      description: 'Guide spirituel pour la paix intérieure',
      speciality: 'Méditation & Mindfulness',
      tone: 'gentle',
      color: 'from-green-400 to-emerald-600'
    }
  ];

  // Simulation mise à jour biométriques
  useEffect(() => {
    if (isSessionActive) {
      const interval = setInterval(() => {
        setBiometrics(prev => ({
          heartRate: Math.max(60, prev.heartRate + (Math.random() - 0.5) * 4),
          stress: Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.6) * 5)),
          mood: prev.mood,
          engagement: Math.min(100, prev.engagement + (Math.random() - 0.3) * 3)
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isSessionActive]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSession = (coach: CoachPersonality) => {
    setSelectedCoach(coach);
    setIsSessionActive(true);
    
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}`,
      content: getWelcomeMessage(coach),
      sender: 'ai',
      timestamp: new Date(),
      emotionalTone: coach.tone,
      aiInsights: [`Votre session avec ${coach.name} commence maintenant`]
    };
    
    setMessages([welcomeMessage]);
    
    toast({
      title: `Session avec ${coach.name}`,
      description: `Votre coach ${coach.speciality.toLowerCase()} est maintenant disponible`
    });
  };

  const getWelcomeMessage = (coach: CoachPersonality): string => {
    const welcomes = {
      empathetic: "Bonjour ! Je suis Emma, votre coach empathique. Je suis là pour vous écouter et vous accompagner dans vos émotions. Comment vous sentez-vous aujourd'hui ?",
      motivational: "Salut ! C'est Alex ! Prêt à donner le meilleur de vous-même ? Je suis là pour vous motiver et vous aider à atteindre vos objectifs. Qu'est-ce qui vous préoccupe ?",
      analytical: "Bonjour, je suis Sophia. En tant qu'analyste comportementale, je vais vous aider à comprendre vos patterns et optimiser votre bien-être. Partagez-moi vos observations.",
      gentle: "Namaste, je suis Zen, votre guide spirituel. Prenons un moment pour respirer ensemble et explorer votre état intérieur. Que ressent votre cœur en ce moment ?"
    };
    return welcomes[coach.tone];
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !selectedCoach) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      biometricContext: { ...biometrics }
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsAiTyping(true);

    // Simulation réponse IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage, selectedCoach, biometrics);
      setMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
      
      // Mise à jour métriques
      setSessionMetrics(prev => ({
        ...prev,
        messagesExchanged: prev.messagesExchanged + 2,
        insightsGenerated: prev.insightsGenerated + (aiResponse.aiInsights?.length || 0),
        actionItemsCreated: prev.actionItemsCreated + (aiResponse.suggestedActions?.length || 0)
      }));
    }, 2000);
  };

  const generateAIResponse = (userInput: string, coach: CoachPersonality, biometrics: any): Message => {
    const responses = {
      empathetic: [
        "Je comprends ce que vous ressentez. Vos émotions sont importantes et valides.",
        "Merci de partager cela avec moi. Comment puis-je vous accompagner ?",
        "Je sens que c'est quelque chose d'important pour vous. Explorons ensemble."
      ],
      motivational: [
        "C'est fantastique que vous abordez ce sujet ! Vous avez déjà fait le premier pas.",
        "Je vois votre potentiel ! Transformons ce défi en opportunité de croissance.",
        "Excellent ! Votre motivation transparaît. Quels sont vos objectifs ?"
      ],
      analytical: [
        "Intéressant. Analysons les données de votre état actuel pour optimiser votre approche.",
        "Vos métriques biométriques indiquent... Explorons les patterns comportementaux.",
        "Basé sur vos informations, je recommande une approche structurée."
      ],
      gentle: [
        "Respirons ensemble un moment... Je sens votre besoin de paix intérieure.",
        "Votre âme communique quelque chose d'important. Écoutons-la ensemble.",
        "Dans cette turbulence, trouvons votre centre de sérénité."
      ]
    };

    const insights = {
      empathetic: [
        "Votre vulnérabilité est une force, pas une faiblesse",
        "Vous montrez une belle capacité d'introspection",
        "Vos émotions sont des guides précieux"
      ],
      motivational: [
        "Votre détermination va vous mener loin",
        "Chaque obstacle est une opportunité déguisée",
        "Vous avez tout le potentiel pour réussir"
      ],
      analytical: [
        `Votre niveau de stress (${biometrics.stress}%) suggère des ajustements`,
        "Les patterns comportementaux révèlent des opportunités d'optimisation",
        "Vos métriques montrent une progression positive"
      ],
      gentle: [
        "Votre âme cherche l'harmonie et l'équilibre",
        "La paix intérieure commence par l'acceptation",
        "Votre sagesse intérieure connaît le chemin"
      ]
    };

    const actions = {
      empathetic: [
        "Prenez un moment pour honorer vos sentiments",
        "Pratiquez l'auto-compassion aujourd'hui",
        "Écrivez dans votre journal sur cette expérience"
      ],
      motivational: [
        "Définissez 3 actions concrètes à entreprendre cette semaine",
        "Célébrez vos victoires, même les petites",
        "Visualisez votre réussite pendant 5 minutes"
      ],
      analytical: [
        "Collectez des données sur vos habitudes pendant 7 jours",
        "Analysez vos patterns de stress et d'énergie",
        "Testez une nouvelle stratégie d'optimisation"
      ],
      gentle: [
        "Méditez 10 minutes au coucher du soleil",
        "Pratiquez la respiration consciente",
        "Connectez-vous avec la nature aujourd'hui"
      ]
    };

    return {
      id: `msg_${Date.now() + 1}`,
      content: responses[coach.tone][Math.floor(Math.random() * responses[coach.tone].length)],
      sender: 'ai',
      timestamp: new Date(),
      emotionalTone: coach.tone,
      aiInsights: [insights[coach.tone][Math.floor(Math.random() * insights[coach.tone].length)]],
      suggestedActions: [actions[coach.tone][Math.floor(Math.random() * actions[coach.tone].length)]]
    };
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Enregistrement vocal démarré",
        description: "Parlez naturellement, votre coach vous écoute"
      });
      
      // Simulation transcription
      setTimeout(() => {
        setCurrentMessage("J'ai besoin d'aide pour gérer mon stress au travail. Je me sens dépassé par toutes mes responsabilités...");
        setIsRecording(false);
        toast({
          title: "Message vocal transcrit",
          description: "Votre message a été converti en texte"
        });
      }, 3000);
    }
  };

  const CoachSelector: React.FC = () => (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Choisissez votre Coach IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {coachPersonalities.map(coach => (
            <motion.div
              key={coach.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={() => startSession(coach)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${coach.color} flex items-center justify-center text-2xl`}>
                      {coach.avatar}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{coach.name}</h3>
                      <Badge variant="outline">{coach.speciality}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {coach.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ChatInterface: React.FC = () => (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Zone de chat */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${selectedCoach?.color} flex items-center justify-center`}>
                  {selectedCoach?.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedCoach?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCoach?.speciality}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Mode sélecteur */}
                <Button
                  variant={coachMode === 'chat' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCoachMode('chat')}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant={coachMode === 'voice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCoachMode('voice')}
                >
                  <Headphones className="h-4 w-4" />
                </Button>
                <Button
                  variant={coachMode === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCoachMode('video')}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 pr-2">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar>
                    <AvatarFallback>
                      {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[70%] space-y-2 ${message.sender === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-4 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted'
                    }`}>
                      <p>{message.content}</p>
                    </div>
                    
                    {/* Insights IA */}
                    {message.aiInsights && message.aiInsights.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Insight</span>
                        </div>
                        {message.aiInsights.map((insight, index) => (
                          <p key={index} className="text-sm">{insight}</p>
                        ))}
                      </div>
                    )}
                    
                    {/* Actions suggérées */}
                    {message.suggestedActions && message.suggestedActions.length > 0 && (
                      <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Action recommandée</span>
                        </div>
                        {message.suggestedActions.map((action, index) => (
                          <p key={index} className="text-sm">{action}</p>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* IA en train de taper */}
              {isAiTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Avatar>
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Zone de saisie */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Textarea
                  ref={textareaRef}
                  placeholder={`Partagez vos pensées avec ${selectedCoach?.name}...`}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1 min-h-[80px] resize-none"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    onClick={toggleRecording}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isAiTyping}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {isRecording && (
                <div className="flex items-center gap-2 text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Enregistrement en cours... Parlez naturellement</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Panneau latéral */}
      <div className="space-y-4">
        {/* Biométrie temps réel */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              État Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <Heart className="h-6 w-6 text-red-500 mx-auto mb-1" />
                <div className="text-lg font-bold">{biometrics.heartRate}</div>
                <p className="text-xs text-muted-foreground">BPM</p>
              </div>
              <div>
                <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-lg font-bold">{biometrics.stress}%</div>
                <p className="text-xs text-muted-foreground">Stress</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Engagement</span>
                <span>{biometrics.engagement}%</span>
              </div>
              <Progress value={biometrics.engagement} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        {/* Métriques de session */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Métriques Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{sessionMetrics.messagesExchanged} messages</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>{sessionMetrics.insightsGenerated} insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>{sessionMetrics.actionItemsCreated} actions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(sessionMetrics.duration / 60)} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions rapides */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              Définir un objectif
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Exercice de gratitude
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Bilan de progression
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-pink-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Coach IA Émotionnel
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Votre compagnon d'intelligence artificielle pour le développement personnel et le bien-être émotionnel
          </p>
        </motion.div>

        {/* Contenu principal */}
        <AnimatePresence mode="wait">
          {!isSessionActive ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CoachSelector />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedCoachPage;