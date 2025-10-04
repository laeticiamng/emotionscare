import React from 'react';
import { useAmbitionArcade } from '../hooks/useAmbitionArcade';

interface AmbitionArcadeMainProps {
  className?: string;
}

/**
 * Composant principal du module Ambition Arcade
 * Jeu d'objectifs gamifié
 */
export const AmbitionArcadeMain: React.FC<AmbitionArcadeMainProps> = ({ className = '' }) => {
  const { goals, currentLevel, addGoal, completeGoal } = useAmbitionArcade();

  return (
    <div className={`ambition-arcade-container ${className}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Ambition Arcade 🎯</h2>
          <span className="text-lg font-semibold text-primary">Niveau {currentLevel}</span>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={addGoal}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ajouter un objectif
          </button>
          
          <div className="space-y-2">
            {goals.map(goal => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
              >
                <span className={goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}>
                  {goal.title}
                </span>
                {!goal.completed && (
                  <button
                    onClick={() => completeGoal(goal.id)}
                    className="px-4 py-2 bg-success text-success-foreground rounded hover:bg-success/90 transition-colors text-sm"
                  >
                    Compléter
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {goals.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Aucun objectif pour le moment
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbitionArcadeMain;
