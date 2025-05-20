
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

interface WelcomeMessageProps {
  className?: string;
}

const welcomeMessages = [
  "Prenez un moment pour vous reconnecter à vos émotions",
  "Explorez votre bien-être émotionnel en toute sérénité",
  "Découvrez une méthode scientifique pour comprendre vos émotions",
  "Un espace premium pour votre équilibre émotionnel",
  "Votre parcours vers la sérénité commence ici"
];

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ className = "" }) => {
  const { currentHour } = useTimeOfDay();
  const [message, setMessage] = useState("");
  
  const [text] = useTypewriter({
    words: [getTimeBasedGreeting(currentHour), ...welcomeMessages],
    loop: 1,
    delaySpeed: 2000,
    deleteSpeed: 40,
    typeSpeed: 40,
  });

  return (
    <motion.div 
      className={`text-center ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="block min-h-[4rem]">
        {text}<Cursor cursorColor="var(--primary)" />
      </span>
    </motion.div>
  );
};

// Helper to get time-based greetings
function getTimeBasedGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "Bonjour et bienvenue sur votre espace bien-être";
  } else if (hour >= 12 && hour < 18) {
    return "Bon après-midi et bienvenue sur votre espace bien-être";
  } else {
    return "Bonsoir et bienvenue sur votre espace bien-être";
  }
}

// Hook to get current time of day
function useTimeOfDay() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { currentHour };
}

export default WelcomeMessage;
