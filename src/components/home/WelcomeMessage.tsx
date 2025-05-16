
import React, { useState, useEffect } from 'react';
import { TimeOfDay, determineTimeOfDay, DEFAULT_WELCOME_MESSAGES } from '@/constants/defaults';

interface WelcomeMessageProps {
  className?: string;
  customMessages?: string[];
  customMessage?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  className = '', 
  customMessages,
  customMessage 
}) => {
  const [message, setMessage] = useState<string>('');
  
  useEffect(() => {
    if (customMessage) {
      setMessage(customMessage);
      return;
    }
    
    const timeOfDay = determineTimeOfDay();
    const messages = customMessages || DEFAULT_WELCOME_MESSAGES[timeOfDay];
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);
  }, [customMessages, customMessage]);

  return (
    <p className={className}>
      {message}
    </p>
  );
};

export default WelcomeMessage;
