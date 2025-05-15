
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommandOptions {
  commands?: Record<string, () => void>;
  language?: string;
  autoStop?: boolean;
}

const useVoiceCommand = (options: VoiceCommandOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  const {
    commands = {},
    language = 'fr-FR',
    autoStop = true
  } = options;

  // Check if browser supports speech recognition
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
  }, []);

  // Function to execute a command based on the transcript
  const executeCommand = useCallback((text: string) => {
    const normalizedText = text.toLowerCase().trim();
    
    // Check if the transcript matches any command
    for (const [phrase, action] of Object.entries(commands)) {
      if (normalizedText.includes(phrase.toLowerCase())) {
        action();
        return true;
      }
    }

    return false;
  }, [commands]);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (isListening) {
      setIsListening(false);
    } else if (isSupported) {
      setIsListening(true);
      
      // Simulate speech recognition with a simple toast
      // In a real implementation, this would use the Whisper API
      toast({
        title: "Commandes vocales activées",
        description: "Parlez maintenant pour naviguer"
      });
      
      // Simulate a command after 3 seconds (for development purposes)
      setTimeout(() => {
        const simulatedCommand = "je suis un particulier";
        setTranscript(simulatedCommand);
        executeCommand(simulatedCommand);
        setIsListening(false);
        
        toast({
          title: "Commande reconnue",
          description: `"${simulatedCommand}"`,
        });
      }, 3000);
    } else {
      toast({
        title: "Commandes vocales non disponibles",
        description: "Votre navigateur ne supporte pas cette fonctionnalité",
        variant: "destructive"
      });
    }
  }, [isListening, isSupported, executeCommand, toast]);

  return {
    isListening,
    toggleListening,
    transcript,
    isSupported,
    executeCommand
  };
};

export default useVoiceCommand;
