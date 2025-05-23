
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User, Bot, Loader2, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

const AICoach: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeConversation();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = async () => {
    if (!user) return;

    try {
      // Charger ou créer une conversation
      const { data: conversations, error: conversationsError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (conversationsError) throw conversationsError;

      let currentConversationId: string;

      if (conversations && conversations.length > 0) {
        currentConversationId = conversations[0].id;
        setConversationId(currentConversationId);

        // Charger les messages existants
        const { data: chatMessages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', currentConversationId)
          .order('timestamp', { ascending: true });

        if (messagesError) throw messagesError;

        if (chatMessages) {
          const formattedMessages: Message[] = chatMessages.map(msg => ({
            id: msg.id,
            sender: msg.sender as 'user' | 'coach',
            content: msg.text,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        }
      } else {
        // Créer une nouvelle conversation
        const { data: newConversation, error: createError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            title: 'Session de coaching'
          })
          .select()
          .single();

        if (createError) throw createError;

        currentConversationId = newConversation.id;
        setConversationId(currentConversationId);

        // Message de bienvenue
        const welcomeMessage: Message = {
          id: 'welcome',
          sender: 'coach',
          content: `Bonjour ${user.name || 'cher utilisateur'} ! Je suis votre coach en bien-être émotionnel. Comment vous sentez-vous aujourd'hui ? N'hésitez pas à me parler de ce qui vous préoccupe ou de ce que vous ressentez. Je suis là pour vous accompagner avec bienveillance.`,
          timestamp: new Date()
        };

        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast.error('Erreur lors de l\'initialisation de la conversation');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      // Construire l'historique pour l'IA
      const history = messages.map(msg => ({
        sender: msg.sender,
        content: msg.content
      }));

      // Appeler l'API du coach IA
      const { data, error } = await supabase.functions.invoke('chat-coach', {
        body: {
          message: inputMessage,
          history: history
        }
      });

      if (error) throw error;

      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachResponse]);

      // Sauvegarder la réponse du coach
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender: 'coach',
          text: data.response
        });

      // Mettre à jour la conversation
      await supabase
        .from('chat_conversations')
        .update({
          last_message: data.response,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      
      // Message d'erreur du coach
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        content: 'Je suis désolé, j\'ai rencontré un problème technique. Pourriez-vous réessayer ? Je suis là pour vous aider.',
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
      sendMessage();
    }
  };

  const startNewConversation = async () => {
    if (!user) return;

    try {
      const { data: newConversation, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: 'Nouvelle session de coaching'
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(newConversation.id);
      setMessages([{
        id: 'welcome-new',
        sender: 'coach',
        content: 'Nouvelle conversation commencée ! Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date()
      }]);

      toast.success('Nouvelle conversation créée');
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Coach IA Bien-être
            </CardTitle>
            <CardDescription>
              Votre accompagnant personnel pour le bien-être émotionnel
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={startNewConversation}>
            Nouvelle conversation
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'coach' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Le coach réfléchit...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Partagez vos émotions, vos préoccupations..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Appuyez sur Entrée pour envoyer. Votre coach IA est formé pour vous accompagner avec bienveillance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICoach;
