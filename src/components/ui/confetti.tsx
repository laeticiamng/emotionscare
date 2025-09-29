
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ duration = 3000 }) => {
  useEffect(() => {
    // Fire confetti
    const fireConfetti = () => {
      const end = Date.now() + duration;
      
      const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];
      
      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    };
    
    fireConfetti();
    
    return () => {
      confetti.reset();
    };
  }, [duration]);
  
  return null; // This component doesn't render anything visible
};
