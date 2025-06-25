
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Eye, Clock, Brain, Pause, Play, RotateCcw, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScreenSilkBreakPage: React.FC = () => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [selectedBreakType, setSelectedBreakType] = useState('micro');
  const [screenTime, setScreenTime] = useState({ today: 0, week: 0 });

  // Simuler le temps d'écran
  useEffect(() => {
    setScreenTime({
      today: 6.5, // heures
      week: 42.3  // heures
    });
  }, []);

  // Timer pour les pauses
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreakActive && breakTimeLeft > 0) {
      interval = setInterval(() => {
        setBreakTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (breakTimeLeft === 0 && isBreakActive) {
      setIsBreakActive(false);
    }
    return () => clearInterval(interval);
  }, [isBreakActive, breakTimeLeft]);

  const breakTypes = [
    {
      id: 'micro',
      name: 'Micro-Pause',
      duration: 30,
      description: 'Pause de 30 secondes pour reposer vos yeux',
      color: 'from-green-500 to-emerald-500',
      exercises: [
        'Regardez au loin pendant 20 secondes',
        'Clignez lentement des yeux 10 fois',
        'Respirez profondément 3 fois'
      ]
    },
    {
      id: 'short',
      name: 'Pause Courte',
      duration: 300, // 5 minutes
      description: 'Pause de 5 minutes pour vous étirer et bouger',
      color: 'from-blue-500 to-cyan-500',
      exercises: [
        'Étirez vos bras et votre cou',
        'Faites quelques pas',
        'Hydratez-vous',
        'Exercices de respiration'
      ]
    },
    {
      id: 'long',
      name: 'Pause Longue',
      duration: 900, // 15 minutes
      description: 'Pause de 15 minutes pour une déconnexion complète',
      color: 'from-purple-500 to-pink-500',
      exercises: [
        'Sortez prendre l\'air',
        'Méditation guidée',
        'Étirements complets',
        'Collation saine',
        'Lecture ou musique'
      ]
    }
  ];

  const eyeExercises = [
    {
      name: 'Règle 20-20-20',
      description: 'Toutes les 20 minutes, regardez quelque chose à 20 pieds (6m) pendant 20 secondes',
      icon: Eye,
      frequency: 'Toutes les 20 min'
    },
    {
      name: 'Clignement Conscient',
      description: 'Clignez lentement et complètement 10-15 fois pour humidifier vos yeux',
      icon: Eye,
      frequency: 'Chaque heure'
    },
    {
      name: 'Focus Near-Far',
      description: 'Alternez entre regarder votre doigt proche et un objet distant',
      icon: Eye,
      frequency: '2-3 fois/jour'
    },
    {
      name: 'Palming',
      description: 'Couvrez vos yeux avec vos paumes pendant 30 secondes dans l\'obscurité',
      icon: Eye,
      frequency: 'Lors des pauses'
    }
  ];

  const stats = {
    breaksToday: 12,
    totalBreakTime: 45, // minutes
    eyeStrainReduction: 68,
    focusImprovement: 34
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startBreak = (type: string) => {
    const breakType = breakTypes.find(bt => bt.id === type);
    if (breakType) {
      setSelectedBreakType(type);
      setBreakTimeLeft(breakType.duration);
      setIsBreakActive(true);
    }
  };

  const getCurrentBreak = () => breakTypes.find(bt => bt.id === selectedBreakType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Monitor className="h-12 w-12 text-indigo-600 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Screen Silk Break
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Protégez vos yeux et votre bien-être avec des pauses intelligentes et des exercices adaptés. 
              Transformez votre rapport aux écrans avec des habitudes saines.
            </p>
            
            {/* Screen Time Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-indigo-600">{screenTime.today}h</div>
                <div className="text-sm text-gray-600">Aujourd'hui</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{screenTime.week}h</div>
                <div className="text-sm text-gray-600">Cette Semaine</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{stats.breaksToday}</div>
                <div className="text-sm text-gray-600">Pauses Aujourd'hui</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">{stats.totalBreakTime}min</div>
                <div className="text-sm text-gray-600">Temps de Pause</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Break Timer */}
      {isBreakActive && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-8 px-4 bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Pause className="h-8 w-8 mr-3" />
              <h2 className="text-3xl font-bold">Pause en Cours</h2>
            </div>
            <div className="text-6xl font-bold mb-4">{formatTime(breakTimeLeft)}</div>
            <p className="text-xl mb-6">{getCurrentBreak()?.name}</p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-3">Exercices Suggérés :</h3>
              <ul className="space-y-2 text-left">
                {getCurrentBreak()?.exercises.map((exercise, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    {exercise}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 space-x-4">
              <Button 
                variant="secondary" 
                onClick={() => setIsBreakActive(false)}
              >
                Terminer
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-indigo-600"
                onClick={() => setBreakTimeLeft(breakTimeLeft + 60)}
              >
                +1 min
              </Button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="breaks" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="breaks">Pauses</TabsTrigger>
              <TabsTrigger value="exercises">Exercices</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="breaks" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {breakTypes.map((breakType, index) => (
                  <motion.div
                    key={breakType.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className={`w-12 h-12 bg-gradient-to-r ${breakType.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-center">{breakType.name}</CardTitle>
                        <CardDescription className="text-center">
                          {breakType.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {breakType.duration < 60 
                                ? `${breakType.duration}s` 
                                : `${Math.floor(breakType.duration / 60)}min`
                              }
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Exercices inclus :</h4>
                            <ul className="space-y-1">
                              {breakType.exercises.slice(0, 3).map((exercise, exerciseIndex) => (
                                <li key={exerciseIndex} className="text-sm text-gray-600 flex items-center">
                                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                                  {exercise}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Button 
                            className={`w-full bg-gradient-to-r ${breakType.color} hover:opacity-90 transition-opacity`}
                            onClick={() => startBreak(breakType.id)}
                            disabled={isBreakActive}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Commencer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="exercises" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercices pour les Yeux</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {eyeExercises.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <exercise.icon className="h-6 w-6 text-indigo-600 mr-3" />
                              <CardTitle className="text-lg">{exercise.name}</CardTitle>
                            </div>
                            <Badge variant="outline">{exercise.frequency}</Badge>
                          </div>
                          <CardDescription>{exercise.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            Démarrer l'Exercice
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Amélioration du Bien-être</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Réduction de la fatigue oculaire</span>
                        <span>{stats.eyeStrainReduction}%</span>
                      </div>
                      <Progress value={stats.eyeStrainReduction} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Amélioration de la concentration</span>
                        <span>{stats.focusImprovement}%</span>
                      </div>
                      <Progress value={stats.focusImprovement} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Habitudes de Pause</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">12</div>
                          <div className="text-sm text-gray-600">Pauses Aujourd'hui</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">85</div>
                          <div className="text-sm text-gray-600">Cette Semaine</div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">7</div>
                        <div className="text-sm text-gray-600">Jours de Suite</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Paramètres de Pause
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Rappels automatiques</label>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Micro-pauses toutes les 20 minutes</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Pause courte toutes les heures</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Pause longue toutes les 2 heures</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Notifications</label>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Sons de notification</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Notifications push</span>
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
      </section>
    </div>
  );
};

export default ScreenSilkBreakPage;
