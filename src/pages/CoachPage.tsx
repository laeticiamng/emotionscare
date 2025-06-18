
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Heart, Lightbulb, Clock, Star } from 'lucide-react';

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Bonjour ! Je suis votre coach IA personnel. Comment vous sentez-vous aujourd\'hui ?',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'user',
      content: 'Salut ! Je me sens un peu stressé par ma charge de travail en ce moment.',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      type: 'bot',
      content: 'Je comprends que la charge de travail puisse être stressante. Pouvez-vous me dire ce qui vous préoccupe le plus actuellement ? Cela m\'aidera à vous proposer des stratégies adaptées.',
      timestamp: new Date(Date.now() - 180000)
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user' as const,
        content: currentMessage,
        timestamp: new Date()
      };
      
      setMessages([...messages, newMessage]);
      setCurrentMessage('');
      setIsTyping(true);
      
      // Simulation de réponse du bot
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot' as const,
          content: 'Merci pour ce partage. Voici quelques techniques qui pourraient vous aider à gérer ce stress : 1) Priorisez vos tâches, 2) Prenez des pauses régulières, 3) Pratiquez la respiration profonde. Souhaitez-vous que nous explorions l\'une de ces techniques ensemble ?',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const quickSuggestions = [
    'Comment gérer mon stress ?',
    'J\'ai besoin de motivation',
    'Exercices de relaxation',
    'Améliorer mon sommeil'
  ];

  const coachFeatures = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: 'Soutien Émotionnel',
      description: 'Accompagnement personnalisé pour vos défis émotionnels'
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      title: 'Conseils Pratiques',
      description: 'Stratégies concrètes adaptées à votre situation'
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: 'Disponible 24/7',
      description: 'Votre coach personnel toujours accessible'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Coach IA Personnel</h1>
        <p className="text-muted-foreground">
          Votre compagnon intelligent pour le bien-être émotionnel
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                Emma - Coach IA
                <Badge variant="secondary" className="ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  En ligne
                </Badge>
              </CardTitle>
              <CardDescription>
                Assistant personnel spécialisé en bien-être émotionnel
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'bot' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {message.type === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 opacity-70`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMessage(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Coach Features */}
          <Card>
            <CardHeader>
              <CardTitle>Capacités du Coach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coachFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.icon}
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Votre Progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sessions ce mois</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Temps total</span>
                <Badge variant="secondary">3h 45min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Satisfaction</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
              <CardDescription>
                Basées sur vos conversations récentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-sm">
                <Heart className="h-4 w-4 mr-2" />
                Exercice de gratitude
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                <Lightbulb className="h-4 w-4 mr-2" />
                Technique de respiration
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Pause méditation 5min
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
