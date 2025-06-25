
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Mic, Heart, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import BreathingLoader from '@/components/chat/BreathingLoader';

interface Message {
  id: number;
  sender: 'user' | 'coach';
  content: string;
  timestamp: Date;
  type?: 'text' | 'recommendation' | 'exercise' | 'insight';
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [coachMood, setCoachMood] = useState<'empathetic' | 'motivational' | 'analytical'>('empathetic');

  const initialMessages: Message[] = [
    {
      id: 1,
      sender: 'coach',
      content: "Bonjour ! Je suis votre coach IA personnel. Je suis là pour vous accompagner dans votre parcours de bien-être émotionnel. Comment vous sentez-vous aujourd'hui ?",
      timestamp: new Date(),
      type: 'text'
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: "Exercice de respiration",
      description: "Prenez 5 minutes pour vous centrer",
      duration: "5 min",
      type: "breathing",
      icon: Heart
    },
    {
      id: 2,
      title: "Méditation guidée",
      description: "Session de pleine conscience",
      duration: "10 min", 
      type: "meditation",
      icon: Brain
    },
    {
      id: 3,
      title: "Objectif du jour",
      description: "Définissez votre priorité",
      duration: "2 min",
      type: "goal",
      icon: Target
    }
  ];

  const insights = [
    {
      title: "Votre progression",
      value: "+15%",
      description: "Amélioration du bien-être cette semaine",
      color: "text-green-600"
    },
    {
      title: "Streak actuel",
      value: "7 jours",
      description: "Jours consécutifs d'utilisation",
      color: "text-blue-600"
    },
    {
      title: "Séances complétées",
      value: "23",
      description: "Exercices réalisés ce mois",
      color: "text-purple-600"
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulation de la réponse du coach
    setTimeout(() => {
      const coachResponse = generateCoachResponse(inputMessage);
      const coachMessage: Message = {
        id: Date.now() + 1,
        sender: 'coach',
        content: coachResponse.content,
        timestamp: new Date(),
        type: coachResponse.type
      };
      
      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateCoachResponse = (userInput: string): { content: string; type: Message['type'] } => {
    const input = userInput.toLowerCase();
    
    if (input.includes('stress') || input.includes('anxieux') || input.includes('inquiet')) {
      setCoachMood('empathetic');
      return {
        content: "Je comprends que vous ressentiez du stress. C'est tout à fait normal. Essayons ensemble un exercice de respiration profonde. Inspirez lentement pendant 4 secondes, retenez pendant 4 secondes, puis expirez pendant 6 secondes. Répétez cela 5 fois.",
        type: 'exercise'
      };
    }
    
    if (input.includes('motivation') || input.includes('objectif') || input.includes('but')) {
      setCoachMood('motivational');
      return {
        content: "C'est formidable que vous pensiez à vos objectifs ! La motivation vient de la clarté. Quel est le petit pas que vous pourriez faire aujourd'hui pour vous rapprocher de ce qui vous tient à cœur ?",
        type: 'recommendation'
      };
    }
    
    if (input.includes('fatigue') || input.includes('épuisé') || input.includes('tired')) {
      setCoachMood('empathetic');
      return {
        content: "La fatigue peut être physique ou émotionnelle. Avez-vous pris le temps de vous reposer vraiment aujourd'hui ? Parfois, 10 minutes de méditation valent mieux qu'une heure de repos agité.",
        type: 'insight'
      };
    }
    
    // Réponse par défaut
    setCoachMood('analytical');
    return {
      content: "Merci de partager cela avec moi. Pouvez-vous m'en dire plus sur ce que vous ressentez en ce moment ? Je suis là pour vous écouter et vous accompagner.",
      type: 'text'
    };
  };

  const handleRecommendationClick = (rec: any) => {
    toast.success(`Lancement de: ${rec.title}`);
    const message: Message = {
      id: Date.now(),
      sender: 'coach',
      content: `Parfait ! Commençons par "${rec.title}". ${rec.description}. Prenez votre temps et écoutez votre corps.`,
      timestamp: new Date(),
      type: 'exercise'
    };
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4" data-testid="coach-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coach IA Personnel</h1>
          <p className="text-xl text-gray-600">Votre accompagnateur intelligent pour le bien-être émotionnel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Principal */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/coach-avatar.png" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      <Brain className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Coach IA
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        En ligne
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Mode: {coachMood === 'empathetic' ? 'Empathique' : 
                            coachMood === 'motivational' ? 'Motivant' : 'Analytique'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-4 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-indigo-600 text-white' 
                              : message.type === 'exercise' 
                                ? 'bg-green-50 border border-green-200'
                                : message.type === 'recommendation'
                                  ? 'bg-blue-50 border border-blue-200'
                                  : message.type === 'insight'
                                    ? 'bg-purple-50 border border-purple-200'
                                    : 'bg-gray-50 border border-gray-200'
                          }`}>
                            {message.sender === 'coach' && message.type !== 'text' && (
                              <div className="flex items-center gap-2 mb-2">
                                {message.type === 'exercise' && <Heart className="h-4 w-4 text-green-600" />}
                                {message.type === 'recommendation' && <Lightbulb className="h-4 w-4 text-blue-600" />}
                                {message.type === 'insight' && <Brain className="h-4 w-4 text-purple-600" />}
                                <span className="text-xs font-medium uppercase tracking-wide">
                                  {message.type === 'exercise' ? 'Exercice' : 
                                   message.type === 'recommendation' ? 'Recommandation' : 'Insight'}
                                </span>
                              </div>
                            )}
                            <p className={message.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                              {message.content}
                            </p>
                            <p className={`text-xs mt-2 ${
                              message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
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
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <BreathingLoader size="sm" />
                          <p className="text-xs text-gray-500 mt-2">Coach IA réfléchit...</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Partagez vos pensées..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vos Progrès
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="text-center">
                    <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
                    <p className="font-medium text-sm">{insight.title}</p>
                    <p className="text-xs text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommandations rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRecommendationClick(rec)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <rec.icon className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{rec.title}</p>
                        <p className="text-xs text-gray-600">{rec.description}</p>
                        <Badge variant="outline" className="text-xs mt-1">{rec.duration}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* État émotionnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Check-in Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Comment vous sentez-vous maintenant ?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['😊', '😐', '😔', '😤'].map((emoji, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-12 text-xl"
                      onClick={() => toast.success('État émotionnel enregistré')}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
