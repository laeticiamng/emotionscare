import React, { useState, useEffect } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from '@/utils/voice-recognition';
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceCommandsProps {
  onCommandRecognized?: (command: string) => void;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onCommandRecognized }) => {
  const [listening, setListening] = useState(false);
  const { transcript, isListening, startListening, stopListening, browserSupported } = useSpeechRecognition();
  const { supported, speak, speaking, cancel, voices } = useSpeechSynthesis();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && onCommandRecognized) {
      onCommandRecognized(transcript);
    }
  }, [transcript, onCommandRecognized]);

  const toggleListening = () => {
    if (!browserSupported) {
      toast({
        title: "La reconnaissance vocale n'est pas supportée",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale.",
        variant: "destructive",
      });
      return;
    }

    if (listening) {
      stopListening();
      setListening(false);
    } else {
      startListening();
      setListening(true);
    }
  };

  const handleSpeak = (text: string) => {
    if (!supported) {
      toast({
        title: "La synthèse vocale n'est pas supportée",
        description: "Votre navigateur ne supporte pas la synthèse vocale.",
        variant: "destructive",
      });
      return;
    }
    speak({ text });
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={toggleListening}
        disabled={speaking}
      >
        {listening ? (
          <>
            <Square className="mr-2 h-4 w-4" /> Arrêter
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" /> Démarrer
          </>
        )}
      </Button>
      {/*<Button onClick={() => handleSpeak("Bonjour, comment ça va ?")}>Dire Bonjour</Button>*/}
      {/*<p>Transcription: {transcript}</p>*/}
    </div>
  );
};

export default VoiceCommands;
