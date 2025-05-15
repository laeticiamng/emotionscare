
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WelcomeMessageProps {
  className?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ className = '' }) => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // In a real implementation, this would call an API to generate the message
    // For now, we'll select from a predefined set
    const messages = [
      'Bienvenue dans votre espace personnel de reconnexion émotionnelle.',
      'Prenez un moment pour vous. Votre bien-être émotionnel est important.',
      'Découvrez des outils pour comprendre et gérer vos émotions au quotidien.',
      'Un espace serein pour prendre soin de votre bien-être mental et émotionnel.',
      'Explorez votre paysage émotionnel en toute sécurité et confidentialité.'
    ];
    
    // Select a random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Simulate API call delay
    setTimeout(() => {
      setMessage(randomMessage);
    }, 500);
  }, []);

  return (
    <motion.p 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: message ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {message || 'Chargement...'}
    </motion.p>
  );
};
