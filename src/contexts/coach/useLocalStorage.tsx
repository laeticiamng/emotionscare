// @ts-nocheck

import { useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { logger } from '@/lib/logger';

export function useCoachLocalStorage(
  messages: ChatMessage[],
  setMessages: (messages: ChatMessage[]) => void
) {
  // Load previous messages from local storage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('coachMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        logger.error('Failed to parse saved messages', error as Error, 'SYSTEM');
      }
    }
  }, [setMessages]);

  // Save messages to local storage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('coachMessages', JSON.stringify(messages));
    }
  }, [messages]);
}
