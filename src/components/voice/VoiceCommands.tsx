import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useMusic } from '@/contexts/music';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommandsProps {
  className?: string;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({ className }) => {
  const [listening, setListening] = useState(false);
  const musicContext = useMusic();
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    start,
    stop
  } = useSpeechRecognition({
    onResult: (result) => {
      const command = result;
      console.log('Voice command:', command);
      
      // Check for music commands
      if (command.includes('music')) {
        const musicCommand = command.replace('music', '').trim();
        handleMusicCommand(musicCommand);
      }
      
      // Add more command handling logic here
    },
    onError: (error) => {
      console.error("Speech recognition error:", error);
      toast({
        title: "Erreur de reconnaissance vocale",
        description: "La reconnaissance vocale n'a pas pu démarrer. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });
  
  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }, [listening, start, stop]);
  
  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      start();
      setListening(true);
      toast({
        title: "Reconnaissance vocale activée",
        description: "Vous pouvez maintenant utiliser les commandes vocales."
      });
    } else {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur.",
        variant: "destructive"
      });
    }
  };
  
  const stopListening = () => {
    stop();
    setListening(false);
    toast({
      title: "Reconnaissance vocale désactivée",
      description: "La reconnaissance vocale est maintenant désactivée."
    });
  };

  // Handle music commands
  const handleMusicCommand = (command: string) => {
    if (!musicContext) return;
    
    switch (command.toLowerCase()) {
      case 'play':
      case 'resume':
        musicContext.resumeTrack();
        break;
      case 'pause':
        musicContext.pauseTrack();
        break;
      case 'next':
      case 'skip':
        musicContext.nextTrack();
        break;
      case 'previous':
      case 'back':
        musicContext.prevTrack(); // Changed from previousTrack to prevTrack
        break;
      default:
        console.log('Unknown music command:', command);
    }
  };
  
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Navigateur non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur.",
        variant: "destructive"
      });
    }
  }, [browserSupportsSpeechRecognition, toast]);
  
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Button
        variant="outline"
        onClick={toggleListening}
        disabled={!browserSupportsSpeechRecognition}
      >
        {listening ? (
          <>
            <MicOff className="mr-2 h-4 w-4" />
            Arrêter
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Écouter
          </>
        )}
      </Button>
      
      {transcript && (
        <div className="flex-1 overflow-x-auto">
          <p className="text-sm text-muted-foreground">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceCommands;
