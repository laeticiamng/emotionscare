import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceCommandListenerProps {
  isActive: boolean;
  onCommand: (command: string) => void;
}

const VoiceCommandListener: React.FC<VoiceCommandListenerProps> = ({ isActive, onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const supported = typeof window !== 'undefined' && 'webkitSpeechRecognition' in window;

  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  if (!supported || !isActive) return null;

  return (
    <Button
      variant={isListening ? 'destructive' : 'outline'}
      size="sm"
      onClick={toggleListening}
      aria-label={isListening ? 'Arrêter' : 'Écouter'}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceCommandListener;
