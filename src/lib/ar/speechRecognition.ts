// @ts-nocheck
// Polyfill utilities for SpeechRecognition
import type {
  SpeechRecognitionConstructor,
  SpeechRecognition,
  SpeechRecognitionEvent,
} from '@/types/voice';
import { logger } from '@/lib/logger';

type SpeechRecognitionResult = {
  isFinal: boolean;
  [index: number]: {
    [index: number]: {
      transcript: string;
      confidence: number;
    };
  };
  length: number;
};

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
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

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
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
export const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
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
export const createSpeechRecognition = (): SpeechRecognition | null => {
  const SpeechRecognitionConstructor = getSpeechRecognition();
  
  if (!SpeechRecognitionConstructor) {
    logger.warn('SpeechRecognition is not supported in this browser', {}, 'SYSTEM');
    return null;
  }
  
  return new SpeechRecognitionConstructor();
};

// Export default as a utility object
export default {
  getSpeechRecognition,
  isSpeechRecognitionSupported,
  createSpeechRecognition
};
