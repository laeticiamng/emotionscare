
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Heart, Brain, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

const CoachPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre coach virtuel. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'coach',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    {
      title: 'Technique de respiration',
      description: 'Exercices de respiration guidés',
      icon: Heart,
      action: () => startBreathingExercise()
    },
    {
      title: 'Gestion du stress',
      description: 'Conseils pour réduire le stress',
      icon: Brain,
      action: () => sendQuickMessage('Comment gérer mon stress ?')
    },
    {
      title: 'Boost d\'énergie',
      description: 'Techniques pour retrouver de l\'énergie',
      icon: Zap,
      action: () => sendQuickMessage('J\'ai besoin d\'énergie')
    }
  ];

  const coachResponses = {
    'stress': [
      'Je comprends que vous ressentez du stress. Voici quelques techniques rapides :',
      '• Prenez 3 respirations profondes (4 sec inspiration, 6 sec expiration)',
      '• Identifiez la source de votre stress',
      '• Faites une pause de 5 minutes avec de la musique relaxante',
      '• Essayez la technique du "5-4-3-2-1" : 5 choses que vous voyez, 4 que vous touchez, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez'
    ],
    'énergie': [
      'Pour retrouver de l\'énergie naturellement :',
      '• Hydratez-vous (un verre d\'eau fraîche)',
      '• Faites quelques étirements ou du mouvement',
      '• Écoutez une musique énergisante',
      '• Prenez 2 minutes de respiration dynamisante',
      '• Sortez prendre l\'air frais si possible'
    ],
    'default': [
      'Merci de partager cela avec moi. Voici quelques suggestions personnalisées :',
      '• Prenez un moment pour vous recentrer',
      '• Essayez une technique de respiration',
      '• Écoutez de la musique adaptée à votre humeur',
      '• N\'hésitez pas à faire une pause si nécessaire'
    ]
  };

  const generateCoachResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxieux') || lowerMessage.includes('angoisse')) {
      return coachResponses.stress.join('\n');
    } else if (lowerMessage.includes('énergie') || lowerMessage.includes('fatigué') || lowerMessage.includes('motivation')) {
      return coachResponses.énergie.join('\n');
    } else {
      return coachResponses.default.join('\n');
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulation de réponse du coach
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateCoachResponse(inputText),
        sender: 'coach',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const sendQuickMessage = (message: string) => {
    setInputText(message);
    setTimeout(() => sendMessage(), 100);
  };

  const startBreathingExercise = () => {
    const breathingMessage: Message = {
      id: Date.now().toString(),
      text: 'Commençons un exercice de respiration guidé :\n\n🫁 Respirez profondément par le nez (4 secondes)\n⏸️ Retenez votre souffle (4 secondes)\n💨 Expirez lentement par la bouche (6 secondes)\n\nRépétez ce cycle 5 fois. Concentrez-vous uniquement sur votre respiration.',
      sender: 'coach',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, breathingMessage]);
    toast.success('Exercice de respiration commencé');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Coach Virtuel</h1>
          <p className="text-muted-foreground">Votre accompagnement personnalisé</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Principal */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-fill animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Zone de saisie */}
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!inputText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Rapides */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.action}
                    className="w-full justify-start h-auto p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conseils du Jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">💡 Astuce</p>
                  <p className="text-xs text-blue-700">
                    Prenez 3 respirations profondes avant chaque tâche importante
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">🌱 Bien-être</p>
                  <p className="text-xs text-green-700">
                    5 minutes de méditation peuvent transformer votre journée
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
