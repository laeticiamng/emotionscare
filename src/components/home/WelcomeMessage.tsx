import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeMessageProps {
  className?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`text-center ${className || ''}`}
    >
      <p className="text-lg md:text-xl text-muted-foreground font-light">
        Découvrez votre bien-être émotionnel grâce à l'intelligence artificielle
      </p>
    </motion.div>
  );
};

export default WelcomeMessage;
