import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentWrapper } from './AssessmentWrapper';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Sparkles, Heart, Brain, Zap, Wind } from 'lucide-react';
import type { Instrument } from '../../../../packages/contracts/assess';

interface AssessmentExperienceProps {
  instrument: Instrument;
  title: string;
  description: string;
  context?: string;
  theme?: 'wellness' | 'energy' | 'calm' | 'focus' | 'social' | 'creative';
  onComplete?: (badges: string[]) => void;
  showProgress?: boolean;
  immersive?: boolean;
}

const themeConfig = {
  wellness: {
    icon: Heart,
    colors: 'from-rose-500 to-pink-500',
    particles: '✨',
    bgPattern: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20'
  },
  energy: {
    icon: Zap,
    colors: 'from-orange-500 to-yellow-500', 
    particles: '⚡',
    bgPattern: 'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20'
  },
  calm: {
    icon: Wind,
    colors: 'from-blue-500 to-teal-500',
    particles: '🌊',
    bgPattern: 'bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20'
  },
  focus: {
    icon: Brain,
    colors: 'from-purple-500 to-indigo-500',
    particles: '🧠',
    bgPattern: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20'
  },
  social: {
    icon: Star,
    colors: 'from-green-500 to-emerald-500',
    particles: '💫',
    bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
  },
  creative: {
    icon: Sparkles,
    colors: 'from-violet-500 to-purple-500',
    particles: '🎨',
    bgPattern: 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20'
  }
};

export function AssessmentExperience({
  instrument,
  title,
  description,
  context = 'adhoc',
  theme = 'wellness',
  onComplete,
  showProgress = true,
  immersive = true
}: AssessmentExperienceProps) {
  const [phase, setPhase] = useState<'intro' | 'assessment' | 'completion'>('intro');
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  
  const config = themeConfig[theme];
  const Icon = config.icon;

  useEffect(() => {
    if (immersive) {
      // Créer des particules animées
      const newParticles = Array.from({length: 12}, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
    }
  }, [immersive]);

  const handleStart = () => {
    setPhase('assessment');
    setProgress(20);
  };

  const handleComplete = (badges: string[]) => {
    setProgress(100);
    setPhase('completion');
    onComplete?.(badges);
  };

  if (!immersive) {
    return (
      <AssessmentWrapper
        instrument={instrument}
        title={title}
        description={description}
        context={context}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${config.bgPattern}`}>
      {/* Particules animées */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl opacity-20 pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [-20, -40, -20],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        >
          {config.particles}
        </motion.div>
      ))}

      {/* Barre de progression */}
      {showProgress && (
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 p-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2 bg-white/20" />
            <p className="text-sm text-center mt-2 text-muted-foreground">
              Parcours bien-être • {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -50 }}
              className="text-center max-w-lg"
            >
              <motion.div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${config.colors} mb-6 shadow-lg`}
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1 
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h1>

              <motion.p 
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Badge variant="outline" className="mb-6 px-4 py-2">
                  Expérience personnalisée • 100% confidentiel
                </Badge>
              </motion.div>

              <motion.button
                onClick={handleStart}
                className={`px-8 py-4 rounded-full text-white font-medium text-lg shadow-lg bg-gradient-to-r ${config.colors} hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Commencer l'expérience
              </motion.button>
            </motion.div>
          )}

          {phase === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <AssessmentWrapper
                instrument={instrument}
                title={title}
                description="Répondez selon votre ressenti du moment"
                context={context}
                onComplete={handleComplete}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20"
              />
            </motion.div>
          )}

          {phase === 'completion' && (
            <motion.div
              key="completion"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="text-center max-w-lg"
            >
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6 shadow-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h2 
                className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Expérience terminée !
              </motion.h2>

              <motion.p 
                className="text-lg text-muted-foreground mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Merci pour votre participation. Vos réponses vont nous aider à personnaliser votre expérience.
              </motion.p>

              <motion.div
                className="flex justify-center space-x-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}