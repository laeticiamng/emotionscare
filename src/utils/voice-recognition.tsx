// @ts-nocheck

import React from 'react';
import { SpeechRecognition } from '@/types/speech';
import { logger } from '@/lib/logger';

// Polyfill minimal pour remplacer react-speech-kit
export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const [browserSupported, setBrowserSupported] = React.useState(false);

  React.useEffect(() => {
    const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setBrowserSupported(isSpeechRecognitionSupported);
  }, []);

  const startListening = React.useCallback(() => {
    if (!browserSupported) return;
    
    setIsListening(true);
    // Logique réelle à implémenter
    logger.debug("Speech recognition would start here", 'SYSTEM');
  }, [browserSupported]);

  const stopListening = React.useCallback(() => {
    setIsListening(false);
    // Logique réelle à implémenter
    logger.debug("Speech recognition would stop here", 'SYSTEM');
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    browserSupported,
  };
};

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = React.useState(false);
  const [supported, setSupported] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      loadVoices();
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const speak = ({ text = '', voice = null, rate = 1, pitch = 1, volume = 1 }) => {
    if (!supported) return;
    
    setSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onend = () => {
      setSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  return {
    supported,
    speak,
    speaking,
    cancel,
    voices,
  };
};
