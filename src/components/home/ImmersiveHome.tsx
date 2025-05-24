
import React from 'react';
import { motion } from 'framer-motion';
import { WelcomeMessage } from './WelcomeMessage';
import { ActionButtons } from './ActionButtons';
import AnimatedBackground from './AnimatedBackground';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Heart, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Scanner d'émotions IA",
      description: "Analysez vos émotions en temps réel"
    },
    {
      icon: Heart,
      title: "Coach personnel",
      description: "Accompagnement sur mesure"
    },
    {
      icon: Sparkles,
      title: "Thérapie musicale",
      description: "Musique adaptée à vos émotions"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <AnimatedBackground />
      
      {/* Hero Section - Optimisé mobile */}
      <div className="relative z-10 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Titre principal - Taille adaptée mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-16 sm:pt-20 lg:pt-24 text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight sm:leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                EmotionsCare
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2"
            >
              Votre compagnon de bien-être émotionnel powered by AI
            </motion.p>
          </motion.div>

          {/* Message de bienvenue - Espacement mobile optimisé */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 sm:mt-12"
          >
            <WelcomeMessage />
          </motion.div>

          {/* Boutons d'action - Stack vertical sur mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <Button
              onClick={() => navigate('/choose-mode')}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all duration-300"
            >
              Découvrir les fonctionnalités
            </Button>
          </motion.div>

          {/* Fonctionnalités - Grid adaptatif */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 sm:mt-20 lg:mt-24 pb-16 sm:pb-20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.2, duration: 0.6 }}
                    className="group"
                  >
                    <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group-hover:rotate-6 transition-transform duration-300">
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
