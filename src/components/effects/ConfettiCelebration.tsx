// @ts-nocheck
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
  duration?: number;
  particleCount?: number;
  spread?: number;
  trigger?: boolean;
  colors?: string[];
}

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  duration = 3000,
  particleCount = 100,
  spread = 70,
  trigger = false,
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
}) => {
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (trigger && !fired) {
      setFired(true);
      
      const end = Date.now() + duration;
      
      // Create both left and right confetti cannon
      const launchConfetti = () => {
        confetti({
          particleCount: particleCount / 2,
          angle: 60,
          spread,
          origin: { x: 0.1, y: 0.6 },
          colors
        });
        
        confetti({
          particleCount: particleCount / 2,
          angle: 120,
          spread,
          origin: { x: 0.9, y: 0.6 },
          colors
        });
      };
      
      // Initial launch
      launchConfetti();
      
      // For longer durations, add multiple bursts
      if (duration > 1000) {
        const interval = setInterval(() => {
          if (Date.now() > end) {
            clearInterval(interval);
            setFired(false);
            return;
          }
          
          launchConfetti();
        }, 700);
        
        return () => {
          clearInterval(interval);
        };
      } else {
        const timeout = setTimeout(() => {
          setFired(false);
        }, duration);
        
        return () => {
          clearTimeout(timeout);
        };
      }
    }
  }, [trigger, fired, duration, particleCount, spread, colors]);

  return null; // This is just a utility component, no visual element
};

export default ConfettiCelebration;
