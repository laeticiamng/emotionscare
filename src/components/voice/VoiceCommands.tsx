/**
 * VoiceCommands - Commandes vocales pour le player musical
 * Intégration complète avec MusicContext
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Simplified voice recognition hook
const useSimpleVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);
    
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const start = useCallback((onResult: (text: string) => void) => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        setTranscript(result[0].transcript);
        onResult(result[0].transcript.toLowerCase());
      }
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = () => setIsListening(false);

    recognitionRef.current.start();
    setIsListening(true);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, isSupported, transcript, start, stop };
};

const VoiceCommands: React.FC = () => {
  const musicContext = useMusic();
  const { state, play, pause, next, previous, stop: stopPlayback, setVolume } = musicContext;
  const [lastCommand, setLastCommand] = useState<string>('');
  
  const { isListening, isSupported, transcript, start, stop } = useSimpleVoiceRecognition();

  const processCommand = useCallback((text: string) => {
    logger.debug('Voice command received:', text, 'VOICE');
    setLastCommand(text);

    // Play commands
    if (text.includes('play') || text.includes('joue') || text.includes('lecture')) {
      if (state.currentTrack) {
        play(state.currentTrack);
        toast.success('▶️ Lecture démarrée');
      }
      return;
    }

    // Pause commands
    if (text.includes('pause') || text.includes('stop') || text.includes('arrête')) {
      pause();
      toast.success('⏸️ Lecture en pause');
      return;
    }

    // Next commands
    if (text.includes('suivant') || text.includes('next') || text.includes('après')) {
      next();
      toast.success('⏭️ Piste suivante');
      return;
    }

    // Previous commands  
    if (text.includes('précédent') || text.includes('previous') || text.includes('avant')) {
      previous();
      toast.success('⏮️ Piste précédente');
      return;
    }

    // Volume commands
    if (text.includes('volume')) {
      if (text.includes('plus') || text.includes('augmente') || text.includes('monte')) {
        setVolume(Math.min(1, state.volume + 0.2));
        toast.success('🔊 Volume augmenté');
        return;
      }
      if (text.includes('moins') || text.includes('baisse') || text.includes('diminue')) {
        setVolume(Math.max(0, state.volume - 0.2));
        toast.success('🔉 Volume diminué');
        return;
      }
      if (text.includes('muet') || text.includes('mute')) {
        setVolume(0);
        toast.success('🔇 Son coupé');
        return;
      }
    }

    // Unknown command
    toast.info('Commande non reconnue');
  }, [state, play, pause, next, previous, setVolume]);

  const handleToggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start(processCommand);
    }
  }, [isListening, start, stop, processCommand]);

  if (!isSupported) {
    return null;
  }

  return (
    <Card className={cn(
      "fixed bottom-24 left-4 p-3 shadow-lg border-border/50 backdrop-blur-sm z-50",
      "bg-background/90 transition-all duration-300",
      "w-auto min-w-[200px] md:min-w-[280px]",
      isListening && "ring-2 ring-primary"
    )}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "relative w-10 h-10 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-primary/20 to-primary/5",
              isListening && "animate-pulse"
            )}>
              {isListening ? (
                <Mic className="w-5 h-5 text-primary" />
              ) : (
                <MicOff className="w-5 h-5 text-muted-foreground" />
              )}
              {isListening && (
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Commandes Vocales
              </span>
              <span className="text-xs text-muted-foreground">
                {isListening ? '🎤 En écoute...' : 'Inactif'}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant={isListening ? "destructive" : "default"}
            onClick={handleToggle}
          >
            {isListening ? 'Stop' : 'Start'}
          </Button>
        </div>

        {lastCommand && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Dernière commande :</p>
            <p className="text-sm bg-muted/50 p-2 rounded">{lastCommand}</p>
          </div>
        )}

        {isListening && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">Commandes :</p>
            <ul className="text-xs text-muted-foreground space-y-0.5 ml-2">
              <li>• "Joue" / "Pause"</li>
              <li>• "Suivant" / "Précédent"</li>
              <li>• "Volume plus" / "Volume moins"</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceCommands;
