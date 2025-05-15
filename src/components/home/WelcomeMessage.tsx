
import React, { useEffect, useState } from 'react';
import { TimeOfDay } from '@/constants/defaults';

interface WelcomeMessageProps {
  className?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ className = '' }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TimeOfDay.MORNING);
  const [greeting, setGreeting] = useState('Bienvenue sur EmotionsCare');
  
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    // Set time of day based on current hour
    if (hour >= 5 && hour < 12) {
      setTimeOfDay(TimeOfDay.MORNING);
      setGreeting('Prêt(e) pour une journée calme et connectée ?');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay(TimeOfDay.AFTERNOON);
      setGreeting('Un moment pour vous, au cœur de votre journée');
    } else if (hour >= 18 && hour < 22) {
      setTimeOfDay(TimeOfDay.EVENING);
      setGreeting('Prenez soin de vous. Vous êtes au bon endroit.');
    } else {
      setTimeOfDay(TimeOfDay.NIGHT);
      setGreeting('Un instant de calme avant le repos');
    }
  }, []);
  
  return (
    <p className={`text-muted-foreground ${className}`}>
      {greeting}
    </p>
  );
};
