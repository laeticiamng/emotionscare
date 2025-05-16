import React, { useState, useEffect, useRef } from 'react';
import { CoachCharacterProps } from '@/types/coach';

const CoachCharacter: React.FC<CoachCharacterProps> = ({
  mood = 'neutral',
  speaking = false,
  imageUrl,
  size = 'md',
  style,
  className
}) => {
  const [blinking, setBlinking] = useState(false);
  const [breathScale, setBreathScale] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set size based on prop
  const sizeClass = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }[size];
  
  // Handle blinking animation
  useEffect(() => {
    const blinkRandomly = () => {
      const nextBlink = Math.random() * 5000 + 1000; // Between 1 and 6 seconds
      
      setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 200); // Eyes closed for 200ms
        if (document.visibilityState === 'visible') {
          blinkRandomly();
        }
      }, nextBlink);
    };
    
    blinkRandomly();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Handle breathing animation
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBreathScale(prev => prev === 1 ? 1.03 : 1);
    }, 2000); // Breathe every 2 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Get the appropriate color for the mood
  const getMoodColor = () => {
    const moodColors = {
      neutral: 'bg-blue-100 dark:bg-blue-900',
      happy: 'bg-amber-100 dark:bg-amber-900',
      calm: 'bg-emerald-100 dark:bg-emerald-900',
      sad: 'bg-indigo-100 dark:bg-indigo-900',
      anxious: 'bg-violet-100 dark:bg-violet-900',
      energetic: 'bg-orange-100 dark:bg-orange-900',
      focused: 'bg-cyan-100 dark:bg-cyan-900'
    };
    
    return moodColors[mood as keyof typeof moodColors] || moodColors.neutral;
  };
  
  // If image URL is provided, use it instead of the SVG character
  if (imageUrl) {
    return (
      <div 
        className={`rounded-full overflow-hidden ${sizeClass} ${className}`}
        style={{
          transform: `scale(${breathScale})`,
          transition: 'transform 2s ease-in-out',
          ...style
        }}
      >
        <img 
          src={imageUrl} 
          alt="Coach IA" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  
  // Otherwise, render the SVG character
  return (
    <div 
      className={`rounded-full ${sizeClass} ${getMoodColor()} flex items-center justify-center overflow-hidden shadow-lg ${className}`}
      style={{
        transform: `scale(${breathScale})`,
        transition: 'transform 2s ease-in-out',
        ...style
      }}
    >
      <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" style={{ overflow: 'visible' }}>
        {/* Face */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={speaking ? 'animate-pulse' : ''}
        />
        
        {/* Eyes */}
        <g className="transition-transform duration-200">
          {blinking ? (
            // Closed eyes
            <>
              <line x1="30" y1="45" x2="40" y2="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="60" y1="45" x2="70" y2="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            // Open eyes
            <>
              <circle cx="35" cy="45" r="5" fill="currentColor" />
              <circle cx="65" cy="45" r="5" fill="currentColor" />
            </>
          )}
        </g>
        
        {/* Mouth - changes based on mood and speaking */}
        {speaking ? (
          // Speaking mouth
          <ellipse cx="50" cy="65" rx="15" ry={mood === 'happy' ? '12' : '8'} fill="currentColor" opacity="0.7" />
        ) : (
          // Different mouths based on mood
          <>
            {mood === 'happy' && (
              <path d="M35,65 Q50,75 65,65" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            )}
            {mood === 'sad' && (
              <path d="M35,70 Q50,60 65,70" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            )}
            {mood === 'neutral' && (
              <line x1="35" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            )}
            {mood === 'anxious' && (
              <path d="M35,65 Q50,70 65,65" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
            )}
            {mood === 'energetic' && (
              <path d="M35,65 Q50,80 65,65" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            )}
            {mood === 'calm' && (
              <path d="M35,65 Q50,72 65,65" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            )}
            {mood === 'focused' && (
              <rect x="35" y="65" width="30" height="3" rx="1.5" fill="currentColor" />
            )}
          </>
        )}
      </svg>
    </div>
  );
};

export default CoachCharacter;
