
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing typing indicator in chat
 */
export function useTypingIndicator() {
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Handle user typing and show indicators
  const handleUserTyping = useCallback(() => {
    // Reset typing indicator after a delay
    const resetIndicatorAfterDelay = () => {
      const timeout = setTimeout(() => {
        setTypingIndicator(null);
      }, 30000); // 30 seconds timeout
      return timeout;
    };
    
    // Set indicator based on message length and complexity
    setTypingIndicator("Le coach réfléchit...");
    const timeout = resetIndicatorAfterDelay();
    
    // Clean up timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, []);
  
  // Clear typing indicator
  const clearTypingIndicator = useCallback(() => {
    setTypingIndicator(null);
  }, []);
  
  // Handle typing error (e.g., network issues)
  const handleTypingError = useCallback(() => {
    setTypingIndicator(null);
    toast({
      title: "Problème de connexion",
      description: "La communication avec le coach a été interrompue. Veuillez réessayer.",
      variant: "destructive"
    });
  }, [toast]);
  
  return {
    typingIndicator,
    handleUserTyping,
    clearTypingIndicator,
    handleTypingError
  };
}
