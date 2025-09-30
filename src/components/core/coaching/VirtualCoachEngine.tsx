// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Mic, 
  MicOff,
  Send,
  Brain,
  Heart,
  Lightbulb,
  Clock,
  Settings,
  Volume2,
  VolumeX,
  User,
  Bot,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type: 'text' | 'voice' | 'system';
  emotion?: string;
  confidence?: number;
  suggestions?: string[];
  context?: {
    mood: string;
    energy: number;
    stress: number;
  };
}

interface CoachPersonality {
  id: string;
  name: string;
  description: string;
  traits: string[];
  avatar: string;
  voice: 'empathetic' | 'energetic' | 'calm' | 'professional';
  specialties: string[];
}

interface VirtualCoachEngineProps {
  initialPersonality?: string;
  userName?: string;
  contextualMode?: boolean;
  voiceEnabled?: boolean;
  emotionTracking?: boolean;
  onConversationUpdate?: (messages: ChatMessage[]) => void;
}

/**
 * Moteur de coaching virtuel IA avancé
 * Assistant thérapeutique intelligent avec personnalité adaptative
 */
const VirtualCoachEngine: React.FC<VirtualCoachEngineProps> = ({
  initialPersonality = 'nyvee',
  userName = 'utilisateur',
  contextualMode = true,
  voiceEnabled = true,
  emotionTracking = true,
  onConversationUpdate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCoachTyping, setIsCoachTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState<CoachPersonality | null>(null);
  const [voiceVolume, setVoiceVolume] = useState(true);
  const [conversationContext, setConversationContext] = useState({
    mood: 'neutre',
    energy: 50,
    stress: 30,
    sessionGoals: [] as string[]
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Personnalités de coach disponibles
  const availablePersonalities: CoachPersonality[] = [
    {
      id: 'nyvee',
      name: 'Nyvée',
      description: 'Coach empathique spécialisée en bien-être émotionnel',
      traits: ['Empathique', 'Bienveillante', 'Intuitive', 'Patiente'],
      avatar: '🌸',
      voice: 'empathetic',
      specialties: ['Gestion du stress', 'Intelligence émotionnelle', 'Mindfulness']
    },
    {
      id: 'marcus',
      name: 'Marcus',
      description: 'Coach énergique axé sur la motivation et performance',
      traits: ['Motivant', 'Dynamique', 'Orienté résultats', 'Encourageant'],
      avatar: '⚡',
      voice: 'energetic',
      specialties: ['Motivation', 'Objectifs', 'Performance', 'Résilience']
    },
    {
      id: 'sophia',
      name: 'Sophia',
      description: 'Thérapeute professionnelle pour accompagnement clinique',
      traits: ['Professionnelle', 'Analytique', 'Structurée', 'Précise'],
      avatar: '🧠',
      voice: 'professional',
      specialties: ['Thérapie cognitive', 'Anxiété', 'Dépression', 'Trauma']
    },
    {
      id: 'zen',
      name: 'Zen',
      description: 'Maître de méditation pour équilibre et sérénité',
      traits: ['Calme', 'Sage', 'Équilibré', 'Présent'],
      avatar: '🧘',
      voice: 'calm',
      specialties: ['Méditation', 'Pleine conscience', 'Équilibre', 'Spiritualité']
    }
  ];

  // Initialisation du coach
  useEffect(() => {
    const personality = availablePersonalities.find(p => p.id === initialPersonality) || availablePersonalities[0];
    setCurrentPersonality(personality);
    
    // Message de bienvenue personnalisé
    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: generateWelcomeMessage(personality, userName),
      sender: 'coach',
      timestamp: new Date(),
      type: 'text',
      context: conversationContext
    };
    
    setMessages([welcomeMessage]);
  }, [initialPersonality, userName]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Notification des mises à jour de conversation
  useEffect(() => {
    onConversationUpdate?.(messages);
  }, [messages, onConversationUpdate]);

  // Configuration reconnaissance vocale
  useEffect(() => {
    if (voiceEnabled && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'fr-FR';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [voiceEnabled]);

  const generateWelcomeMessage = (personality: CoachPersonality, userName: string): string => {
    const welcomeMessages = {
      nyvee: `Bonjour ${userName} ! Je suis Nyvée, votre coach en bien-être émotionnel. Je suis là pour vous accompagner avec bienveillance dans votre parcours. Comment vous sentez-vous aujourd'hui ? 🌸`,
      marcus: `Salut ${userName} ! Marcus à votre service ! 💪 Prêt à débloquer votre potentiel et atteindre vos objectifs ? Dites-moi ce qui vous motive aujourd'hui !`,
      sophia: `Bonjour ${userName}. Je suis Sophia, thérapeute professionnelle. Mon approche est structurée et bienveillante. Quel aspect de votre bien-être souhaitez-vous explorer aujourd'hui ?`,
      zen: `Namaste ${userName} 🙏 Je suis Zen, votre guide vers l'équilibre intérieur. Prenons un moment pour nous connecter à l'instant présent. Qu'est-ce qui occupe votre esprit aujourd'hui ?`
    };
    
    return welcomeMessages[personality.id as keyof typeof welcomeMessages] || `Bonjour ${userName} ! Comment puis-je vous aider aujourd'hui ?`;
  };

  const analyzeUserMessage = useCallback((message: string): {
    emotion: string;
    confidence: number;
    suggestions: string[];
  } => {
    // Simulation d'analyse IA avancée
    const emotions = ['joie', 'tristesse', 'anxiété', 'colère', 'frustration', 'espoir', 'confusion'];
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    const suggestions = generateContextualSuggestions(detectedEmotion, message);
    
    return {
      emotion: detectedEmotion,
      confidence: 0.75 + Math.random() * 0.24,
      suggestions
    };
  }, []);

  const generateContextualSuggestions = (emotion: string, message: string): string[] => {
    const suggestionMap: Record<string, string[]> = {
      'anxiété': [
        'Technique de respiration 4-7-8',
        'Exercice d\'ancrage 5-4-3-2-1',
        'Méditation guidée de 5 minutes'
      ],
      'tristesse': [
        'Journal de gratitude',
        'Connexion avec un proche',
        'Activité créative apaisante'
      ],
      'colère': [
        'Pause de 10 minutes',
        'Exercice physique modéré',
        'Technique de communication non-violente'
      ],
      'confusion': [
        'Cartographie mentale de la situation',
        'Priorisation des préoccupations',
        'Conversation avec un mentor'
      ]
    };
    
    return suggestionMap[emotion] || [
      'Prise de recul et observation',
      'Pratique de l\'auto-compassion',
      'Définition d\'objectifs courts termes'
    ];
  };

  const generateCoachResponse = useCallback(async (
    userMessage: string, 
    analysis: ReturnType<typeof analyzeUserMessage>,
    personality: CoachPersonality
  ): Promise<string> => {
    // Simulation de génération IA contextuelle
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responsePatterns = {
      nyvee: {
        empathetic: [
          `Je comprends que vous ressentez de la ${analysis.emotion}. C'est tout à fait naturel et valide. `,
          `Merci de partager cela avec moi. Vos émotions sont importantes et méritent d'être entendues. `,
          `Je sens que cette situation vous touche profondément. Prenons le temps d'explorer cela ensemble. `
        ],
        supportive: [
          `Vous avez déjà fait un grand pas en exprimant cela. Je suis fière de votre courage. `,
          `Votre prise de conscience est remarquable. Continuons à construire sur cette base solide. `,
          `Chaque étape de votre parcours compte, même les plus petites. Célébrons vos progrès. `
        ]
      },
      marcus: {
        motivational: [
          `Excellente attitude ${userName} ! Cette ${analysis.emotion} peut devenir votre force motrice ! `,
          `J'aime votre honnêteté ! C'est exactement cette lucidité qui va vous propulser vers le succès ! `,
          `Fantastique ! Vous venez d'identifier une opportunité de croissance personnelle ! `
        ],
        action_oriented: [
          `Maintenant, passons à l'action ! Voici ce que je vous propose : `,
          `Transformons cette énergie en mouvement positif ! Êtes-vous prêt pour un défi ? `,
          `Perfect ! Établissons un plan concret pour canaliser cette motivation ! `
        ]
      }
    };
    
    // Sélection de réponse selon la personnalité
    const personalityResponses = responsePatterns[personality.id as keyof typeof responsePatterns];
    if (personalityResponses) {
      const category = Object.keys(personalityResponses)[Math.floor(Math.random() * Object.keys(personalityResponses).length)];
      const patterns = personalityResponses[category as keyof typeof personalityResponses];
      const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
      
      // Ajout de suggestions contextuelles
      const suggestions = analysis.suggestions.slice(0, 2).map((s, i) => 
        i === 0 ? `${s}` : `ou ${s.toLowerCase()}`
      ).join(' ');
      
      return `${selectedPattern}\n\nVoici quelques pistes que nous pourrions explorer : ${suggestions}.\n\nQue pensez-vous de ces approches ?`;
    }
    
    return `Je comprends votre situation concernant ${analysis.emotion}. Comment aimeriez-vous aborder cela ?`;
  }, [userName]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentPersonality) return;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsCoachTyping(true);
    
    // Analyse du message utilisateur
    const analysis = analyzeUserMessage(inputMessage);
    
    // Mise à jour du contexte conversationnel
    if (emotionTracking) {
      setConversationContext(prev => ({
        ...prev,
        mood: analysis.emotion,
        stress: analysis.emotion === 'anxiété' ? Math.min(prev.stress + 10, 100) : Math.max(prev.stress - 5, 0),
        energy: analysis.emotion === 'joie' ? Math.min(prev.energy + 10, 100) : prev.energy
      }));
    }
    
    // Génération de réponse du coach
    const coachResponse = await generateCoachResponse(inputMessage, analysis, currentPersonality);
    
    const coachMessage: ChatMessage = {
      id: `msg-${Date.now()}-coach`,
      content: coachResponse,
      sender: 'coach',
      timestamp: new Date(),
      type: 'text',
      emotion: analysis.emotion,
      confidence: analysis.confidence,
      suggestions: analysis.suggestions,
      context: conversationContext
    };
    
    setMessages(prev => [...prev, coachMessage]);
    setIsCoachTyping(false);
    
    // Synthèse vocale si activée
    if (voiceEnabled && voiceVolume) {
      speakMessage(coachResponse);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Arrêter toute synthèse en cours
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = currentPersonality?.voice === 'calm' ? 0.8 : 1;
      
      speechSynthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceRecording = () => {
    if (!isRecording && recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const changePersonality = (personalityId: string) => {
    const personality = availablePersonalities.find(p => p.id === personalityId);
    if (personality) {
      setCurrentPersonality(personality);
      
      const transitionMessage: ChatMessage = {
        id: `msg-${Date.now()}-system`,
        content: `${personality.name} a rejoint la conversation. ${generateWelcomeMessage(personality, userName)}`,
        sender: 'coach',
        timestamp: new Date(),
        type: 'system',
        context: conversationContext
      };
      
      setMessages(prev => [...prev, transitionMessage]);
    }
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start gap-3 max-w-[80%] ${
        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          message.sender === 'user' 
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        }`}>
          {message.sender === 'user' ? (
            <User className="h-4 w-4" />
          ) : (
            currentPersonality?.avatar || <Bot className="h-4 w-4" />
          )}
        </div>
        
        {/* Message content */}
        <div className={`rounded-2xl px-4 py-3 ${
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground'
            : message.type === 'system'
            ? 'bg-muted border border-border'
            : 'bg-background border border-border shadow-sm'
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
          
          {/* Metadata */}
          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {message.emotion && (
              <Badge variant="secondary" className="text-xs">
                {message.emotion}
              </Badge>
            )}
            {message.confidence && (
              <span>{Math.round(message.confidence * 100)}%</span>
            )}
          </div>
          
          {/* Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-medium opacity-80">Suggestions:</div>
              <div className="flex flex-wrap gap-1">
                {message.suggestions.map((suggestion, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header avec sélection de personnalité */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="text-2xl">{currentPersonality?.avatar}</div>
              <div>
                <div className="text-xl">{currentPersonality?.name}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {currentPersonality?.description}
                </div>
              </div>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {contextualMode && (
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    <Heart className="h-3 w-3 mr-1" />
                    {conversationContext.mood}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {conversationContext.energy}%
                  </Badge>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVoiceVolume(!voiceVolume)}
              >
                {voiceVolume ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Sélecteur de personnalité */}
          <div className="flex gap-2 mt-4">
            {availablePersonalities.map((personality) => (
              <Button
                key={personality.id}
                variant={currentPersonality?.id === personality.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => changePersonality(personality.id)}
                className="flex items-center gap-2"
              >
                <span>{personality.avatar}</span>
                {personality.name}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Chat interface */}
      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </AnimatePresence>
              
              {/* Coach typing indicator */}
              {isCoachTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm">
                      {currentPersonality?.avatar}
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Exprimez-vous librement... Comment vous sentez-vous ?"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="resize-none min-h-[40px] max-h-[120px]"
                  disabled={isCoachTyping}
                />
              </div>
              
              <div className="flex gap-2">
                {voiceEnabled && (
                  <Button
                    variant={isRecording ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={toggleVoiceRecording}
                    disabled={isCoachTyping}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isCoachTyping}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="flex gap-2 mt-3">
              {['Comment je me sens', 'J\'ai besoin d\'aide', 'Définir un objectif', 'Méditation guidée'].map((quickMessage) => (
                <Button
                  key={quickMessage}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputMessage(quickMessage);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  disabled={isCoachTyping}
                  className="text-xs"
                >
                  {quickMessage}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualCoachEngine;