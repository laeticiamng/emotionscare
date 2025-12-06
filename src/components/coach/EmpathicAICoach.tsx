import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Brain, Lightbulb, Users, Zap, MessageCircle, Send, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: string;
  emotionalContext?: string;
  techniques?: string[];
}

interface CoachPersonality {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  specialties: string[];
  tone: string;
  approach: string;
}

interface ConversationContext {
  userMood: string;
  recentEmotions: string[];
  stressLevel: number;
  conversationGoal: string;
  sessionDuration: number;
}

const EmpathicAICoach: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<string>('empathetic');
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    userMood: 'neutral',
    recentEmotions: [],
    stressLevel: 0.5,
    conversationGoal: 'general_support',
    sessionDuration: 0
  });

  const personalities: CoachPersonality[] = [
    {
      id: 'empathetic',
      name: 'Maya l\'Empathique',
      description: 'Douce et compréhensive, elle vous écoute avec bienveillance',
      icon: <Heart className="h-5 w-5" />,
      specialties: ['Écoute active', 'Validation émotionnelle', 'Soutien inconditionnel'],
      tone: 'warm_compassionate',
      approach: 'supportive_listening'
    },
    {
      id: 'analytical',
      name: 'Dr. Logic',
      description: 'Analytique et structuré, il vous aide à comprendre vos patterns',
      icon: <Brain className="h-5 w-5" />,
      specialties: ['Analyse comportementale', 'Thérapie cognitive', 'Résolution de problèmes'],
      tone: 'analytical_structured',
      approach: 'cognitive_behavioral'
    },
    {
      id: 'motivational',
      name: 'Alex l\'Inspirant',
      description: 'Énergique et motivant, il vous pousse vers vos objectifs',
      icon: <Zap className="h-5 w-5" />,
      specialties: ['Motivation', 'Fixation d\'objectifs', 'Développement personnel'],
      tone: 'energetic_motivational',
      approach: 'solution_focused'
    },
    {
      id: 'creative',
      name: 'Luna la Créative',
      description: 'Créative et intuitive, elle explore de nouvelles perspectives',
      icon: <Lightbulb className="h-5 w-5" />,
      specialties: ['Créativité thérapeutique', 'Art-thérapie', 'Pensée latérale'],
      tone: 'creative_intuitive',
      approach: 'expressive_arts'
    },
    {
      id: 'social',
      name: 'Sam le Social',
      description: 'Sociable et connecté, il vous aide dans vos relations',
      icon: <Users className="h-5 w-5" />,
      specialties: ['Relations sociales', 'Communication', 'Dynamique de groupe'],
      tone: 'social_connecting',
      approach: 'interpersonal_therapy'
    }
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const detectUserEmotion = useCallback(async (message: string): Promise<{
    emotion: string;
    intensity: number;
    context: string[];
  }> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion-text', {
        body: { text: message }
      });

      if (error) throw error;

      return {
        emotion: data.primary_emotion || 'neutral',
        intensity: data.intensity || 0.5,
        context: data.emotional_keywords || []
      };
    } catch (error) {
      logger.error('Error detecting emotion:', error);
      return { emotion: 'neutral', intensity: 0.5, context: [] };
    }
  }, []);

  const generateCoachResponse = useCallback(async (
    userMessage: string,
    personality: CoachPersonality,
    context: ConversationContext
  ): Promise<{
    response: string;
    techniques: string[];
    nextQuestions: string[];
  }> => {
    try {
      const { data, error } = await supabase.functions.invoke('coach-ai', {
        body: {
          userMessage,
          personality: {
            id: personality.id,
            name: personality.name,
            tone: personality.tone,
            approach: personality.approach,
            specialties: personality.specialties
          },
          context,
          conversationHistory: messages.slice(-5).map(m => ({
            content: m.content,
            sender: m.sender
          }))
        }
      });

      if (error) throw error;

      return {
        response: data.response,
        techniques: data.suggested_techniques || [],
        nextQuestions: data.next_questions || []
      };
    } catch (error) {
      logger.error('Error generating response:', error);
      throw error;
    }
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Detect user emotion
      const emotionData = await detectUserEmotion(currentMessage);
      
      // Update conversation context
      const updatedContext: ConversationContext = {
        ...conversationContext,
        userMood: emotionData.emotion,
        recentEmotions: [...conversationContext.recentEmotions.slice(-4), emotionData.emotion],
        stressLevel: emotionData.intensity,
        sessionDuration: conversationContext.sessionDuration + 1
      };
      setConversationContext(updatedContext);

      // Generate coach response
      const selectedCoach = personalities.find(p => p.id === selectedPersonality)!;
      const coachData = await generateCoachResponse(currentMessage, selectedCoach, updatedContext);

      // Add coach message
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: coachData.response,
        sender: 'coach',
        timestamp: new Date().toISOString(),
        emotionalContext: emotionData.emotion,
        techniques: coachData.techniques
      };

      setMessages(prev => [...prev, coachMessage]);

      // Save conversation to database
      await supabase.from('coach_conversations').upsert({
        user_id: user?.id,
        personality: selectedPersonality,
        message_count: messages.length + 2,
        last_message_at: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  }, [currentMessage, isTyping, conversationContext, selectedPersonality, personalities, detectUserEmotion, generateCoachResponse, messages.length, user?.id, toast]);

  const startNewConversation = useCallback(async (goal: string) => {
    setMessages([]);
    setConversationContext({
      userMood: 'neutral',
      recentEmotions: [],
      stressLevel: 0.5,
      conversationGoal: goal,
      sessionDuration: 0
    });

    const selectedCoach = personalities.find(p => p.id === selectedPersonality)!;
    
    // Generate opening message based on personality and goal
    try {
      const { data, error } = await supabase.functions.invoke('coach-ai', {
        body: {
          userMessage: '',
          personality: {
            id: selectedCoach.id,
            name: selectedCoach.name,
            tone: selectedCoach.tone,
            approach: selectedCoach.approach
          },
          context: { ...conversationContext, conversationGoal: goal },
          isOpening: true
        }
      });

      if (error) throw error;

      const openingMessage: Message = {
        id: Date.now().toString(),
        content: data.response || `Bonjour ! Je suis ${selectedCoach.name}. Comment puis-je vous aider aujourd'hui ?`,
        sender: 'coach',
        timestamp: new Date().toISOString()
      };

      setMessages([openingMessage]);
    } catch (error) {
      logger.error('Error starting conversation:', error);
    }
  }, [selectedPersonality, personalities, conversationContext]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (messages.length === 0) {
      startNewConversation('general_support');
    }
  }, [selectedPersonality, startNewConversation, messages.length]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            Coach IA Empathique
          </CardTitle>
          
          <div className="flex items-center gap-4">
            <Select value={selectedPersonality} onValueChange={setSelectedPersonality}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choisir un coach" />
              </SelectTrigger>
              <SelectContent>
                {personalities.map((personality) => (
                  <SelectItem key={personality.id} value={personality.id}>
                    <div className="flex items-center gap-2">
                      {personality.icon}
                      <span>{personality.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startNewConversation('stress_management')}
              >
                Gestion du stress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startNewConversation('emotional_support')}
              >
                Soutien émotionnel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startNewConversation('personal_growth')}
              >
                Développement personnel
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Coach Personality Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {personalities.find(p => p.id === selectedPersonality)?.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {personalities.find(p => p.id === selectedPersonality)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {personalities.find(p => p.id === selectedPersonality)?.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {personalities.find(p => p.id === selectedPersonality)?.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Area */}
          <Card className="h-[500px] flex flex-col">
            <CardContent className="flex-1 p-4">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.techniques && message.techniques.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.techniques.map((technique, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                {technique}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Partagez vos pensées..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isTyping}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!currentMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Context Display */}
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span>Humeur: <Badge variant="outline">{conversationContext.userMood}</Badge></span>
                  <span>Stress: {Math.round(conversationContext.stressLevel * 100)}%</span>
                </div>
                <div className="text-muted-foreground">
                  Session: {conversationContext.sessionDuration} échanges
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmpathicAICoach;