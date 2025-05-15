
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ButtonProps } from '@/components/ui/button';

interface VoiceCommandButtonProps extends ButtonProps {
  onTranscript?: (transcript: string) => void;
  commands?: {
    [command: string]: () => void;
  };
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({ 
  onTranscript,
  commands = {},
  ...props
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
      title: "Commandes vocales activées",
      description: "Parlez maintenant pour utiliser une commande vocale",
    });
    
    // Simulate voice recognition (in a real app, use actual Whisper API)
    setTimeout(() => {
      const mockedTranscript = "connexion à mon espace";
      
      if (onTranscript) {
        onTranscript(mockedTranscript);
      }
      
      // Check if the transcript matches any command
      Object.entries(commands).forEach(([command, action]) => {
        if (mockedTranscript.toLowerCase().includes(command.toLowerCase())) {
          action();
        }
      });
      
      stopListening();
      
      toast({
        title: "Commande reconnue",
        description: `"${mockedTranscript}"`,
      });
    }, 3000);
  };
  
  const stopListening = () => {
    setIsListening(false);
    // In a real app, stop the actual recognition service
    toast({
      title: "Commandes vocales désactivées",
      description: "Le microphone est maintenant éteint",
    });
  };
  
  return (
    <Button
      size="icon"
      variant={isListening ? "default" : "ghost"}
      onClick={toggleListening}
      className={isListening ? "animate-pulse" : ""}
      {...props}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isListening ? "Désactiver les commandes vocales" : "Activer les commandes vocales"}
      </span>
    </Button>
  );
};
