// @ts-nocheck
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface ARVoiceInterfaceProps {
  onCommand: (command: string) => void;
}

const ARVoiceInterface: React.FC<ARVoiceInterfaceProps> = ({ onCommand }) => {
  const { isListening, toggleListening, supported, lastCommand } = useVoiceCommands();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (lastCommand) {
      onCommand(lastCommand);
    }
  }, [lastCommand, onCommand]);
  
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
        variant={isListening ? "default" : "outline"}
        size="lg"
        className="rounded-full h-14 w-14 flex items-center justify-center"
      >
        {isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      <p className="text-sm mt-2">
        {isListening ? "Parlez maintenant..." : "Cliquez pour activer les commandes vocales"}
      </p>
    </div>
  );
};

export default ARVoiceInterface;
