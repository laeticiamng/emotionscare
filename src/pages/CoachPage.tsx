
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Send, Bot, User, Lightbulb, Target, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre coach IA personnel. Comment puis-je vous aider aujourd\'hui à améliorer votre bien-être ?',
      timestamp: new Date(),
      suggestions: [
        'Je me sens stressé(e) au travail',
        'J\'ai du mal à me concentrer',
        'Comment améliorer mon humeur ?',
        'Aide-moi à fixer des objectifs'
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: generateSuggestions(content)
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    // Simple response generation based on keywords
    const input = userInput.toLowerCase();
    
    if (input.includes('stress') || input.includes('stressé')) {
      return 'Je comprends que vous ressentez du stress. Le stress est une réaction naturelle, mais il est important de le gérer. Voici quelques techniques qui peuvent vous aider : la respiration profonde, la méditation de pleine conscience, et la planification de pauses régulières. Voulez-vous que je vous guide dans un exercice de respiration ?';
    }
    
    if (input.includes('concentration') || input.includes('concentrer')) {
      return 'Les difficultés de concentration peuvent avoir plusieurs causes. Je vous recommande la technique Pomodoro : travaillez par blocs de 25 minutes avec des pauses de 5 minutes. Éliminez les distractions, organisez votre espace de travail et assurez-vous de bien dormir. Quel aspect de la concentration vous pose le plus de problèmes ?';
    }
    
    if (input.includes('humeur') || input.includes('moral')) {
      return 'Pour améliorer votre humeur, je suggère plusieurs approches : l\'exercice physique régulier libère des endorphines, la gratitude quotidienne change votre perspective, et maintenir des connexions sociales est essentiel. Quelle activité vous apporte habituellement de la joie ?';
    }
    
    if (input.includes('objectif') || input.includes('but')) {
      return 'Excellent ! Fixer des objectifs est une excellente démarche. Utilisons la méthode SMART : Spécifique, Mesurable, Atteignable, Réaliste, Temporel. Quel domaine de votre vie aimeriez-vous améliorer en priorité ? Personnel, professionnel, ou bien-être ?';
    }
    
    return 'Je vous remercie de partager cela avec moi. Chaque situation est unique et mérite une attention particulière. Pouvez-vous me donner plus de détails sur ce que vous ressentez ? Cela m\'aidera à vous proposer des conseils plus personnalisés.';
  };

  const generateSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();
    
    if (input.includes('stress')) {
      return [
        'Guide-moi dans un exercice de respiration',
        'Quelles sont les causes de mon stress ?',
        'Comment organiser mes priorités ?'
      ];
    }
    
    if (input.includes('concentration')) {
      return [
        'Explique-moi la technique Pomodoro',
        'Comment améliorer mon environnement de travail ?',
        'Aide-moi à créer un planning'
      ];
    }
    
    return [
      'Donne-moi plus de conseils',
      'Comment créer une routine bien-être ?',
      'Aide-moi avec mes émotions'
    ];
  };

  const coachFeatures = [
    {
      icon: Lightbulb,
      title: 'Conseils personnalisés',
      description: 'Recommandations adaptées à votre profil'
    },
    {
      icon: Target,
      title: 'Objectifs sur mesure',
      description: 'Définition et suivi d\'objectifs réalisables'
    },
    {
      icon: Calendar,
      title: 'Planning bien-être',
      description: 'Organisation de votre routine quotidienne'
    }
  ];

  return (
    <div data-testid="page-root" className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Coach IA Personnel</h1>
        <p className="text-lg text-gray-600">
          Votre accompagnateur intelligent pour un bien-être optimal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Conversation avec votre coach
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'bot' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        {message.suggestions && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-50 text-xs"
                                onClick={() => sendMessage(suggestion)}
                              >
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessage)}
                    className="flex-1"
                  />
                  <Button onClick={() => sendMessage(newMessage)} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coach Features */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités du coach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coachFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => sendMessage('Je me sens stressé(e) aujourd\'hui')}
              >
                Aide pour le stress
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => sendMessage('Comment puis-je améliorer ma productivité ?')}
              >
                Améliorer la productivité
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => sendMessage('Aide-moi à créer une routine bien-être')}
              >
                Créer une routine
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => sendMessage('J\'ai besoin de motivation')}
              >
                Besoin de motivation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
