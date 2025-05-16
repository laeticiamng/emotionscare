
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    setIsListening(true);
    toast({
      title: "Commande vocale activée",
      description: "Je suis à votre écoute...",
    });
    
    // In a real implementation, we would use the Web Speech API or connect to a backend
    // For demo purposes, we'll simulate voice recognition
    setTimeout(() => {
      const simulatedCommand = "connexion à mon espace";
      
      toast({
        title: "Commande détectée",
        description: simulatedCommand,
      });
      
      // Execute matching commands
      Object.entries(commands).forEach(([phrase, callback]) => {
        if (simulatedCommand.toLowerCase().includes(phrase.toLowerCase())) {
          callback();
        }
      });
      
      // Call the onTranscript callback if provided
      if (onTranscript) {
        onTranscript(simulatedCommand);
      }
      
      stopListening();
    }, 3000);
  };
  
  const stopListening = () => {
    setIsListening(false);
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleListening}
      className={`relative ${isListening ? 'animate-pulse' : ''}`}
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
