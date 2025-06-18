import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Brain, 
  Heart,
  Lightbulb,
  Clock,
  Smile,
  Target,
  BookOpen,
  Headphones,
  Mic,
  MoreVertical
} from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'exercise';
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Bonjour ! Je suis votre coach IA personnel. Je suis là pour vous accompagner dans votre parcours de bien-être émotionnel. Comment vous sentez-vous aujourd'hui ?",
      sender: 'coach',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    { text: "Je me sens stressé", icon: <Heart className="h-4 w-4" /> },
    { text: "J'ai besoin de motivation", icon: <Target className="h-4 w-4" /> },
    { text: "Comment méditer ?", icon: <Brain className="h-4 w-4" /> },
    { text: "Exercice de respiration", icon: <Smile className="h-4 w-4" /> },
  ];

  const coachFeatures = [
    {
      title: "Conseils Personnalisés",
      description: "Obtenez des recommandations adaptées à votre situation",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "bg-yellow-500"
    },
    {
      title: "Exercices Guidés",
      description: "Méditation, respiration, et techniques de relaxation",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      title: "Suivi Émotionnel",
      description: "Analysez vos patterns émotionnels avec l'aide de l'IA",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-red-500"
    },
    {
      title: "Support 24/7",
      description: "Votre coach est disponible quand vous en avez besoin",
      icon: <Clock className="h-6 w-6" />,
      color: "bg-green-500"
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulation de réponse du coach
    setTimeout(() => {
      const coachResponse: Message = {
        id: messages.length + 2,
        content: getCoachResponse(newMessage),
        sender: 'coach',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getCoachResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxieux')) {
      return "Je comprends que vous ressentez du stress. C'est tout à fait normal. Voulez-vous essayer un exercice de respiration ? Inspirez profondément pendant 4 secondes, retenez pendant 4 secondes, puis expirez pendant 6 secondes. Répétez cela 5 fois.";
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('motivé')) {
      return "La motivation peut fluctuer, c'est normal ! Rappelons-nous vos objectifs personnels. Qu'est-ce qui vous tient vraiment à cœur ? Parfois, commencer par de petites actions peut relancer la motivation.";
    }
    
    if (lowerMessage.includes('méditation') || lowerMessage.includes('méditer')) {
      return "La méditation est excellente pour le bien-être ! Commencez par 5 minutes par jour. Asseyez-vous confortablement, fermez les yeux et concentrez-vous sur votre respiration. Quand vos pensées divaguent, ramenez doucement votre attention sur le souffle.";
    }
    
    return "Merci de partager cela avec moi. Chaque émotion est valide et mérite d'être écoutée. Pouvez-vous me dire ce qui vous préoccupe le plus en ce moment ? Je suis là pour vous accompagner.";
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat principal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header du chat */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/api/placeholder/48/48" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Brain className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">Coach IA EmotionsCare</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">En ligne</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Messages */}
          <Card className="flex-1">
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] space-y-1`}>
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground text-right">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Suggestions rapides */}
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSuggestion(suggestion.text)}
                className="flex items-center space-x-1"
              >
                {suggestion.icon}
                <span>{suggestion.text}</span>
              </Button>
            ))}
          </div>

          {/* Input de message */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar des fonctionnalités */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span>Votre Coach IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Votre coach personnel alimenté par l'intelligence artificielle, 
                spécialisé en bien-être émotionnel et développement personnel.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {coachFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-8 h-8 rounded-lg ${feature.color} flex items-center justify-center text-white flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exercices Recommandés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Headphones className="h-4 w-4 mr-2" />
                Méditation guidée (5 min)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Exercice de gratitude
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Définir un objectif
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Votre Progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conversations cette semaine</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Exercices complétés</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Streak actuel</span>
                  <Badge variant="secondary">7 jours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { CoachPage };
export default CoachPage;