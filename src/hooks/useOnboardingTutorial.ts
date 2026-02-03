import { useState, useEffect } from 'react';

const TUTORIAL_KEY = 'emotionscare_tutorial_completed';

export interface UseOnboardingTutorialReturn {
  showTutorial: boolean;
  completeTutorial: () => void;
  resetTutorial: () => void;
  skipTutorial: () => void;
}

/**
 * Hook pour gérer l'affichage du tutoriel interactif
 * Différent de useOnboarding qui gère le profil utilisateur
 */
export const useOnboardingTutorial = (): UseOnboardingTutorialReturn => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if tutorial was completed
    const completed = localStorage.getItem(TUTORIAL_KEY);
    if (!completed) {
      // Délai pour ne pas afficher immédiatement au chargement
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTutorial = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    setShowTutorial(false);
  };

  const skipTutorial = () => {
    localStorage.setItem(TUTORIAL_KEY, 'skipped');
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_KEY);
    setShowTutorial(true);
  };

  return {
    showTutorial,
    completeTutorial,
    resetTutorial,
    skipTutorial,
  };
};
