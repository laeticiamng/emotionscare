// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Award, Timer, TrendingUp, Target, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';

interface FlashChallenge {
  id: string;
  name: string;
  emoji: string;
  task: string;
  duration: number; // secondes
  points: number;
  category: 'physical' | 'mental' | 'creative' | 'social' | 'grateful';
  difficulty: number;
}

const flashChallenges: FlashChallenge[] = [
  { id: '1', name: 'Sourire Express', emoji: '😊', task: 'Souris pendant 10 secondes', duration: 10, points: 10, category: 'physical', difficulty: 1 },
  { id: '2', name: 'Respiration Zen', emoji: '🧘', task: '3 grandes respirations profondes', duration: 15, points: 15, category: 'physical', difficulty: 1 },
  { id: '3', name: 'Gratitude Flash', emoji: '🙏', task: 'Pense à 3 choses positives', duration: 20, points: 20, category: 'grateful', difficulty: 1 },
  { id: '4', name: 'Dance Break', emoji: '💃', task: 'Danse sur place 15 secondes', duration: 15, points: 20, category: 'physical', difficulty: 2 },
  { id: '5', name: 'Compliment Mental', emoji: '💭', task: 'Pense à 1 compliment pour toi', duration: 15, points: 15, category: 'mental', difficulty: 1 },
  { id: '6', name: 'Power Pose', emoji: '💪', task: 'Pose de super-héros 20 secondes', duration: 20, points: 25, category: 'physical', difficulty: 2 },
  { id: '7', name: 'Mini Méditation', emoji: '🌟', task: 'Ferme les yeux et visualise du bonheur', duration: 30, points: 30, category: 'mental', difficulty: 2 },
  { id: '8', name: 'Stretch Express', emoji: '🤸', task: 'Étire-toi dans toutes les directions', duration: 25, points: 25, category: 'physical', difficulty: 2 },
  { id: '9', name: 'Rire Thérapie', emoji: '😂', task: 'Ris (même forcé) pendant 10 secondes', duration: 10, points: 20, category: 'physical', difficulty: 1 },
  { id: '10', name: 'Affirmation Positive', emoji: '✨', task: 'Répète "Je suis capable" 5 fois', duration: 15, points: 20, category: 'mental', difficulty: 1 },
  { id: '11', name: 'Câlin Virtuel', emoji: '🤗', task: 'Envoie de l\'amour à quelqu\'un mentalement', duration: 15, points: 20, category: 'social', difficulty: 1 },
  { id: '12', name: 'Creativity Spark', emoji: '🎨', task: 'Imagine 3 choses créatives', duration: 20, points: 25, category: 'creative', difficulty: 2 },
  { id: '13', name: 'Energy Boost', emoji: '⚡', task: '10 jumping jacks rapides', duration: 15, points: 30, category: 'physical', difficulty: 3 },
  { id: '14', name: 'Mindful Moment', emoji: '🧠', task: 'Observe 5 choses autour de toi', duration: 25, points: 25, category: 'mental', difficulty: 2 },
  { id: '15', name: 'Victory Pose', emoji: '🏆', task: 'Célèbre comme si tu avais gagné', duration: 10, points: 20, category: 'physical', difficulty: 2 },
  { id: '16', name: 'Heart Connection', emoji: '❤️', task: 'Mets ta main sur ton cœur et ressens-le', duration: 20, points: 25, category: 'mental', difficulty: 2 },
  { id: '17', name: 'Future Vision', emoji: '🔮', task: 'Visualise ton meilleur futur 30 secondes', duration: 30, points: 35, category: 'creative', difficulty: 3 },
  { id: '18', name: 'Nature Connection', emoji: '🌿', task: 'Imagine-toi dans la nature', duration: 25, points: 30, category: 'mental', difficulty: 2 },
  { id: '19', name: 'Self High-Five', emoji: '🙌', task: 'Félicite-toi à voix haute', duration: 10, points: 15, category: 'social', difficulty: 1 },
  { id: '20', name: 'Champion Mode', emoji: '👑', task: 'Combine 3 challenges précédents', duration: 60, points: 100, category: 'physical', difficulty: 5 },
];

