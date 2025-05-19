
// Définition correcte des types pour SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

// Global declaration without redeclaring the properties
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

let recognition: SpeechRecognitionInstance | null = null;

export const initSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognitionAPI) {
    console.warn('Speech Recognition API not supported in this browser');
    return null;
  }
  
  recognition = new SpeechRecognitionAPI();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'fr-FR';
  
  return recognition;
};

export const startListening = (onResult: (text: string, isFinal: boolean) => void, onError?: (error: any) => void) => {
  if (!recognition) {
    recognition = initSpeechRecognition();
    
    if (!recognition) {
      if (onError) onError(new Error('Speech Recognition not supported'));
      return false;
    }
  }
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const resultIndex = event.resultIndex;
    const transcript = Array.from(event.results)
      .slice(resultIndex)
      .map(result => result[0].transcript)
      .join('');
    
    const isFinal = event.results[resultIndex].isFinal;
    
    onResult(transcript, isFinal);
  };
  
  recognition.onerror = (event) => {
    if (onError) onError(event);
  };
  
  try {
    recognition.start();
    return true;
  } catch (error) {
    if (onError) onError(error);
    return false;
  }
};

export const stopListening = () => {
  if (recognition) {
    recognition.stop();
    return true;
  }
  return false;
};

export default {
  initSpeechRecognition,
  startListening,
  stopListening,
};
