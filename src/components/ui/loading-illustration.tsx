
import React from 'react';
import { motion } from 'framer-motion';

export const LoadingIllustration: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-background">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-lg font-medium text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Chargement d'EmotionsCare...
        </motion.p>
        <motion.p
          className="text-sm text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Préparation de votre expérience personnalisée
        </motion.p>
      </div>
    </div>
  );
};
