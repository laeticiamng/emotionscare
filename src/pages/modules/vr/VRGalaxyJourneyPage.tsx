// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Award, Star, Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Planet {
  id: number;
  name: string;
  emoji: string;
  theme: string;
  duration: number;
  color: string;
  description: string;
  unlocked: boolean;
}

const GALAXY_PLANETS: Planet[] = [
  {
    id: 1,
    name: 'Planète Zen',
    emoji: '🌊',
    theme: 'Relaxation profonde',
    duration: 300,
    color: 'hsl(200, 70%, 60%)',
    description: 'Plongez dans un océan de tranquillité',
    unlocked: true,
  },
  {
    id: 2,
    name: 'Nébuleuse des Rêves',
    emoji: '💫',
    theme: 'Méditation guidée',
    duration: 420,
    color: 'hsl(280, 60%, 65%)',
    description: 'Explorez les confins de votre conscience',
    unlocked: true,
  },
  {
    id: 3,
    name: 'Étoile Lumineuse',
    emoji: '✨',
    theme: 'Énergie positive',
    duration: 240,
    color: 'hsl(45, 90%, 60%)',
    description: 'Rechargez votre énergie vitale',
    unlocked: true,
  },
  {
    id: 4,
    name: 'Constellation Créative',
    emoji: '🎨',
    theme: 'Visualisation créative',
    duration: 360,
    color: 'hsl(160, 50%, 60%)',
    description: 'Libérez votre potentiel créatif',
    unlocked: false,
  },
  {
    id: 5,
    name: 'Trou Noir Guérisseur',
    emoji: '🌀',
    theme: 'Libération émotionnelle',
    duration: 480,
    color: 'hsl(270, 70%, 50%)',
    description: 'Laissez partir ce qui ne vous sert plus',
    unlocked: false,
  },
  {
    id: 6,
    name: 'Supernova d\'Amour',
    emoji: '💖',
    theme: 'Compassion universelle',
    duration: 540,
    color: 'hsl(330, 80%, 60%)',
    description: 'Connectez-vous à l\'amour inconditionnel',
    unlocked: false,
  },
];

