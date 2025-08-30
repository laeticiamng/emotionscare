/**
 * B2C VR Galaxy - Cathédrale cosmique
 * Pitch : Tu respires sous les étoiles ; plus tu restes, plus le ciel se relie.
 * Boucle cœur : Démarrage → constellations qui se tissent si tu tiens la cadence → sortie en mots.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Eye, EyeOff, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Constellation {
  id: string;
  name: string;
  stars: Array<{ x: number; y: number; connected: boolean }>;
  unlocked: boolean;
  poeticDescription: string;
}

const ConstellationTemplates: Constellation[] = [
  {
    id: 'first-breath',
    name: 'Premier Souffle',
    stars: [
      { x: 50, y: 30, connected: false },
      { x: 60, y: 40, connected: false },
      { x: 70, y: 30, connected: false }
    ],
    unlocked: false,
    poeticDescription: "Trois étoiles qui naissent de ta première respiration consciente"
  },
  {
    id: 'inner-calm',
    name: 'Calme Intérieur',
    stars: [
      { x: 30, y: 50, connected: false },
      { x: 40, y: 45, connected: false },
      { x: 35, y: 60, connected: false },
      { x: 45, y: 65, connected: false }
    ],
    unlocked: false,
    poeticDescription: "Un carré de lumière qui grandit avec ta sérénité"
  },
  {
    id: 'cosmic-peace',
    name: 'Paix Cosmique',
    stars: [
      { x: 20, y: 20, connected: false },
      { x: 80, y: 20, connected: false },
      { x: 50, y: 80, connected: false },
      { x: 30, y: 70, connected: false },
      { x: 70, y: 70, connected: false }
    ],
    unlocked: false,
    poeticDescription: "Une danse d'étoiles qui célèbre ton voyage intérieur"
  }
];

export default function B2CVRGalaxyPage() {
  const [isVRMode, setIsVRMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [constellations, setConstellations] = useState<Constellation[]>(ConstellationTemplates);
  const [currentBreaths, setCurrentBreaths] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [mantra, setMantra] = useState('');
  const [showMantra, setShowMantra] = useState(false);

  // Session timer
  useEffect(() => {
    let timer: number;
    
    if (isActive && !sessionComplete) {
      timer = window.setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          
          // Chaque 30 secondes de respiration calme = 1 nouveau souffle
          if (newTime % 30 === 0) {
            setCurrentBreaths(prevBreaths => {
              const newBreaths = prevBreaths + 1;
              checkConstellationUnlock(newBreaths);
              return newBreaths;
            });
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isActive, sessionComplete]);

  const checkConstellationUnlock = (breaths: number) => {
    setConstellations(prev => prev.map((constellation, index) => {
      if (!constellation.unlocked && breaths >= (index + 1) * 3) {
        // Débloquer progressivement les constellations
        return {
          ...constellation,
          unlocked: true,
          stars: constellation.stars.map((star, starIndex) => ({
            ...star,
            connected: starIndex <= Math.floor(breaths / 2) // Connecter les étoiles progressivement
          }))
        };
      }
      return constellation;
    }));
  };

  const handleStart = () => {
    setIsActive(true);
    setSessionTime(0);
    setCurrentBreaths(0);
    setSessionComplete(false);
    setShowMantra(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    setSessionComplete(true);
    
    // Générer un mantra basé sur les constellations débloquées
    const unlockedCount = constellations.filter(c => c.unlocked).length;
    const mantras = [
      "Je respire avec l'univers",
      "Chaque souffle tisse ma lumière intérieure",
      "Je suis connecté(e) à l'infini en moi",
      "Ma paix rayonne comme les étoiles"
    ];
    setMantra(mantras[Math.min(unlockedCount - 1, mantras.length - 1)] || mantras[0]);
    setShowMantra(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionTime(0);
    setCurrentBreaths(0);
    setSessionComplete(false);
    setShowMantra(false);
    setConstellations(ConstellationTemplates.map(c => ({
      ...c,
      unlocked: false,
      stars: c.stars.map(s => ({ ...s, connected: false }))
    })));
  };

  const generateStarField = () => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3
    }));
  };

  const [backgroundStars] = useState(generateStarField());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.5, star.opacity],
              scale: [star.size, star.size * 1.2, star.size]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-md mx-auto pt-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold text-white mb-2">
            VR Galaxy
          </h1>
          <p className="text-blue-200 text-sm">
            Cathédrale cosmique sous les étoiles
          </p>
          
          {/* VR Toggle */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button
              onClick={() => setIsVRMode(!isVRMode)}
              variant="outline"
              size="sm"
              className={`${isVRMode ? 'bg-blue-500/20 border-blue-400 text-blue-200' : 'text-white border-white/30'}`}
            >
              {isVRMode ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {isVRMode ? 'VR Immersion' : 'Vue 2D'}
            </Button>
          </div>
        </motion.div>

        {/* Session Setup */}
        {!isActive && !sessionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-slate-800/50 border-slate-600">
              <div className="text-center space-y-4">
                <Sparkles className="w-12 h-12 mx-auto text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                  Voyage dans les étoiles
                </h3>
                <p className="text-slate-300 text-sm">
                  Respire calmement et regarde les constellations naître
                </p>
                
                <Button onClick={handleStart} className="w-full h-12 mt-6 bg-blue-600 hover:bg-blue-700">
                  <Play className="w-5 h-5 mr-2" />
                  Commencer le voyage
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Active Session */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Galaxy Dome */}
              <div className="relative h-80 bg-gradient-to-b from-slate-800/30 to-slate-900/50 rounded-3xl border border-slate-600/30 overflow-hidden">
                {/* Constellations */}
                {constellations.map((constellation) => (
                  <div key={constellation.id} className="absolute inset-0">
                    {constellation.stars.map((star, index) => (
                      <motion.div
                        key={index}
                        className={`absolute w-3 h-3 rounded-full ${
                          constellation.unlocked ? 'bg-blue-400' : 'bg-slate-500'
                        }`}
                        style={{
                          left: `${star.x}%`,
                          top: `${star.y}%`
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={constellation.unlocked ? {
                          scale: [0, 1.5, 1],
                          opacity: [0, 1, 0.8],
                        } : { scale: 0, opacity: 0 }}
                        transition={{
                          duration: 2,
                          delay: index * 0.5
                        }}
                      />
                    ))}
                    
                    {/* Star Connections */}
                    {constellation.unlocked && constellation.stars.length > 1 && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {constellation.stars.slice(0, -1).map((star, index) => {
                          const nextStar = constellation.stars[index + 1];
                          if (!star.connected || !nextStar.connected) return null;
                          
                          return (
                            <motion.line
                              key={index}
                              x1={`${star.x}%`}
                              y1={`${star.y}%`}
                              x2={`${nextStar.x}%`}
                              y2={`${nextStar.y}%`}
                              stroke="rgb(96, 165, 250)"
                              strokeWidth="1"
                              opacity="0.6"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, delay: (index + 1) * 0.5 }}
                            />
                          );
                        })}
                      </svg>
                    )}
                  </div>
                ))}

                {/* Central Breathing Anchor */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-8 h-8 bg-white/80 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>

              {/* Session Info */}
              <div className="text-center space-y-3">
                <div className="text-white">
                  <span className="text-2xl font-bold">{currentBreaths}</span>
                  <span className="text-slate-300 ml-2">souffles cosmiques</span>
                </div>
                
                <div className="text-slate-400 text-sm">
                  {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                </div>
                
                <div className="space-y-2">
                  {constellations.map((constellation) => (
                    <motion.div
                      key={constellation.id}
                      className={`text-xs px-3 py-1 rounded-full ${
                        constellation.unlocked 
                          ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' 
                          : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: constellation.unlocked ? 0.5 : 0 }}
                    >
                      {constellation.unlocked ? `✨ ${constellation.name}` : `⭐ ${constellation.name}`}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handlePause}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-slate-700 hover:bg-slate-600"
                >
                  <Pause className="w-6 h-6 text-white" />
                </Button>
                
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  <Star className="w-6 h-6" />
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full border-slate-600 text-slate-300"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Session Complete */}
        <AnimatePresence>
          {sessionComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-slate-800/50 border-slate-600 text-center">
                <Sparkles className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">
                  Voyage terminé
                </h3>
                
                <div className="text-slate-300 space-y-2 mb-6">
                  <p>{currentBreaths} souffles • {constellations.filter(c => c.unlocked).length} constellations</p>
                  <p className="text-sm">{Math.floor(sessionTime / 60)} minutes dans les étoiles</p>
                </div>
                
                {showMantra && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-900/30 rounded-lg p-4 mb-6"
                  >
                    <p className="text-blue-200 italic">"{mantra}"</p>
                  </motion.div>
                )}
                
                <div className="space-y-3">
                  <Button onClick={handleReset} className="w-full bg-blue-600 hover:bg-blue-700">
                    Nouveau voyage
                  </Button>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                    2 min de plus
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}