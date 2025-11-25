import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { coachSessionsApi, type CoachSessionRecord, type CoachMessageRecord } from '@/services/api/coachSessionsApi';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AICoach: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeConversation();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = async () => {
    if (!user) return;

    try {
      // Récupérer les sessions existantes via API
      const sessions = await coachSessionsApi.listSessions({ limit: 1 });

      let sessionId: string;

      if (sessions && sessions.length > 0) {
        sessionId = sessions[0].id;
        setConversationId(sessionId);

        // Charger les messages existants via API
        const existingMessages = await coachSessionsApi.getMessages(sessionId);

        const formattedMessages: Message[] = existingMessages.map((msg: CoachMessageRecord) => ({
          id: msg.id,
          sender: msg.sender === 'user' ? 'user' : 'ai' as const,
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }));

        setMessages(formattedMessages);
      } else {
        // Créer une nouvelle session via API
        const newSession = await coachSessionsApi.createSession({
          title: 'Session avec Coach IA'
        });

        sessionId = newSession.id;
        setConversationId(sessionId);

        // Message de bienvenue
        const welcomeMessage: Message = {
          id: 'welcome',
          sender: 'ai',
          content: `Bonjour ! Je suis votre coach IA personnel. Comment puis-je vous aider avec votre bien-être émotionnel aujourd'hui ?`,
          timestamp: new Date()
        };

        setMessages([welcomeMessage]);
      }
    } catch (error) {
      logger.error('Conversation initialization error:', error);
      toast.error('Erreur lors de l\'initialisation de la conversation');
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Sauvegarder le message utilisateur via API
      await coachSessionsApi.sendMessage({
        session_id: conversationId,
        sender: 'user',
        content: inputMessage
      });

      // Simuler la réponse de l'IA (remplacer par l'appel OpenAI réel)
      const aiResponse = await generateAIResponse(inputMessage);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      // Sauvegarder la réponse IA via API
      await coachSessionsApi.sendMessage({
        session_id: conversationId,
        sender: 'coach',
        content: aiResponse
      });

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      logger.error('Send message error:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Simulation de réponse IA contextuelle
    await new Promise(resolve => setTimeout(resolve, 1500));

    const input = userInput.toLowerCase();
    
    if (input.includes('stress') || input.includes('anxieux')) {
      return "Je comprends que vous ressentez du stress. Avez-vous essayé la technique de respiration 4-7-8 ? Inspirez pendant 4 secondes, retenez pendant 7, puis expirez pendant 8. Cette technique peut vous aider à vous détendre immédiatement.";
    }
    
    if (input.includes('triste') || input.includes('déprim')) {
      return "Il est normal de se sentir triste parfois. Ces émotions font partie de l'expérience humaine. Puis-je vous suggérer de vous concentrer sur une petite activité qui vous procure habituellement de la joie ? Même quelque chose de simple comme écouter votre musique préférée.";
    }
    
    if (input.includes('fatigue') || input.includes('épuis')) {
      return "La fatigue peut affecter notre bien-être émotionnel. Assurez-vous de prendre des pauses régulières et d'avoir un sommeil de qualité. Avez-vous pensé à essayer une courte méditation ou une session de musicothérapie ?";
    }
    
    if (input.includes('heureux') || input.includes('bien') || input.includes('content')) {
      return "C'est merveilleux d'entendre que vous vous sentez bien ! Profitez de ce moment positif. Que pouvez-vous faire aujourd'hui pour maintenir ou renforcer cette sensation de bien-être ?";
    }
    
    return "Merci de partager cela avec moi. Votre bien-être émotionnel est important. Pouvez-vous me dire ce qui vous préoccupe le plus en ce moment ou ce sur quoi vous aimeriez travailler ensemble ?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Coach IA Personnel
        </CardTitle>
        <CardDescription>
          Votre coach en bien-être émotionnel disponible 24h/24
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {message.sender === 'user' ? 
                    <User className="h-4 w-4" /> : 
                    <Bot className="h-4 w-4" />
                  }
                </div>
                
                <div className={`flex-1 max-w-[80%] ${
                  message.sender === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Coach IA réfléchit...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-800 text-xs">
            💡 Votre coach IA est formé pour vous accompagner dans votre bien-être émotionnel. 
            N'hésitez pas à partager vos sentiments et préoccupations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICoach;
