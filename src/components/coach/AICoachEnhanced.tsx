import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { coachSessionsApi, type CoachAnalytics } from '@/services/api/coachSessionsApi';
import { useToast } from '@/hooks/use-toast';
import {
  Send,
  Sparkles,
  Heart,
  Brain,
  TrendingUp,
  MessageCircle,
  Loader2,
  Bot
} from 'lucide-react';
import { logger } from '@/lib/logger';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  emotion?: string;
}

interface CoachStats {
  totalSessions: number;
  totalMessages: number;
  favoriteTopics: string[];
  emotionalProgress: number;
}

const AICoachEnhanced: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [stats, setStats] = useState<CoachStats | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConversationHistory();
    loadStats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_conversations')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedMessages: Message[] = [];
        data.forEach((conv: any) => {
          formattedMessages.push({
            id: `user-${conv.id}`,
            content: conv.message,
            isBot: false,
            timestamp: new Date(conv.created_at),
            emotion: conv.emotion
          });
          formattedMessages.push({
            id: `bot-${conv.id}`,
            content: conv.response,
            isBot: true,
            timestamp: new Date(conv.created_at)
          });
        });
        setMessages(formattedMessages);
      }
    } catch (error) {
      logger.error('Error loading conversation', error as Error, 'UI');
    }
  };

  const loadStats = async () => {
    try {
      // Try to load analytics from API
      const analytics = await coachSessionsApi.getAnalytics();

      setStats({
        totalSessions: analytics.total_sessions,
        totalMessages: analytics.total_messages,
        favoriteTopics: ['Gestion du stress', 'Anxiété', 'Motivation'],
        emotionalProgress: analytics.average_satisfaction ? analytics.average_satisfaction * 20 : 75
      });
    } catch (error) {
      // Fallback to default stats if API fails
      logger.warn('Could not load coach analytics from API', {}, 'UI');
      setStats({
        totalSessions: 0,
        totalMessages: 0,
        favoriteTopics: ['Gestion du stress', 'Anxiété', 'Motivation'],
        emotionalProgress: 0
      });
    }
  };

  const sendMessage = async (content: string, emotion?: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      isBot: false,
      timestamp: new Date(),
      emotion
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('ai-coach-chat', {
        body: {
          message: content,
          emotion: emotion || currentEmotion,
          conversationHistory: messages.slice(-10)
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: data.response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }

      toast({
        title: "Réponse reçue",
        description: "Le coach a répondu à votre message",
      });

    } catch (error) {
      logger.error('Error sending message', error as Error, 'UI');
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
    sendMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const detectEmotion = (text: string): string | undefined => {
    const emotionKeywords = {
      anxious: ['anxieux', 'inquiet', 'stressé', 'peur'],
      sad: ['triste', 'déprimé', 'découragé', 'mélancolique'],
      angry: ['en colère', 'énervé', 'frustré', 'agacé'],
      happy: ['heureux', 'content', 'joyeux', 'épanoui']
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return emotion;
      }
    }
    return undefined;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Coach IA EmotionsCare</h1>
        </div>
        <p className="text-muted-foreground">Votre compagnon de bien-être émotionnel disponible 24/7</p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Conversation
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Sparkles className="w-4 h-4 mr-2" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="stats">
            <TrendingUp className="w-4 h-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[500px] pr-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <Bot className="w-16 h-16 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold">Bienvenue ! 👋</h3>
                      <p className="text-muted-foreground">
                        Comment puis-je vous aider aujourd'hui ?
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            msg.isBot
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            <span>{msg.timestamp.toLocaleTimeString()}</span>
                            {msg.emotion && (
                              <Badge variant="outline" className="text-xs">
                                {msg.emotion}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-secondary rounded-lg p-4">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    const detectedEmotion = detectEmotion(e.target.value);
                    if (detectedEmotion) setCurrentEmotion(detectedEmotion);
                  }}
                  placeholder="Partagez ce que vous ressentez..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Questions suggérées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                  </Button>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Commencez une conversation pour recevoir des suggestions personnalisées</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Thèmes populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Gestion du stress',
                  'Anxiété',
                  'Motivation',
                  'Confiance en soi',
                  'Relations',
                  'Sommeil'
                ].map((topic) => (
                  <Button
                    key={topic}
                    variant="secondary"
                    className="justify-start"
                    onClick={() => sendMessage(`Parlez-moi de ${topic.toLowerCase()}`)}
                    disabled={isLoading}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {stats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <MessageCircle className="w-8 h-8 mx-auto text-primary" />
                      <div className="text-3xl font-bold">{stats.totalMessages}</div>
                      <div className="text-sm text-muted-foreground">Messages échangés</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <Brain className="w-8 h-8 mx-auto text-primary" />
                      <div className="text-3xl font-bold">{stats.totalSessions}</div>
                      <div className="text-sm text-muted-foreground">Sessions de coaching</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <Heart className="w-8 h-8 mx-auto text-primary" />
                      <div className="text-3xl font-bold">{stats.emotionalProgress}%</div>
                      <div className="text-sm text-muted-foreground">Progrès émotionnel</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Thèmes les plus abordés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.favoriteTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{topic}</span>
                        <Badge>{Math.floor(Math.random() * 20 + 5)} fois</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Commencez à utiliser le coach pour voir vos statistiques</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AICoachEnhanced;
