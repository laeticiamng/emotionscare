
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Sparkles, Timer, Target, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FlashGlowPage = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionType, setSessionType] = useState('energy');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(12);
  const [sessionCount, setSessionCount] = useState(3);

  const sessionTypes = [
    {
      id: 'energy',
      name: 'Energy Boost',
      duration: 3,
      description: 'Réveil instantané et boost d\'énergie',
      color: 'bg-yellow-500',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'focus',
      name: 'Focus Flash',
      duration: 5,
      description: 'Concentration maximale en quelques minutes',
      color: 'bg-blue-500',
      icon: <Target className="h-5 w-5" />
    },
    {
      id: 'calm',
      name: 'Instant Calm',
      duration: 2,
      description: 'Apaisement rapide du stress',
      color: 'bg-green-500',
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      id: 'confidence',
      name: 'Confidence Surge',
      duration: 4,
      description: 'Boost de confiance avant un défi',
      color: 'bg-purple-500',
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const recentSessions = [
    { type: 'Energy Boost', time: '08:30', effect: 'Excellent', duration: '3 min' },
    { type: 'Focus Flash', time: '14:15', effect: 'Très bon', duration: '5 min' },
    { type: 'Instant Calm', time: '18:45', effect: 'Bon', duration: '2 min' }
  ];

  const achievements = [
    { name: 'Flash Master', progress: 85, total: 100, unlocked: false },
    { name: 'Série de Feu', progress: 12, total: 15, unlocked: false },
    { name: 'Glow Guru', progress: 100, total: 100, unlocked: true },
    { name: 'Speed Demon', progress: 67, total: 50, unlocked: true }
  ];

  useEffect(() => {
    let interval;
    if (isSessionActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsSessionActive(false);
            setGlowIntensity(100);
            setTimeout(() => setGlowIntensity(0), 2000);
            return 0;
          }
          return prev - 1;
        });
        
        // Effet glow pendant la session
        setGlowIntensity(prev => Math.min(prev + 2, 90));
      }, 1000);
    } else if (!isSessionActive) {
      setGlowIntensity(0);
    }
    
    return () => clearInterval(interval);
  }, [isSessionActive, timeRemaining]);

  const startSession = () => {
    const selectedSession = sessionTypes.find(s => s.id === sessionType);
    setTimeRemaining(selectedSession.duration * 60);
    setIsSessionActive(true);
    setGlowIntensity(10);
  };

  const pauseSession = () => {
    setIsSessionActive(!isSessionActive);
  };

  const resetSession = () => {
    setIsSessionActive(false);
    setTimeRemaining(0);
    setGlowIntensity(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedSessionType = sessionTypes.find(s => s.id === sessionType);

  return (
    <div 
      data-testid="page-root" 
      className="min-h-screen bg-gradient-to-br from-slate-900 to-orange-900 text-white relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, 
          rgba(255, 165, 0, ${glowIntensity / 200}) 0%, 
          rgba(30, 41, 59, 1) 50%, 
          rgba(15, 23, 42, 1) 100%)`
      }}
    >
      {/* Effet Glow Global */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at center, 
            rgba(255, 215, 0, ${glowIntensity / 300}) 0%, 
            transparent 70%)`,
          opacity: glowIntensity / 100
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="secondary" className="mb-4 bg-orange-600">
            <Zap className="h-4 w-4 mr-2" />
            Flash Glow
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Transformation Instantanée
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Séances ultra-rapides pour un changement d'état immédiat. Énergie, focus ou calme en quelques minutes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
            <CardHeader className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center relative">
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: `radial-gradient(circle, rgba(255, 215, 0, ${glowIntensity / 100}) 0%, transparent 70%)`,
                    transform: `scale(${1 + glowIntensity / 200})`
                  }}
                />
                <div className="relative z-10">
                  {isSessionActive ? (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{formatTime(timeRemaining)}</div>
                      <div className="text-sm text-yellow-200">{selectedSessionType?.name}</div>
                    </div>
                  ) : (
                    selectedSessionType?.icon && (
                      <div className="text-white text-4xl">
                        {selectedSessionType.icon}
                      </div>
                    )
                  )}
                </div>
              </div>
              <CardTitle className="text-white text-2xl">Session Flash</CardTitle>
              <CardDescription className="text-gray-400">
                {selectedSessionType?.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sessionTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={sessionType === type.id ? "default" : "outline"}
                    className={`h-auto p-3 flex flex-col gap-2 ${
                      sessionType === type.id ? type.color : ''
                    }`}
                    onClick={() => setSessionType(type.id)}
                    disabled={isSessionActive}
                  >
                    <div className="text-lg">{type.icon}</div>
                    <div className="text-xs font-medium">{type.name}</div>
                    <div className="text-xs opacity-75">{type.duration}min</div>
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={isSessionActive ? pauseSession : startSession}
                  className="bg-orange-600 hover:bg-orange-700 px-8"
                  data-testid="flash-action"
                >
                  {isSessionActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isSessionActive ? 'Pause' : 'Flash Start'}
                </Button>
                {isSessionActive && (
                  <Button variant="outline" onClick={resetSession}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
                <Button variant="outline">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Audio
                </Button>
              </div>

              {isSessionActive && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Intensité Glow</span>
                    <span className="text-orange-400">{Math.round(glowIntensity)}%</span>
                  </div>
                  <Progress value={glowIntensity} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Timer className="h-5 w-5 text-orange-400" />
                Stats Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Sessions Flash</span>
                <span className="text-white font-semibold">{sessionCount}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Temps total</span>
                <span className="text-orange-400 font-semibold">12 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Série quotidienne</span>
                <span className="text-green-400 font-semibold">{dailyStreak} jours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Efficacité</span>
                <span className="text-blue-400 font-semibold">94%</span>
              </div>
              <Progress value={(sessionCount / 5) * 100} className="mt-4" />
              <p className="text-xs text-gray-400 text-center">
                {5 - sessionCount} sessions restantes pour l'objectif quotidien
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="history" className="data-[state=active]:bg-orange-600">
              Historique
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-orange-600">
              Succès
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-orange-600">
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Sessions d'Aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <div>
                          <div className="font-medium text-white">{session.type}</div>
                          <div className="text-sm text-gray-400">{session.time} • {session.duration}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${
                        session.effect === 'Excellent' ? 'text-green-400 border-green-400' :
                        session.effect === 'Très bon' ? 'text-blue-400 border-blue-400' :
                        'text-yellow-400 border-yellow-400'
                      }`}>
                        {session.effect}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`bg-slate-800/50 border-slate-700 ${
                  achievement.unlocked ? 'border-orange-500' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{achievement.name}</h4>
                      {achievement.unlocked && (
                        <Badge className="bg-orange-600">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Débloqué
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progression</span>
                        <span className="text-white">
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Analyse de Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-600/20 border border-green-600 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">🚀 Excellent rythme !</h4>
                    <p className="text-sm text-gray-300">
                      Votre régularité Flash Glow s'améliore de 23% cette semaine
                    </p>
                  </div>
                  <div className="p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">⏰ Meilleur moment</h4>
                    <p className="text-sm text-gray-300">
                      Vos sessions de 14h-16h montrent 94% d'efficacité
                    </p>
                  </div>
                  <div className="p-4 bg-purple-600/20 border border-purple-600 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">🎯 Recommandation</h4>
                    <p className="text-sm text-gray-300">
                      Essayez "Focus Flash" avant vos réunions importantes
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Tendances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Lundi', sessions: 4, efficiency: 88 },
                      { label: 'Mardi', sessions: 5, efficiency: 92 },
                      { label: 'Mercredi', sessions: 3, efficiency: 85 },
                      { label: 'Jeudi', sessions: 6, efficiency: 96 },
                      { label: 'Vendredi', sessions: 4, efficiency: 90 }
                    ].map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="font-medium text-white">{day.label}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-orange-400">{day.sessions} sessions</span>
                          <span className="text-green-400">{day.efficiency}% efficace</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FlashGlowPage;
