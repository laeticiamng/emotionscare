
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
}

const Coach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [coachingTopics, setCoachingTopics] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const quickTopics = [
    'Gestion du stress',
    'Confiance en soi',
    'Motivation',
    'Relations sociales',
    'Équilibre vie-travail',
    'Anxiété',
    'Sommeil',
    'Méditation'
  ];

  useEffect(() => {
    if (user) {
      loadConversations();
      initializeWelcomeMessage();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setConversations(data?.map(conv => ({
        id: conv.id,
        title: conv.title,
        lastMessage: conv.last_message || '',
        updatedAt: new Date(conv.updated_at)
      })) || []);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    }
  };

  const initializeWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: '👋 Bonjour ! Je suis votre coach IA personnel. Je suis là pour vous accompagner dans votre bien-être émotionnel. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const startNewConversation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: 'Nouvelle conversation',
          last_message: ''
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentConversationId(data.id);
      initializeWelcomeMessage();
      await loadConversations();
    } catch (error) {
      console.error('Erreur création conversation:', error);
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Sauvegarder le message utilisateur
      if (user && currentConversationId) {
        await supabase.from('chat_messages').insert({
          conversation_id: currentConversationId,
          sender: 'user',
          text: currentMessage,
          timestamp: new Date().toISOString()
        });
      }

      // Obtenir la réponse de l'IA
      const { data, error } = await supabase.functions.invoke('ai-coach-chat', {
        body: {
          message: currentMessage,
          conversationHistory: messages.slice(-5), // Derniers 5 messages pour le contexte
          userId: user?.id
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response || 'Désolé, je n\'ai pas pu traiter votre demande.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Sauvegarder la réponse IA
      if (user && currentConversationId) {
        await supabase.from('chat_messages').insert({
          conversation_id: currentConversationId,
          sender: 'ai',
          text: aiMessage.text,
          timestamp: new Date().toISOString()
        });

        // Mettre à jour la conversation
        await supabase
          .from('chat_conversations')
          .update({
            last_message: aiMessage.text.slice(0, 100),
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConversationId);
      }

      await loadConversations();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Désolé, une erreur est survenue. Pouvez-vous réessayer ?',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTopic = (topic: string) => {
    setCurrentMessage(`J'aimerais parler de ${topic.toLowerCase()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
          <Heart className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Coach IA</h1>
          <p className="text-muted-foreground">Votre accompagnement personnalisé pour le bien-être</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar avec conversations */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button onClick={startNewConversation} className="w-full">
                Nouvelle conversation
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    currentConversationId === conv.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentConversationId(conv.id)}
                >
                  <div className="font-medium text-sm truncate">{conv.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {conv.lastMessage}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sujets rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sujets populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleQuickTopic(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone de chat principale */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Session de coaching
              </CardTitle>
              <CardDescription>
                Partagez vos préoccupations et recevez des conseils personnalisés
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`max-w-[80%] ${
                      message.sender === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="flex gap-2">
                <Input
                  placeholder="Tapez votre message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!currentMessage.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Coach;
