// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import type { SpeechRecognition } from '@/types/speech';
import { logger } from '@/lib/logger';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    const hasRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setSupported(hasRecognition);
    
    if (!hasRecognition) {
      logger.warn('Speech recognition not supported in this browser', {}, 'UI');
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!supported) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur"
      });
      return;
    }
    
    if (isListening) {
      // Stop listening
      setIsListening(false);
      // Here you would normally stop your SpeechRecognition instance
    } else {
      // Start listening
      setIsListening(true);
      
      try {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognitionClass) {
          const recognition = new SpeechRecognitionClass();
          recognition.lang = 'fr-FR';
          recognition.continuous = false;
          
          recognition.onstart = () => {
            toast({
              title: "Commandes vocales activées",
              description: "Parlez maintenant..."
            });
          };
          
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            setLastCommand(transcript);
            
            toast({
              title: "Commande reconnue",
              description: `"${transcript}"`
            });
            
            // Arrêt automatique après une commande
            recognition.stop();
          };
          
          recognition.onerror = (event: any) => {
            logger.error('Error in speech recognition', new Error(event.error), 'UI');
            toast({
              title: "Erreur de reconnaissance vocale",
              description: `${event.error || "Impossible d'activer la reconnaissance vocale"}`,
              variant: "destructive"
            });
          };
          
          recognition.onend = () => {
            setIsListening(false);
          };
          
          recognition.start();
        }
      } catch (error) {
        logger.error('Error starting voice recognition', error as Error, 'UI');
        toast({
          title: "Erreur de reconnaissance vocale",
          description: "Impossible d'activer la reconnaissance vocale",
          variant: "destructive"
        });
        setIsListening(false);
      }
    }
  }, [isListening, supported, toast]);

  const processCommand = useCallback((command: string, actions: Record<string, () => void>, fallback?: () => void) => {
    const normalizedCommand = command.toLowerCase().trim();
    
    let actionExecuted = false;
    
    // Parcourir toutes les actions possibles
    Object.entries(actions).forEach(([keyword, action]) => {
      if (normalizedCommand.includes(keyword.toLowerCase())) {
        action();
        actionExecuted = true;
      }
    });
    
    // Si aucune action n'a été exécutée et qu'il y a un fallback
    if (!actionExecuted && fallback) {
      fallback();
    }
    
    return actionExecuted;
  }, []);

  return {
    isListening,
    toggleListening,
    supported,
    lastCommand,
    processCommand
  };
}

export default useVoiceCommands;
