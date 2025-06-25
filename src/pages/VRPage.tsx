
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, Play, Pause, RotateCcw, Settings, Timer, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const VRPage: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const vrEnvironments = [
    {
      id: 'beach',
      name: 'Plage Tropicale',
      description: 'Détendez-vous sur une plage paradisiaque avec le bruit des vagues',
      duration: '10-20 min',
      category: 'Relaxation',
      difficulty: 'Débutant',
      rating: 4.8,
      image: '🏖️',
      benefits: ['Réduction stress', 'Relaxation profonde', 'Évasion mentale'],
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'forest',
      name: 'Forêt Enchantée',
      description: 'Promenade méditative dans une forêt mystique apaisante',
      duration: '15-25 min',
      category: 'Méditation',
      difficulty: 'Intermédiaire',
      rating: 4.9,
      image: '🌲',
      benefits: ['Concentration', 'Connexion nature', 'Paix intérieure'],
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 'mountain',
      name: 'Sommet Zen',
      description: 'Méditation au sommet d\'une montagne avec vue panoramique',
      duration: '20-30 min',
      category: 'Méditation Avancée',
      difficulty: 'Avancé',
      rating: 4.7,
      image: '⛰️',
      benefits: ['Clarté mentale', 'Perspective', 'Accomplissement'],
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'space',
      name: 'Cosmos Infini',
      description: 'Voyage méditatif dans l\'espace pour une perspective cosmique',
      duration: '15-25 min',
      category: 'Contemplation',
      difficulty: 'Intermédiaire',
      rating: 4.6,
      image: '🌌',
      benefits: ['Émerveillement', 'Lâcher-prise', 'Perspective globale'],
      color: 'from-indigo-600 to-purple-700'
    },
    {
      id: 'garden',
      name: 'Jardin Japonais',
      description: 'Sérénité dans un jardin zen traditionnel japonais',
      duration: '10-15 min',
      category: 'Relaxation',
      difficulty: 'Débutant',
      rating: 4.8,
      image: '🎋',
      benefits: ['Harmonie', 'Simplicité', 'Présence'],
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'underwater',
      name: 'Récif Corallien',
      description: 'Exploration sous-marine paisible dans un récif coloré',
      duration: '12-18 min',
      category: 'Exploration',
      difficulty: 'Débutant',
      rating: 4.5,
      image: '🐠',
      benefits: ['Émerveillement', 'Calme', 'Curiosité'],
      color: 'from-teal-400 to-blue-600'
    }
  ];

  const sessionStats = {
    totalSessions: 47,
    totalTime: 892, // minutes
    favoriteEnvironment: 'Forêt Enchantée',
    streakDays: 12,
    stressReduction: 73,
    focusImprovement: 68
  };

  const recentActivities = [
    { date: 'Aujourd\'hui', environment: 'Plage Tropicale', duration: 15, rating: 5 },
    { date: 'Hier', environment: 'Jardin Japonais', duration: 12, rating: 4 },
    { date: 'Il y a 2 jours', environment: 'Forêt Enchantée', duration: 20, rating: 5 },
    { date: 'Il y a 3 jours', environment: 'Cosmos Infini', duration: 18, rating: 4 }
  ];

  const startSession = (environmentId: string) => {
    setCurrentSession(environmentId);
    setIsSessionActive(true);
    setSessionTime(0);
  };

  const pauseSession = () => {
    setIsSessionActive(false);
  };

  const stopSession = () => {
    setCurrentSession(null);
    setIsSessionActive(false);
    setSessionTime(0);
  };

  const getCurrentEnvironment = () => 
    vrEnvironments.find(env => env.id === currentSession);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Expériences VR Thérapeutiques</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Immergez-vous dans des environnements virtuels conçus pour votre bien-être mental
          </p>
        </motion.div>

        {/* Active Session */}
        {currentSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-800 to-indigo-800 border-purple-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">{getCurrentEnvironment()?.image}</div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {getCurrentEnvironment()?.name}
                      </h3>
                      <p className="text-purple-200">{getCurrentEnvironment()?.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white">
                    Session Active
                  </Badge>
                </div>

                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">
                      {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-purple-200">Temps écoulé</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={isSessionActive ? pauseSession : () => setIsSessionActive(true)}
                    variant="secondary"
                    size="lg"
                  >
                    {isSessionActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    {isSessionActive ? 'Pause' : 'Reprendre'}
                  </Button>
                  <Button onClick={stopSession} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Terminer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="environments" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="environments">Environnements</TabsTrigger>
            <TabsTrigger value="sessions">Mes Sessions</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="environments">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vrEnvironments.map((environment, index) => (
                <motion.div
                  key={environment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-3xl">{environment.image}</div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-300">{environment.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-white">{environment.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {environment.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <Badge className={getDifficultyColor(environment.difficulty)}>
                            {environment.difficulty}
                          </Badge>
                          <span className="text-gray-400 flex items-center">
                            <Timer className="h-3 w-3 mr-1" />
                            {environment.duration}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">Bénéfices :</h4>
                          <div className="flex flex-wrap gap-1">
                            {environment.benefits.map((benefit, benefitIndex) => (
                              <Badge key={benefitIndex} variant="outline" className="text-xs text-gray-300 border-gray-600">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button 
                          className={`w-full bg-gradient-to-r ${environment.color} hover:opacity-90 transition-opacity`}
                          onClick={() => startSession(environment.id)}
                          disabled={!!currentSession}
                        >
                          <Headphones className="h-4 w-4 mr-2" />
                          {currentSession ? 'Session en cours' : 'Commencer'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Sessions Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-white">{activity.environment}</h3>
                        <p className="text-sm text-gray-400">{activity.date} • {activity.duration} minutes</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex mr-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < activity.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                        <Button variant="outline" size="sm">
                          Relancer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Statistiques de Bien-être
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{sessionStats.totalSessions}</div>
                        <div className="text-sm text-gray-400">Sessions Total</div>
                      </div>
                      <div className="text-center p-4 bg-green-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{formatTime(sessionStats.totalTime)}</div>
                        <div className="text-sm text-gray-400">Temps Total</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-500/20 rounded-lg">
                      <div className="text-xl font-bold text-purple-400">{sessionStats.favoriteEnvironment}</div>
                      <div className="text-sm text-gray-400">Environnement Préféré</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Impact sur le Bien-être</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Réduction du Stress</span>
                        <span className="text-white font-semibold">{sessionStats.stressReduction}%</span>
                      </div>
                      <Progress value={sessionStats.stressReduction} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Amélioration du Focus</span>
                        <span className="text-white font-semibold">{sessionStats.focusImprovement}%</span>
                      </div>
                      <Progress value={sessionStats.focusImprovement} className="h-3" />
                    </div>
                    <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{sessionStats.streakDays}</div>
                      <div className="text-sm text-gray-400">Jours Consécutifs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Paramètres VR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white">Qualité Visuelle</label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center text-gray-300">
                        <input type="radio" name="quality" className="mr-2" defaultChecked />
                        <span className="text-sm">Haute (Recommandé)</span>
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input type="radio" name="quality" className="mr-2" />
                        <span className="text-sm">Moyenne (Performance)</span>
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input type="radio" name="quality" className="mr-2" />
                        <span className="text-sm">Basse (Économie d'énergie)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-white">Sons et Audio</label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Sons d'ambiance</span>
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Musique de fond</span>
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Instructions vocales</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white">Sessions Automatiques</label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Session matinale quotidienne</span>
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Pause relaxation après-midi</span>
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Session sommeil le soir</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Sauvegarder les Paramètres</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VRPage;
