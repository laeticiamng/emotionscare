import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Sparkles, Brain, Heart, TrendingUp, Send, Star } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Message {
  role: 'user' | 'coach';
  content: string;
  timestamp: Date;
  emotion?: string;
}

interface Session {
  id: string;
  coach_personality: string;
  messages_count: number;
  emotions_detected: string[];
  created_at: string;
}

interface Recommendation {
  type: string;
  title: string;
  description: string;
  priority: string;
}

export const AICoachingDashboard: React.FC = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [coachPersonality, setCoachPersonality] = useState<'empathetic' | 'motivational' | 'analytical'>('empathetic');

  useEffect(() => {
    loadSessions();
    loadRecommendations();
  }, []);

  const loadSessions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('ai-coaching/sessions', {
        method: 'GET',
      });

      if (response.data?.sessions) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      logger.error('Erreur chargement sessions', error as Error, 'UI');
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await supabase.functions.invoke('ai-coaching/recommendations', {
        method: 'GET',
      });

      if (response.data?.recommendations) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      logger.error('Erreur chargement recommandations', error as Error, 'UI');
    }
  };

  const startNewSession = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('ai-coaching/sessions', {
        method: 'POST',
        body: {
          coach_personality: coachPersonality,
          initial_emotion: currentEmotion,
        },
      });

      if (response.data?.session) {
        setCurrentSession(response.data.session);
        setMessages([
          {
            role: 'coach',
            content: `Bonjour ! Je suis votre coach ${
              coachPersonality === 'empathetic' ? 'empathique' :
              coachPersonality === 'motivational' ? 'motivant' : 'analytique'
            }. Comment vous sentez-vous aujourd'hui ?`,
            timestamp: new Date(),
          },
        ]);
        toast({
          title: 'Session démarrée',
          description: 'Votre session de coaching a commencé',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer la session',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      emotion: currentEmotion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await supabase.functions.invoke('ai-coaching/chat', {
        method: 'POST',
        body: {
          session_id: currentSession.id,
          message: inputMessage,
          emotion: currentEmotion,
        },
      });

      if (response.data?.response) {
        const coachMessage: Message = {
          role: 'coach',
          content: response.data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, coachMessage]);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const endSession = async (rating: number) => {
    if (!currentSession) return;

    try {
      await supabase.functions.invoke(`ai-coaching/sessions/${currentSession.id}/complete`, {
        method: 'POST',
        body: {
          satisfaction_rating: rating,
          notes: `Session terminée avec ${messages.length} messages`,
        },
      });

      toast({
        title: 'Session terminée',
        description: 'Merci pour votre feedback !',
      });

      setCurrentSession(null);
      setMessages([]);
      loadSessions();
    } catch (error) {
      logger.error('Erreur fin de session', error as Error, 'UI');
    }
  };

  const personalityIcons = {
    empathetic: <Heart className="h-5 w-5" />,
    motivational: <Sparkles className="h-5 w-5" />,
    analytical: <Brain className="h-5 w-5" />,
  };

  const emotionColors: Record<string, string> = {
    heureux: 'bg-green-100 text-green-800',
    calme: 'bg-blue-100 text-blue-800',
    anxieux: 'bg-yellow-100 text-yellow-800',
    triste: 'bg-gray-100 text-gray-800',
    stressé: 'bg-red-100 text-red-800',
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageCircle className="h-8 w-8 text-primary" />
          Coaching IA Personnalisé
        </h1>
      </div>

      {!currentSession ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Démarrer une nouvelle session */}
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Type de coach
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['empathetic', 'motivational', 'analytical'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={coachPersonality === type ? 'default' : 'outline'}
                      onClick={() => setCoachPersonality(type)}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      {personalityIcons[type]}
                      <span className="text-xs">
                        {type === 'empathetic' ? 'Empathique' :
                         type === 'motivational' ? 'Motivant' : 'Analytique'}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Comment vous sentez-vous ?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['heureux', 'calme', 'anxieux', 'triste', 'stressé'].map((emotion) => (
                    <Badge
                      key={emotion}
                      variant={currentEmotion === emotion ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setCurrentEmotion(emotion)}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={startNewSession}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Démarrage...' : 'Démarrer la session'}
              </Button>
            </CardContent>
          </Card>

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-lg space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'}>
                      {rec.priority === 'high' ? 'Prioritaire' : 'Suggéré'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Historique des sessions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Sessions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="p-3 border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {personalityIcons[session.coach_personality as keyof typeof personalityIcons]}
                      <div>
                        <p className="text-sm font-medium">
                          Coach {session.coach_personality}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString()} • {session.messages_count} messages
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {session.emotions_detected?.slice(0, 3).map((emotion, idx) => (
                        <Badge key={idx} variant="outline" className={emotionColors[emotion] || ''}>
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {personalityIcons[currentSession.coach_personality as keyof typeof personalityIcons]}
                Session en cours
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Évaluer la session :
                </span>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="ghost"
                    size="sm"
                    onClick={() => endSession(rating)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écrivez votre message..."
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Sélection d'émotion rapide */}
            <div className="flex gap-2">
              {['heureux', 'calme', 'anxieux', 'triste', 'stressé'].map((emotion) => (
                <Badge
                  key={emotion}
                  variant={currentEmotion === emotion ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setCurrentEmotion(emotion)}
                >
                  {emotion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AICoachingDashboard;
