
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

export interface UseVoiceCommandsProps {
  enabled?: boolean;
  onCommand?: (command: string) => void;
}

export const useVoiceCommands = (props: UseVoiceCommandsProps = {}) => {
  const { enabled = true, onCommand } = props;
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [lastTranscript, setLastTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if browser supports SpeechRecognition
  useEffect(() => {
    const speechRecognitionSupported = 
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window;
    
    setSupported(speechRecognitionSupported);
    
    if (!speechRecognitionSupported) {
      console.warn('Speech recognition not supported in this browser');
    }
  }, []);

  // Voice commands handler
  const handleCommand = useCallback((transcript: string) => {
    if (!transcript) return;
    
    const lowerTranscript = transcript.toLowerCase().trim();
    setLastTranscript(transcript);
    
    // Define command patterns
    const goToPattern = /(?:aller vers|aller à|va à|montre|ouvre|navigue vers|naviguer vers|ouvrir)\s+(?:la page|le|la)?\s*(.+)/i;
    const simpleCommandPattern = /(accueil|dashboard|journal|scan|musique|aide|profil|paramètres|réglages)/i;
    
    // Check for navigation commands
    let destination = '';
    const goToMatch = lowerTranscript.match(goToPattern);
    
    if (goToMatch && goToMatch[1]) {
      destination = goToMatch[1].trim();
    } else {
      const simpleMatch = lowerTranscript.match(simpleCommandPattern);
      if (simpleMatch) {
        destination = simpleMatch[1];
      }
    }
    
    // Map spoken destinations to routes
    const routeMap: Record<string, string> = {
      'accueil': '/',
      'dashboard': '/dashboard',
      'tableau de bord': '/dashboard',
      'journal': '/journal',
      'scan': '/scan',
      'analyse': '/scan',
      'émotions': '/scan',
      'musique': '/music',
      'musicothérapie': '/musicotherapy',
      'thérapie': '/musicotherapy',
      'aide': '/support',
      'support': '/support',
      'profil': '/profile',
      'paramètres': '/settings',
      'réglages': '/settings',
    };
    
    if (destination && routeMap[destination]) {
      const route = routeMap[destination];
      setLastCommand(`Navigation vers ${destination}`);
      
      toast({
        title: "Commande vocale",
        description: `Navigation vers ${destination}`,
      });
      
      navigate(route);
      
      if (onCommand) {
        onCommand(`navigate:${destination}`);
      }
    }
  }, [navigate, toast, onCommand]);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (!supported) {
      toast({
        title: "Commandes vocales non supportées",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale",
        variant: "destructive"
      });
      return;
    }
    
    setListening(prev => !prev);
  }, [supported, toast]);

  // Setup speech recognition
  useEffect(() => {
    if (!supported || !enabled) return;
    
    // Use the appropriate SpeechRecognition constructor
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition && listening) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'fr-FR';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleCommand(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setListening(false);
      };
      
      recognition.onend = () => {
        setListening(false);
      };
      
      recognition.start();
      
      return () => {
        recognition.abort();
      };
    }
  }, [listening, supported, enabled, handleCommand]);

  return {
    listening,
    toggleListening,
    supported,
    lastCommand,
    lastTranscript,
    isListening: listening // for compatibility
  };
};

export default useVoiceCommands;
