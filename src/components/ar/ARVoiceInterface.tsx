import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface ARVoiceInterfaceProps {
  onCommand: (command: string) => void;
}

const ARVoiceInterface: React.FC<ARVoiceInterfaceProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const supported = typeof window !== 'undefined' && 'webkitSpeechRecognition' in window;

  const toggleListening = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      toast({ title: 'Écoute activée', description: 'Dites une commande vocale.' });
    }
  };

  if (!supported) {
    return (
      <div className="ar-voice-interface-error">
        <p>La reconnaissance vocale n'est pas prise en charge par votre navigateur.</p>
      </div>
    );
  }

  return (
    <div className="ar-voice-interface">
      <Button
        onClick={toggleListening}
        variant={isListening ? 'destructive' : 'default'}
        size="icon"
        aria-label={isListening ? 'Arrêter l\'écoute' : 'Démarrer l\'écoute'}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default ARVoiceInterface;
