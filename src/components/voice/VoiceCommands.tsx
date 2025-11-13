// @ts-nocheck
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const VoiceCommands = () => {
  const { play, pause, next, previous, stop } = useMusic();
  const [transcript, setTranscript] = useState<string>('');
  const [assistantResponse, setAssistantResponse] = useState<string>('');

  const handleCommand = async (command: string, params?: any) => {
    console.log('🎯 Executing command:', command, params);

    if (command === 'player') {
      switch (params.action) {
        case 'play':
          play();
          toast.success('Lecture démarrée');
          break;
        case 'pause':
          pause();
          toast.success('Lecture en pause');
          break;
        case 'next':
          next();
          toast.success('Piste suivante');
          break;
        case 'previous':
          previous();
          toast.success('Piste précédente');
          break;
        case 'stop':
          stop();
          toast.success('Lecture arrêtée');
          break;
      }
    } else if (command === 'generate') {
      console.log('🎵 Generating music for:', params.emotion, 'intensity:', params.intensity);
      toast.success(`Génération de musique ${params.emotion}...`);
    }
  };

  const handleTranscript = (text: string, isFinal: boolean) => {
    if (isFinal) {
      setTranscript(text);
      setAssistantResponse('');
    } else {
      setAssistantResponse(prev => prev + text);
    }
  };

  const {
    isListening,
    isConnected,
    isSpeaking,
    startListening,
    stopListening
  } = useVoiceCommands({
    onCommand: handleCommand,
    onTranscript: handleTranscript
  });

  return (
    <Card className={cn(
      "fixed bottom-24 left-8 p-4 shadow-lg border-border/50 backdrop-blur-sm z-50",
      "bg-background/80 transition-all duration-300 min-w-[320px]",
      (isListening || isSpeaking) && "ring-2 ring-primary"
    )}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "relative w-12 h-12 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-primary/20 to-primary/5",
              isListening && "animate-pulse"
            )}>
              {isListening ? (
                <Mic className="w-6 h-6 text-primary" />
              ) : (
                <MicOff className="w-6 h-6 text-muted-foreground" />
              )}
              
              {isListening && (
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                Commandes Vocales
              </span>
              <span className="text-xs text-muted-foreground">
                {!isConnected && !isListening && 'Inactif'}
                {isConnected && !isListening && 'Connexion...'}
                {isListening && !isSpeaking && 'En écoute 🎤'}
                {isSpeaking && 'Assistant parle 🔊'}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? stopListening : startListening}
            className="ml-2"
          >
            {isListening ? 'Stop' : 'Start'}
          </Button>
        </div>

        {transcript && (
          <div className="pt-3 border-t border-border/50">
            <div className="text-xs font-semibold text-muted-foreground mb-1">
              Vous :
            </div>
            <div className="text-sm text-foreground bg-muted/50 p-2 rounded">
              {transcript}
            </div>
          </div>
        )}

        {assistantResponse && (
          <div className="pt-3 border-t border-border/50">
            <div className="text-xs font-semibold text-muted-foreground mb-1">
              Assistant :
            </div>
            <div className="text-sm text-foreground bg-primary/10 p-2 rounded">
              {assistantResponse}
            </div>
          </div>
        )}

        {isListening && !transcript && (
          <div className="pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold">Essayez :</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>"Joue la musique"</li>
                <li>"Pause"</li>
                <li>"Suivant"</li>
                <li>"Génère musique calme"</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceCommands;
