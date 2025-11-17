import React from 'react';
import VirtualCoach from '@/components/features/VirtualCoach';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Bot,
  User,
  Heart,
  Brain,
  Zap,
  Sparkles,
  Mic,
  Image,
  Plus
} from 'lucide-react';

const MessagesPage: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: 'ai',
      content: 'Bonjour ! Je suis Nyvée, votre assistant IA émotionnel. Comment vous sentez-vous aujourd\'hui ?',
      timestamp: '09:15',
      mood: 'welcoming'
    },
    {
      id: 2,
      sender: 'user',
      content: 'Salut Nyvée ! Je me sens un peu stressé par ma présentation de demain.',
      timestamp: '09:16',
      mood: 'anxious'
    },
    {
      id: 3,
      sender: 'ai',
      content: 'Je comprends votre appréhension. Les présentations peuvent être sources de stress. Voulez-vous que nous travaillions ensemble sur des techniques de relaxation et de préparation mentale ?',
      timestamp: '09:17',
      mood: 'supportive'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      mood: 'neutral' as const
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simuler réponse IA
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai' as const,
        content: 'Merci de partager cela avec moi. Je vais analyser vos émotions et vous proposer des conseils personnalisés.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        mood: 'thoughtful' as const
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const quickActions = [
    { label: 'Comment je me sens', icon: Heart, color: 'text-red-500' },
    { label: 'Besoin de motivation', icon: Zap, color: 'text-yellow-500' },
    { label: 'Gestion du stress', icon: Brain, color: 'text-blue-500' },
    { label: 'Techniques relaxation', icon: Sparkles, color: 'text-purple-500' }
  ];

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Messages avec Nyvée</h1>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Bot className="h-3 w-3 mr-1" />
            IA Active
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Conversez avec votre assistant IA émotionnel personnel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Zone de chat principale */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Nyvée</div>
                  <div className="text-sm text-muted-foreground">Assistant IA Émotionnel</div>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  En ligne
                </Badge>
              </CardTitle>
            </CardHeader>

            {/* Zone des messages */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={msg.sender === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-primary text-primary-foreground'}>
                        {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[70%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 px-1">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Zone de saisie */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Tapez votre message à Nyvée..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Sujets de conversation suggérés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setMessage(action.label)}
                >
                  <action.icon className={`h-4 w-4 mr-3 ${action.color}`} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analyse de Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-sm font-medium mb-1">Humeur Détectée</div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Légèrement anxieux</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-sm font-medium mb-1">Sujets Principaux</div>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Stress</Badge>
                  <Badge variant="secondary" className="text-xs">Travail</Badge>
                  <Badge variant="secondary" className="text-xs">Présentation</Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Voir l'historique complet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;