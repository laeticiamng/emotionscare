
import React, { useEffect, useState } from 'react';
import { TimeOfDay } from '@/constants/defaults';

interface WelcomeMessageProps {
  username?: string;
  className?: string;
}

// These would typically come from OpenAI in a real implementation
const WELCOME_MESSAGES = {
  [TimeOfDay.MORNING]: [
    "Bonjour. Prêt(e) pour une journée calme et connectée ?",
    "Le matin est propice au recentrage. Comment vous sentez-vous aujourd'hui ?",
    "Bienvenue dans votre espace. Laissez la journée commencer dans la douceur."
  ],
  [TimeOfDay.AFTERNOON]: [
    "Re-bonjour. Un moment pour vous reconnecter à l'essentiel ?",
    "Cet après-midi, prenez un temps pour vous. Vous êtes au bon endroit.",
    "Ravie de vous revoir. Comment évolue votre journée ?"
  ],
  [TimeOfDay.EVENING]: [
    "Bonsoir. Un moment calme pour clôturer la journée ?",
    "Prenez soin de vous. Vous êtes au bon endroit.",
    "C'est le moment idéal pour un retour à soi. Bienvenue."
  ],
  [TimeOfDay.NIGHT]: [
    "Bonsoir. Un dernier moment de calme avant le repos ?",
    "La nuit est propice à l'introspection. Bienvenue dans votre espace.",
    "Prenez ce temps pour vous. Vous êtes dans votre bulle de sérénité."
  ]
};

export function WelcomeMessage({ username, className = '' }: WelcomeMessageProps) {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    let timeOfDay: TimeOfDay;
    
    if (hour >= 5 && hour < 12) timeOfDay = TimeOfDay.MORNING;
    else if (hour >= 12 && hour < 18) timeOfDay = TimeOfDay.AFTERNOON;
    else if (hour >= 18 && hour < 22) timeOfDay = TimeOfDay.EVENING;
    else timeOfDay = TimeOfDay.NIGHT;
    
    const messages = WELCOME_MESSAGES[timeOfDay];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // In a real implementation, this would call OpenAI to generate a personalized message
    setMessage(username ? `${randomMessage} ${username}.` : randomMessage);
  }, [username]);
  
  return (
    <h2 className={`text-2xl font-light italic text-center ${className}`}>
      {message}
    </h2>
  );
}
