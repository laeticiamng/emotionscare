
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Send, Loader2, User, Bot, Lightbulb, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

const Coach: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);

  // Message d'accueil du coach
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      sender: 'coach',
      content: `Bonjour ${user?.name || 'cher utilisateur'} ! 👋 Je suis votre coach IA EmotionsCare. Je suis là pour vous accompagner dans votre parcours de bien-être émotionnel. Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) {
      toast.error('Veuillez saisir un message');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Appel à l'API du coach IA
      const { data, error } = await supabase.functions.invoke('coach-ai', {
        body: {
          message: newMessage,
          userId: user.id,
          conversationId: currentConversation
        }
      });

      if (error) {
        throw error;
      }

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        content: data.response || 'Je suis là pour vous écouter. Pouvez-vous me parler de ce que vous ressentez ?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachMessage]);

      // Sauvegarder la conversation
      if (data.conversationId) {
        setCurrentConversation(data.conversationId);
      }

    } catch (error) {
      console.error('Erreur du coach IA:', error);
      
      // Réponse de fallback
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        content: 'Je comprends ce que vous ressentez. Prendre soin de son bien-être émotionnel est important. Voulez-vous me parler de ce qui vous préoccupe en ce moment ?',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "Je me sens stressé aujourd'hui",
    "Comment puis-je gérer mon anxiété ?",
    "J'ai besoin de motivation",
    "Je traverse une période difficile",
    "Comment améliorer mon sommeil ?",
    "Je veux développer ma confiance en moi"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setNewMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900 dark:via-slate-800 dark:to-pink-900 p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="mx-auto p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-fit">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Coach IA EmotionsCare
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Votre accompagnateur personnel pour le bien-être émotionnel. 
            Partagez vos préoccupations et recevez des conseils personnalisés.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Suggestions rapides */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Suggestions
                </CardTitle>
                <CardDescription>
                  Sujets fréquents pour commencer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full text-left h-auto p-3 whitespace-normal"
                  >
                    {prompt}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectifs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Réduction du stress</div>
                  <div className="text-muted-foreground">En cours...</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Amélioration du sommeil</div>
                  <div className="text-muted-foreground">Planifié</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Confiance en soi</div>
                  <div className="text-muted-foreground">À définir</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat principal */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Conversation avec votre coach
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          message.sender === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          {message.sender === 'coach' ? (
                            <>
                              <AvatarImage src="/coach-avatar.png" />
                              <AvatarFallback>
                                <Heart className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src={user?.avatar_url} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <Heart className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Votre coach réfléchit...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Zone de saisie */}
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Partagez ce que vous ressentez..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={isLoading || !newMessage.trim()}
                      size="icon"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coach;
