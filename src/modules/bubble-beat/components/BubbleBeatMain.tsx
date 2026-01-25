import React, { useState, useRef, useEffect } from 'react';
import { useBubbleBeat } from '@/hooks/useBubbleBeat';
import { useAuth } from '@/contexts/AuthContext';

interface BubbleBeatMainProps {
  className?: string;
}

/**
 * Composant principal du module Bubble Beat
 * Jeu rythmique anti-stress
 */
export const BubbleBeatMain: React.FC<BubbleBeatMainProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { createSession, completeSession } = useBubbleBeat(user?.id || '');
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [bubblesPopped, setBubblesPopped] = useState(0);

  // Ref pour stocker l'interval (type-safe, pas de @ts-ignore)
  const bubbleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup de l'interval au unmount du composant
  useEffect(() => {
    return () => {
      if (bubbleIntervalRef.current) {
        clearInterval(bubbleIntervalRef.current);
        bubbleIntervalRef.current = null;
      }
    };
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setBubblesPopped(0);
    setStartTime(Date.now());
    
    if (user?.id) {
      createSession({ difficulty: 'medium', mood: 'calm' }, {
        onSuccess: (session: any) => {
          setSessionId(session.id);
        }
      });
    }
    
    // Simuler des points
    const interval = setInterval(() => {
      setScore(prev => prev + 10);
      setBubblesPopped(prev => prev + 1);
    }, 1000);

    // Stocker dans ref (type-safe ✅)
    bubbleIntervalRef.current = interval;
  };

  const stopGame = () => {
    setIsPlaying(false);
    // Nettoyer l'interval (type-safe ✅)
    if (bubbleIntervalRef.current) {
      clearInterval(bubbleIntervalRef.current);
      bubbleIntervalRef.current = null;
    }
    
    if (sessionId && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      completeSession({ sessionId, score, bubblesPopped, duration });
    }
  };

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
