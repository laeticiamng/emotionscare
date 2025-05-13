
import React, { useState, useEffect } from 'react';
import { useVoiceAssistant } from '@/hooks/ai/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface VoiceAssistantProps {
  emotionalState?: string;
  onActionDetected?: (action: string, params: any) => void;
  className?: string;
  variant?: 'icon' | 'button' | 'floating';
  position?: 'top-right' | 'bottom-right' | 'bottom-center';
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  emotionalState,
  onActionDetected,
  className = '',
  variant = 'button',
  position = 'bottom-right'
}) => {
  const { isListening, isProcessing, transcript, lastAction, startListening, stopListening } = 
    useVoiceAssistant({ emotionalState, onActionDetected });
  
  const [showTranscript, setShowTranscript] = useState(false);
  const { toast } = useToast();
  
  // Afficher la transcription pendant quelques secondes
  useEffect(() => {
    if (transcript) {
      setShowTranscript(true);
      const timer = setTimeout(() => {
        setShowTranscript(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [transcript]);
  
  // Positionnement du composant flottant
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };
  
  const handleToggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Variante Icon (juste une icône)
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full ${className}`}
        onClick={handleToggleListen}
        disabled={isProcessing}
        aria-label={isListening ? "Arrêter l'écoute" : "Activer l'assistant vocal"}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isListening ? (
          <Mic className="h-4 w-4 text-red-500" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    );
  }
  
  // Variante flottante
  if (variant === 'floating') {
    return (
      <div className={`fixed z-50 ${positionClasses[position]}`}>
        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            className={`rounded-full shadow-lg ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary text-primary-foreground'} ${className}`}
            onClick={handleToggleListen}
            disabled={isProcessing}
            aria-label={isListening ? "Arrêter l'écoute" : "Activer l'assistant vocal"}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          
          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-full mb-2 p-2 bg-background border rounded-lg shadow-lg min-w-[200px] max-w-[300px]"
              >
                <p className="text-sm font-medium">Vous avez dit:</p>
                <p className="text-xs italic">{transcript}</p>
                {lastAction && (
                  <p className="text-xs mt-1 text-primary">{lastAction.responseMessage}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
  
  // Variante bouton (par défaut)
  return (
    <Button
      variant={isListening ? "destructive" : "secondary"}
      className={`flex items-center ${className}`}
      onClick={handleToggleListen}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="mr-2 h-4 w-4" />
      ) : (
        <Mic className="mr-2 h-4 w-4" />
      )}
      {isListening ? "Arrêter l'écoute" : "Assistant vocal"}
      
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full mt-2 left-0 p-2 bg-background border rounded-lg shadow-lg min-w-[200px] max-w-[300px] z-50"
          >
            <p className="text-sm">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default VoiceAssistant;
