import React from 'react';
import { useNyvee } from '../hooks/useNyvee';

interface NyveeMainProps {
  className?: string;
}

/**
 * Composant principal du module Nyvee
 * Cocoon émotionnel personnalisé
 */
export const NyveeMain: React.FC<NyveeMainProps> = ({ className = '' }) => {
  const { cozyLevel, increaseCozy, resetCozy } = useNyvee();

  return (
    <div className={`nyvee-container ${className}`}>
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold text-foreground">Nyvee Cocon 🫧</h2>
        
        <div className="text-center space-y-4">
          <div className="text-6xl">
            {cozyLevel < 30 ? '🌱' : cozyLevel < 70 ? '🫧' : '✨'}
          </div>
          <p className="text-muted-foreground">Niveau de confort: {cozyLevel}%</p>
          
          <div className="flex gap-3">
            <button
              onClick={increaseCozy}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Augmenter
            </button>
            <button
              onClick={resetCozy}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NyveeMain;