export default function FlashGlowJourneyPage() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [glowLevel, setGlowLevel] = useState(0);

  const currentChallenge = flashChallenges[currentChallengeIndex];
  const progress = currentChallenge ? ((currentChallenge.duration - timeLeft) / currentChallenge.duration) * 100 : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeChallenge();
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

  // Update glow level based on points
  useEffect(() => {
    setGlowLevel(Math.min(100, (totalPoints / 500) * 100));
  }, [totalPoints]);

  const startChallenge = () => {
    if (!currentChallenge) return;
    setTimeLeft(currentChallenge.duration);
    setIsActive(true);
  };

  const completeChallenge = () => {
    if (!currentChallenge) return;
    
    setIsActive(false);
    setCompletedChallenges(prev => [...prev, currentChallenge.id]);
    setTotalPoints(prev => prev + currentChallenge.points);
    setStreak(prev => {
      const newStreak = prev + 1;
      if (newStreak > bestStreak) setBestStreak(newStreak);
      return newStreak;
    });

    confetti({
      particleCount: 50 + currentChallenge.difficulty * 10,
      spread: 60,
      origin: { y: 0.6 },
    });

    // Auto-advance to next challenge after celebration
    setTimeout(() => {
      if (currentChallengeIndex < flashChallenges.length - 1) {
        setCurrentChallengeIndex(prev => prev + 1);
      }
    }, 2000);
  };

  const skipChallenge = () => {
    setIsActive(false);
    setStreak(0);
    if (currentChallengeIndex < flashChallenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    }
  };

  const resetJourney = () => {
    setCurrentChallengeIndex(0);
    setCompletedChallenges([]);
    setStreak(0);
    setIsActive(false);
  };

  const getCategoryColor = (category: FlashChallenge['category']) => {
    const colors = {
      physical: '#FF6347',
      mental: '#4169E1',
      creative: '#9370DB',
      social: '#FFB6C1',
      grateful: '#FFD700',
    };
    return colors[category] || '#808080';
  };

  const getCategoryIcon = (category: FlashChallenge['category']) => {
    const icons = {
      physical: '💪',
      mental: '🧠',
      creative: '🎨',
      social: '❤️',
      grateful: '🙏',
    };
    return icons[category] || '✨';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-orange-950 to-red-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12" />
            Flash Glow Arena
          </h1>
          <p className="text-white/80 text-lg">Bouffées de bonheur en 10-60 secondes!</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Challenge */}
          <Card className="lg:col-span-2 p-6 bg-white/10 backdrop-blur-lg border-white/20">
            {currentChallenge ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-6xl">{currentChallenge.emoji}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{currentChallenge.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">{getCategoryIcon(currentChallenge.category)}</span>
                        <span className="text-white/70 capitalize">{currentChallenge.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 mb-1">
                      {[...Array(currentChallenge.difficulty)].map((_, i) => (
                        <Zap key={i} className="w-5 h-5 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-white/70 text-sm">{currentChallenge.points} pts</div>
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
                      strokeWidth="16"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="35%"
                      fill="none"
                      stroke={getCategoryColor(currentChallenge.category)}
                      strokeWidth="16"
                      strokeDasharray={`${2 * Math.PI * 35} ${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  
                  <div className="text-center z-10">
                    {isActive ? (
                      <>
                        <div className="text-8xl font-bold text-white mb-2">{timeLeft}</div>
                        <div className="text-white/70 text-xl">secondes</div>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-white mb-2">{currentChallenge.duration}s</div>
                        <div className="text-white/70">Challenge rapide</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Task Description */}
                <Card className="p-6 bg-white/5 mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">🎯 Ta Mission</h3>
                  <p className="text-white/80 text-2xl text-center leading-relaxed">
                    {currentChallenge.task}
                  </p>
                </Card>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-3">
                  {!isActive ? (
                    <>
                      <Button
                        onClick={startChallenge}
                        className="h-16 text-lg"
                        style={{
                          background: `linear-gradient(135deg, ${getCategoryColor(currentChallenge.category)}, ${getCategoryColor(currentChallenge.category)}dd)`,
                        }}
                      >
                        <Timer className="w-5 h-5 mr-2" />
                        Start
                      </Button>
                      <Button
                        onClick={skipChallenge}
                        variant="outline"
                        className="h-16 text-lg"
                      >
                        Skip
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={completeChallenge}
                      className="col-span-2 h-16 text-lg bg-green-500 hover:bg-green-600"
                    >
                      ✓ Terminé!
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <Crown className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">Parcours Complété!</h3>
                <p className="text-white/70 mb-6">Tu as illuminé tous les challenges ✨</p>
                <Button
                  onClick={resetJourney}
                  className="h-14 px-8 text-lg bg-gradient-to-r from-yellow-500 to-orange-500"
                >
                  Recommencer
                </Button>
              </div>
            )}
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Glow Level */}
            <Card 
              className="p-6 backdrop-blur-lg border-2"
              style={{
                background: `linear-gradient(135deg, rgba(255, 215, 0, ${glowLevel/100 * 0.3}), rgba(255, 140, 0, ${glowLevel/100 * 0.3}))`,
                borderColor: `rgba(255, 215, 0, ${glowLevel/100})`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                <span className="text-white/80">Niveau de Glow</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{Math.round(glowLevel)}%</div>
              <Progress value={glowLevel} className="h-3" />
            </Card>

            {/* Points */}
            <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-8 h-8 text-yellow-400" />
                <span className="text-white/80">Points Totaux</span>
              </div>
              <div className="text-4xl font-bold text-white">{totalPoints}</div>
            </Card>

            {/* Streak */}
            <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg border-orange-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-8 h-8 text-orange-400" />
                <span className="text-white/80">Série Actuelle</span>
              </div>
              <div className="text-4xl font-bold text-white">{streak} 🔥</div>
              <div className="text-white/60 text-sm mt-2">Record: {bestStreak}</div>
            </Card>

            {/* Progress */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progression
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Complétés</span>
                  <span className="text-white font-bold">
                    {completedChallenges.length}/{flashChallenges.length}
                  </span>
                </div>
                <Progress 
                  value={(completedChallenges.length / flashChallenges.length) * 100} 
                  className="h-3"
                />
              </div>
            </Card>

            {completedChallenges.length >= 10 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Flash Master!</h3>
                  <p className="text-white/70 text-sm">Tu maîtrises l'art du bonheur express ⚡</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Challenge Grid */}
        <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">🎯 Tous les Flash Challenges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {flashChallenges.map((challenge, index) => (
              <div
                key={challenge.id}
                className={`p-3 rounded-lg text-center transition-all cursor-pointer ${
                  index === currentChallengeIndex
                    ? 'bg-orange-500/30 border-2 border-orange-400 scale-105'
                    : completedChallenges.includes(challenge.id)
                    ? 'bg-green-500/20 border-2 border-green-400'
                    : 'bg-white/10 border-2 border-white/20'
                }`}
                style={{
                  borderTopColor: index === currentChallengeIndex || completedChallenges.includes(challenge.id)
                    ? undefined
                    : getCategoryColor(challenge.category)
                }}
              >
                <div className="text-3xl mb-1">{challenge.emoji}</div>
                <div className="text-white text-xs font-medium mb-1">{challenge.name}</div>
                <div className="text-white/60 text-xs">{challenge.duration}s</div>
                {completedChallenges.includes(challenge.id) && (
                  <div className="text-green-400 text-xs mt-1">✓</div>
                )}
                {index === currentChallengeIndex && (
                  <div className="text-orange-400 text-xs mt-1">●</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
