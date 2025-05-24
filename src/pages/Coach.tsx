
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Heart, 
  Brain, 
  Lightbulb,
  User,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  mood?: string;
}

const Coach: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDemo = user?.email?.endsWith('@exemple.fr');

  const initialMessage: Message = {
    id: '1',
    type: 'bot',
    content: `Bonjour ${user?.user_metadata?.name || 'cher utilisateur'} ! 👋 Je suis votre coach IA personnel pour le bien-être émotionnel. Comment puis-je vous aider aujourd'hui ?`,
    timestamp: new Date(),
    mood: 'friendly'
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const mockResponses = [
    {
      triggers: ['stress', 'stressé', 'anxieux', 'angoisse'],
      response: 'Je comprends que vous ressentez du stress. Voici quelques techniques qui peuvent vous aider : \n\n1. Respiration profonde : Inspirez 4 secondes, retenez 4 secondes, expirez 6 secondes\n2. Technique de grounding : Nommez 5 choses que vous voyez, 4 que vous entendez, 3 que vous touchez\n3. Prenez une pause de 5 minutes loin de votre écran\n\nSouhaitez-vous que je vous guide dans un exercice de relaxation ?',
      mood: 'supportive'
    },
    {
      triggers: ['fatigue', 'fatigué', 'épuisé', 'burn'],
      response: 'La fatigue émotionnelle est un signal important. Voici mes recommandations :\n\n💤 Assurez-vous de dormir 7-8h par nuit\n🚶 Faites une courte marche de 10 minutes\n🧘 Essayez 5 minutes de méditation\n💧 Hydratez-vous régulièrement\n\nQuel aspect aimeriez-vous améliorer en premier ?',
      mood: 'caring'
    },
    {
      triggers: ['motivation', 'motivé', 'objectifs', 'goals'],
      response: 'C\'est formidable que vous pensiez à vos objectifs ! 🎯\n\nPour rester motivé :\n• Définissez des objectifs SMART (Spécifiques, Mesurables, Atteignables)\n• Célébrez les petites victoires\n• Visualisez votre réussite\n• Entourez-vous de personnes positives\n\nQuel objectif aimeriez-vous atteindre cette semaine ?',
      mood: 'energetic'
    },
    {
      triggers: ['travail', 'work', 'équipe', 'collègues'],
      response: 'Les relations professionnelles sont cruciales pour notre bien-être ! 🤝\n\nConseils pour améliorer votre bien-être au travail :\n• Communiquez ouvertement avec vos collègues\n• Prenez des pauses régulières\n• Organisez votre espace de travail\n• Fixez des limites saines\n\nY a-t-il une situation spécifique que vous aimeriez aborder ?',
      mood: 'professional'
    }
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Chercher une réponse appropriée
    for (const response of mockResponses) {
      if (response.triggers.some(trigger => lowerMessage.includes(trigger))) {
        return response.response;
      }
    }
    
    // Réponse par défaut
    return 'Merci de partager cela avec moi. Chaque émotion est valide et importante. Pouvez-vous me parler un peu plus de ce que vous ressentez en ce moment ? Cela m\'aidera à vous donner des conseils plus personnalisés.';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulation de délai de réponse
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: isDemo ? getAIResponse(inputMessage) : getAIResponse(inputMessage),
        timestamp: new Date(),
        mood: 'supportive'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const startListening = () => {
    setIsListening(true);
    // Simulation de reconnaissance vocale
    setTimeout(() => {
      setIsListening(false);
      setInputMessage('Je me sens un peu stressé aujourd\'hui');
      toast.success('Message vocal transcrit !');
    }, 3000);
  };

  const quickSuggestions = [
    'Je me sens stressé au travail',
    'Comment améliorer ma motivation ?',
    'J\'ai du mal à me concentrer',
    'Je manque de confiance en moi',
    'Comment mieux gérer mes émotions ?'
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* En-tête */}
        <div className="text-center">
          <div className="mx-auto p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mb-4">
            <Bot className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Coach IA Personnel</h1>
          <p className="text-xl text-muted-foreground">
            Votre assistant intelligent pour le bien-être émotionnel
          </p>
          {isDemo && (
            <Badge variant="secondary" className="mt-4">
              Mode démo - Réponses simulées
            </Badge>
          )}
        </div>

        {/* Zone de chat */}
        <Card className="h-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Conversation</span>
            </CardTitle>
            <CardDescription>
              Partagez vos émotions et recevez des conseils personnalisés
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full overflow-hidden">
            <div className="h-64 overflow-y-auto space-y-4 pr-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Le coach réfléchit...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Zone de saisie */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Partagez ce que vous ressentez..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={startListening}
                variant="outline"
                size="icon"
                disabled={isListening || isLoading}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center"
              >
                <Badge variant="secondary" className="animate-pulse">
                  🎤 Écoute en cours...
                </Badge>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Suggestions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Suggestions rapides</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conseils du jour */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Conseil du jour</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              💡 <strong>Technique de la gratitude :</strong> Chaque matin, notez 3 choses pour lesquelles vous êtes reconnaissant. 
              Cette pratique simple peut améliorer votre humeur et votre perspective générale sur la vie.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Voir plus de conseils
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Coach;
