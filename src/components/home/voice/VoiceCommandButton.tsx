
import React from 'react';
import { Button } from '@/components/ui/button';
import { useVoiceCommands } from './useVoiceCommands';
import { Mic, MicOff } from 'lucide-react';

interface VoiceCommandButtonProps {
  onTranscript?: (text: string) => void;
  commands?: Record<string, () => void>;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
}

export function VoiceCommandButton({ 
  onTranscript, 
  commands, 
  className = '',
  variant = 'outline'
}: VoiceCommandButtonProps) {
  const { isListening, startListening, stopListening, transcript, error } = useVoiceCommands({
    onTranscript,
    commands
  });
  
  return (
    <div className="relative">
      <Button 
        variant={variant}
        className={`relative flex items-center gap-2 ${className}`}
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4" />
            <span className="animate-pulse">Écoute en cours...</span>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            <span>Commande vocale</span>
          </>
        )}
      </Button>
      
      {isListening && (
        <div className="absolute mt-2 p-2 bg-background/80 backdrop-blur-sm rounded-md shadow-lg w-60 text-sm">
          <p className="font-medium">Je vous écoute...</p>
          {transcript && <p className="italic mt-1">{transcript}</p>}
        </div>
      )}
      
      {error && (
        <div className="absolute mt-2 p-2 bg-destructive/80 text-destructive-foreground backdrop-blur-sm rounded-md shadow-lg w-60 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
