
import { useEffect, useState } from 'react';

export interface UseVoiceCommandsProps {
  enabled?: boolean;
  commands?: Record<string, string>;
  commandCallback?: (command: string) => void;
  onRecognized?: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceCommands = ({
  enabled = false,
  commands = {},
  commandCallback,
  onRecognized,
  onError
}: UseVoiceCommandsProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition if supported
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'fr-FR';

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript.trim().toLowerCase();
        setTranscript(result);
        
        // Call onRecognized callback if provided
        if (onRecognized) {
          onRecognized(result);
        }
        
        // Check if the transcript matches any command
        Object.entries(commands).forEach(([key, value]) => {
          if (result.includes(key.toLowerCase())) {
            console.log(`Voice command detected: ${key}`);
            if (commandCallback) {
              commandCallback(value);
            }
          }
        });
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (onError) {
          onError(event.error);
        }
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else if (onError) {
      onError('Speech recognition not supported');
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [commands, onRecognized, onError, commandCallback]);

  useEffect(() => {
    if (recognition) {
      if (enabled && !isListening) {
        try {
          recognition.start();
          setIsListening(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
        }
      } else if (!enabled && isListening) {
        recognition.stop();
        setIsListening(false);
      }
    }
  }, [enabled, isListening, recognition]);

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening
  };
};

export default useVoiceCommands;
