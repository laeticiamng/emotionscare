
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap, Crown, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BossLevelGritPage: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xpPoints, setXpPoints] = useState(150);
  const [streak, setStreak] = useState(7);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  
  const challenges = [
    {
      id: 'resilience-master',
      title: 'Maître de la Résilience',
      difficulty: 'BOSS',
      xpReward: 500,
      description: 'Complétez 7 sessions de respiration consécutives sans interruption',
      progress: 5,
      total: 7,
      icon: <Crown className="h-6 w-6" />,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600'
    },
    {
      id: 'emotion-conqueror',
      title: 'Conquérant Émotionnel',
      difficulty: 'ELITE',
      xpReward: 300,
      description: 'Analysez et réglez 15 états émotionnels différents',
      progress: 12,
      total: 15,
      icon: <Target className="h-6 w-6" />,
      color: 'bg-gradient-to-r from-blue-600 to-cyan-600'
    },
    {
      id: 'mindful-warrior',
      title: 'Guerrier Mindful',
      difficulty: 'HERO',
      xpReward: 200,
      description: 'Maintenez une pratique quotidienne pendant 30 jours',
      progress: 23,
      total: 30,
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-gradient-to-r from-green-600 to-emerald-600'
    }
  ];
  
  const achievements = [
    { name: 'Premier Pas', icon: '🏃', unlocked: true },
    { name: 'Persévérant', icon: '💪', unlocked: true },
    { name: 'Champion', icon: '🏆', unlocked: false },
    { name: 'Légende', icon: '⭐', unlocked: false }
  ];

  const handleChallengeStart = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    // Simulation d'activation du défi
    setTimeout(() => {
      setXpPoints(prev => prev + 50);
      setSelectedChallenge(null);
    }, 2000);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec stats du joueur */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            Boss Level Grit
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Défiez vos limites et atteignez la maîtrise émotionnelle
          </p>
          
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{currentLevel}</div>
              <div className="text-sm text-gray-400">Niveau</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{xpPoints}</div>
              <div className="text-sm text-gray-400">XP Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{streak}</div>
              <div className="text-sm text-gray-400">Série</div>
            </div>
          </div>
        </motion.div>

        {/* Défis Boss */}
        <div className="grid gap-6 mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Défis Boss Level
          </h2>
          
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${challenge.color}`}>
                        {challenge.icon}
                      </div>
                      <div>
                        <CardTitle className="text-white">{challenge.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={challenge.difficulty === 'BOSS' ? 'destructive' : 
                                        challenge.difficulty === 'ELITE' ? 'default' : 'secondary'}>
                            {challenge.difficulty}
                          </Badge>
                          <span className="text-yellow-400 text-sm font-semibold">
                            +{challenge.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleChallengeStart(challenge.id)}
                      disabled={selectedChallenge === challenge.id}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      {selectedChallenge === challenge.id ? 'En cours...' : 'Commencer'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{challenge.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{challenge.progress}/{challenge.total}</span>
                    </div>
                    <Progress 
                      value={(challenge.progress / challenge.total) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Hauts Faits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`text-center p-4 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-yellow-500/20 border-yellow-500/50' 
                      : 'bg-gray-800/50 border-gray-600 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className={`text-sm ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {achievement.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Animation de progression */}
        <AnimatePresence>
          {selectedChallenge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-2">Défi Activé !</h3>
                <p className="text-gray-300">Votre progression est maintenant suivie...</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BossLevelGritPage;
