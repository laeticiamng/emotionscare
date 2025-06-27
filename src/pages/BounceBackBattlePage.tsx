
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Zap, Heart, Target, Trophy, ArrowUp } from 'lucide-react';

const BounceBackBattlePage: React.FC = () => {
  const [resilience, setResilience] = useState(65);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [battlesWon, setBattlesWon] = useState(12);
  const [isInBattle, setIsInBattle] = useState(false);

  const challenges = [
    {
      title: "Défi de l'Échec",
      description: "Transformez une déception récente en apprentissage",
      difficulty: "Facile",
      reward: 150,
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Bataille du Stress",
      description: "Surmontez une situation stressante avec calme",
      difficulty: "Moyen",
      reward: 250,
      icon: Shield,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Combat de l'Anxiété",
      description: "Affrontez vos peurs avec courage",
      difficulty: "Difficile",
      reward: 400,
      icon: Heart,
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Boss Final: Renaissance",
      description: "Reconstruction complète après un grand défi",
      difficulty: "Légendaire",
      reward: 1000,
      icon: Trophy,
      color: "from-purple-500 to-yellow-500"
    }
  ];

  const startBattle = (index: number) => {
    setCurrentChallenge(index);
    setIsInBattle(true);
  };

  const completeBattle = () => {
    setIsInBattle(false);
    setBattlesWon(prev => prev + 1);
    setResilience(prev => Math.min(100, prev + 5));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Héroïque */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Bounce Back Battle
            </h1>
          </div>
          <p className="text-xl text-slate-300">
            Transformez vos défaites en victoires épiques
          </p>

          {/* Stats de Résilience */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Niveau de Résilience</span>
                  <Badge className="bg-blue-500">{resilience}%</Badge>
                </div>
                <Progress value={resilience} className="h-4 mb-2" />
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{battlesWon}</p>
                    <p className="text-sm text-slate-400">Batailles Gagnées</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">Niveau 7</p>
                    <p className="text-sm text-slate-400">Guerrier</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-400">2,850</p>
                    <p className="text-sm text-slate-400">Points XP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Battle Arena */}
        <AnimatePresence mode="wait">
          {isInBattle ? (
            <motion.div
              key="battle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/50 backdrop-blur-md">
                <CardContent className="p-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity 
                    }}
                  >
                    <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">
                    En Combat: {challenges[currentChallenge]?.title}
                  </h3>
                  <p className="text-slate-300 mb-6">
                    {challenges[currentChallenge]?.description}
                  </p>
                  <div className="space-y-4">
                    <Progress value={75} className="h-3" />
                    <p className="text-sm text-slate-400">Combat en cours...</p>
                    <Button 
                      onClick={completeBattle}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Trophy className="h-5 w-5 mr-2" />
                      Remporter la Bataille
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="challenges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Zap className="h-6 w-6" />
                Défis de Résilience
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge, index) => {
                  const IconComponent = challenge.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="transform transition-all duration-300"
                    >
                      <Card className={`bg-gradient-to-br ${challenge.color} bg-opacity-20 border-white/20 backdrop-blur-md hover:border-white/40`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <IconComponent className="h-5 w-5" />
                              {challenge.title}
                            </CardTitle>
                            <Badge 
                              variant="secondary"
                              className={`${
                                challenge.difficulty === 'Facile' ? 'bg-green-500' :
                                challenge.difficulty === 'Moyen' ? 'bg-yellow-500' :
                                challenge.difficulty === 'Difficile' ? 'bg-red-500' :
                                'bg-purple-500'
                              }`}
                            >
                              {challenge.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-300 mb-4">{challenge.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">
                              Récompense: {challenge.reward} XP
                            </span>
                            <Button 
                              onClick={() => startBattle(index)}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                              Commencer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tableau des Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <ArrowUp className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">+18%</p>
              <p className="text-sm text-slate-400">Résilience</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">12</p>
              <p className="text-sm text-slate-400">Victoires</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">87%</p>
              <p className="text-sm text-slate-400">Taux de Réussite</p>
            </CardContent>
          </Card>
          <Card className="bg-pink-500/10 border-pink-500/30">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-pink-400">5</p>
              <p className="text-sm text-slate-400">Série Actuelle</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BounceBackBattlePage;
