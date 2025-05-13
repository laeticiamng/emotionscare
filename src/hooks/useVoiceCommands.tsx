
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

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
      console.warn('Speech recognition not supported in this browser');
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!supported) return;
    
    if (isListening) {
      // Stop listening
      setIsListening(false);
      // Here you would normally stop your SpeechRecognition instance
    } else {
      // Start listening
      setIsListening(true);
      
      try {
        // This is a simplified example, in a real app you would handle the recognition properly
        toast({
          title: "Commandes vocales activées",
          description: "Parlez maintenant..."
        });
        
        // Simulate receiving a command after 3 seconds
        setTimeout(() => {
          const simulatedCommand = "afficher le tableau de bord";
          setLastCommand(simulatedCommand);
          
          toast({
            title: "Commande reconnue",
            description: `"${simulatedCommand}"`
          });
          
          setIsListening(false);
        }, 3000);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        toast({
          title: "Erreur de reconnaissance vocale",
          description: "Impossible d'activer la reconnaissance vocale",
          variant: "destructive"
        });
        setIsListening(false);
      }
    }
  }, [isListening, supported, toast]);

  return {
    isListening,
    toggleListening,
    supported,
    lastCommand
  };
}

export default useVoiceCommands;
