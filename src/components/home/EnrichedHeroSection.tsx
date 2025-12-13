/**
 * EnrichedHeroSection - Section héro interventionnelle
 * Vision: EmotionsCare n'est pas une plateforme, c'est un réflexe émotionnel
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { StopCircle, Clock, Zap, Heart, Shield, Brain } from 'lucide-react';
import { useReducedMotion, getAnimationVariants } from '@/hooks/useReducedMotion';

const EnrichedHeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const animations = getAnimationVariants(prefersReducedMotion);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = prefersReducedMotion
    ? animations.fadeIn
    : {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      };

  const pulseVariants = prefersReducedMotion
    ? { animate: {} }
    : {
        animate: {
          scale: [1, 1.05, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
      };

  // Action immédiate - lancer une session
  const handleImmediateAction = () => {
    navigate('/app/scan');
  };

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center py-12 lg:py-20 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background - ambiance apaisante */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {!prefersReducedMotion ? (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-br from-primary/15 to-transparent rounded-full mix-blend-multiply filter blur-3xl"
              style={{ willChange: 'transform' }}
              animate={{
                y: [0, 50, 0],
                x: [0, 30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'mirror'
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-full mix-blend-multiply filter blur-3xl"
              style={{ willChange: 'transform' }}
              animate={{
                y: [0, -40, 0],
                x: [0, -20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'mirror'
              }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-br from-primary/15 to-transparent rounded-full mix-blend-multiply filter blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-full mix-blend-multiply filter blur-3xl" />
          </>
        )}
      </div>

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-10 max-w-5xl mx-auto"
        >
          {/* Badge contextuel - pas de jargon tech */}
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 backdrop-blur-sm"
            >
              <Heart className="h-3.5 w-3.5 mr-2 text-primary" />
              Si tu es ici, ce n'est probablement pas par curiosité.
            </Badge>
          </motion.div>

          {/* Headline interventionnelle - situation avant produit */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="text-foreground">
                Ton cerveau est encore
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/90 to-blue-500 bg-clip-text text-transparent">
                en train de tourner ?
              </span>
            </h1>
          </motion.div>

          {/* Sous-titre - urgence avant explication */}
          <motion.p
            variants={itemVariants}
            className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light"
          >
            On ne t'explique rien.{' '}
            <strong className="text-foreground font-medium">On t'aide à t'arrêter.</strong>
          </motion.p>

          {/* CTAs émotionnels - action avant compréhension */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.div
              variants={pulseVariants}
              animate="animate"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <Button
                size="lg"
                onClick={handleImmediateAction}
                className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-500 px-10 py-7 text-lg font-semibold group"
              >
                <StopCircle className="h-5 w-5 mr-3" />
                <span>Je veux que ça s'arrête maintenant</span>
                
                {/* Effet de brillance au hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>

            <Button
              size="lg"
              variant="ghost"
              onClick={handleImmediateAction}
              className="text-muted-foreground hover:text-foreground px-8 py-7 text-lg group"
            >
              <Clock className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
              <span>2 minutes suffisent</span>
            </Button>
          </motion.div>

          {/* Indicateurs de confiance - réassurance sans jargon */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-muted-foreground pt-10"
          >
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-green-500/15 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-500" aria-hidden="true" />
              </div>
              <span>Tes données restent privées</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-blue-500/15 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-blue-500" aria-hidden="true" />
              </div>
              <span>Effet en moins de 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-purple-500/15 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-purple-500" aria-hidden="true" />
              </div>
              <span>Aucune explication nécessaire</span>
            </div>
          </motion.div>

          {/* Cartes de sessions - protocoles, pas playlists */}
          <motion.div
            variants={itemVariants}
            className="pt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto"
          >
            {/* Session STOP */}
            <motion.button
              onClick={() => navigate('/app/scan?mode=stop')}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="text-left bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <StopCircle className="h-5 w-5 text-red-500" />
                </div>
                <Badge variant="outline" className="text-xs border-red-500/30 text-red-500">
                  Urgence
                </Badge>
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Stop</p>
              <p className="text-sm text-muted-foreground">
                Interrompre une montée anxieuse en cours
              </p>
            </motion.button>

            {/* Session Arrêt mental */}
            <motion.button
              onClick={() => navigate('/app/scan?mode=mental-stop')}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="text-left bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-500/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-indigo-500" />
                </div>
                <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-500">
                  Nuit
                </Badge>
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Arrêt mental</p>
              <p className="text-sm text-muted-foreground">
                Quand le corps est épuisé mais que le cerveau refuse
              </p>
            </motion.button>

            {/* Session Reset */}
            <motion.button
              onClick={() => navigate('/app/scan?mode=reset')}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="text-left bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-500">
                  Journée
                </Badge>
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Reset</p>
              <p className="text-sm text-muted-foreground">
                Quand tu dois continuer sans t'effondrer
              </p>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnrichedHeroSection;
