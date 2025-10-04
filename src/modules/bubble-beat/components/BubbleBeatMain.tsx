import React from 'react';
import { useBubbleBeat } from '../hooks/useBubbleBeat';

interface BubbleBeatMainProps {
  className?: string;
}

/**
 * Composant principal du module Bubble Beat
 * Jeu rythmique anti-stress
 */
export const BubbleBeatMain: React.FC<BubbleBeatMainProps> = ({ className = '' }) => {
  const { score, isPlaying, startGame, stopGame } = useBubbleBeat();

  return (
    <div className={`bubble-beat-container ${className}`}>
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold text-foreground">Bubble Beat 🫧</h2>
        
        {isPlaying ? (
          <div className="space-y-4 text-center">
            <div className="text-4xl font-bold text-primary">{score}</div>
            <p className="text-muted-foreground">Score</p>
            <button
              onClick={stopGame}
              className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Terminer
            </button>
          </div>
        ) : (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Commencer à jouer
          </button>
        )}
      </div>
    </div>
  );
};

export default BubbleBeatMain;
