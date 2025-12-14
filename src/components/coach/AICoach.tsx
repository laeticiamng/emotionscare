import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
      // Créer une nouvelle conversation ou récupérer la dernière
      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let convId: string;

      if (conversations && conversations.length > 0) {
        convId = conversations[0].id;
        setConversationId(convId);
        
        // Charger les messages existants
        const { data: existingMessages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('timestamp', { ascending: true });

        if (messagesError) throw messagesError;

        const formattedMessages: Message[] = existingMessages?.map(msg => ({
          id: msg.id,
          sender: msg.sender as 'user' | 'ai',
          content: msg.text,
          timestamp: new Date(msg.timestamp)
        })) || [];

        setMessages(formattedMessages);
      } else {
        // Créer une nouvelle conversation
        const { data: newConv, error: convError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            title: 'Session avec Coach IA'
          })
          .select()
          .single();

        if (convError) throw convError;
        
        convId = newConv.id;
        setConversationId(convId);
        
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
      // Sauvegarder le message utilisateur
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender: 'user',
          text: inputMessage
        });

      // Simuler la réponse de l'IA (remplacer par l'appel OpenAI réel)
      const aiResponse = await generateAIResponse(inputMessage);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      // Sauvegarder la réponse IA
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender: 'ai',
          text: aiResponse
        });

      setMessages(prev => [...prev, aiMessage]);

      // Mettre à jour la conversation
      await supabase
        .from('chat_conversations')
        .update({
          last_message: aiResponse,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

    } catch (error) {
      logger.error('Send message error:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    try {
      // Appeler l'edge function openai-chat pour une vraie réponse IA
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `Tu es un coach émotionnel bienveillant et professionnel pour EmotionsCare. 
              Tu aides les utilisateurs à gérer leurs émotions, leur stress et leur bien-être.
              Réponds en français de manière empathique, concise et actionnable.
              Suggère des exercices pratiques (respiration, méditation, journaling) quand c'est pertinent.
              N'oublie jamais de valider les émotions de l'utilisateur avant de proposer des solutions.
              Limite tes réponses à 3-4 phrases maximum.`
            },
            ...messages.slice(-6).map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content
            })),
            { role: 'user', content: userInput }
          ]
        }
      });

      if (error) {
        logger.error('AI Coach error:', error);
        throw error;
      }

      // Extraire la réponse du format de l'edge function
      const aiMessage = data?.choices?.[0]?.message?.content || data?.response || data?.content;
      
      if (!aiMessage) {
        throw new Error('No response from AI');
      }

      return aiMessage;
    } catch (error) {
      logger.warn('Falling back to local responses:', error);
      
      // Fallback vers les réponses locales si l'IA n'est pas disponible
      const input = userInput.toLowerCase();
      
      if (input.includes('stress') || input.includes('anxieux')) {
        return "Je comprends que vous ressentez du stress. Avez-vous essayé la technique de respiration 4-7-8 ? Inspirez pendant 4 secondes, retenez pendant 7, puis expirez pendant 8. Cette technique peut vous aider à vous détendre immédiatement.";
      }
      
      if (input.includes('triste') || input.includes('déprim')) {
        return "Il est normal de se sentir triste parfois. Ces émotions font partie de l'expérience humaine. Puis-je vous suggérer de vous concentrer sur une petite activité qui vous procure habituellement de la joie ?";
      }
      
      if (input.includes('fatigue') || input.includes('épuis')) {
        return "La fatigue peut affecter notre bien-être émotionnel. Assurez-vous de prendre des pauses régulières et d'avoir un sommeil de qualité. Avez-vous pensé à essayer une courte méditation ?";
      }
      
      if (input.includes('heureux') || input.includes('bien') || input.includes('content')) {
        return "C'est merveilleux d'entendre que vous vous sentez bien ! Profitez de ce moment positif. Que pouvez-vous faire aujourd'hui pour maintenir cette sensation ?";
      }
      
      return "Merci de partager cela avec moi. Votre bien-être émotionnel est important. Pouvez-vous me dire ce qui vous préoccupe le plus en ce moment ?";
    }
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
            aria-label="Envoyer le message"
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
