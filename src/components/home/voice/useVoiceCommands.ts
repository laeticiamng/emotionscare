// @ts-nocheck
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface VoiceCommandOptions {
  commands?: Record<string, () => void>;
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  autoStop?: boolean;
  language?: string;
}

export function useVoiceCommands(options: VoiceCommandOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    commands = {},
    onTranscript,
    onError,
    autoStop = true,
    language = 'fr-FR'
  } = options;

  const defaultCommands = {
    'je suis un particulier': () => navigate('/login?segment=b2c'),
    'je suis une entreprise': () => navigate('/entreprise'),
    'je suis rh': () => navigate('/login?segment=b2b'),
    'je suis collaborateur': () => navigate('/login?segment=b2b'),
    'connexion à mon espace': () => {
      toast({
        title: "Commande vocale reconnue",
        description: "Connexion à votre espace personnel",
      });
      // This would typically trigger auto-login if credentials are stored
    }
  };
  
  const allCommands = { ...defaultCommands, ...commands };

  const startListening = useCallback(() => {
    // Using imported types for SpeechRecognition from our speech.d.ts
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("La reconnaissance vocale n'est pas prise en charge par votre navigateur");
      onError?.("La reconnaissance vocale n'est pas prise en charge par votre navigateur");
      return;
    }
    
    setIsListening(true);
    setError(null);
    
    // Using the Web Speech API with our type definitions
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("La reconnaissance vocale n'est pas disponible");
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = false;
    
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript.toLowerCase();
      setTranscript(speechText);
      onTranscript?.(speechText);
      
      // Check if the speech matches any command
      Object.entries(allCommands).forEach(([phrase, action]) => {
        if (speechText.includes(phrase.toLowerCase())) {
          action();
        }
      });
    };
    
    recognition.onerror = (event) => {
      const errorMessage = event.error || "Erreur de reconnaissance vocale";
      setError(`Erreur de reconnaissance vocale: ${errorMessage}`);
      onError?.(`Erreur de reconnaissance vocale: ${errorMessage}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
    
    // Automatically stop after 5 seconds if autoStop is true
    if (autoStop) {
      setTimeout(() => {
        recognition.stop();
      }, 5000);
    }
    
    return () => {
      recognition.abort();
    };
  }, [allCommands, autoStop, language, onError, onTranscript]);
  
  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);
  
  return {
    startListening,
    stopListening,
    isListening,
    transcript,
    error
  };
}
