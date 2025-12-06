// @ts-nocheck
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface VoiceCommandListenerProps {
  isActive: boolean;
  onCommand: (command: string) => void;
}

const VoiceCommandListener: React.FC<VoiceCommandListenerProps> = ({ isActive, onCommand }) => {
  const { isListening, toggleListening, supported, lastCommand } = useVoiceCommands();
  
  const { toast } = useToast();
  
  // Pass commands to parent when recognized
  React.useEffect(() => {
    if (lastCommand && isActive) {
      onCommand(lastCommand);
    }
  }, [lastCommand, onCommand, isActive]);
  
  if (!supported || !isActive) return null;
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleListening}
      className={`rounded-full ${isListening ? 'bg-primary/20' : ''}`}
      aria-label={isListening ? "Arrêter les commandes vocales" : "Activer les commandes vocales"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceCommandListener;
