// @ts-nocheck

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface UseVoiceCommandProps {
  commands?: Record<string, () => void>;
  autoStart?: boolean;
}

export const useVoiceCommand = ({ commands = {}, autoStart = false }: UseVoiceCommandProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();

  // Check if browser supports speech recognition
  useEffect(() => {
    const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setIsSupported(hasSpeechRecognition);
    
    if (!hasSpeechRecognition) {
      logger.warn('Speech recognition not supported in this browser', {}, 'UI');
    }
    
    if (autoStart && hasSpeechRecognition) {
      startListening();
    }

    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    
    try {
      setIsListening(true);
      toast({
        title: 'Commandes vocales activées',
        description: 'Je vous écoute...'
      });
      
      // In a real implementation, this would initialize the WebSpeech API
      // or integrate with Whisper API for voice recognition
      logger.info('Voice recognition started', {}, 'UI');
      
      // For demo purposes - simulate receiving a command after 3 seconds
      setTimeout(() => {
        const phrases = Object.keys(commands);
        if (phrases.length > 0) {
          const randomCommand = phrases[Math.floor(Math.random() * phrases.length)];
          processCommand(randomCommand);
        }
      }, 3000);
      
    } catch (error) {
      logger.error('Error starting voice recognition', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'activer la reconnaissance vocale',
        variant: 'destructive',
      });
      setIsListening(false);
    }
  }, [isSupported, toast, commands]);

  const stopListening = useCallback(() => {
    if (!isListening) return;
    
    setIsListening(false);
    toast({
      title: 'Commandes vocales désactivées',
      description: 'Le microphone est maintenant éteint',
    });
    
    // In a real implementation, this would stop the WebSpeech API
    // or disconnect from Whisper API
    logger.info('Voice recognition stopped', {}, 'UI');
  }, [isListening, toast]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Process received command
  const processCommand = useCallback((command: string) => {
    setTranscript(command);
    
    // Check if command matches any registered commands
    let commandExecuted = false;
    for (const [phrase, callback] of Object.entries(commands)) {
      if (command.toLowerCase().includes(phrase.toLowerCase())) {
        toast({
          title: 'Commande reconnue',
          description: `"${command}"`,
        });
        
        // Execute the command
        callback();
        commandExecuted = true;
        break;
      }
    }
    
    // If no command matched
    if (!commandExecuted) {
      toast({
        title: 'Commande non reconnue',
        description: `Désolé, je n'ai pas compris "${command}"`,
      });
    }
    
    setIsListening(false);
  }, [commands, toast]);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening
  };
};

export default useVoiceCommand;
