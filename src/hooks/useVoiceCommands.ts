
import { useState, useEffect } from 'react';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
    console.log('Voice commands: Started listening');
  };

  const stopListening = () => {
    setIsListening(false);
    console.log('Voice commands: Stopped listening');
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  };
};
