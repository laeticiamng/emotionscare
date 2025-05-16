
import React, { useEffect, useState, useRef } from 'react';

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
  const [currentMessage, setCurrentMessage] = useState(welcomeMessages[0]);
  const [fadingOut, setFadingOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set up message rotation
    timeoutRef.current = setTimeout(() => {
      rotateMessage();
    }, 10000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentMessage]);
  
  const rotateMessage = () => {
    setFadingOut(true);
    
    setTimeout(() => {
      // Pick a new random message that's different from the current one
      let newIndex = Math.floor(Math.random() * welcomeMessages.length);
      while (welcomeMessages[newIndex] === currentMessage) {
        newIndex = Math.floor(Math.random() * welcomeMessages.length);
      }
      
      setCurrentMessage(welcomeMessages[newIndex]);
      setFadingOut(false);
    }, 500); // This should match the CSS transition time
  };
  
  return (
    <div className={`relative ${className}`}>
      <p 
        className={`transition-opacity duration-500 ${fadingOut ? 'opacity-0' : 'opacity-100'}`}
      >
        {currentMessage}
      </p>
    </div>
  );
};
