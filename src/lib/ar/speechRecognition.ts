
// Create polyfill for SpeechRecognition

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    isFinal: boolean;
    length: number;
  };
}

interface SimpleSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onstart: ((event: Event) => void) | null;
}

interface SimpleSpeechRecognitionConstructor {
  new (): SimpleSpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SimpleSpeechRecognitionConstructor | undefined;
    webkitSpeechRecognition: SimpleSpeechRecognitionConstructor | undefined;
    mozSpeechRecognition: SimpleSpeechRecognitionConstructor | undefined;
    msSpeechRecognition: SimpleSpeechRecognitionConstructor | undefined;
  }
}

// Get the appropriate constructor for SpeechRecognition
export const getSpeechRecognition = (): SimpleSpeechRecognitionConstructor | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return window.SpeechRecognition || 
         window.webkitSpeechRecognition ||
         window.mozSpeechRecognition ||
         window.msSpeechRecognition || 
         null;
};

// Check if speech recognition is supported
export const isSpeechRecognitionSupported = (): boolean => {
  return getSpeechRecognition() !== null;
};

// Create a new speech recognition instance
export const createSpeechRecognition = (): SimpleSpeechRecognition | null => {
  const SpeechRecognition = getSpeechRecognition();
  
  if (!SpeechRecognition) {
    console.warn('SpeechRecognition is not supported in this browser');
    return null;
  }
  
  return new SpeechRecognition();
};

// Export default as a utility object
export default {
  getSpeechRecognition,
  isSpeechRecognitionSupported,
  createSpeechRecognition
};
