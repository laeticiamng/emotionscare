
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import createARSpeechRecognition from '@/lib/ar/speechRecognition';
import { createVoiceCommandMatcher } from '@/lib/ar/voiceCommandMatcher';

type CommandHandler = (command: string) => void;

interface VoiceCommandOptions {
  enabled?: boolean;
  lang?: string;
  continuous?: boolean;
  commandCallback?: CommandHandler;
  strictMode?: boolean;
}

export function useVoiceCommands({
  enabled = false,
  lang = 'fr',
  continuous = false,
  commandCallback,
  strictMode = false
}: VoiceCommandOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const commandMatcher = useRef(createVoiceCommandMatcher({ language: lang, strictMode }));
  
  // Check if speech recognition is supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setSupported(isSupported);
    }
  }, []);
  
  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    recognitionRef.current = createARSpeechRecognition({
      language: lang === 'fr' ? 'fr-FR' : 'en-US',
      continuous,
      interimResults: true,
      onResult: (result) => {
        if (result.isFinal) {
          setLastTranscript(result.transcript);
          const command = commandMatcher.current.match(result.transcript);
          
          if (command) {
            setLastCommand(command);
            
            if (commandCallback) {
              commandCallback(command);
            }
            
            toast({
              title: "Commande vocale reconnue",
              description: `"${result.transcript}" - Commande exécutée: ${command}`,
            });
          }
        }
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        toast({
          title: "Erreur de reconnaissance vocale",
          description: error,
          variant: "destructive"
        });
        setIsListening(false);
      },
      onStart: () => {
        console.log('Speech recognition started');
      },
      onEnd: () => {
        console.log('Speech recognition ended');
        // Only update if we're not in continuous mode, as continuous will restart itself
        if (!continuous) {
          setIsListening(false);
        }
      }
    });
    
    return recognitionRef.current;
  }, [lang, continuous, commandCallback, toast]);
  
  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (!supported || !enabled) return;
    
    const newListeningState = !isListening;
    setIsListening(newListeningState);
    
    if (newListeningState) {
      const recognition = recognitionRef.current || initRecognition();
      
      toast({
        title: "Commandes vocales activées",
        description: "Je vous écoute... Dites une commande",
      });
      
      recognition.start();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      
      toast({
        title: "Commandes vocales désactivées",
        description: "Mode d'écoute terminé",
      });
    }
  }, [isListening, supported, enabled, toast, initRecognition]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  return {
    isListening,
    toggleListening,
    supported,
    lastCommand,
    lastTranscript
  };
}

export default useVoiceCommands;
