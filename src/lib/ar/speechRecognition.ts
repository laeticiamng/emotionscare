
// Polyfill utilities for SpeechRecognition
import type {
  SpeechRecognitionConstructor,
  SpeechRecognition,
  SpeechRecognitionEvent,
} from '@/types/voice';

interface SimpleSpeechRecognition extends SpeechRecognition {}

interface SimpleSpeechRecognitionConstructor {
  new (): SimpleSpeechRecognition;
}


declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    mozSpeechRecognition?: SpeechRecognitionConstructor;
    msSpeechRecognition?: SpeechRecognitionConstructor;
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
