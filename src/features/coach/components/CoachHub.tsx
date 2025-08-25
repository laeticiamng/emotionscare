import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  Heart, 
  Brain,
  Lightbulb,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function CoachHub() {
  const [message, setMessage] = useState('');
  const [activeCoach, setActiveCoach] = useState('emma');
  const navAction = useNavAction();

  const coaches = [
    {
      id: 'emma',
      name: 'Emma',
      specialty: 'Bien-être émotionnel',
      avatar: '/avatars/emma.jpg',
      status: 'online',
      description: 'Experte en gestion des émotions et mindfulness'
    },
    {
      id: 'alex',
      name: 'Alex',
      specialty: 'Performance académique',
      avatar: '/avatars/alex.jpg',
      status: 'online',
      description: 'Spécialisé en optimisation des révisions'
    },
    {
      id: 'marie',
      name: 'Marie',
      specialty: 'Gestion du stress',
      avatar: '/avatars/marie.jpg',
      status: 'away',
      description: 'Psychologue clinicienne, expert en anxiété'
    }
  ];

  const conversations = [
    {
      sender: 'Emma',
      message: 'Bonjour ! Comment vous sentez-vous aujourd\'hui ?',
      time: '14:32',
      isBot: true
    },
    {
      sender: 'Vous',
      message: 'Je me sens un peu stressé par mes examens...',
      time: '14:35',
      isBot: false
    },
    {
      sender: 'Emma',
      message: 'Je comprends. Le stress pré-examen est normal. Voulez-vous que nous explorions ensemble des techniques pour le gérer ?',
      time: '14:36',
      isBot: true
    }
  ];

  const suggestions = [
    { icon: Heart, text: 'Comment gérer mon anxiété ?', category: 'Émotions' },
    { icon: Brain, text: 'Techniques de mémorisation', category: 'Révisions' },
    { icon: Target, text: 'Fixer des objectifs réalisables', category: 'Motivation' },
    { icon: Calendar, text: 'Planifier mes révisions', category: 'Organisation' }
  ];

  const currentCoach = coaches.find(c => c.id === activeCoach) || coaches[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coach Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Vos Coachs IA</h2>
        <div className="space-y-3">
          {coaches.map((coach) => (
            <Card 
              key={coach.id}
              className={`cursor-pointer transition-all ${
                activeCoach === coach.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setActiveCoach(coach.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={coach.avatar} />
                      <AvatarFallback>{coach.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      coach.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{coach.name}</h3>
                    <p className="text-sm text-muted-foreground">{coach.specialty}</p>
                    <Badge variant="outline" size="sm" className="mt-1">
                      {coach.status === 'online' ? 'Disponible' : 'Occupé'}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{coach.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="space-y-3">
          <h3 className="font-semibold">Suggestions rapides</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setMessage(suggestion.text)}
                >
                  <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{suggestion.text}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={currentCoach.avatar} />
                  <AvatarFallback>{currentCoach.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{currentCoach.name}</CardTitle>
                  <CardDescription>{currentCoach.specialty}</CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navAction({ type: 'modal', id: 'coach-history' })}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Historique
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navAction({ type: 'modal', id: 'coach-insights' })}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Insights
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Chat Messages */}
            <ScrollArea className="h-96 w-full border rounded-lg p-4">
              <div className="space-y-4">
                {conversations.map((conv, index) => (
                  <div 
                    key={index}
                    className={`flex ${conv.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] ${conv.isBot ? 'order-2' : 'order-1'}`}>
                      {conv.isBot && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Bot className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">{conv.sender}</span>
                        </div>
                      )}
                      <div className={`rounded-lg p-3 ${
                        conv.isBot 
                          ? 'bg-muted text-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        <p className="text-sm">{conv.message}</p>
                        <p className="text-xs mt-1 opacity-70">{conv.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                placeholder={`Parlez à ${currentCoach.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // Handle send message
                    setMessage('');
                  }
                }}
              />
              <Button 
                onClick={() => {
                  // Handle send message
                  setMessage('');
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => navAction({ type: 'modal', id: 'wellness-plan' })}
          >
            <Lightbulb className="w-6 h-6 mb-2" />
            Plan de bien-être
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => navAction({ type: 'modal', id: 'mood-analysis' })}
          >
            <TrendingUp className="w-6 h-6 mb-2" />
            Analyse d'humeur
          </Button>
        </div>
      </div>
    </div>
  );
}