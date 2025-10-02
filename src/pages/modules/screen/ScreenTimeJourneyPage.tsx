// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Timer, Award, TrendingUp, Zap, Target, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
import { useJourneyModule } from '@/hooks/useJourneyModule';

interface ScreenBreak {
  id: string;
  name: string;
  emoji: string;
  duration: number; // en secondes
  exercise: string;
  benefit: string;
  difficulty: number;
}

const screenBreaks: ScreenBreak[] = [
  {
    id: '1',
    name: 'Le Clignement',
    emoji: '👁️',
    duration: 30,
    exercise: 'Cligne des yeux 20 fois lentement',
    benefit: 'Hydrate tes yeux',
    difficulty: 1
  },
  {
    id: '2',
    name: 'Le 20-20-20',
    emoji: '🔭',
    duration: 60,
    exercise: 'Regarde un objet à 20 mètres pendant 20 secondes',
    benefit: 'Relaxe les muscles oculaires',
    difficulty: 1
  },
  {
    id: '3',
    name: 'Palming Zen',
    emoji: '🙏',
    duration: 90,
    exercise: 'Frotte tes mains et couvre tes yeux avec la chaleur',
    benefit: 'Apaise et détend',
    difficulty: 2
  },
  {
    id: '4',
    name: 'Focus Dynamique',
    emoji: '🎯',
    duration: 120,
    exercise: 'Alterne entre un point proche et lointain 10 fois',
    benefit: 'Entraîne la flexibilité',
    difficulty: 2
  },
  {
    id: '5',
    name: 'Rotation 360°',
    emoji: '⭕',
    duration: 90,
    exercise: 'Fais des cercles avec tes yeux dans les deux sens',
    benefit: 'Renforce tous les muscles',
    difficulty: 3
  },
  {
    id: '6',
    name: 'Micro-Sieste Oculaire',
    emoji: '😴',
    duration: 180,
    exercise: 'Ferme les yeux et visualise un paysage apaisant',
    benefit: 'Repos complet',
    difficulty: 2
  },
  {
    id: '7',
    name: 'Le Défi Ultime',
    emoji: '🌟',
    duration: 300,
    exercise: 'Combinaison de tous les exercices précédents',
    benefit: 'Maîtrise totale',
    difficulty: 4
  },
];

