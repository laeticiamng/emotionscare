
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VrHeadset, Play, Pause, RotateCcw, Settings, Timer, Zap, Waves, Mountain } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface VRExperience {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: 'Facile' | 'Moyen' | 'Avancé';
  image: string;
  benefits: string[];
  color: string;
}

const VRPage: React.FC = () => {
  const [activeSession, setActiveSession] = useState<VRExperience | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const vrExperiences: VRExperience[] = [
    {
      id: 1,
      title: 'Plage Tropicale',
      description: 'Détendez-vous sur une plage paradisiaque avec le bruit des vagues',
      duration: '10 min',
      category: 'relaxation',
      difficulty: 'Facile',
      image: '/vr-beach.jpg',
      benefits: ['Réduction du stress', 'Relaxation profonde', 'Évasion mentale'],
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Forêt Enchantée',
      description: 'Promenade méditative dans une forêt magique',
      duration: '15 min',
      category: 'meditation',
      difficulty: 'Moyen',
      image: '/vr-forest.jpg',
      benefits: ['Centrage', 'Connexion nature', 'Pleine conscience'],
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Sommet des Montagnes',
      description: 'Méditation au sommet avec vue panoramique',
      duration: '20 min',
      category: 'meditation',
      difficulty: 'Avancé',
      image: '/vr-mountain.jpg',
      benefits: ['Focus profond', 'Perspective', 'Accomplissement'],
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Jardin Zen Japonais',
      description: 'Sérénité dans un jardin zen traditionnel',
      duration: '12 min',
      category: 'relaxation',
      difficulty: 'Facile',
      image: '/vr-zen.jpg',
      benefits: ['Harmonie', 'Simplicité', 'Paix intérieure'],
      color: 'bg-indigo-500'
    },
    {
      id: 5,
      title: 'Aurores Boréales',
      description: 'Spectacle magique des aurores dans le Grand Nord',
      duration: '18 min',
      category: 'inspiration',
      difficulty: 'Moyen',
      image: '/vr-aurora.jpg',
      benefits: ['Émerveillement', 'Inspiration', 'Connexion cosmique'],
      color: 'bg-teal-500'
    },
    {
      id: 6,
      title: 'Respiration Océanique',
      description: 'Exercices de respiration guidés sous l\'océan',
      duration: '8 min',
      category: 'breathing',
      difficulty: 'Facile',
      image: '/vr-ocean.jpg',
      benefits: ['Respiration', 'Oxygénation', 'Calme profond'],
      color: 'bg-cyan-500'
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes', icon: VrHeadset },
    { id: 'relaxation', label: 'Relaxation', icon: Waves },
    { id: 'meditation', label: 'Méditation', icon: Mountain },
    { id: 'breathing', label: 'Respiration', icon: Zap },
    { id: 'inspiration', label: 'Inspiration', icon: Timer }
  ];

  const stats = [
    { label: 'Sessions completées', value: '47', trend: '+5' },
    { label: 'Temps total', value: '12h 30m', trend: '+2h' },
    { label: 'Streak actuel', value: '7 jours', trend: 'Record!' },
    { label: 'Expériences découvertes', value: '23', trend: '+3' }
  ];

  const filteredExperiences = selectedCategory === 'all' 
    ? vrExperiences 
    : vrExperiences.filter(exp => exp.category === selectedCategory);

  const startSession = (experience: VRExperience) => {
    setActiveSession(experience);
    setSessionTime(0);
    setIsSessionActive(true);
    toast.success(`Session "${experience.title}" démarrée !`);
  };

  const pauseSession = () => {
    setIsSessionActive(!isSessionActive);
    toast.info(isSessionActive ? 'Session en pause' : 'Session reprise');
  };

  const stopSession = () => {
    setActiveSession(null);
    setIsSessionActive(false);
    setSessionTime(0);
    toast.success('Session terminée !');
  };

  // Timer pour la session active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && activeSession) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, activeSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-500';
      case 'Moyen': return 'bg-yellow-500';
      case 'Avancé': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-cyan-50 p-4" data-testid="vr-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Réalité Virtuelle Thérapeutique</h1>
          <p className="text-xl text-gray-600">Expériences immersives pour votre bien-être mental</p>
        </div>

        {/* Session Active */}
        <AnimatePresence>
          {activeSession && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${activeSession.color} rounded-full flex items-center justify-center`}>
                        <VrHeadset className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{activeSession.title}</CardTitle>
                        <p className="text-sm text-gray-600">{activeSession.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      En cours
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-purple-600">
                      {formatTime(sessionTime)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Durée recommandée: {activeSession.duration}
                    </div>
                  </div>
                  
                  <Progress 
                    value={(sessionTime / (parseInt(activeSession.duration) * 60)) * 100} 
                    className="w-full"
                  />
                  
                  <div className="flex justify-center gap-4">
                    <Button onClick={pauseSession} variant="outline">
                      {isSessionActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isSessionActive ? 'Pause' : 'Reprendre'}
                    </Button>
                    <Button onClick={stopSession} variant="destructive">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Arrêter
                    </Button>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Statistiques */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vos Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                    <div className="text-sm font-medium">{stat.label}</div>
                    <div className="text-xs text-green-600">{stat.trend}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Catégories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Expériences VR */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="experiences">
              <TabsList className="mb-6">
                <TabsTrigger value="experiences">Expériences</TabsTrigger>
                <TabsTrigger value="library">Ma Bibliothèque</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="experiences">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredExperiences.map((experience) => (
                    <motion.div
                      key={experience.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={`h-32 ${experience.color} relative flex items-center justify-center`}>
                          <VrHeadset className="h-16 w-16 text-white opacity-80" />
                          <div className="absolute top-2 right-2">
                            <Badge className={`${getDifficultyColor(experience.difficulty)} text-white`}>
                              {experience.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardHeader>
                          <CardTitle className="text-lg">{experience.title}</CardTitle>
                          <p className="text-sm text-gray-600">{experience.description}</p>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">{experience.duration}</Badge>
                              <Badge variant="secondary">{experience.category}</Badge>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-2">Bienfaits:</p>
                              <div className="flex flex-wrap gap-1">
                                {experience.benefits.map((benefit, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full"
                              onClick={() => startSession(experience)}
                              disabled={!!activeSession}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              {activeSession ? 'Session en cours' : 'Commencer'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="library">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes Expériences Favorites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vrExperiences.slice(0, 3).map((exp) => (
                        <div key={exp.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${exp.color} rounded-full flex items-center justify-center`}>
                              <VrHeadset className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{exp.title}</p>
                              <p className="text-sm text-gray-600">Utilisé 5 fois</p>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => startSession(exp)}>
                            <Play className="mr-1 h-3 w-3" />
                            Lancer
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: 'Aujourd\'hui 14:30', experience: 'Plage Tropicale', duration: '10 min', completed: true },
                        { date: 'Hier 18:15', experience: 'Forêt Enchantée', duration: '15 min', completed: true },
                        { date: 'Hier 12:00', experience: 'Jardin Zen', duration: '8 min', completed: false },
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{session.experience}</p>
                            <p className="text-sm text-gray-600">{session.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{session.duration}</p>
                            <Badge variant={session.completed ? "default" : "secondary"}>
                              {session.completed ? 'Terminée' : 'Interrompue'}
                            </Badge>
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
      </div>
    </div>
  );
};

export default VRPage;
