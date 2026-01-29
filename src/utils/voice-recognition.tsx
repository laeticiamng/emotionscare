/**
 * Voice Recognition & Speech Synthesis Utilities
 * Complete implementation using Web Speech API
 */

import React from 'react';
import { logger } from '@/lib/logger';

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

type SpeechRecognitionType = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

// Get Speech Recognition constructor
const getSpeechRecognition = (): SpeechRecognitionType | null => {
  if (typeof window === 'undefined') return null;
  return (window as typeof window & {
    SpeechRecognition?: SpeechRecognitionType;
    webkitSpeechRecognition?: SpeechRecognitionType;
  }).SpeechRecognition || (window as typeof window & {
    webkitSpeechRecognition?: SpeechRecognitionType;
  }).webkitSpeechRecognition || null;
};

export interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const {
    continuous = false,
    interimResults = true,
    lang = 'fr-FR',
    onResult,
    onError,
    onEnd,
  } = options;

  const [transcript, setTranscript] = React.useState('');
  const [interimTranscript, setInterimTranscript] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const [browserSupported, setBrowserSupported] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const recognitionRef = React.useRef<InstanceType<SpeechRecognitionType> | null>(null);

  // Initialize recognition
  React.useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    
    if (!SpeechRecognition) {
      setBrowserSupported(false);
      logger.warn('Speech Recognition not supported in this browser', 'VOICE');
      return;
    }

    setBrowserSupported(true);
    const recognition = new SpeechRecognition();
    
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      logger.info('Speech recognition started', 'VOICE');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        onResult?.(finalTranscript, true);
      }
      
      setInterimTranscript(interimText);
      if (interimText) {
        onResult?.(interimText, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMsg = `Speech recognition error: ${event.error}`;
      setError(errorMsg);
      setIsListening(false);
      onError?.(errorMsg);
      logger.error('Speech recognition error', { error: event.error, message: event.message }, 'VOICE');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      onEnd?.();
      logger.info('Speech recognition ended', 'VOICE');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [continuous, interimResults, lang, onResult, onError, onEnd]);

  const startListening = React.useCallback(() => {
    if (!browserSupported || !recognitionRef.current) {
      setError('Speech recognition not supported');
      return;
    }

    if (isListening) {
      return;
    }

    try {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
    } catch (err) {
      logger.error('Failed to start speech recognition', err as Error, 'VOICE');
      setError('Failed to start speech recognition');
    }
  }, [browserSupported, isListening]);

  const stopListening = React.useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (err) {
      logger.error('Failed to stop speech recognition', err as Error, 'VOICE');
    }
  }, []);

  const resetTranscript = React.useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    transcript,
    interimTranscript,
    finalTranscript: transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupported,
    error,
  };
};

export interface UseSpeechSynthesisOptions {
  onEnd?: () => void;
  onError?: (error: string) => void;
  onStart?: () => void;
}

export const useSpeechSynthesis = (options: UseSpeechSynthesisOptions = {}) => {
  const { onEnd, onError, onStart } = options;
  
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = React.useState(false);
  const [supported, setSupported] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      // Voices might be loaded asynchronously
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      }
      
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const speak = React.useCallback(({ 
    text = '', 
    voice = null as SpeechSynthesisVoice | null, 
    rate = 1, 
    pitch = 1, 
    volume = 1,
    lang = 'fr-FR'
  }) => {
    if (!supported || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      utterance.voice = voice;
    } else {
      // Try to find a French voice
      const frenchVoice = voices.find(v => v.lang.startsWith('fr'));
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
    }
    
    utterance.rate = Math.max(0.1, Math.min(10, rate));
    utterance.pitch = Math.max(0, Math.min(2, pitch));
    utterance.volume = Math.max(0, Math.min(1, volume));
    utterance.lang = lang;
    
    utterance.onstart = () => {
      setSpeaking(true);
      setIsPaused(false);
      onStart?.();
    };
    
    utterance.onend = () => {
      setSpeaking(false);
      setIsPaused(false);
      onEnd?.();
    };
    
    utterance.onerror = (event) => {
      setSpeaking(false);
      setIsPaused(false);
      onError?.(event.error);
      logger.error('Speech synthesis error', { error: event.error }, 'VOICE');
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [supported, voices, onStart, onEnd, onError]);

  const cancel = React.useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setIsPaused(false);
  }, [supported]);

  const pause = React.useCallback(() => {
    if (!supported || !speaking) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [supported, speaking]);

  const resume = React.useCallback(() => {
    if (!supported || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [supported, isPaused]);

  // Get preferred voice for a language
  const getVoiceForLang = React.useCallback((lang: string) => {
    return voices.find(v => v.lang.startsWith(lang)) || null;
  }, [voices]);

  return {
    supported,
    speak,
    speaking,
    cancel,
    pause,
    resume,
    isPaused,
    voices,
    getVoiceForLang,
  };
};
