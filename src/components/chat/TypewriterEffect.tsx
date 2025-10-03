import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 30,
  delay = 0,
  onComplete,
  className,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
    setIsTyping(false);
    
    // Delay before starting
    timeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  useEffect(() => {
    if (!isTyping) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, isTyping, text, speed, onComplete]);
  
  return <span className={className}>{displayText}</span>;
};

export default TypewriterEffect;
