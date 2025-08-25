import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, Send, Bot, User, Heart, Brain,
  Sparkles, Volume2, VolumeX, Mic, MicOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'audio';
}

interface CoachChatProps {
  coachType?: 'emotional' | 'wellness' | 'mindfulness' | 'general';
  showVoice?: boolean;
  className?: string;
}

const coachProfiles = {
  emotional: {
    name: 'Emma',
    role: 'Coach Émotionnel',
    avatar: '🧘‍♀️',
    description: 'Spécialisée dans la gestion des émotions et le bien-être mental',
    color: 'bg-pink-500'
  },
  wellness: {
    name: 'Alex',
    role: 'Coach Bien-être',
    avatar: '🌟',
    description: 'Expert en lifestyle et habitudes de vie saines',
    color: 'bg-green-500'
  },
  mindfulness: {
    name: 'Sophia',
    role: 'Coach Mindfulness',
    avatar: '🧘',
    description: 'Guide pour la méditation et la pleine conscience',
    color: 'bg-purple-500'
  },
  general: {
    name: 'Jordan',
    role: 'Coach Personnel',
    avatar: '💭',
    description: 'Accompagnement personnalisé et écoute active',
    color: 'bg-blue-500'
  }
};

const CoachChat: React.FC<CoachChatProps> = ({ 
  coachType = 'general', 
  showVoice = true,
  className = '' 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const coach = coachProfiles[coachType];

  useEffect(() => {
    // Message de bienvenue du coach
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `Bonjour ! Je suis ${coach.name}, votre ${coach.role.toLowerCase()}. ${coach.description}. Comment puis-je vous accompagner aujourd'hui ?`,
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [coachType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: content,
          type: coachType,
          context: {
            coach_name: coach.name,
            coach_role: coach.role,
            conversation_history: messages.slice(-5) // Derniers 5 messages pour le contexte
          }
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data?.response || "Je suis désolé, je n'ai pas pu traiter votre message. Pouvez-vous reformuler ?",
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Synthèse vocale si activée
      if (isSpeaking && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(assistantMessage.content);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  const toggleVoice = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col h-[600px] ${className}`}>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${coach.color} flex items-center justify-center text-white text-lg`}>
                {coach.avatar}
              </div>
              <div>
                <CardTitle className="text-lg">{coach.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{coach.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showVoice && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoice}
                  title={isSpeaking ? "Désactiver la voix" : "Activer la voix"}
                >
                  {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              )}
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                En ligne
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'assistant' && (
                  <div className={`w-8 h-8 rounded-full ${coach.color} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                    {coach.avatar}
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className={`w-8 h-8 rounded-full ${coach.color} flex items-center justify-center text-white text-sm`}>
                  {coach.avatar}
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Tapez votre message à ${coach.name}...`}
                  disabled={isLoading}
                  className="pr-12"
                />
                {showVoice && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={startListening}
                    disabled={isListening}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={!newMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachChat;