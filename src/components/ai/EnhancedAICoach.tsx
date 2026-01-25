import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Brain, 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Lightbulb,
  Heart,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
  confidence?: number;
  suggestions?: string[];
}

interface AIPersonality {
  name: string;
  avatar: string;
  specialty: string;
  description: string;
  color: string;
}

const AI_PERSONALITIES: AIPersonality[] = [
  {
    name: "Luna",
    avatar: "🌙",
    specialty: "Bien-être émotionnel",
    description: "Experte en gestion des émotions et méditation",
    color: "from-accent to-destructive"
  },
  {
    name: "Atlas",
    avatar: "🧠",
    specialty: "Coaching professionnel",
    description: "Spécialisé en développement personnel et carrière",
    color: "from-primary to-info"
  },
  {
    name: "Zen",
    avatar: "🧘",
    specialty: "Mindfulness",
    description: "Guide en méditation et relaxation",
    color: "from-success to-success"
  }
];

const EnhancedAICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState(AI_PERSONALITIES[0]);
  const [emotionalContext, setEmotionalContext] = useState<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Erreur de reconnaissance vocale",
          description: "Impossible d'enregistrer votre voix.",
          variant: "destructive"
        });
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeEmotion = async (_text: string) => {
    try {
      // Simuler l'analyse d'émotion (à remplacer par une vraie API)
      const emotions = ['joie', 'tristesse', 'anxiété', 'colère', 'sérénité', 'motivation'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = Math.random() * 0.4 + 0.6; // 60-100%
      
      return {
        emotion: randomEmotion,
        confidence: Math.round(confidence * 100),
        suggestions: generateSuggestions(randomEmotion)
      };
    } catch (error) {
      logger.error('Erreur analyse émotionnelle', { error }, 'AI_COACH');
      return null;
    }
  };

  const generateSuggestions = (emotion: string): string[] => {
    const suggestionMap: Record<string, string[]> = {
      joie: ["Partagez cette joie avec vos proches", "Notez ce moment dans votre journal", "Pratiquez la gratitude"],
      tristesse: ["Prenez le temps de ressentir cette émotion", "Parlez à quelqu'un de confiance", "Essayez une méditation guidée"],
      anxiété: ["Pratiquez la respiration profonde", "Identifiez la source de votre anxiété", "Faites une activité relaxante"],
      colère: ["Comptez jusqu'à 10 avant de réagir", "Faites de l'exercice physique", "Exprimez-vous par l'écriture"],
      sérénité: ["Savourez ce moment de paix", "Méditez pour approfondir cette sensation", "Partagez votre sérénité"],
      motivation: ["Fixez-vous des objectifs concrets", "Planifiez vos prochaines étapes", "Célébrez vos victoires"]
    };
    
    return suggestionMap[emotion] || ["Prenez soin de vous", "Restez à l'écoute de vos émotions"];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsProcessing(true);

    // Analyser l'émotion du message
    const emotionAnalysis = await analyzeEmotion(inputMessage);

    // Simuler la réponse de l'IA (à remplacer par une vraie API)
    setTimeout(async () => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage, selectedPersonality, emotionAnalysis),
        sender: 'ai',
        timestamp: new Date(),
        emotion: emotionAnalysis?.emotion,
        confidence: emotionAnalysis?.confidence,
        suggestions: emotionAnalysis?.suggestions
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setIsProcessing(false);

      // Synthèse vocale si activée
      if (voiceEnabled) {
        speakText(aiResponse.content);
      }
    }, 2000);
  };

  const generateAIResponse = (_userInput: string, personality: AIPersonality, _emotion: any): string => {
    const responses = {
      Luna: [
        "Je comprends ce que vous ressentez. Vos émotions sont valides et importantes.",
        "Prenons un moment ensemble pour explorer ces sentiments plus profondément.",
        "Votre bien-être émotionnel est ma priorité. Comment puis-je vous accompagner ?"
      ],
      Atlas: [
        "Excellente question ! Analysons ensemble cette situation sous différents angles.",
        "Votre développement personnel est un voyage continu. Félicitations pour cette réflexion.",
        "Transformons ce défi en opportunité de croissance. Que pensez-vous de cette approche ?"
      ],
      Zen: [
        "Respirons ensemble et trouvons la paix dans ce moment présent.",
        "La mindfulness nous enseigne à observer sans juger. Que ressentez-vous maintenant ?",
        "Chaque instant est une nouvelle chance de cultiver la sérénité intérieure."
      ]
    };

    const personalityResponses = responses[personality.name as keyof typeof responses] || responses.Luna;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Sélection de personnalité IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-accent" />
            Coach IA Personnalisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AI_PERSONALITIES.map((personality) => (
              <motion.div
                key={personality.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedPersonality.name === personality.name 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPersonality(personality)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl mb-2 p-3 rounded-full bg-gradient-to-r ${personality.color} text-primary-foreground w-fit mx-auto`}>
                      {personality.avatar}
                    </div>
                    <h3 className="font-semibold">{personality.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{personality.specialty}</p>
                    <p className="text-xs text-muted-foreground">{personality.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interface de chat */}
      <Card className="h-96">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className={`bg-gradient-to-r ${selectedPersonality.color} text-primary-foreground`}>
                {selectedPersonality.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedPersonality.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedPersonality.specialty}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              aria-label={voiceEnabled ? "Désactiver la synthèse vocale" : "Activer la synthèse vocale"}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}>
                    <p>{message.content}</p>
                    {message.emotion && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {message.emotion} ({message.confidence}%)
                        </Badge>
                      </div>
                    )}
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs opacity-80">
                            <Lightbulb className="h-3 w-3" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
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
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Partagez vos pensées avec votre coach IA..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isProcessing}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                aria-label={isListening ? "Arrêter l'écoute" : "Activer le microphone"}
              >
                {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={sendMessage} disabled={isProcessing || !inputMessage.trim()} aria-label="Envoyer le message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights et recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold">État émotionnel</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">Stable</p>
            <p className="text-sm text-muted-foreground">Dernière analyse</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Progression</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">+15%</p>
            <p className="text-sm text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Conversations</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{messages.length}</p>
            <p className="text-sm text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedAICoach;
