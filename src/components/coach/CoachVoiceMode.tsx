/**
 * CoachVoiceMode - Mode conversation vocale avec le coach IA
 * Permet d'interagir avec le coach par la voix
 */

import React, { useState, useRef, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, MicOff, Volume2, VolumeX, MessageCircle,
  Loader2, Pause, Play, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

const CoachVoiceMode = memo(() => {
  const { toast } = useToast();
  const [state, setState] = useState<VoiceState>('idle');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'coach',
      content: 'Bonjour ! Je suis votre coach bien-être. Comment vous sentez-vous aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setState('processing');
        
        // Simuler traitement (en production: envoyer à l'API de transcription)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const userMessage = "Je me sens un peu stressé aujourd'hui";
        setTranscript(userMessage);
        
        addMessage('user', userMessage);
        
        // Simuler réponse du coach
        setState('speaking');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        addMessage('coach', 
          "Je comprends. Le stress est une réaction naturelle. Voulez-vous que nous fassions un exercice de respiration ensemble pour vous aider à vous détendre ?"
        );
        
        setState('idle');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setState('listening');
      setTranscript('');
      
      toast({
        title: 'Écoute en cours',
        description: 'Parlez maintenant...'
      });
    } catch (error) {
      toast({
        title: 'Erreur microphone',
        description: 'Impossible d\'accéder au microphone',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && state === 'listening') {
      mediaRecorderRef.current.stop();
    }
  }, [state]);

  const addMessage = (role: 'user' | 'coach', content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    }]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? 'Audio activé' : 'Audio désactivé',
      description: isMuted ? 'Vous entendrez les réponses du coach' : 'Le coach répondra en texte uniquement'
    });
  };

  const getStateDisplay = () => {
    switch (state) {
      case 'listening':
        return { text: 'Écoute...', color: 'bg-green-500' };
      case 'processing':
        return { text: 'Traitement...', color: 'bg-yellow-500' };
      case 'speaking':
        return { text: 'Le coach parle...', color: 'bg-blue-500' };
      default:
        return { text: 'En attente', color: 'bg-gray-500' };
    }
  };

  const stateDisplay = getStateDisplay();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Mode Vocal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${stateDisplay.color} bg-opacity-20`}
            >
              <div className={`h-2 w-2 rounded-full ${stateDisplay.color} mr-2 ${
                state !== 'idle' ? 'animate-pulse' : ''
              }`} />
              {stateDisplay.text}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              title={isMuted ? 'Activer l\'audio' : 'Désactiver l\'audio'}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Zone de conversation */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px]">
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Transcript en cours */}
          <AnimatePresence>
            {transcript && state === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-end"
              >
                <div className="max-w-[80%] p-3 rounded-lg bg-primary/50 text-primary-foreground">
                  <p className="text-sm italic">{transcript}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Visualisation audio */}
        <AnimatePresence>
          {state === 'listening' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center gap-1 h-12"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [8, 24, 8],
                    transition: {
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.1
                    }
                  }}
                  className="w-1 bg-primary rounded-full"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contrôles */}
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            variant={state === 'listening' ? 'destructive' : 'default'}
            className={`rounded-full h-16 w-16 ${
              state === 'listening' ? 'animate-pulse' : ''
            }`}
            onClick={state === 'listening' ? stopListening : startListening}
            disabled={state === 'processing' || state === 'speaking'}
          >
            {state === 'processing' ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : state === 'listening' ? (
              <MicOff className="h-6 w-6" />
            ) : state === 'speaking' ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          {state === 'idle' && 'Appuyez sur le micro pour parler'}
          {state === 'listening' && 'Parlez maintenant, puis appuyez pour terminer'}
          {state === 'processing' && 'Analyse de votre message...'}
          {state === 'speaking' && 'Le coach vous répond...'}
        </div>

        {/* Suggestions rapides */}
        {state === 'idle' && (
          <div className="flex flex-wrap gap-2 justify-center">
            {['Comment je me sens', 'Exercice de respiration', 'Conseil du jour'].map(suggestion => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  addMessage('user', suggestion);
                  setState('processing');
                  setTimeout(() => {
                    addMessage('coach', 'Je comprends votre demande. Laissez-moi vous guider...');
                    setState('idle');
                  }, 2000);
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

CoachVoiceMode.displayName = 'CoachVoiceMode';

export default CoachVoiceMode;
