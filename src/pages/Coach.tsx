
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Send, 
  Bot, 
  User, 
  Heart,
  Brain,
  Sparkles,
  MessageSquare,
  Clock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'exercise';
}

const Coach: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isDemoAccount = user?.email?.endsWith('@exemple.fr');
  const userName = user?.user_metadata?.name?.split(' ')[0] || 'Utilisateur';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        content: `Bonjour ${userName} ! Je suis votre coach IA EmotionsCare. Je suis là pour vous accompagner dans votre parcours de bien-être émotionnel. Comment vous sentez-vous aujourd'hui ?`,
        sender: 'coach',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [userName]);

  const generateCoachResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    let type: 'text' | 'suggestion' | 'exercise' = 'text';

    if (lowerMessage.includes('stress') || lowerMessage.includes('anxieux') || lowerMessage.includes('angoisse')) {
      response = `Je comprends que vous ressentez du stress. Voici quelques techniques qui peuvent vous aider : prenez 3 respirations profondes, concentrez-vous sur le moment présent, et rappelez-vous que cette situation est temporaire. Souhaitez-vous que je vous guide dans un exercice de relaxation ?`;
      type = 'suggestion';
    } else if (lowerMessage.includes('triste') || lowerMessage.includes('déprim') || lowerMessage.includes('moral')) {
      response = `Je sens que vous traversez une période difficile. C'est normal de ressentir de la tristesse parfois. Essayez de vous entourer de personnes bienveillantes, pratiquez une activité qui vous fait du bien, et n'hésitez pas à exprimer vos émotions. Voulez-vous parler de ce qui vous préoccupe ?`;
    } else if (lowerMessage.includes('heureux') || lowerMessage.includes('joie') || lowerMessage.includes('content')) {
      response = `C'est merveilleux de vous entendre si positif ! Profitez de ce moment de bonheur et gardez en mémoire ce qui vous rend heureux. Cela pourra vous aider dans les moments plus difficiles. Qu'est-ce qui vous rend heureux aujourd'hui ?`;
    } else if (lowerMessage.includes('fatigue') || lowerMessage.includes('épuisé') || lowerMessage.includes('sommeil')) {
      response = `La fatigue peut affecter votre bien-être émotionnel. Assurez-vous de bien dormir, prenez des pauses régulières, et n'hésitez pas à déléguer si possible. Avez-vous essayé des techniques de relaxation avant le coucher ?`;
    } else if (lowerMessage.includes('colère') || lowerMessage.includes('énervé') || lowerMessage.includes('frustré')) {
      response = `La colère est une émotion naturelle. Essayez de comprendre ce qui la déclenche, prenez du recul, et exprimez-la de manière constructive. Un exercice de respiration peut aussi vous aider à vous calmer. Souhaitez-vous que je vous propose des techniques de gestion de la colère ?`;
      type = 'exercise';
    } else if (lowerMessage.includes('exercice') || lowerMessage.includes('meditation') || lowerMessage.includes('relaxation')) {
      response = `Parfait ! Voici un exercice simple : Fermez les yeux, respirez profondément par le nez en comptant jusqu'à 4, retenez votre souffle pendant 4 secondes, puis expirez par la bouche en comptant jusqu'à 6. Répétez 5 fois. Comment vous sentez-vous ?`;
      type = 'exercise';
    } else {
      response = `Merci de partager cela avec moi. Je suis là pour vous écouter et vous accompagner. Pouvez-vous me dire plus précisément comment vous vous sentez émotionnellement en ce moment ? Cela m'aidera à mieux vous conseiller.`;
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'coach',
      timestamp: new Date(),
      type
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const coachResponse = generateCoachResponse(inputMessage);
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Je me sens stressé(e)",
    "J'ai besoin de motivation",
    "Je suis anxieux/anxieuse",
    "Comment gérer ma colère ?",
    "Je veux méditer",
    "J'ai des difficultés à dormir"
  ];

  const coachStats = isDemoAccount ? [
    { label: 'Sessions', value: '23' },
    { label: 'Jours consécutifs', value: '7' },
    { label: 'Progression', value: '+15%' }
  ] : [
    { label: 'Sessions', value: '0' },
    { label: 'Jours consécutifs', value: '0' },
    { label: 'Progression', value: '--' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Coach IA</h1>
            <p className="text-muted-foreground mt-1">
              Votre accompagnateur personnel de bien-être émotionnel
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {coachStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/coach-avatar.png" />
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Coach EmotionsCare</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>En ligne</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar className="w-8 h-8">
                      {message.sender === 'coach' ? (
                        <AvatarFallback className="bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-blue-100">
                          <User className="h-4 w-4 text-blue-600" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.type && message.type !== 'text' && (
                        <Badge 
                          variant="secondary" 
                          className="mt-2 text-xs"
                        >
                          {message.type === 'suggestion' ? 'Conseil' : 'Exercice'}
                        </Badge>
                      )}
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Suggestions rapides</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  className="w-full justify-start text-left h-auto p-3"
                >
                  {suggestion}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Coach Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Fonctionnalités</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Analyse émotionnelle en temps réel</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Target className="h-4 w-4 text-blue-500" />
                <span>Conseils personnalisés</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="h-4 w-4 text-green-500" />
                <span>Disponible 24h/24</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                <span>Conversations privées</span>
              </div>
            </CardContent>
          </Card>

          {/* Today's Tip */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conseil du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                <p className="text-sm">
                  "Prenez 5 minutes aujourd'hui pour respirer consciemment. 
                  Votre esprit vous remerciera."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Coach;
