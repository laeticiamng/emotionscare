import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mic, MicOff, StopCircle, User, Bot, Image as ImageIcon, Wand2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import useOpenAI from '@/hooks/api/useOpenAI';
import useWhisper from '@/hooks/api/useWhisper';
import { sanitizeUserContent } from '@/lib/security/sanitize';
import { logger } from '@/lib/logger';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface EnhancedCoachChatProps {
  initialMessage?: string;
  showCharacter?: boolean;
  showHeader?: boolean;
}

const EnhancedCoachChat: React.FC<EnhancedCoachChatProps> = ({
  initialMessage = "Bonjour, je suis votre coach émotionnel. Comment puis-je vous aider aujourd'hui?",
  showCharacter = false,
  showHeader = false
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateText } = useOpenAI();
  const { transcribeAudio, isTranscribing } = useWhisper();
  const [isRecording, setIsRecording] = useState(false);
  
  useEffect(() => {
    // Add initial message
    if (initialMessage) {
      const sanitizedInitial = sanitizeUserContent(initialMessage);
      if (!sanitizedInitial) {
        return;
      }

      setMessages([
        {
          id: 'initial',
          role: 'assistant',
          content: sanitizedInitial,
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const sanitizedMessage = sanitizeUserContent(inputMessage);

    if (!sanitizedMessage) {
      toast.error('Votre message ne peut pas être vide ou contenir de contenu interdit.');
      return;
    }

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: sanitizedMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const userFirstName = user?.user_metadata?.name?.split(' ')[0] || 'utilisateur';
      const prompt = `Tu es un coach émotionnel bienveillant. Tu t'adresses à ${userFirstName}. Réponds de manière empathique, positive et encourageante à ce message: "${sanitizedMessage}"`;

      const response = await generateText({ prompt });

      if (response) {
        const sanitizedResponse = sanitizeUserContent(response);
        if (!sanitizedResponse) {
          toast.error("La réponse du coach a été filtrée pour des raisons de sécurité. Veuillez réessayer.");
          return;
        }
        const newAssistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: sanitizedResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, newAssistantMessage]);
      }
    } catch (error) {
      logger.error('Error generating response:', error);
      toast.error("Désolé, je n'ai pas pu générer de réponse. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleStartRecording = async () => {
    toast.info("Fonctionnalité d'enregistrement vocal à venir");
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
  };
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {showHeader && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/coach-avatar.png" />
              <AvatarFallback>
                <Bot className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-medium">Coach EmotionsCare</h2>
              <p className="text-sm text-muted-foreground">Disponible 24/7 pour vous accompagner</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {showCharacter && (
          <div className="hidden md:block w-1/4 border-r p-4 bg-muted/20">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/coach-avatar.png" />
                <AvatarFallback className="bg-primary/20">
                  <Bot className="h-12 w-12 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium">Emma</h3>
                <p className="text-sm text-muted-foreground">Coach en bien-être émotionnel</p>
              </div>
              
              <Card className="w-full mt-4">
                <CardContent className="p-3 text-sm">
                  <p className="font-medium mb-1">Spécialités:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Gestion du stress</li>
                    <li>Pleine conscience</li>
                    <li>Intelligence émotionnelle</li>
                    <li>Équilibre vie pro/perso</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Button variant="outline" className="w-full" onClick={() => toast.info("Fonctionnalité à venir")}>
                <Wand2 className="h-4 w-4 mr-2" />
                Paramètres IA
              </Button>
            </div>
          </div>
        )}

        <div className={`flex flex-col flex-1 ${showCharacter ? 'md:w-3/4' : 'w-full'}`}>
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="mt-0.5">
                    {message.role === 'user' ? (
                      <>
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/coach-avatar.png" />
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <Avatar className="mt-0.5">
                    <AvatarImage src="/coach-avatar.png" />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="rounded-lg p-3 bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => toast.info("Fonctionnalité à venir")}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
              >
                {isRecording ? (
                  <StopCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez un message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isRecording && (
              <div className="flex items-center mt-2 text-xs text-red-500 animate-pulse">
                <MicOff className="h-3 w-3 mr-1" />
                Enregistrement en cours... Cliquez sur le bouton pour arrêter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCoachChat;
