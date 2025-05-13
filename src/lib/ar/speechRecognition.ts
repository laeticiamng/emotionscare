
// Create a flexible wrapper for browser Speech Recognition API
interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (result: { transcript: string; isFinal: boolean }) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function createARSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  // Browser compatibility check
  const SpeechRecognitionAPI = 
    window.SpeechRecognition || 
    window.webkitSpeechRecognition || 
    null;
  
  if (!SpeechRecognitionAPI) {
    console.error('Speech recognition not supported in this browser');
    if (options.onError) {
      options.onError('Speech recognition not supported in this browser');
    }
    return null;
  }
  
  const recognition = new SpeechRecognitionAPI();
  
  // Configure recognition
  recognition.lang = options.language || 'fr-FR';
  recognition.continuous = options.continuous || false;
  recognition.interimResults = options.interimResults || false;
  
  // Set up event handlers
  recognition.onstart = () => {
    if (options.onStart) options.onStart();
  };
  
  recognition.onend = () => {
    if (options.onEnd) options.onEnd();
  };
  
  recognition.onerror = (event) => {
    if (options.onError) options.onError(event.error);
  };
  
  recognition.onresult = (event) => {
    if (options.onResult) {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.trim();
      const isFinal = event.results[last].isFinal;
      
      options.onResult({ transcript, isFinal });
    }
  };
  
  // Return controller object
  return {
    start: () => {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (options.onError) options.onError('Failed to start recognition');
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    },
    abort: () => {
      try {
        recognition.abort();
      } catch (error) {
        console.error('Error aborting speech recognition:', error);
      }
    }
  };
}
