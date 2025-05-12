
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type CommandHandler = (command: string) => void;

interface VoiceCommandOptions {
  enabled?: boolean;
  lang?: string;
  continuous?: boolean;
  commandCallback?: CommandHandler;
}

export function useVoiceCommands({
  enabled = false,
  lang = 'fr-FR',
  continuous = false,
  commandCallback
}: VoiceCommandOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Vérifier si la fonctionnalité est supportée
  useEffect(() => {
    setSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }, []);
  
  // Simuler la reconnaissance vocale (dans une implémentation réelle, utiliser l'API Web Speech)
  const simulateRecognition = useCallback((isActive: boolean) => {
    if (isActive && enabled) {
      // Liste de commandes possibles
      const possibleCommands = [
        'pause', 'play', 'lecture', 'stop', 'arrêter', 
        'suivant', 'précédent', 'volume plus', 'volume moins',
        'afficher', 'cacher', 'quitter'
      ];
      
      console.log('Voice recognition started');
      
      // Simuler la reconnaissance après un court délai
      const timeout = setTimeout(() => {
        // En environnement de production, ce serait remplacé par une vraie reconnaissance
        // En démo, nous choisissons aléatoirement une commande
        if (Math.random() > 0.7) {
          const randomCommand = possibleCommands[Math.floor(Math.random() * possibleCommands.length)];
          setLastCommand(randomCommand);
          
          if (commandCallback) {
            commandCallback(randomCommand);
          }
          
          toast({
            title: "Commande vocale reconnue",
            description: `"${randomCommand}" - Commande exécutée`,
          });
        }
        
        // Automatiquement arrêter l'écoute si non continue
        if (!continuous) {
          setIsListening(false);
        }
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [enabled, continuous, toast, commandCallback]);
  
  // Démarrer/arrêter l'écoute
  const toggleListening = useCallback(() => {
    if (!supported || !enabled) return;
    
    const newListeningState = !isListening;
    setIsListening(newListeningState);
    
    if (newListeningState) {
      toast({
        title: "Commandes vocales activées",
        description: "Je vous écoute... Dites une commande",
      });
      
      simulateRecognition(true);
    } else {
      toast({
        title: "Commandes vocales désactivées",
        description: "Mode d'écoute terminé",
      });
    }
  }, [isListening, supported, enabled, toast, simulateRecognition]);
  
  // Effet pour lancer/arrêter la reconnaissance selon l'état isListening
  useEffect(() => {
    if (isListening) {
      const cleanupFn = simulateRecognition(true);
      return () => {
        if (cleanupFn) cleanupFn();
      };
    }
  }, [isListening, simulateRecognition]);
  
  return {
    isListening,
    toggleListening,
    supported,
    lastCommand
  };
}

export default useVoiceCommands;
