
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden py-12 md:py-16 lg:py-20">
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-slate-900"></div>
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent dark:from-slate-900 dark:to-transparent"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-blue-800 dark:text-blue-300 mb-6">
            Prenez soin de votre <span className="text-blue-600 dark:text-blue-400">bien-être émotionnel</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="text-lg md:text-xl text-blue-700/80 dark:text-blue-400/80 max-w-3xl mx-auto mb-8">
            Découvrez comment notre plateforme utilise l'intelligence artificielle pour analyser vos émotions et vous proposer des solutions personnalisées pour améliorer votre bien-être quotidien.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={() => navigate('/login')}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-6 text-lg"
          >
            Commencer maintenant
          </Button>
          <Button 
            onClick={() => navigate('/b2b/selection')}
            variant="outline" 
            size="lg"
            className="border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-8 py-6 text-lg"
          >
            Solutions entreprise
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
