
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Brain, Star, Target, Clock, TrendingUp, Award, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FlashGlowPage: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [flashTimer, setFlashTimer] = useState(0);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const flashChallenges = [
    {
      id: 'quick-mood-boost',
      title: 'Flash Boost Humeur',
      description: 'Améliorez votre humeur en 60 secondes',
      duration: 60,
      color: 'from-yellow-400 to-orange-500',
      icon: Star,
      difficulty: 'Facile',
      activities: [
        'Souriez pendant 10 secondes',
        'Pensez à 3 choses positives',
        'Respirez profondément 5 fois',
        'Écoutez votre chanson préférée',
        'Bougez sur place 20 secondes'
      ],
      points: 50
    },
    {
      id: 'instant-focus',
      title: 'Flash Focus Laser',
      description: 'Retrouvez votre concentration instantanément',
      duration: 90,
      color: 'from-blue-500 to-purple-600',
      icon: Target,
      difficulty: 'Modéré',
      activities: [
        'Fermez les yeux 20 secondes',
        'Définissez votre priorité #1',
        'Éliminez une distraction',
        'Organisez votre espace de travail',
        'Visualisez votre succès'
      ],
      points: 75
    },
    {
      id: 'energy-surge',
      title: 'Flash Énergie',
      description: 'Rechargez vos batteries en 2 minutes',
      duration: 120,
      color: 'from-green-500 to-emerald-600',
      icon: Zap,
      difficulty: 'Facile',
      activities: [
        'Étirements dynamiques 30s',
        'Hydratez-vous généreusement',
        '10 jumping jacks',
        'Respirations énergisantes',
        'Affirmations positives'
      ],
      points: 60
    },
    {
      id: 'stress-killer',
      title: 'Flash Anti-Stress',
      description: 'Éliminez le stress en temps record',
      duration: 180,
      color: 'from-purple-500 to-pink-500',
      icon: Brain,
      difficulty: 'Avancé',
      activities: [
        'Technique de respiration 4-7-8',
        'Relâchement musculaire progressif',
        'Méditation express',
        'Gratitude instantanée',
        'Visualisation apaisante'
      ],
      points: 100
    }
  ];

  const achievements = [
    { id: 'flash-starter', name: 'Premier Flash', description: 'Complétez votre premier défi flash', icon: Star, unlocked: true },
    { id: 'speed-demon', name: 'Démon de Vitesse', description: 'Complétez 10 défis en une journée', icon: Flame, unlocked: true },
    { id: 'consistency-king', name: 'Roi de la Régularité', description: '7 jours consécutifs de défis', icon: Award, unlocked: false },
    { id: 'flash-master', name: 'Maître Flash', description: 'Complétez tous les types de défis', icon: Target, unlocked: false }
  ];

  const stats = {
    todayFlashes: 12,
    totalFlashes: 156,
    streakDays: 8,
    totalPoints: 4250,
    averageTime: 95 // secondes
  };

  // Flash timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFlashActive && flashTimer > 0) {
      interval = setInterval(() => {
        setFlashTimer(prev => prev - 1);
      }, 1000);
    } else if (flashTimer === 0 && isFlashActive) {
      setIsFlashActive(false);
      if (currentChallenge) {
        setCompletedChallenges(prev => [...prev, currentChallenge]);
      }
    }
    return () => clearInterval(interval);
  }, [isFlashActive, flashTimer, currentChallenge]);

  const startFlashChallenge = (challengeId: string) => {
    const challenge = flashChallenges.find(c => c.id === challengeId);
    if (challenge) {
      setCurrentChallenge(challengeId);
      setFlashTimer(challenge.duration);
      setIsFlashActive(true);
    }
  };

  const getCurrentChallenge = () => 
    flashChallenges.find(c => c.id === currentChallenge);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="h-12 w-12 text-yellow-400 mr-4" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Flash Glow
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transformez votre état d'esprit en quelques minutes avec des défis flash ultra-rapides. 
              Boostez votre humeur, votre focus et votre énergie instantanément.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{stats.todayFlashes}</div>
                <div className="text-sm text-gray-400">Flash Aujourd'hui</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{stats.totalFlashes}</div>
                <div className="text-sm text-gray-400">Total Flash</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-400">{stats.streakDays}</div>
                <div className="text-sm text-gray-400">Jours Consécutifs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-400">{stats.totalPoints.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Points Total</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{Math.floor(stats.averageTime / 60)}min</div>
                <div className="text-sm text-gray-400">Temps Moyen</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Flash Challenge */}
      <AnimatePresence>
        {isFlashActive && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-8 px-4 bg-gradient-to-r from-pink-600 to-purple-600"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl font-bold mb-4"
              >
                {formatTime(flashTimer)}
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-2">{getCurrentChallenge()?.title}</h2>
              <p className="text-xl mb-6">Flash Challenge en cours...</p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-3">Actions Flash :</h3>
                <ul className="space-y-2 text-left">
                  {getCurrentChallenge()?.activities.map((activity, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center"
                    >
                      <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                      {activity}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-x-4">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setIsFlashActive(false);
                    setFlashTimer(0);
                  }}
                >
                  Terminer
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                  onClick={() => setFlashTimer(flashTimer + 30)}
                >
                  +30s
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="challenges" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="challenges">Défis Flash</TabsTrigger>
              <TabsTrigger value="achievements">Succès</TabsTrigger>
              <TabsTrigger value="leaderboard">Classement</TabsTrigger>
            </TabsList>

            <TabsContent value="challenges" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {flashChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-300 ${
                      completedChallenges.includes(challenge.id) ? 'ring-2 ring-green-500' : ''
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 bg-gradient-to-r ${challenge.color} rounded-full flex items-center justify-center mr-4`}>
                              <challenge.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white">{challenge.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{challenge.difficulty}</Badge>
                                <span className="text-sm text-gray-400 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {Math.floor(challenge.duration / 60)}min {challenge.duration % 60}s
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold">+{challenge.points} pts</div>
                            {completedChallenges.includes(challenge.id) && (
                              <Badge className="bg-green-500 text-white mt-1">Complété!</Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-gray-300">
                          {challenge.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Actions Flash :</h4>
                            <ul className="space-y-1">
                              {challenge.activities.slice(0, 3).map((activity, activityIndex) => (
                                <li key={activityIndex} className="text-sm text-gray-300 flex items-center">
                                  <Zap className="h-3 w-3 mr-2 text-yellow-400" />
                                  {activity}
                                </li>
                              ))}
                              {challenge.activities.length > 3 && (
                                <li className="text-sm text-gray-400">
                                  +{challenge.activities.length - 3} autres actions...
                                </li>
                              )}
                            </ul>
                          </div>

                          <Button 
                            className={`w-full bg-gradient-to-r ${challenge.color} hover:opacity-90 transition-opacity`}
                            onClick={() => startFlashChallenge(challenge.id)}
                            disabled={isFlashActive}
                          >
                            {isFlashActive ? 'Flash en cours...' : 'Flash!'}
                            <Zap className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Succès Flash</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className={`bg-slate-800 border-slate-700 ${
                        achievement.unlocked 
                          ? 'ring-2 ring-yellow-500 bg-gradient-to-r from-yellow-500/20 to-orange-500/20' 
                          : 'opacity-60'
                      }`}>
                        <CardHeader>
                          <div className="flex items-center">
                            <achievement.icon className={`h-8 w-8 mr-3 ${
                              achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                            }`} />
                            <div>
                              <CardTitle className={achievement.unlocked ? 'text-white' : 'text-gray-400'}>
                                {achievement.name}
                              </CardTitle>
                              <CardDescription>{achievement.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <TrendingUp className="h-6 w-6 mr-2 text-yellow-400" />
                    Top Flash Masters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { rank: 1, name: 'FlashKing', points: 8965, flashes: 234 },
                      { rank: 2, name: 'SpeedyGlow', points: 7432, flashes: 198 },
                      { rank: 3, name: 'QuickBoost', points: 6891, flashes: 167 },
                      { rank: 4, name: 'Vous', points: 4250, flashes: 156 },
                      { rank: 5, name: 'FlashMaster', points: 3987, flashes: 143 }
                    ].map((player, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                        player.name === 'Vous' 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                          : 'bg-slate-700'
                      }`}>
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                            player.rank === 1 ? 'bg-yellow-500' :
                            player.rank === 2 ? 'bg-gray-300' :
                            player.rank === 3 ? 'bg-orange-400' : 'bg-slate-600'
                          }`}>
                            <span className="font-bold text-white">#{player.rank}</span>
                          </div>
                          <div>
                            <div className="text-white font-semibold">{player.name}</div>
                            <div className="text-sm text-gray-400">{player.flashes} flash complétés</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">{player.points.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default FlashGlowPage;
