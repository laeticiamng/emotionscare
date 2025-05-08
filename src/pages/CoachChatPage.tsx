
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, RefreshCw, ArrowLeft } from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { useCoach } from '@/hooks/coach/useCoach';
import { useActivity } from '@/hooks/useActivity';

const CoachChatPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const { toast } = useToast();
  const { askQuestion, generateRecommendation } = useCoach();
  const { logActivity } = useActivity();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Récupérer la question initiale des paramètres de navigation
  useEffect(() => {
    const state = location.state as { initialQuestion?: string } | undefined;
    if (state?.initialQuestion) {
      handleSendMessage(state.initialQuestion);
    }
  }, [location.state]);

  // Faire défiler automatiquement vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText: string = userMessage) => {
    if (!messageText.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessageObj: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessageObj]);
    setUserMessage('');
    setIsLoading(true);
    
    try {
      // Log d'activité
      logActivity('coach_chat', { message: messageText });
      
      // Obtenir une réponse du coach IA
      const response = await askQuestion(messageText);
      
      // Ajouter la réponse du coach
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message to coach:', error);
      toast({
        title: "Erreur",
        description: "Impossible de communiquer avec le coach IA. Veuillez réessayer.",
        variant: "destructive"
      });
      
      // Ajouter un message d'erreur
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Je suis désolé, mais je rencontre des difficultés techniques. Veuillez réessayer plus tard.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      // Donner le focus à l'input après l'envoi
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRegenerate = async () => {
    // Récupérer le dernier message de l'utilisateur
    const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
    if (!lastUserMessage) return;
    
    setIsLoading(true);
    
    try {
      // Log
      logActivity('coach_regenerate', { originalMessageId: lastUserMessage.id });
      
      // Obtenir une nouvelle réponse
      const response = await askQuestion(lastUserMessage.text);
      
      // Ajouter la nouvelle réponse
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
      toast({
        title: "Nouvelle réponse générée",
        description: "Une nouvelle réponse a été générée pour votre question."
      });
    } catch (error) {
      console.error('Error regenerating response:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer une nouvelle réponse.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-4 max-w-4xl h-[80vh] flex flex-col">
        <Card className="flex-grow flex flex-col overflow-hidden p-0">
          {/* En-tête du chat */}
          <div className="bg-secondary/50 p-4 border-b flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">Coach IA Personnel</h1>
              <p className="text-sm text-muted-foreground">Discutez avec votre coach pour obtenir des conseils personnalisés</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          
          {/* Zone de messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2">
                  <div className="flex space-x-2" aria-label="Coach est en train d'écrire...">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Zone de saisie et boutons */}
          <div className="p-4 border-t">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input 
                  ref={inputRef}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrivez votre message..."
                  className="flex-grow"
                  disabled={isLoading}
                  aria-label="Votre message"
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={isLoading || !userMessage.trim()} 
                  aria-label="Envoyer le message"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Envoyer</span>
                </Button>
              </div>
              
              {messages.length > 1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="self-end" 
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  aria-label="Régénérer une réponse"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Régénérer une réponse
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default CoachChatPage;
