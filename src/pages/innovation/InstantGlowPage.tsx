
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Sparkles, Timer, Target, TrendingUp, Award, Clock, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlowSession {
  id: string;
  type: string;
  duration: number;
  intensity: number;
  completed: boolean;
}

const InstantGlowPage: React.FC = () => {
  const [activeSession, setActiveSession] = useState<GlowSession | null>(null);
  const [glowScore, setGlowScore] = useState(85);
  const [streak, setStreak] = useState(7);
  const [todayGoal, setTodayGoal] = useState(3);
  const [completedToday, setCompletedToday] = useState(1);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);

  const quickGlowSessions = [
    {
      id: 'energy-boost',
      name: 'Energy Boost',
      description: '2 minutes pour recharger tes batteries',
      duration: 120,
      intensity: 'Haute',
      color: 'text-yellow-500',
      icon: Zap,
      benefit: '+15 énergie'
    },
    {
      id: 'focus-spark',
      name: 'Focus Spark',
      description: '3 minutes de concentration pure',
      duration: 180,
      intensity: 'Moyenne',
      color: 'text-blue-500',
      icon: Target,
      benefit: '+20 focus'
    },
    {
      id: 'mood-lift',
      name: 'Mood Lift',
      description: '1 minute pour illuminer ton humeur',
      duration: 60,
      intensity: 'Douce',
      color: 'text-pink-500',
      icon: Sparkles,
      benefit: '+10 joie'
    },
    {
      id: 'power-surge',
      name: 'Power Surge',
      description: '5 minutes de puissance maximale',
      duration: 300,
      intensity: 'Extrême',
      color: 'text-red-500',
      icon: Flame,
      benefit: '+25 puissance'
    }
  ];

  const achievements = [
    { name: 'First Glow', description: 'Première session complétée', unlocked: true },
    { name: 'Streak Master', description: '7 jours consécutifs', unlocked: true },
    { name: 'Speed Demon', description: '10 sessions éclair', unlocked: false },
    { name: 'Glow Master', description: 'Score parfait atteint', unlocked: false }
  ];

  // Simulation de session
  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      setSessionProgress(prev => {
        const newProgress = prev + (100 / activeSession.duration);
        if (newProgress >= 100) {
          setActiveSession(null);
          setCompletedToday(prev => prev + 1);
          setGlowScore(prev => Math.min(100, prev + 5));
          setIsGlowing(true);
          setTimeout(() => setIsGlowing(false), 3000);
          return 0;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const startSession = (session: any) => {
    setActiveSession({
      id: session.id,
      type: session.name,
      duration: session.duration,
      intensity: session.intensity === 'Haute' ? 80 : session.intensity === 'Moyenne' ? 60 : 40,
      completed: false
    });
    setSessionProgress(0);
  };

  const stopSession = () => {
    setActiveSession(null);
    setSessionProgress(0);
  };

  return (
    <div data-testid="page-root" className={`min-h-screen transition-all duration-1000 ${isGlowing ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500' : 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header avec effet glow */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.h1 
            className={`text-4xl font-bold mb-4 transition-all duration-1000 ${isGlowing ? 'text-white glow-text' : 'text-white'}`}
            animate={isGlowing ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            ⚡ Instant Glow
          </motion.h1>
          <p className="text-xl text-purple-200 mb-6">
            Transformations rapides pour un boost instantané
          </p>
          
          {/* Indicateur de glow */}
          <AnimatePresence>
            {isGlowing && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold"
              >
                <Sparkles className="w-5 h-5" />
                GLOW ACTIVÉ!
                <Sparkles className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/50 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{glowScore}</div>
              <div className="text-sm text-purple-200">Glow Score</div>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-green-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{streak}</div>
              <div className="text-sm text-purple-200">Jours consécutifs</div>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{completedToday}/{todayGoal}</div>
              <div className="text-sm text-purple-200">Objectif du jour</div>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{quickGlowSessions.length}</div>
              <div className="text-sm text-purple-200">Sessions disponibles</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sessions">⚡ Sessions</TabsTrigger>
            <TabsTrigger value="progress">📊 Progrès</TabsTrigger>
            <TabsTrigger value="achievements">🏆 Succès</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            {/* Session active */}
            {activeSession && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Card className="bg-black/70 border-yellow-500/50">
                  <CardHeader>
                    <CardTitle className="text-yellow-400 text-center flex items-center justify-center gap-2">
                      <Zap className="w-6 h-6" />
                      Session en cours: {activeSession.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={sessionProgress} className="w-full h-4" data-testid="session-progress" />
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">
                          {Math.floor((activeSession.duration * (100 - sessionProgress)) / 100)}s
                        </div>
                        <p className="text-purple-200">Temps restant</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        <Button 
                          variant="outline" 
                          onClick={stopSession}
                          data-testid="stop-session"
                        >
                          Arrêter
                        </Button>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                          Continuer le Glow
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Sessions disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickGlowSessions.map((session) => {
                const IconComponent = session.icon;
                return (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`bg-black/50 border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer h-full ${activeSession ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => !activeSession && startSession(session)}
                      data-testid={`session-${session.id}`}
                    >
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                          <IconComponent className={`h-8 w-8 ${session.color}`} />
                        </div>
                        <CardTitle className="text-white">{session.name}</CardTitle>
                        <CardDescription className="text-purple-200">
                          {session.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Durée:</span>
                            <div className="flex items-center gap-1 text-blue-400">
                              <Clock className="w-4 h-4" />
                              {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Intensité:</span>
                            <Badge variant={session.intensity === 'Extrême' ? 'destructive' : session.intensity === 'Haute' ? 'secondary' : 'default'}>
                              {session.intensity}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Bénéfice:</span>
                            <span className="text-green-400 font-bold">{session.benefit}</span>
                          </div>
                          
                          {!activeSession && (
                            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                              <Zap className="w-4 h-4 mr-2" />
                              Lancer le Glow
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">📈 Progression du jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-300">Objectif quotidien</span>
                        <span className="text-white">{completedToday}/{todayGoal}</span>
                      </div>
                      <Progress value={(completedToday / todayGoal) * 100} className="w-full" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-300">Glow Score</span>
                        <span className="text-yellow-400">{glowScore}/100</span>
                      </div>
                      <Progress value={glowScore} className="w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">🔥 Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Sessions totales:</span>
                      <span className="text-white font-bold">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Temps total:</span>
                      <span className="text-white font-bold">2h 15m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Meilleure série:</span>
                      <span className="text-green-400 font-bold">{streak} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Score max:</span>
                      <span className="text-yellow-400 font-bold">98/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`${achievement.unlocked ? 'bg-yellow-900/30 border-yellow-500/50' : 'bg-gray-900/50 border-gray-500/30'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-600'}`}>
                        <Award className={`w-6 h-6 ${achievement.unlocked ? 'text-black' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {achievement.name}
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
        </Tabs>
      </div>

      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 20px #fbbf24, 0 0 40px #fbbf24, 0 0 60px #fbbf24;
        }
      `}</style>
    </div>
  );
};

export default InstantGlowPage;
