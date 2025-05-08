
import { useState, useCallback, useEffect } from 'react';

/**
 * Hook spécialisé pour gérer l'indicateur de frappe dans le chat
 */
export function useTypingIndicator() {
  const [typingIndicator, setTypingIndicator] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Fonction pour afficher l'indicateur de frappe
  const handleUserTyping = useCallback(() => {
    setTypingIndicator(true);
    
    // Efface le timeout précédent s'il existe
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Définir un nouveau timeout pour masquer l'indicateur après 1 seconde d'inactivité
    const timeout = setTimeout(() => {
      setTypingIndicator(false);
    }, 1000);
    
    setTypingTimeout(timeout);
  }, [typingTimeout]);
  
  // Fonction pour masquer l'indicateur de frappe
  const clearTypingIndicator = useCallback(() => {
    setTypingIndicator(false);
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
  }, [typingTimeout]);
  
  // Fonction pour gérer les erreurs d'indicateur de frappe
  const handleTypingError = useCallback(() => {
    clearTypingIndicator();
  }, [clearTypingIndicator]);
  
  // Nettoyer les timeouts lors du démontage du composant
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);
  
  return {
    typingIndicator,
    handleUserTyping,
    clearTypingIndicator,
    handleTypingError
  };
}
