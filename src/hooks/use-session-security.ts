
import { useState, useEffect, useCallback } from 'react';

interface SessionSecurityOptions {
  timeout?: number;
  warningTime?: number;
}

export const useSessionSecurity = (options: SessionSecurityOptions = {}) => {
  const {
    timeout = 900000, // 15 minutes par défaut
    warningTime = 60000, // 1 minute d'avertissement par défaut
  } = options;

  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeout);

  // Réinitialise le minuteur d'activité
  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  // Surveille l'activité de l'utilisateur
  useEffect(() => {
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Ajoute des écouteurs d'événements pour toutes les activités pertinentes
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Nettoie les écouteurs d'événements
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  // Vérifie le délai d'inactivité
  useEffect(() => {
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = Math.max(0, timeout - elapsed);
      
      setTimeLeft(remaining);

      // Affiche l'avertissement quand on approche du délai d'inactivité
      if (elapsed >= timeout - warningTime && !showWarning && remaining > 0) {
        setShowWarning(true);
      }

      // Déconnecte l'utilisateur après le délai d'inactivité
      if (elapsed >= timeout && remaining <= 0) {
        // La déconnexion peut être implémentée ici
        console.log("Session expirée - Déconnexion");
        // logout();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastActivity, timeout, warningTime, showWarning]);

  return {
    resetTimer,
    showWarning,
    timeLeft,
    isActive: timeLeft > 0
  };
};
