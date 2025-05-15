
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommandButtonProps {
  onTranscript: (transcript: string) => void;
  commands?: Record<string, () => void>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({ 
  onTranscript,
  commands = {},
  variant = 'outline'
}) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  
  const startListening = () => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Commande vocale non supportée",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale",
        variant: "destructive",
      });
      return;
    }
    
    // This is a mock implementation for demonstration
    // In a real app, you'd use the Web Speech API
    setIsListening(true);
    toast({
      title: "Écoute en cours...",
      description: "Dites votre commande vocale",
    });
    
    // Simulate voice recognition (in real app, use the Web Speech API)
    setTimeout(() => {
      setIsListening(false);
      
      // Process a mock command from the available commands list
      const commandKeys = Object.keys(commands);
      if (commandKeys.length > 0) {
        const mockCommand = commandKeys[0]; // Just use the first command for demo
        toast({
          title: "Commande reconnue",
          description: `"${mockCommand}"`,
        });
        
        // Execute the command function
        onTranscript(mockCommand);
        commands[mockCommand]?.();
      } else {
        // Default behavior if no commands provided
        toast({
          title: "Commande reconnue",
          description: "connexion à mon espace",
        });
        onTranscript("connexion à mon espace");
      }
    }, 2000);
  };
  
  const stopListening = () => {
    setIsListening(false);
    // In a real app, you would stop the speech recognition here
  };
  
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={isListening ? stopListening : startListening}
      className="relative"
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          <span className="ml-2">Arrêter</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          <span className="ml-2">Commande vocale</span>
        </>
      )}
    </Button>
  );
};
