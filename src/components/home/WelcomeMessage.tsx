
import React, { useEffect, useState } from 'react';
import { TimeOfDay, determineTimeOfDay, DEFAULT_WELCOME_MESSAGES } from '@/constants/defaults';

interface WelcomeMessageProps {
  className?: string;
  customMessage?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  className = '', 
  customMessage 
}) => {
  const [message, setMessage] = useState<string>('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(determineTimeOfDay());

  useEffect(() => {
    if (customMessage) {
      setMessage(customMessage);
      return;
    }

    // Determine time of day for appropriate message
    const currentTimeOfDay = determineTimeOfDay();
    setTimeOfDay(currentTimeOfDay);
    
    // In a real implementation, this would call OpenAI to generate a dynamic message
    // For now, we'll use predefined messages based on time of day
    const defaultMessage = DEFAULT_WELCOME_MESSAGES[currentTimeOfDay] || 
                          DEFAULT_WELCOME_MESSAGES.GENERIC;
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setMessage(defaultMessage);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [customMessage]);

  if (!message) {
    return <p className={`text-muted-foreground ${className}`}>Chargement...</p>;
  }

  return (
    <p className={className}>
      {message}
    </p>
  );
};

export default WelcomeMessage;
