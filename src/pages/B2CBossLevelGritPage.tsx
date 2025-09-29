import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, Shield, Crown, Target, Zap, Star, Trophy } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile' | 'boss';
  xp: number;
  duration: string;
  icon: React.ElementType;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

const B2CBossLevelGritPage: React.FC = () => {
  const [playerLevel] = useState(5);
  const [currentXP] = useState(750);
  const [maxXP] = useState(1000);

  const challenges: Challenge[] = [
    {
      id: 'daily-focus',
      title: 'Maître de la Concentration',
      description: 'Maintenez votre focus pendant 25 minutes sans interruption',
      difficulty: 'facile',
      xp: 50,
      duration: '25 min',
      icon: Target,
      status: 'available'
    },
    {
      id: 'stress-warrior',
      title: 'Guerrier Anti-Stress',
      description: 'Gérez 5 situations stressantes avec nos techniques',
      difficulty: 'moyen',
      xp: 100,
      duration: '1 heure',
      icon: Shield,
      status: 'available'
    },
    {
      id: 'emotion-master',
      title: 'Maître des Émotions',
      description: 'Identifiez et gérez 10 émotions différentes',
      difficulty: 'difficile',
      xp: 200,
      duration: '2 heures',
      icon: Crown,
      status: 'in-progress'
    },
    {
      id: 'boss-resilience',
      title: 'Boss Final: Résilience Ultime',
      description: 'Défi ultime de résilience émotionnelle',
      difficulty: 'boss',
      xp: 500,
      duration: '1 jour',
      icon: Sword,
      status: 'locked'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'moyen': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'difficile': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'boss': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Boss Level Grit
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Relevez des défis émotionnels progressifs et développez votre résilience mentale.
          </p>

          {/* Stats du joueur */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">Niveau {playerLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span>{currentXP} / {maxXP} XP</span>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Progress value={(currentXP / maxXP) * 100} className="h-3" />
          </div>
        </motion.div>

        {/* Grille des défis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            const isLocked = challenge.status === 'locked';
            const isCompleted = challenge.status === 'completed';
            const isInProgress = challenge.status === 'in-progress';

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!isLocked ? { scale: 1.02 } : {}}
              >
                <Card className={`h-full transition-all duration-300 ${
                  isLocked ? 'opacity-60 grayscale' : 
                  isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' :
                  isInProgress ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' :
                  'hover:shadow-lg cursor-pointer'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-6 h-6 ${
                          challenge.difficulty === 'boss' ? 'text-red-500' : 'text-primary'
                        }`} />
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      {isInProgress && <Zap className="w-4 h-4 text-blue-500 animate-pulse" />}
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>⏱️ {challenge.duration}</span>
                        <span>✨ {challenge.xp} XP</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      variant={isCompleted ? "outline" : "default"}
                      disabled={isLocked}
                    >
                      {isCompleted ? 'Terminé' :
                       isInProgress ? 'En cours...' :
                       isLocked ? 'Verrouillé' : 'Commencer'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default B2CBossLevelGritPage;