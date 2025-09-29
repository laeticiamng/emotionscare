import { useState, useRef, useCallback } from 'react';

export function useVoiceCommands(): VoiceRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  const startListening = useCallback(() => {
    if (!supported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      
      recognitionRef.current.onresult = (event) => {
        const current = event.results[event.results.length - 1];
        const transcript = current[0].transcript;
        setTranscript(transcript);
        
        if (current.isFinal) {
          setLastCommand(transcript);
        }
      };
      
      recognitionRef.current.start();
    }
  }, [supported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setLastCommand('');
  }, []);

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
    resetTranscript,
    toggleListening,
    supported,
    lastCommand,
  };
}