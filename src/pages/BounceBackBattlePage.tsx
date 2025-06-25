
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Zap, Heart, Target, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BounceBackBattlePage = () => {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [resilienceScore, setResilienceScore] = useState(75);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [heartRate, setHeartRate] = useState(72);

  const scenarios = [
    {
      id: 1,
      title: "Critique au Travail",
      description: "Votre manager critique publiquement votre présentation",
      difficulty: "Facile",
      duration: "5 min",
      category: "Professionnel",
      completed: true,
      score: 85
    },
    {
      id: 2,
      title: "Rejet Social",
      description: "Exclusion d'un groupe ou d'une activité sociale",
      difficulty: "Moyen", 
      duration: "8 min",
      category: "Social",
      completed: false,
      score: null
    },
    {
      id: 3,
      title: "Échec Personnel",
      description: "Un projet important sur lequel vous travailliez échoue",
      difficulty: "Difficile",
      duration: "12 min",
      category: "Personnel",
      completed: false,
      score: null
    }
  ];

  const techniques = [
    {
      name: "Respiration 4-7-8",
      description: "Technique de respiration pour gérer le stress",
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      name: "Recadrage Cognitif",
      description: "Changer la perspective sur la situation",
      icon: <Target className="h-5 w-5 text-blue-500" />
    },
    {
      name: "Auto-Compassion",
      description: "Traiter ses erreurs avec bienveillance",
      icon: <Shield className="h-5 w-5 text-green-500" />
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-500';
      case 'Moyen': return 'bg-yellow-500';
      case 'Difficile': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        setHeartRate(prev => prev + Math.floor(Math.random() * 6) - 3);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startScenario = (scenario) => {
    setCurrentScenario(scenario);
    setSessionTime(0);
    setIsPlaying(true);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="secondary" className="mb-4 bg-blue-600">
            <Shield className="h-4 w-4 mr-2" />
            Bounce Back Battle
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Forge Your Resilience
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Entraînez-vous à surmonter les défis grâce à des simulations immersives et des techniques de résilience éprouvées.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Score de Résilience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{resilienceScore}/100</div>
                <Progress value={resilienceScore} className="mb-2" />
                <p className="text-sm text-gray-400">Niveau: Intermédiaire</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Rythme cardiaque</span>
                <span className="text-red-400 font-semibold">{heartRate} bpm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stress Level</span>
                <span className="text-yellow-400 font-semibold">Modéré</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Session</span>
                <span className="text-blue-400 font-semibold">{formatTime(sessionTime)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                Progrès
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Scénarios complétés</span>
                <span className="text-white font-semibold">12/25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taux de réussite</span>
                <span className="text-green-400 font-semibold">76%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Série actuelle</span>
                <span className="text-blue-400 font-semibold">5 jours</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Contrôles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsPlaying(!isPlaying)}
                data-testid="start-challenge"
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Démarrer'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setSessionTime(0)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" className="w-full">
                <Volume2 className="h-4 w-4 mr-2" />
                Audio Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-blue-600">
              Scénarios
            </TabsTrigger>
            <TabsTrigger value="techniques" className="data-[state=active]:bg-blue-600">
              Techniques
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${getDifficultyColor(scenario.difficulty)} text-white`}>
                          {scenario.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-gray-400">
                          {scenario.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-lg">{scenario.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {scenario.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Durée: {scenario.duration}</span>
                          {scenario.completed && (
                            <span className="text-green-400">Score: {scenario.score}%</span>
                          )}
                        </div>
                        <Button 
                          className={`w-full ${
                            scenario.completed 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          onClick={() => startScenario(scenario)}
                        >
                          {scenario.completed ? 'Refaire' : 'Commencer'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="techniques" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techniques.map((technique, index) => (
                <motion.div
                  key={technique.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        {technique.icon}
                        <CardTitle className="text-white">{technique.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400 mb-4">
                        {technique.description}
                      </CardDescription>
                      <Button variant="outline" className="w-full">
                        Apprendre
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Dernières Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Aujourd'hui", scenario: "Critique au Travail", score: 85, duration: "4:32" },
                    { date: "Hier", scenario: "Conflit Familial", score: 78, duration: "6:15" },
                    { date: "2 jours", scenario: "Échec d'Entretien", score: 92, duration: "5:48" }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">{session.scenario}</div>
                        <div className="text-sm text-gray-400">{session.date} • {session.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-400">{session.score}%</div>
                        <div className="text-sm text-gray-400">Score</div>
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

export default BounceBackBattlePage;