export default function VRGalaxyJourneyPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isExperiencing, setIsExperiencing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [planetsVisited, setPlanetsVisited] = useState(0);
  const [level, setLevel] = useState(1);
  const [unlockedPlanets, setUnlockedPlanets] = useState<number[]>([1, 2, 3]);

  useEffect(() => {
    const stored = localStorage.getItem('vrGalaxyProgress');
    if (stored) {
      const data = JSON.parse(stored);
      setTotalMinutes(data.totalMinutes || 0);
      setPlanetsVisited(data.planetsVisited || 0);
      setLevel(data.level || 1);
      setUnlockedPlanets(data.unlockedPlanets || [1, 2, 3]);
    }
  }, []);

  useEffect(() => {
    if (!isExperiencing || !selectedPlanet) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / selectedPlanet.duration);
        if (newProgress >= 100) {
          completeExperience();
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExperiencing, selectedPlanet]);

  const startExperience = (planet: Planet) => {
    if (!unlockedPlanets.includes(planet.id)) return;
    setSelectedPlanet(planet);
    setProgress(0);
    setIsExperiencing(true);
  };

  const completeExperience = () => {
    if (!selectedPlanet) return;

    const minutesAdded = Math.floor(selectedPlanet.duration / 60);
    const newTotalMinutes = totalMinutes + minutesAdded;
    const newPlanetsVisited = planetsVisited + 1;
    const newLevel = Math.floor(newTotalMinutes / 30) + 1;

    setTotalMinutes(newTotalMinutes);
    setPlanetsVisited(newPlanetsVisited);
    setLevel(newLevel);

    // Unlock next planet
    const nextPlanetId = selectedPlanet.id + 1;
    if (nextPlanetId <= GALAXY_PLANETS.length && !unlockedPlanets.includes(nextPlanetId)) {
      setUnlockedPlanets([...unlockedPlanets, nextPlanetId]);
    }

    localStorage.setItem(
      'vrGalaxyProgress',
      JSON.stringify({
        totalMinutes: newTotalMinutes,
        planetsVisited: newPlanetsVisited,
        level: newLevel,
        unlockedPlanets: [...unlockedPlanets, nextPlanetId],
      })
    );

    setIsExperiencing(false);
    setSelectedPlanet(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6 relative overflow-hidden">
      {/* Animated stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1
            className="text-5xl font-bold text-white"
            animate={{ textShadow: ['0 0 20px #fff', '0 0 40px #fff', '0 0 20px #fff'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌌 Galaxie du Bien-Être
          </motion.h1>
          <p className="text-white/70 text-lg">Explorez l'univers de votre conscience</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-white/10 backdrop-blur border-white/20">
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
            <div className="text-2xl font-bold text-white">Niveau {level}</div>
            <div className="text-sm text-white/70">Explorateur</div>
          </Card>
          <Card className="p-4 text-center bg-white/10 backdrop-blur border-white/20">
            <Award className="w-6 h-6 mx-auto mb-2 text-blue-300" />
            <div className="text-2xl font-bold text-white">{planetsVisited}</div>
            <div className="text-sm text-white/70">Planètes visitées</div>
          </Card>
          <Card className="p-4 text-center bg-white/10 backdrop-blur border-white/20">
            <Zap className="w-6 h-6 mx-auto mb-2 text-purple-300" />
            <div className="text-2xl font-bold text-white">{totalMinutes} min</div>
            <div className="text-sm text-white/70">Temps total</div>
          </Card>
        </div>

        <AnimatePresence mode="wait">
          {!isExperiencing ? (
            <motion.div
              key="planets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {GALAXY_PLANETS.map((planet) => {
                const isUnlocked = unlockedPlanets.includes(planet.id);
                return (
                  <motion.div
                    key={planet.id}
                    whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                    className={isUnlocked ? 'cursor-pointer' : 'opacity-50'}
                  >
                    <Card
                      className={`p-6 bg-white/10 backdrop-blur border-white/20 ${
                        !isUnlocked && 'cursor-not-allowed'
                      }`}
                      onClick={() => isUnlocked && startExperience(planet)}
                    >
                      <div
                        className="text-6xl mb-4 text-center"
                        style={{ filter: isUnlocked ? 'none' : 'grayscale(100%)' }}
                      >
                        {planet.emoji}
                      </div>
                      <h3 className="text-xl font-bold text-white text-center mb-2">
                        {planet.name}
                      </h3>
                      <p className="text-white/70 text-sm text-center mb-3">{planet.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-white/60">
                          <span>{planet.theme}</span>
                          <span>{Math.floor(planet.duration / 60)} min</span>
                        </div>
                        {!isUnlocked && (
                          <div className="text-center text-xs text-yellow-300">
                            🔒 Niveau {planet.id} requis
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="experience"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="p-8 bg-white/10 backdrop-blur border-white/20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-40 h-40 mx-auto mb-8"
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-8xl"
                    style={{ backgroundColor: `${selectedPlanet?.color}40` }}
                  >
                    {selectedPlanet?.emoji}
                  </div>
                </motion.div>

                <h2 className="text-3xl font-bold text-white text-center mb-4">
                  {selectedPlanet?.name}
                </h2>
                <p className="text-white/80 text-center mb-6">{selectedPlanet?.theme}</p>

                <Progress value={progress} className="h-3 mb-4" />
                <div className="text-center text-white/70 mb-6">
                  {Math.round(progress)}% • {Math.floor((selectedPlanet?.duration || 0) * (1 - progress / 100))}s
                  restantes
                </div>

                <div className="space-y-4 text-center">
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-white/90 text-lg italic"
                  >
                    Respirez profondément... Laissez-vous porter...
                  </motion.p>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsExperiencing(false);
                      setSelectedPlanet(null);
                      setProgress(0);
                    }}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    Quitter l'expérience
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
