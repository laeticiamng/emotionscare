
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, BrainCircuit, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: number;
  sender: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

const CoachPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'coach',
      text: "Bonjour, je suis votre coach émotionnel IA. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Simuler une réponse du coach après 1 seconde
    setTimeout(() => {
      const coachResponses = [
        "Je comprends ce que vous ressentez. Prenez un moment pour respirer profondément et réfléchir à ce qui a déclenché cette émotion.",
        "C'est une situation complexe. Avez-vous essayé d'analyser les différentes perspectives ?",
        "Je vous propose de faire un exercice de pleine conscience pour vous aider à gérer ce sentiment.",
        "Il est normal de se sentir ainsi. Pourriez-vous me donner plus de détails sur ce qui a provoqué cette situation ?",
        "Merci de partager cela. Si vous voulez, nous pouvons explorer ensemble des stratégies pour mieux gérer ce type de situations."
      ];
      
      const randomResponse = coachResponses[Math.floor(Math.random() * coachResponses.length)];
      
      const coachMessage: Message = {
        id: messages.length + 2,
        sender: 'coach',
        text: randomResponse,
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, coachMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BrainCircuit className="h-7 w-7" />
          Coach IA Personnel
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Dernière session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Clock className="h-4 w-4" />
              <span>Il y a 3 jours</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Humeur analysée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                Légèrement anxieux
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-sm">2 nouvelles suggestions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/ai-coach.png" />
                  <AvatarFallback className="bg-primary/20">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <span>Conversation avec votre coach</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] overflow-y-auto flex flex-col gap-4 p-4" style={{ overflowAnchor: 'none' }}>
              <motion.div 
                className="flex flex-col gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={itemVariants}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                      <p>{message.text}</p>
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'} flex justify-between items-center`}>
                        <span>{formatTime(message.timestamp)}</span>
                        
                        {message.sender === 'coach' && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Partagez vos pensées ou posez une question..."
                  className="flex-1 min-h-12 resize-none"
                />
                <Button type="submit" size="icon" className="h-12 w-12">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Méditation guidée
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Exercice de respiration
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Journal guidé
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Analyse de pensées
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Type de coaching</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="default" className="w-full">
                Général
              </Button>
              
              <Button variant="outline" className="w-full">
                Gestion du stress
              </Button>
              
              <Button variant="outline" className="w-full">
                Performance
              </Button>
              
              <Button variant="outline" className="w-full">
                Relations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
