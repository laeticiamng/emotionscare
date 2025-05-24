
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

interface WelcomeMessageProps {
  className?: string;
}

const welcomeMessages = [
  "Analysez vos émotions en temps réel avec l'IA",
  "Découvrez votre coach personnel intelligent",
  "Explorez la thérapie musicale adaptative",
  "Transformez votre bien-être émotionnel",
  "Rejoignez une communauté bienveillante"
];

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ className = "" }) => {
  const { currentHour } = useTimeOfDay();
  
  const [text] = useTypewriter({
    words: [getTimeBasedGreeting(currentHour), ...welcomeMessages],
    loop: 1,
    delaySpeed: 3000,
    deleteSpeed: 50,
    typeSpeed: 60,
  });

  return (
    <motion.div 
      className={`text-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="min-h-[3rem] xs:min-h-[3.5rem] sm:min-h-[4rem] flex items-center justify-center px-2 sm:px-4">
        <motion.span 
          className="text-responsive text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center leading-relaxed max-w-full overflow-hidden"
          style={{ 
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto'
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
          <Cursor cursorStyle="✨" />
        </motion.span>
      </div>
    </motion.div>
  );
};

function getTimeBasedGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "Bonjour ! Commencez votre journée en beauté";
  } else if (hour >= 12 && hour < 18) {
    return "Bon après-midi ! Prenez soin de vous";
  } else {
    return "Bonsoir ! Un moment pour vous ressourcer";
  }
}

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
