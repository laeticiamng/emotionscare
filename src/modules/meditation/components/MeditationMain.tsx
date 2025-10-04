import React from 'react';
import { useMeditation } from '../hooks/useMeditation';

interface MeditationMainProps {
  className?: string;
}

/**
 * Composant principal du module Meditation
 * Gère les sessions de méditation guidée
 */
export const MeditationMain: React.FC<MeditationMainProps> = ({ className = '' }) => {
  const { isActive, duration, startMeditation, stopMeditation } = useMeditation();

  return (
    <div className={`meditation-container ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Méditation Guidée</h2>
        
        {isActive ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">Session en cours: {duration}s</p>
            <button
              onClick={stopMeditation}
              className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Terminer
            </button>
          </div>
        ) : (
          <button
            onClick={startMeditation}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Démarrer une session
          </button>
        )}
      </div>
    </div>
  );
};

export default MeditationMain;
