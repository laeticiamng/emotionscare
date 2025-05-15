
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommandButtonProps {
  onTranscript?: (transcript: string) => void;
  commands?: Record<string, () => void>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
  onTranscript,
  commands = {},
  variant = "outline"
}) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const toggleVoiceRecognition = () => {
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
      description: "Je vous écoute...",
    });
    
    // Simulate voice recognition (in a real implementation, this would use Whisper API)
    setTimeout(() => {
      const mockTranscript = "Connexion à mon espace";
      
      if (onTranscript) {
        onTranscript(mockTranscript);
      }
      
      // Check for command matches
      Object.entries(commands).forEach(([command, action]) => {
        if (mockTranscript.toLowerCase().includes(command.toLowerCase())) {
          action();
        }
      });
      
      stopListening();
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    toast({
      title: "Commandes vocales désactivées",
      description: "Le microphone est maintenant éteint.",
    });
  };

  return (
    <Button
      onClick={toggleVoiceRecognition}
      variant={variant}
      size="icon"
      className={`rounded-full ${isListening ? 'bg-primary text-white' : ''}`}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceCommandButton;
