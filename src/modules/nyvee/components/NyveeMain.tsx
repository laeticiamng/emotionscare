import React, { useState, useEffect } from 'react';
import { useNyvee } from '@/hooks/useNyvee';
import { useAuth } from '@/contexts/AuthContext';

interface NyveeMainProps {
  className?: string;
}

/**
 * Composant principal du module Nyvee
 * Cocoon émotionnel personnalisé
 */
export const NyveeMain: React.FC<NyveeMainProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { createSession, updateCozyLevel, completeSession, isCreating } = useNyvee(user?.id || '');
  const [cozyLevel, setCozyLevel] = useState(50);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const increaseCozy = async () => {
    const newLevel = Math.min(cozyLevel + 10, 100);
    setCozyLevel(newLevel);
    
    if (!sessionId && user?.id) {
      // Créer une nouvelle session - mapping cozyLevel to intensity
      const intensity = newLevel < 40 ? 'calm' : newLevel < 70 ? 'moderate' : 'intense';
      createSession({ intensity, moodBefore: newLevel }, {
        onSuccess: (session) => {
          setSessionId(session.id);
          setStartTime(Date.now());
        }
      });
    } else if (sessionId) {
      // Mettre à jour le niveau
      updateCozyLevel({ sessionId, cozyLevel: newLevel });
    }
  };

  const resetCozy = async () => {
    if (sessionId && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      completeSession({ sessionId, duration });
    }
    setCozyLevel(50);
    setSessionId(null);
    setStartTime(null);
  };

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
