
import React from 'react';
import { motion } from 'framer-motion';
import WelcomeMessage from './WelcomeMessage';
import ActionButtons from './ActionButtons';
import AnimatedBackground from './AnimatedBackground';
import PhilosophyIntro from './PhilosophyIntro';
import InteractivePathSelector from './InteractivePathSelector';
import BusinessSection from './BusinessSection';
import PersonalSection from './PersonalSection';
import PhilosophySection from './PhilosophySection';
import '@/components/home/immersive-home.css';

export const ImmersiveHome: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div className="immersive-bg">
        <AnimatedBackground />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen container-mobile py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full max-w-4xl mx-auto"
          >
            {/* Titre principal optimisé pour mobile */}
            <motion.h1 
              className="immersive-title text-responsive font-bold mb-2 sm:mb-4 md:mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              EmotionsCare
            </motion.h1>
            
            {/* Sous-titre */}
            <motion.p 
              className="text-responsive text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Votre compagnon de bien-être émotionnel powered by AI
            </motion.p>
            
            {/* Message de bienvenue avec typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 sm:mb-8 md:mb-12"
            >
              <WelcomeMessage className="px-1 sm:px-2" />
            </motion.div>
            
            {/* Boutons d'action */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="w-full px-1 sm:px-2"
            >
              <ActionButtons />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Philosophy Introduction */}
      <PhilosophyIntro />

      {/* Interactive Path Selector */}
      <InteractivePathSelector />

      {/* Business Section */}
      <BusinessSection />

      {/* Personal Section */}
      <PersonalSection />

      {/* Philosophy Details */}
      <PhilosophySection />

      {/* Footer avec signature */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 bg-gradient-to-r from-purple-900 to-blue-900 text-white"
      >
        <div className="container-mobile text-center">
          <motion.p 
            className="text-2xl md:text-3xl font-light mb-4"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            🌟 Découvrez, vivez, partagez l'expérience émotionnelle
          </motion.p>
          <p className="text-lg md:text-xl font-semibold text-purple-200">
            EmotionsCare SASU
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default ImmersiveHome;
