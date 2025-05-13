
import { useState, useCallback } from 'react';

interface UseVoiceCommandsReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  supported: boolean;
  lastCommand: string | null;
  lastTranscript: string | null;
}

export const useVoiceCommands = (): UseVoiceCommandsReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  
  // Check if SpeechRecognition is supported
  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition: any = null;
  
  if (supported) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR'; // Use French as default
  }
  
  const startListening = useCallback(() => {
    if (!supported) return;
    
    setIsListening(true);
    setTranscript('');
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const newTranscript = event.results[current][0].transcript;
      setTranscript(prev => prev + ' ' + newTranscript);
      
      // Process commands if final
      if (event.results[current].isFinal) {
        setLastTranscript(newTranscript);
        
        // Basic command processing
        const command = newTranscript.toLowerCase();
        
        if (command.includes('arrêter') || command.includes('stop')) {
          setLastCommand('stop');
        } else if (command.includes('lancer') || command.includes('jouer') || command.includes('play')) {
          setLastCommand('play');
        }
      }
    };
    
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };
    
    recognition.start();
  }, [supported, isListening]);
  
  const stopListening = useCallback(() => {
    if (!supported) return;
    
    setIsListening(false);
    recognition.stop();
  }, [supported]);
  
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    supported,
    lastCommand,
    lastTranscript
  };
};

export default useVoiceCommands;
