/**
 * 🎤 VOICE COMMANDS - EmotionsCare
 * Système de commandes vocales pour l'accessibilité
 */

import React, { useEffect, useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface VoiceCommandsProps {
  onNavigate?: (path: string) => void;
  onAction?: (action: string, params?: any) => void;
}

const VOICE_COMMANDS: Record<string, { action: string; params?: any; description: string }> = {
  'accueil': { action: 'navigate', params: '/', description: 'Aller à l\'accueil' },
  'tableau de bord': { action: 'navigate', params: '/dashboard', description: 'Ouvrir le tableau de bord' },
  'musique': { action: 'navigate', params: '/music', description: 'Aller à la musique thérapeutique' },
  'journal': { action: 'navigate', params: '/journal', description: 'Ouvrir le journal' },
  'coach': { action: 'navigate', params: '/coach', description: 'Parler au coach IA' },
  'analyser émotion': { action: 'emotion-scan', description: 'Démarrer l\'analyse émotionnelle' },
  'jouer musique calme': { action: 'play-music', params: { emotion: 'calm' }, description: 'Jouer de la musique apaisante' },
  'jouer musique énergique': { action: 'play-music', params: { emotion: 'energetic' }, description: 'Jouer de la musique énergique' },
  'aide': { action: 'help', description: 'Afficher l\'aide' },
  'paramètres': { action: 'navigate', params: '/settings', description: 'Ouvrir les paramètres' },
};

export const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onNavigate, onAction }) => {
  const { state, announce } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'fr-FR';
      
      recognition.onstart = () => {
        setIsListening(true);
        announce('Écoute des commandes vocales activée', 'assertive');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        handleVoiceCommand(command);
      };
      
      recognition.onerror = (event) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        announce('Erreur de reconnaissance vocale', 'assertive');
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log('Commande vocale reçue:', command);
    
    const matchedCommand = Object.entries(VOICE_COMMANDS).find(([key]) => 
      command.includes(key)
    );
    
    if (matchedCommand) {
      const [, commandConfig] = matchedCommand;
      announce(`Commande "${matchedCommand[0]}" reconnue`, 'assertive');
      
      if (commandConfig.action === 'navigate' && onNavigate) {
        onNavigate(commandConfig.params);
      } else if (onAction) {
        onAction(commandConfig.action, commandConfig.params);
      }
    } else {
      announce('Commande non reconnue. Dites "aide" pour voir les commandes disponibles.', 'assertive');
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      announce('Reconnaissance vocale non disponible sur ce navigateur', 'assertive');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const showHelp = () => {
    const commands = Object.entries(VOICE_COMMANDS)
      .map(([key, config]) => `"${key}": ${config.description}`)
      .join('. ');
    
    announce(`Commandes vocales disponibles: ${commands}`, 'assertive');
  };

  if (!state.voiceCommands) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col gap-2">
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          aria-label={isListening ? "Arrêter l'écoute vocale" : "Activer l'écoute vocale"}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>
        
        <Button
          onClick={showHelp}
          variant="outline"
          size="sm"
          className="text-xs"
          aria-label="Aide commandes vocales"
        >
          ?
        </Button>
      </div>
      
      {isListening && (
        <div className="absolute bottom-16 right-0 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm animate-pulse">
          À l'écoute...
        </div>
      )}
    </div>
  );
};