export default function ScreenTimeJourneyPage() {
  const {
    currentStep,
    totalSteps,
    isActive: journeyActive,
    progress: journeyProgress,
    startStep,
    completeStep,
    skipStep,
    sessionData,
    updateProgress,
    achievements,
  } = useJourneyModule('screen-time', screenBreaks.length);

  const [currentBreak, setCurrentBreak] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(screenBreaks[0].duration);
  const [eyeHealth, setEyeHealth] = useState(100);
  const [blinkCount, setBlinkCount] = useState(0);
  const [showBlinkDetector, setShowBlinkDetector] = useState(false);

  const currentExercise = screenBreaks[currentBreak];
  const progress = ((currentExercise.duration - timeLeft) / currentExercise.duration) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Simulate eye health degradation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isActive) {
        setEyeHealth(prev => Math.max(0, prev - 0.5));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive]);

  const completeBreak = async () => {
    setIsActive(false);
    setEyeHealth(prev => Math.min(100, prev + 15));
    
    await completeStep({
      completionTime: screenBreaks[currentBreak].duration - timeLeft,
      performance: Math.round(eyeHealth),
      metadata: { blinkCount, exercise: screenBreaks[currentBreak].name }
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (currentBreak < screenBreaks.length - 1) {
      setTimeout(() => {
        setCurrentBreak(prev => prev + 1);
        setTimeLeft(screenBreaks[currentBreak + 1].duration);
      }, 2000);
    }
  };

  const startBreak = async () => {
    setIsActive(true);
    await startStep(currentBreak);
    if (currentExercise.name === 'Le Clignement') {
      setShowBlinkDetector(true);
      setBlinkCount(0);
    }
  };

  const pauseBreak = () => {
    setIsActive(false);
  };

  const skipBreak = async () => {
    await skipStep();
    if (currentBreak < screenBreaks.length - 1) {
      setCurrentBreak(prev => prev + 1);
      setTimeLeft(screenBreaks[currentBreak + 1].duration);
    }
  };

  const simulateBlink = () => {
    if (showBlinkDetector) {
      setBlinkCount(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Eye className="w-12 h-12" />
            Screen Time Saver Journey
          </h1>
          <p className="text-white/80 text-lg">Prends soin de tes yeux avec des pauses guidées</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Exercise */}
          <Card className="lg:col-span-2 p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{currentExercise.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentExercise.name}</h2>
                  <p className="text-white/70">{currentExercise.benefit}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-1 mb-1">
                  {[...Array(currentExercise.difficulty)].map((_, i) => (
                    <Zap key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <div className="text-white/70 text-sm">Difficulté</div>
              </div>
            </div>

            {/* Timer Circle */}
            <div className="relative h-80 flex items-center justify-center mb-6">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="35%"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="35%"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 35} ${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="text-center z-10">
                <div className="text-7xl font-bold text-white mb-2">{formatTime(timeLeft)}</div>
                <div className="text-white/70 text-lg">{isActive ? 'En cours...' : 'Prêt'}</div>
              </div>

              {/* Blink detector animation */}
              {showBlinkDetector && isActive && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <div className="text-white/30 text-6xl">👁️</div>
                </motion.div>
              )}
            </div>

            {/* Exercise Instructions */}
            <Card className="p-6 bg-white/5 mb-6">
              <h3 className="text-lg font-bold text-white mb-3">📋 Instructions</h3>
              <p className="text-white/80 text-lg leading-relaxed">{currentExercise.exercise}</p>
              
              {showBlinkDetector && isActive && (
                <div className="mt-4 text-center">
                  <Button
                    onClick={simulateBlink}
                    variant="outline"
                    className="h-20 w-full text-2xl"
                  >
                    👁️ Cligner ({blinkCount}/20)
                  </Button>
                </div>
              )}
            </Card>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-3">
              {!isActive ? (
                <>
                  <Button
                    onClick={startBreak}
                    className="col-span-2 h-14 text-lg bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    <Timer className="w-5 h-5 mr-2" />
                    Démarrer
                  </Button>
                  <Button
                    onClick={skipBreak}
                    variant="outline"
                    className="h-14"
                  >
                    Passer
                  </Button>
                </>
              ) : (
                <Button
                  onClick={pauseBreak}
                  className="col-span-3 h-14 text-lg"
                  variant="destructive"
                >
                  <EyeOff className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Eye Health */}
            <Card className={`p-6 backdrop-blur-lg border-2 transition-all ${
              eyeHealth > 70 ? 'bg-green-500/20 border-green-400' :
              eyeHealth > 40 ? 'bg-yellow-500/20 border-yellow-400' :
              'bg-red-500/20 border-red-400'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Eye className={`w-8 h-8 ${
                  eyeHealth > 70 ? 'text-green-400' :
                  eyeHealth > 40 ? 'text-yellow-400' :
                  'text-red-400'
                }`} />
                <span className="text-white/80">Santé Oculaire</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{Math.round(eyeHealth)}%</div>
              <Progress value={eyeHealth} className="h-3" />
              {eyeHealth < 50 && (
                <p className="text-white/70 text-sm mt-2">⚠️ Tes yeux ont besoin de repos!</p>
              )}
            </Card>

            {/* Streak */}
            <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg border-orange-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-orange-400" />
                <span className="text-white/80">Série</span>
              </div>
              <div className="text-4xl font-bold text-white">{sessionData.streak || 0} 🔥</div>
            </Card>

            {/* Stats */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Pauses totales</span>
                  <span className="text-white font-bold">{sessionData.completedCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Niveau</span>
                  <span className="text-white font-bold">{currentBreak + 1}/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Points</span>
                  <span className="text-white font-bold">{sessionData.totalPoints || 0}</span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-3">💡 Conseil Pro</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                La règle 20-20-20 : toutes les 20 minutes, regarde quelque chose à 20 mètres pendant 20 secondes. C'est la clé pour des yeux en bonne santé!
              </p>
            </Card>

            {achievements.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">Maître du Repos Oculaire!</h3>
                  <p className="text-white/70">Tes yeux te remercient 👁️✨</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress Timeline */}
        <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Ton Parcours Bien-Être Oculaire</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {screenBreaks.map((breakItem, index) => (
              <div
                key={breakItem.id}
                className={`p-4 rounded-lg text-center transition-all ${
                  index === currentBreak
                    ? 'bg-blue-500/30 border-2 border-blue-400 scale-105'
                    : index < currentBreak
                    ? 'bg-green-500/20 border-2 border-green-400'
                    : 'bg-white/10 border-2 border-white/20'
                }`}
              >
                <div className="text-4xl mb-2">{breakItem.emoji}</div>
                <div className="text-white text-sm font-medium mb-1">{breakItem.name}</div>
                <div className="text-white/60 text-xs">{breakItem.duration}s</div>
                {index < currentBreak && (
                  <div className="text-green-400 text-xs mt-2">✓ Complété</div>
                )}
                {index === currentBreak && (
                  <div className="text-blue-400 text-xs mt-2">● Actuel</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
