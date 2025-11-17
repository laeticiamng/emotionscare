/**
 * EnrichedHeroSection - Section héro améliorée avec animations et contenu dynamique
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Sparkles, Zap, Heart } from 'lucide-react';
import { useReducedMotion, getAnimationVariants } from '@/hooks/useReducedMotion';

const EnrichedHeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const animations = getAnimationVariants(prefersReducedMotion);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : 0.2,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = prefersReducedMotion
    ? animations.fadeIn
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: 'easeOut' },
        },
      };

  const floatingVariants = prefersReducedMotion
    ? { animate: {} }
    : {
        animate: {
          y: [0, -20, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
      };

  return (
    <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-background via-background/80 to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            y: [0, -100, 0],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 mr-2" />
              Nouveau : Expériences immersives débloquées
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-blue-500 bg-clip-text text-transparent">
                Transformez votre bien-être
              </span>
              <br />
              <span className="text-3xl lg:text-5xl text-foreground/90 font-medium">
                Avec intelligence émotionnelle
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          >
            Découvrez la première plateforme d'IA qui comprend vos émotions.
            <strong className="text-foreground"> Musicothérapie, scan émotionnel, coaching personnalisé</strong> et expériences immersives.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg group"
              asChild
            >
              <Link to="/signup">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Essai gratuit 30 jours</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:bg-muted/50 px-8 py-4 text-lg backdrop-blur-sm"
              asChild
            >
              <Link to="/demo">
                <Zap className="h-5 w-5 mr-2" />
                <span>Voir la démo interactive</span>
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted-foreground pt-8 border-t border-border/50"
          >
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-green-500" aria-hidden="true" />
              </div>
              <span>Confiance de 25K+ utilisateurs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-blue-500" aria-hidden="true" />
              </div>
              <span>100% sécurisé RGPD</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-purple-500" aria-hidden="true" />
              </div>
              <span>Installation instantanée</span>
            </div>
          </motion.div>

          {/* Floating Cards Preview */}
          <motion.div
            variants={itemVariants}
            className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20"
            >
              <div className="text-2xl mb-2">🎵</div>
              <p className="text-sm font-medium">Musique Thérapeutique</p>
              <p className="text-xs text-muted-foreground">Générée par IA en temps réel</p>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm rounded-xl p-4 border border-green-500/20"
            >
              <div className="text-2xl mb-2">👁️</div>
              <p className="text-sm font-medium">Analyse Émotions</p>
              <p className="text-xs text-muted-foreground">99% de précision avec IA</p>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20"
            >
              <div className="text-2xl mb-2">🧠</div>
              <p className="text-sm font-medium">Coach Personnel</p>
              <p className="text-xs text-muted-foreground">Support 24/7 personnalisé</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnrichedHeroSection;
