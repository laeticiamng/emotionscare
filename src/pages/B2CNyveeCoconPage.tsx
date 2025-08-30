/**
 * Nyvée - Cocon d'urgence
 * Quand tu n'en peux plus : appui long, l'app t'enveloppe 6–10 min et te ramène
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Heart, Wind, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NyveeCocon: React.FC = () => {
  const navigate = useNavigate();
  const [sessionState, setSessionState] = useState<'intro' | 'breathing' | 'silence' | 'anchor' | 'complete'>('intro');
  const [timeRemaining, setTimeRemaining] = useState(360); // 6 minutes
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // Protocole d'ancrage 5-4-3-2-1 pour l'agitation
  const anchorSteps = [
    "5 choses que tu vois",
    "4 choses que tu touches", 
    "3 choses que tu entends",
    "2 choses que tu sens",
    "1 chose que tu goûtes"
  ];

  useEffect(() => {
    if (sessionState === 'breathing' || sessionState === 'silence') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionState('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [sessionState]);

  // Animation de respiration
  useEffect(() => {
    if (sessionState === 'breathing') {
      const breathCycle = setInterval(() => {
        setBreathingPhase(prev => {
          switch (prev) {
            case 'inhale': return 'hold';
            case 'hold': return 'exhale';
            case 'exhale': return 'inhale';
            default: return 'inhale';
          }
        });
      }, 4000); // 4 secondes par phase
      
      return () => clearInterval(breathCycle);
    }
  }, [sessionState]);

  const startCocon = () => {
    setSessionState('breathing');
    setTimeRemaining(120); // 2 minutes de respiration d'abord
  };

  const moveToSilence = () => {
    setSessionState('silence');
    setTimeRemaining(240); // 4 minutes de silence
  };

  const moveToAnchor = () => {
    setSessionState('anchor');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 1.2;
      case 'hold': return 1.2;
      case 'exhale': return 0.8;
      default: return 1;
    }
  };

  const getBreathingOpacity = () => {
    switch (breathingPhase) {
      case 'inhale': return 0.8;
      case 'hold': return 0.9;
      case 'exhale': return 0.4;
      default: return 0.6;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Halos respirants d'arrière-plan */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {sessionState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <motion.div
                className="mb-8"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-20 h-20 text-indigo-300 mx-auto" />
              </motion.div>
              
              <h1 className="text-3xl font-light text-white mb-4">
                Cocon d'Urgence
              </h1>
              <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                Un refuge de 6 minutes pour te ramener<br />
                à toi quand tout devient trop lourd
              </p>
              
              <Button
                onClick={startCocon}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg rounded-full"
              >
                Entrer dans le cocon
              </Button>
              
              <div className="mt-8 text-indigo-300 text-sm">
                <p>NoMic/NoCam par défaut • Tout reste local</p>
              </div>
            </motion.div>
          )}

          {sessionState === 'breathing' && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="mb-8">
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center"
                  animate={{
                    scale: getBreathingScale(),
                    opacity: getBreathingOpacity(),
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut"
                  }}
                >
                  <Wind className="w-12 h-12 text-white" />
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-light text-white mb-4">
                Respire avec le halo
              </h2>
              
              <div className="text-indigo-200 text-lg mb-6">
                {breathingPhase === 'inhale' && "Inspire doucement..."}
                {breathingPhase === 'hold' && "Retiens..."}
                {breathingPhase === 'exhale' && "Expire lentement..."}
              </div>
              
              <div className="text-indigo-300 text-sm">
                {formatTime(timeRemaining)}
              </div>
              
              <Button
                onClick={moveToSilence}
                variant="ghost"
                className="mt-8 text-indigo-300 hover:text-white"
              >
                Passer au silence
              </Button>
            </motion.div>
          )}

          {sessionState === 'silence' && (
            <motion.div
              key="silence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="mb-8">
                <motion.div
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-400/30 to-indigo-400/30 flex items-center justify-center"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-3 h-3 bg-white/50 rounded-full" />
                </motion.div>
              </div>
              
              <h2 className="text-xl font-light text-white/80 mb-6">
                Silence sculpté
              </h2>
              
              <div className="text-indigo-300 text-sm mb-8">
                {formatTime(timeRemaining)}
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={moveToAnchor}
                  variant="ghost"
                  className="text-indigo-300 hover:text-white text-sm"
                >
                  Si agitation → Ancrage 5-4-3-2-1
                </Button>
              </div>
            </motion.div>
          )}

          {sessionState === 'anchor' && (
            <motion.div
              key="anchor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16"
            >
              <h2 className="text-2xl font-light text-white text-center mb-8">
                Ancrage 5-4-3-2-1
              </h2>
              
              <div className="space-y-6">
                {anchorSteps.map((step, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">
                          {5 - index}
                        </div>
                        <span className="text-white text-lg">{step}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button
                  onClick={() => setSessionState('complete')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full"
                >
                  Terminer l'ancrage
                </Button>
              </div>
            </motion.div>
          )}

          {sessionState === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                className="mb-8"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: 3 }}
              >
                <Heart className="w-16 h-16 text-pink-400 mx-auto" />
              </motion.div>
              
              <h2 className="text-2xl font-light text-white mb-4">
                Sortie douce
              </h2>
              
              <p className="text-indigo-200 mb-8">
                Tu as pris ce temps pour toi.<br />
                Comment te sens-tu maintenant ?
              </p>
              
              <div className="space-y-4 mb-8">
                <Button
                  onClick={() => setSessionState('breathing')}
                  variant="outline"
                  className="border-indigo-400 text-indigo-300 hover:bg-indigo-600 hover:text-white mr-4"
                >
                  Encore un peu
                </Button>
                <Button
                  onClick={() => navigate('/app/home')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  C'est mieux
                </Button>
              </div>
              
              <div className="text-indigo-300 text-sm">
                Rappel doux dans 45 min ? (optionnel)
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NyveeCocon;