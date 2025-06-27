
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, Crown, Flame } from 'lucide-react';

const BossLevelGritPage: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(7);
  const [experience, setExperience] = useState(750);
  const [maxExperience] = useState(1000);
  const [streak, setStreak] = useState(12);

  const challenges = [
    { id: 1, title: 'Défi Matinal', description: 'Méditation 10min avant 8h', reward: 150, completed: true },
    { id: 2, title: 'Hydratation Power', description: 'Boire 2L d\'eau aujourd\'hui', reward: 100, completed: false },
    { id: 3, title: 'Gratitude Boss', description: 'Noter 3 gratitudes', reward: 200, completed: false },
    { id: 4, title: 'Mouvement Énergie', description: '30min d\'activité physique', reward: 250, completed: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header avec Stats Principales */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3">
            <Crown className="h-10 w-10 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Boss Level Grit
            </h1>
          </div>
          <p className="text-xl text-slate-300">
            Transformez vos défis en victoires épiques
          </p>

          {/* Stats Niveau */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-yellow-400">Niveau {currentLevel}</p>
                <p className="text-sm text-slate-400">Boss Actuel</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30">
              <CardContent className="p-4 text-center">
                <Flame className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-red-400">{streak}</p>
                <p className="text-sm text-slate-400">Jours de Suite</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-purple-400">{experience}</p>
                <p className="text-sm text-slate-400">Points XP</p>
              </CardContent>
            </Card>
          </div>

          {/* Barre de Progression */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span>Niveau {currentLevel}</span>
              <span>Niveau {currentLevel + 1}</span>
            </div>
            <Progress 
              value={(experience / maxExperience) * 100} 
              className="h-3 bg-slate-700"
            />
            <p className="text-xs text-slate-400">
              {experience}/{maxExperience} XP jusqu'au prochain niveau
            </p>
          </div>
        </motion.div>

        {/* Défis Quotidiens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Target className="h-6 w-6" />
            Défis Boss du Jour
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                whileHover={{ scale: 1.02 }}
                className={`transform transition-all duration-300`}
              >
                <Card className={`${
                  challenge.completed 
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50' 
                    : 'bg-black/30 border-slate-600/50 hover:border-orange-500/50'
                } backdrop-blur-md`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge 
                        variant={challenge.completed ? "default" : "secondary"}
                        className={challenge.completed ? "bg-green-500" : "bg-orange-500"}
                      >
                        {challenge.completed ? "Terminé" : `${challenge.reward} XP`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">{challenge.description}</p>
                    <Button 
                      className={`w-full ${
                        challenge.completed 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                      }`}
                      disabled={challenge.completed}
                    >
                      {challenge.completed ? '✓ Boss Vaincu' : 'Relever le Défi'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Boss Final */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 border-orange-500/50 backdrop-blur-md">
            <CardContent className="p-8">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Boss Final de la Semaine</h3>
              <p className="text-slate-300 mb-6">
                Complétez tous les défis quotidiens pour débloquer le boss final
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3"
              >
                🔒 Débloquer Boss Final
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BossLevelGritPage;
