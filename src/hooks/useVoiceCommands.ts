// @ts-nocheck

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
    logger.info('Voice commands started listening', {}, 'UI');
  };

  const stopListening = () => {
    setIsListening(false);
    logger.info('Voice commands stopped listening', {}, 'UI');
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
