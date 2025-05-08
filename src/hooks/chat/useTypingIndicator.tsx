
import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing typing indicator state
 */
export function useTypingIndicator() {
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Handle cleanup of typing timer when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [typingTimer]);
  
  // Handle user typing
  const handleUserTyping = useCallback(() => {
    // Show typing indicator
    if (!typingIndicator) {
      setTypingIndicator('Vous êtes en train d\'écrire...');
    }
    
    // Clear previous timer
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    
    // Set new timer to clear typing indicator after 1.5 seconds of inactivity
    const timer = setTimeout(() => {
      setTypingIndicator(null);
    }, 1500);
    
    setTypingTimer(timer);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [typingIndicator, typingTimer]);
  
  // Clear typing indicator
  const clearTypingIndicator = useCallback(() => {
    if (typingTimer) clearTimeout(typingTimer);
    setTypingIndicator(null);
  }, [typingTimer]);
  
  return {
    typingIndicator,
    handleUserTyping,
    clearTypingIndicator
  };
}
