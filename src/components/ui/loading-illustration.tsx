import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Zap } from 'lucide-react';

export const LoadingIllustration: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="text-center space-y-6">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto relative"
          >
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-2 rounded-full border-4 border-primary/40"></div>
            <div className="absolute inset-4 rounded-full border-4 border-primary"></div>
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-primary" />
          </motion.div>
        </div>
        
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold text-foreground"
          >
            EmotionsCare
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            Préparation de votre espace bien-être...
          </motion.p>
        </div>
        
        <div className="flex justify-center space-x-4">
          {[Brain, Zap, Heart].map((Icon, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="p-2 rounded-full bg-primary/10"
            >
              <Icon className="w-4 h-4 text-primary" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
