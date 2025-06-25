
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Zap, TrendingUp, Star, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

const AmbitionArcadePage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(1250);
  const [level, setLevel] = useState(8);
  const [streak, setStreak] = useState(12);

  const arcadeGames = [
    {
      id: 'goal-crusher',
      title: 'Goal Crusher',
      description: 'Écrase tes objectifs avec style',
      difficulty: 'Intermédiaire',
      rewards: 150,
      duration: '5 min',
      icon: Target,
      color: 'text-blue-500'
    },
    {
      id: 'ambition-rush',
      title: 'Ambition Rush',
      description: 'Course contre le temps pour réaliser tes rêves',
      difficulty: 'Avancé',
      rewards: 250,
      duration: '8 min',
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      id: 'vision-builder',
      title: 'Vision Builder',
      description: 'Construis ton futur idéal bloc par bloc',
      difficulty: 'Débutant',
      rewards: 100,
      duration: '3 min',
      icon: TrendingUp,
      color: 'text-green-500'
    }
  ];

  const achievements = [
    { title: 'Premier Pas', description: 'Joue ton premier jeu', unlocked: true },
    { title: 'Série Gagnante', description: 'Gagne 5 jeux d\'affilée', unlocked: true },
    { title: 'Maître de l\'Ambition', description: 'Atteins le niveau 10', unlocked: false },
    { title: 'Visionnaire', description: 'Complète tous les défis vision', unlocked: false }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec arcade vibes */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 neon-text">
            🎮 Ambition Arcade
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Transforme tes ambitions en jeu addictif
          </p>
          
          {/* Stats du joueur */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{score}</div>
              <div className="text-sm text-purple-200">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Niv. {level}</div>
              <div className="text-sm text-purple-200">Niveau</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{streak}</div>
              <div className="text-sm text-purple-200">Série</div>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="games">🎯 Jeux</TabsTrigger>
            <TabsTrigger value="achievements">🏆 Succès</TabsTrigger>
            <TabsTrigger value="progress">📈 Progrès</TabsTrigger>
          </TabsList>

          <TabsContent value="games">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {arcadeGames.map((game) => {
                const IconComponent = game.icon;
                return (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="bg-black/50 border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer h-full">
                      <CardHeader className="text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500`}>
                          <IconComponent className={`h-8 w-8 ${game.color}`} />
                        </div>
                        <CardTitle className="text-white text-xl">{game.title}</CardTitle>
                        <CardDescription className="text-purple-200">
                          {game.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Difficulté:</span>
                            <Badge variant={game.difficulty === 'Débutant' ? 'default' : game.difficulty === 'Intermédiaire' ? 'secondary' : 'destructive'}>
                              {game.difficulty}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Récompense:</span>
                            <span className="text-yellow-400 font-bold">{game.rewards} pts</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Durée:</span>
                            <span className="text-blue-400">{game.duration}</span>
                          </div>
                          <Button 
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            onClick={() => setActiveGame(game.id)}
                            data-testid={`play-${game.id}`}
                          >
                            {activeGame === game.id ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                En cours...
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Jouer
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Section jeu actif */}
            {activeGame && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card className="bg-black/70 border-yellow-500/50">
                  <CardHeader>
                    <CardTitle className="text-yellow-400 text-center">
                      🎮 Jeu en cours: {arcadeGames.find(g => g.id === activeGame)?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-6xl">🎯</div>
                      <Progress value={45} className="w-full" data-testid="game-progress" />
                      <p className="text-purple-200">Définis ton objectif principal...</p>
                      <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => setActiveGame(null)}>
                          Pause
                        </Button>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                          Continuer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`${achievement.unlocked ? 'bg-yellow-900/30 border-yellow-500/50' : 'bg-gray-900/50 border-gray-500/30'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-600'}`}>
                        <Trophy className={`w-6 h-6 ${achievement.unlocked ? 'text-black' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${achievement.unlocked ? 'text-yellow-200' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="ml-auto bg-yellow-500 text-black">
                          Débloqué
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400">Progression Niveau</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Niveau {level}</span>
                      <span>{score} / {(level + 1) * 200} pts</span>
                    </div>
                    <Progress value={(score % 200) / 2} className="w-full" />
                    <p className="text-sm text-blue-200">
                      {((level + 1) * 200) - score} points pour le niveau suivant
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Jeux joués:</span>
                      <span className="text-white font-bold">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Taux de réussite:</span>
                      <span className="text-green-400 font-bold">84%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Temps total:</span>
                      <span className="text-white font-bold">3h 42m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Meilleure série:</span>
                      <span className="text-yellow-400 font-bold">{streak} jours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6;
        }
      `}</style>
    </div>
  );
};

export default AmbitionArcadePage;
