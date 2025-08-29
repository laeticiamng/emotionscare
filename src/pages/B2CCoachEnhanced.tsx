import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Mic, MicOff, Brain, Heart, Sparkles, Wand2, Volume2, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  emotion?: string;
  suggestions?: string[];
  resources?: any[];
}

interface CoachPersonality {
  id: string;
  name: string;
  avatar: string;
  description: string;
  specialties: string[];
  tone: string;
  color: string;
}

const B2CCoachEnhanced: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachPersonality | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [sessionStats, setSessionStats] = useState({
    sessionsToday: 0,
    totalMessages: 0,
    averageRating: 4.8,
    streakDays: 7
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState('');

  const coaches: CoachPersonality[] = [
    {
      id: 'emma',
      name: 'Emma',
      avatar: '👩‍⚕️',
      description: 'Coach empathique spécialisée en gestion émotionnelle',
      specialties: ['Anxiété', 'Stress', 'Confiance en soi'],
      tone: 'empathetic',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'marcus',
      name: 'Marcus',
      avatar: '👨‍💼',
      description: 'Coach de performance et motivation',
      specialties: ['Productivité', 'Objectifs', 'Leadership'],
      tone: 'motivating',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'luna',
      name: 'Luna',
      avatar: '🧘‍♀️',
      description: 'Experte en mindfulness et bien-être',
      specialties: ['Méditation', 'Relaxation', 'Équilibre'],
      tone: 'zen',
      color: 'from-green-400 to-teal-500'
    },
    {
      id: 'alex',
      name: 'Alex',
      avatar: '🎯',
      description: 'Coach en développement personnel',
      specialties: ['Habitudes', 'Transformation', 'Résilience'],
      tone: 'direct',
      color: 'from-purple-400 to-violet-500'
    }
  ];

  useEffect(() => {
    // Message de bienvenue par défaut
    if (messages.length === 0 && selectedCoach) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Bonjour ! Je suis ${selectedCoach.name}, votre coach IA personnel. Comment puis-je vous aider aujourd'hui ? 😊`,
        sender: 'coach',
        timestamp: new Date(),
        suggestions: [
          'Je me sens anxieux',
          'J\'ai besoin de motivation',
          'Comment gérer mon stress ?',
          'Aide-moi à me relaxer'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedCoach]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string, isVoice = false) => {
    if (!content.trim() || !selectedCoach) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Analyse de l'émotion du message
      const emotionResponse = await supabase.functions.invoke('ai-emotion-analysis', {
        body: { 
          text: content,
          context: 'coaching_session',
          user_emotion: currentEmotion 
        }
      });

      // Génération de la réponse du coach
      const coachResponse = await supabase.functions.invoke('ai-coach-response', {
        body: {
          message: content,
          coachId: selectedCoach.id,
          conversationHistory: messages.slice(-5), // Derniers 5 messages
          userEmotion: emotionResponse.data?.dominant_emotion || 'neutral',
          isVoiceMessage: isVoice
        }
      });

      if (coachResponse.error) throw coachResponse.error;

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: coachResponse.data.response,
        sender: 'coach',
        timestamp: new Date(),
        emotion: emotionResponse.data?.dominant_emotion,
        suggestions: coachResponse.data.suggestions,
        resources: coachResponse.data.resources
      };

      setMessages(prev => [...prev, coachMessage]);
      
      // Lecture audio de la réponse (optionnel)
      if (coachResponse.data.audioResponse) {
        playAudioResponse(coachResponse.data.audioResponse);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Désolé, je rencontre un petit problème technique. Pouvez-vous reformuler votre question ?",
        sender: 'coach',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64 = reader.result?.toString().split(',')[1];
          if (base64) {
            await transcribeAndSend(base64);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAndSend = async (audioBase64: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('openai-whisper', {
        body: { audio: audioBase64 }
      });

      if (error) throw error;
      await sendMessage(data.text, true);

    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "Erreur",
        description: "Impossible de transcrire l'audio",
        variant: "destructive"
      });
    }
  };

  const playAudioResponse = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('openai-tts', {
        body: { 
          text,
          voice: selectedCoach?.tone === 'empathetic' ? 'nova' : 'alloy'
        }
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.play();

    } catch (error) {
      console.error('Error playing audio response:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  if (!selectedCoach) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Brain className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Coach IA Personnel 🤖</h1>
            <p className="text-muted-foreground">Choisissez votre coach préféré pour commencer</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coaches.map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => setSelectedCoach(coach)}
              >
                <CardHeader className={`bg-gradient-to-r ${coach.color} text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{coach.avatar}</div>
                    <div>
                      <CardTitle className="text-xl">{coach.name}</CardTitle>
                      <p className="text-sm opacity-90">{coach.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Spécialités:</h4>
                      <div className="flex flex-wrap gap-2">
                        {coach.specialties.map(specialty => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      {/* Header avec coach sélectionné */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className={`bg-gradient-to-r ${selectedCoach.color} text-white text-xl`}>
              {selectedCoach.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Chat avec {selectedCoach.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedCoach.description}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setSelectedCoach(null)}
        >
          Changer de coach
        </Button>
      </motion.div>

      {/* Stats de session */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{sessionStats.sessionsToday}</div>
            <div className="text-sm text-muted-foreground">Sessions aujourd'hui</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{sessionStats.totalMessages}</div>
            <div className="text-sm text-muted-foreground">Messages échangés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{sessionStats.averageRating}</div>
            <div className="text-sm text-muted-foreground">Note moyenne</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{sessionStats.streakDays}</div>
            <div className="text-sm text-muted-foreground">Streak (jours)</div>
          </CardContent>
        </Card>
      </div>

      {/* Zone de chat */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader className={`bg-gradient-to-r ${selectedCoach.color} text-white`}>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Session de Coaching
          </CardTitle>
        </CardHeader>
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-lg p-4 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground ml-4' 
                        : 'bg-muted mr-4'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.emotion && (
                        <Badge variant="outline" className="mt-2">
                          Émotion détectée: {message.emotion}
                        </Badge>
                      )}
                    </div>
                    
                    {message.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                    {message.sender === 'user' ? (
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    ) : (
                      <AvatarFallback className={`bg-gradient-to-r ${selectedCoach.color} text-white`}>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Indicateur de frappe */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-4 mr-4">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={`bg-gradient-to-r ${selectedCoach.color} text-white text-xs`}>
                        {selectedCoach.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Zone de saisie */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
              disabled={isTyping}
            />
            <Button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              variant="outline"
              size="icon"
              className={isRecording ? 'bg-red-500 text-white animate-pulse' : ''}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={() => sendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default B2CCoachEnhanced;