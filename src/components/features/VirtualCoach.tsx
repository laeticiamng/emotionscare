// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Heart, 
  Brain,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Lightbulb,
  Target,
  Compass,
  Loader2
} from 'lucide-react';
import { emotionsCareApi } from '@/services/emotions-care-api';
import { logger } from '@/lib/logger';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type: 'text' | 'suggestion' | 'exercise' | 'question';
  metadata?: {
    emotion?: string;
    confidence?: number;
    category?: string;
  };
  suggestions?: string[];
  disclaimers?: string[];
}

interface CoachPersonality {
  name: string;
  role: string;
  approach: string;
  avatar: string;
  color: string;
}

const VirtualCoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis Nyvée, votre coach émotionnel personnel. Je suis là pour vous accompagner dans votre bien-être. Comment vous sentez-vous aujourd\'hui ?',
      sender: 'coach',
      timestamp: new Date(),
      type: 'question'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const coach: CoachPersonality = {
    name: 'Nyvée',
    role: 'Coach Émotionnel IA',
    approach: 'Bienveillant & Personnalisé',
    avatar: '🤖',
    color: 'bg-gradient-to-br from-blue-500 to-purple-500'
  };

  const quickSuggestions = [
    { text: 'Je me sens stressé(e)', icon: Heart, color: 'text-red-500' },
    { text: 'J\'ai besoin de motivation', icon: Sparkles, color: 'text-yellow-500' },
    { text: 'Comment gérer l\'anxiété ?', icon: Brain, color: 'text-blue-500' },
    { text: 'Exercices de relaxation', icon: Target, color: 'text-green-500' }
  ];

  const DEFAULT_DISCLAIMERS = [
    "Le coach IA ne remplace pas un professionnel de santé.",
    "En cas d'urgence ou de détresse, contactez les services d'urgence (112 en Europe).",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Appel à l'API du coach IA
      const response = await emotionsCareApi.chatWithCoach(currentMessage, messages);
      
      const coachResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message || generateContextualResponse(currentMessage),
        sender: 'coach',
        timestamp: new Date(),
        type: response.type || 'text',
        metadata: {
          emotion: response.detectedEmotion,
          confidence: response.confidence,
          category: response.category
        },
        suggestions: response.suggestions,
        disclaimers: response.disclaimers && response.disclaimers.length > 0 ? response.disclaimers : DEFAULT_DISCLAIMERS
      };

      setMessages(prev => [...prev, coachResponse]);

      // Synthèse vocale si activée
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(coachResponse.content);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      logger.error('Erreur chat coach', error as Error, 'UI');
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Je rencontre une petite difficulté technique. Pouvez-vous réessayer ? En attendant, prenez quelques respirations profondes.',
        sender: 'coach',
        timestamp: new Date(),
        type: 'text',
        disclaimers: DEFAULT_DISCLAIMERS
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContextualResponse = (userInput: string): string => {
    const responses = {
      stress: [
        "Je comprends que vous ressentez du stress. Essayons ensemble un exercice de respiration 4-7-8 : inspirez 4 secondes, retenez 7 secondes, expirez 8 secondes.",
        "Le stress est une réaction naturelle. Vous pouvez l'apprivoiser en identifiant ses déclencheurs. Qu'est-ce qui vous stresse le plus en ce moment ?"
      ],
      anxiété: [
        "L'anxiété peut être apaisée par des techniques de ancrage. Nommez-moi 5 choses que vous voyez, 4 que vous entendez, 3 que vous touchez, 2 que vous sentez, 1 que vous goûtez.",
        "Vous n'êtes pas seul(e) face à l'anxiété. Voulez-vous que nous explorions ensemble des stratégies qui ont aidé d'autres personnes ?"
      ],
      motivation: [
        "La motivation fluctue, c'est normal ! Commençons par célébrer une petite victoire d'aujourd'hui. Même la plus petite compte.",
        "Votre motivation reviendra. En attendant, quels sont vos trois objectifs les plus importants cette semaine ?"
      ]
    };

    const input = userInput.toLowerCase();
    if (input.includes('stress')) return responses.stress[Math.floor(Math.random() * responses.stress.length)];
    if (input.includes('anxiét') || input.includes('peur')) return responses.anxiété[Math.floor(Math.random() * responses.anxiété.length)];
    if (input.includes('motiv')) return responses.motivation[Math.floor(Math.random() * responses.motivation.length)];
    
    return "Je vous écoute attentivement. Pouvez-vous me parler un peu plus de ce que vous ressentez ? Chaque émotion a son importance et mérite d'être explorée.";
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  const toggleVoiceRecognition = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulation reconnaissance vocale
      setTimeout(() => {
        setCurrentMessage("Message dictée par reconnaissance vocale");
        setIsListening(false);
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const getMessageTypeIcon = (type: string, sender: string) => {
    if (sender === 'user') return <User className="h-4 w-4" />;
    
    switch (type) {
      case 'suggestion': return <Lightbulb className="h-4 w-4" />;
      case 'exercise': return <Target className="h-4 w-4" />;
      case 'question': return <MessageCircle className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du coach */}
      <Card className="border-primary/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className={`h-16 w-16 ${coach.color} text-white text-2xl`}>
              <AvatarFallback className={coach.color}>
                {coach.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{coach.name}</CardTitle>
              <p className="text-muted-foreground">{coach.role}</p>
              <Badge variant="outline" className="mt-1">
                <Brain className="h-3 w-3 mr-1" />
                {coach.approach}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={voiceEnabled ? 'text-blue-500' : 'text-muted-foreground'}
                aria-label={voiceEnabled ? "Désactiver la voix" : "Activer la voix"}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Zone de conversation */}
      <Card className="h-96">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <Avatar className={`h-8 w-8 ${message.sender === 'coach' ? coach.color : 'bg-muted'}`}>
                    <AvatarFallback className={message.sender === 'coach' ? coach.color : 'bg-muted'}>
                      {getMessageTypeIcon(message.type, message.sender)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[70%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>

                      {message.metadata && (
                        <div className="mt-2 flex gap-1">
                          {message.metadata.emotion && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.emotion}
                            </Badge>
                          )}
                          {message.metadata.category && (
                            <Badge variant="secondary" className="text-xs">
                              {message.metadata.category}
                            </Badge>
                          )}
                        </div>
                      )}

                      {message.sender === 'coach' && message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {message.sender === 'coach' && message.disclaimers && message.disclaimers.length > 0 && (
                        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
                          <p className="mb-1 flex items-center gap-2 font-medium">
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            Avertissement important
                          </p>
                          <ul className="list-disc space-y-1 pl-4">
                            {message.disclaimers.map((disclaimer, index) => (
                              <li key={index} className="leading-snug">
                                {disclaimer}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-3">
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <Avatar className={coach.color}>
                  <AvatarFallback className={coach.color}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Suggestions rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {quickSuggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleQuickSuggestion(suggestion.text)}
            className="text-left justify-start gap-2 h-auto p-3"
          >
            <suggestion.icon className={`h-4 w-4 ${suggestion.color}`} />
            <span className="text-xs">{suggestion.text}</span>
          </Button>
        ))}
      </div>

      {/* Interface de saisie */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Textarea
              placeholder="Exprimez-vous librement... Nyvée vous écoute avec bienveillance."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={toggleVoiceRecognition}
                variant={isListening ? 'destructive' : 'outline'}
                size="icon"
                disabled={isLoading}
                aria-label={isListening ? "Arrêter l'enregistrement" : "Enregistrer un message vocal"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                size="icon"
                aria-label="Envoyer le message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Appuyez sur Entrée pour envoyer • Maj+Entrée pour une nouvelle ligne
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualCoach;