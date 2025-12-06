// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { faker } from '@faker-js/faker';
import { logger } from '@/lib/logger';

export const useSessionManager = () => {
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session on load
  useEffect(() => {
    // Generate unique session ID or restore from localStorage
    const storedSessionId = localStorage.getItem('emotionscare_chat_session');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Use faker.string.uuid() instead of v4
      const newSessionId = faker.string.uuid();
      localStorage.setItem('emotionscare_chat_session', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Load message history
  const loadMessageHistory = useCallback(async (messages: ChatMessage[]) => {
    logger.debug('Loading message history for session', { sessionId }, 'UI');
    return messages;
  }, [sessionId]);

  return {
    sessionId,
    loadMessageHistory
  };
};
