
import { useState, useEffect, useCallback } from 'react';

interface UseTypingIndicatorOptions {
  timeout?: number;
  initialState?: boolean;
}

/**
 * Hook to manage typing indicator state
 * Provides functions to handle user typing events and auto-clear the indicator
 */
export function useTypingIndicator(options: UseTypingIndicatorOptions = {}) {
  const { timeout = 3000, initialState = false } = options;
  
  // Use string type for typingIndicator
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  
  // Clear typing indicator after timeout
  const clearTypingIndicator = useCallback(() => {
    setTypingIndicator(null);
  }, []);
  
  // Cleanup function for timeout
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);
  
  // Handle user typing events
  const handleUserTyping = useCallback(() => {
    setTypingIndicator("En train d'écrire...");
    
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout to clear indicator
    const newTimeout = setTimeout(clearTypingIndicator, timeout);
    setTypingTimeoutRef(newTimeout);
  }, [clearTypingIndicator, timeout, typingTimeout]);
  
  // Handle typing errors
  const handleTypingError = useCallback(() => {
    setTypingIndicator("Une erreur s'est produite");
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    const newTimeout = setTimeout(clearTypingIndicator, timeout);
    setTypingTimeoutRef(newTimeout);
  }, [clearTypingIndicator, timeout, typingTimeout]);

  return {
    typingIndicator,
    handleUserTyping,
    handleTypingError,
    clearTypingIndicator
  };
}
