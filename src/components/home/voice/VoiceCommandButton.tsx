
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SpeechRecognition } from '@/types/speech';

interface VoiceCommandButtonProps {
  onTranscript?: (transcript: string) => void;
  commands?: Record<string, () => void>;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({ 
  onTranscript,
  commands = {},
  variant = 'outline',
  size = 'icon'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.lang = 'fr-FR';
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives = 1;
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
        };
        
        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          
          toast({
            title: "Commande détectée",
            description: transcript,
          });
          
          // Execute commands matching the transcript
          Object.entries(commands).forEach(([phrase, callback]) => {
            if (transcript.toLowerCase().includes(phrase.toLowerCase())) {
              callback();
            }
          });
          
          // Call the onTranscript callback if provided
          if (onTranscript) {
            onTranscript(transcript);
          }
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          toast({
            title: "Erreur de reconnaissance vocale",
            description: event.error,
            variant: "destructive",
          });
        };
        
        setRecognition(recognitionInstance);
      }
    }
    
    // Cleanup
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [commands, onTranscript, toast]);
  
  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Non supporté",
        description: "Votre navigateur ne prend pas en charge la reconnaissance vocale",
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        toast({
          title: "Commande vocale activée",
          description: "Je suis à votre écoute...",
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer la reconnaissance vocale",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleListening}
      className={`relative ${isListening ? 'animate-pulse' : ''}`}
      aria-label={isListening ? "Arrêter l'écoute vocale" : "Activer la commande vocale"}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          <span className="sr-only">Arrêter l'écoute</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          <span className="sr-only">Commande vocale</span>
        </>
      )}
    </Button>
  );
};
