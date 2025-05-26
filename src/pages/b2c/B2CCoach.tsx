
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Heart, Brain, Target } from 'lucide-react';
import { mockCoachService } from '@/lib/coach/mockCoachService';

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const B2CCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'coach',
      content: 'Bonjour ! Je suis votre coach émotionnel IA. Comment vous sentez-vous aujourd\'hui ?',
      timestamp: new Date(),
      suggestions: [
        'Je me sens stressé(e)',
        'J\'ai besoin de motivation',
        'Je veux améliorer mon bien-être'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Appeler le service de coach mock
      const response = await mockCoachService.askQuestion(messageToSend);
      
      const coachMessage: Message = {
        id: response.id,
        type: 'coach',
        content: response.message,
        timestamp: new Date(response.timestamp),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, coachMessage]);
    } catch (error) {
      console.error('Erreur lors de la communication avec le coach:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'coach',
        content: 'Désolé, j\'ai rencontré un problème. Pouvez-vous reformuler votre question ?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Coach Émotionnel IA</h1>
          <p className="text-muted-foreground">Votre accompagnateur personnel pour le bien-être mental</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat principal */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                                onClick={() => handleSendMessage(suggestion)}
                              >
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-secondary rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input de message */}
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 min-h-[60px] max-h-[120px]"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5" />
                Bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Votre coach peut vous aider avec :
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Gestion du stress
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Amélioration de l'humeur
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Techniques de relaxation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Objectifs personnels
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5" />
                Conseils Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleSendMessage('J\'ai besoin d\'une technique de respiration')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Exercice de respiration
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleSendMessage('Comment puis-je gérer mon stress ?')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Gérer le stress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleSendMessage('J\'aimerais améliorer mon sommeil')}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Améliorer le sommeil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CCoach;
