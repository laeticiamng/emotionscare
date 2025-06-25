
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Clock, Zap, Star, Crown, Flame, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const BossLevelGritPage = () => {
  const [currentLevel, setCurrentLevel] = useState(12);
  const [xp, setXp] = useState(2840);
  const [xpToNext, setXpToNext] = useState(3200);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Morning Warrior",
      description: "Lever à 6h pendant 7 jours consécutifs", 
      difficulty: "Medium",
      xpReward: 150,
      duration: "7 jours",
      progress: 3,
      total: 7,
      status: "active"
    },
    {
      id: 2,
      title: "Focus Master",
      description: "2h de travail intense sans interruption",
      difficulty: "Hard", 
      xpReward: 300,
      duration: "1 session",
      progress: 0,
      total: 1,
      status: "available"
    },
    {
      id: 3,
      title: "Resilience Builder",
      description: "Surmonter 5 obstacles sans abandonner",
      difficulty: "Expert",
      xpReward: 500,
      duration: "2 semaines",
      progress: 2,
      total: 5,
      status: "active"
    }
  ];

  const achievements = [
    { name: "Première Victoire", icon: <Trophy className="h-6 w-6" />, unlocked: true, rarity: "common" },
    { name: "Série de 7", icon: <Flame className="h-6 w-6" />, unlocked: true, rarity: "uncommon" },
    { name: "Boss Level", icon: <Crown className="h-6 w-6" />, unlocked: false, rarity: "legendary" },
    { name: "Perfectionniste", icon: <Star className="h-6 w-6" />, unlocked: true, rarity: "rare" }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'uncommon': return 'border-green-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="secondary" className="mb-4 bg-purple-600">
            <Crown className="h-4 w-4 mr-2" />
            Boss Level Grit
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Forge Your Inner Strength
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Défiez vos limites, développez votre résilience et atteignez le niveau de maîtrise ultime.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 flex items-center justify-center">
                    <span className="text-2xl font-bold">{currentLevel}</span>
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-purple-600">
                    Level
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-white">Grit Master</CardTitle>
              <CardDescription className="text-gray-400">
                {xp} / {xpToNext} XP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(xp / xpToNext) * 100} className="mb-4" />
              <p className="text-sm text-gray-400 text-center">
                {xpToNext - xp} XP jusqu'au niveau {currentLevel + 1}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-400" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Défis complétés</span>
                <span className="text-white font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Série actuelle</span>
                <span className="text-green-400 font-semibold">7 jours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taux de réussite</span>
                <span className="text-blue-400 font-semibold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total XP gagné</span>
                <span className="text-purple-400 font-semibold">15,420</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                Derniers Exploits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Challenge "Focus Master" terminé</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Niveau 12 atteint</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Badge "Série de 7" débloqué</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-purple-600">
              Défis Actifs
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
              Classement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-colors cursor-pointer"
                      onClick={() => setSelectedChallenge(challenge)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          {challenge.title}
                          <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                            {challenge.difficulty}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {challenge.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">+{challenge.xpReward} XP</div>
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {challenge.duration}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progression</span>
                        <span className="text-white">{challenge.progress} / {challenge.total}</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.total) * 100} />
                    </div>
                    {challenge.status === 'active' && (
                      <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" data-testid="start-challenge">
                        Continuer
                      </Button>
                    )}
                    {challenge.status === 'available' && (
                      <Button className="w-full mt-4" variant="outline" data-testid="start-challenge">
                        Commencer
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-slate-800/50 border-2 ${getRarityColor(achievement.rarity)} ${
                    achievement.unlocked ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <CardContent className="p-4 text-center">
                      <div className={`mb-3 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {achievement.icon}
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1">{achievement.name}</h4>
                      <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Top Grit Masters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Alex Thunder", level: 25, xp: 45200, badge: "🥇" },
                    { rank: 2, name: "Sarah Storm", level: 23, xp: 41800, badge: "🥈" },
                    { rank: 3, name: "Mike Blaze", level: 20, xp: 38500, badge: "🥉" },
                    { rank: 4, name: "Vous", level: currentLevel, xp: 15420, badge: "💪" }
                  ].map((player) => (
                    <div key={player.rank} 
                         className={`flex items-center justify-between p-3 rounded-lg ${
                           player.name === 'Vous' ? 'bg-purple-600/30 border border-purple-500' : 'bg-slate-700/30'
                         }`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{player.badge}</span>
                        <div>
                          <div className="font-semibold text-white">{player.name}</div>
                          <div className="text-sm text-gray-400">Niveau {player.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-400">{player.xp.toLocaleString()} XP</div>
                        <div className="text-sm text-gray-400">#{player.rank}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BossLevelGritPage;
