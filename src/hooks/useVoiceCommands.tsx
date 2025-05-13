import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { speechRecognition } from '@/lib/ar/speechRecognition';

interface UseVoiceCommandsProps {
  commands: {
    [key: string]: () => void;
  };
}

export const useVoiceCommands = ({ commands }: UseVoiceCommandsProps) => {
  const [listening, setListening] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!speechRecognition) {
      toast({
        title: "Fonctionnalité non supportée",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur.",
        variant: "destructive",
      });
      return;
    }

    speechRecognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      Object.keys(commands).forEach(command => {
        if (transcript.toLowerCase().includes(command.toLowerCase())) {
          commands[command]();
          toast({
            title: "Commande vocale",
            description: `Commande "${command}" exécutée.`,
          });
        }
      });
    };

    speechRecognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      toast({
        title: "Erreur de reconnaissance vocale",
        description: `Une erreur s'est produite : ${event.error}`,
        variant: "destructive",
      });
    };

    if (listening) {
      try {
        speechRecognition.start();
      } catch (error: any) {
        console.error("Error starting speech recognition:", error);
        toast({
          title: "Erreur de reconnaissance vocale",
          description: `Impossible de démarrer la reconnaissance vocale : ${error.message}`,
          variant: "destructive",
        });
        setListening(false);
      }
    } else {
      speechRecognition.stop();
    }

    return () => {
      speechRecognition.stop();
    };
  }, [listening, commands, toast]);

  const toggleListening = () => {
    setListening(prevListening => !prevListening);
  };

  return {
    listening,
    toggleListening,
  };
};
