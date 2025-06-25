
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rocket, Play, Pause, RotateCcw, Volume2, Settings, Star, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const VRGalactiquePage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState('nebula');
  const [sessionTime, setSessionTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [immersionLevel, setImmersionLevel] = useState([80]);

  const scenes = {
    nebula: {
      name: 'Nébuleuse Cosmique',
      description: 'Voyage au cœur d\'une nébuleuse aux couleurs chatoyantes',
      duration: '15 min',
      difficulty: 'Débutant',
      benefits: ['Relaxation profonde', 'Créativité', 'Inspiration'],
      image: '🌌'
    },
    galaxy: {
      name: 'Spirale Galactique',
      description: 'Exploration d\'une galaxie spirale en rotation',
      duration: '20 min',
      difficulty: 'Intermédiaire',
      benefits: ['Méditation active', 'Concentration', 'Émerveillement'],
      image: '🌀'
    },
    blackhole: {
      name: 'Trou Noir Mystique',
      description: 'Approche contrôlée d\'un trou noir supermassif',
      duration: '25 min',
      difficulty: 'Avancé',
      benefits: ['Lâcher-prise', 'Contemplation', 'Transcendance'],
      image: '🕳️'
    },
    aurora: {
      name: 'Aurores Stellaires',
      description: 'Danse cosmique des aurores dans l\'espace',
      duration: '12 min',
      difficulty: 'Débutant',
      benefits: ['Joie', 'Énergie positive', 'Harmonie'],
      image: '✨'
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-orange-100 text-orange-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4 bg-purple-800 text-purple-100">
            <Rocket className="w-4 h-4 mr-2" />
            VR Galactique - Méditation Cosmique
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Voyage Intergalactique
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explorez l'univers en réalité virtuelle pour une expérience de méditation unique. 
            Laissez-vous porter par la beauté cosmique pour un lâcher-prise total.
          </p>
        </div>

        {/* Current Session */}
        {isPlaying && (
          <Card className="bg-purple-900/50 border-purple-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  Session en cours
                </span>
                <span className="text-2xl font-mono">{formatTime(sessionTime)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-4">{scenes[currentScene as keyof typeof scenes].image}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {scenes[currentScene as keyof typeof scenes].name}
                </h3>
                <p className="text-gray-300">{scenes[currentScene as keyof typeof scenes].description}</p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => setIsPlaying(false)}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => {setSessionTime(0); setIsPlaying(false);}}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Redémarrer
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Volume2 className="w-4 h-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">{volume[0]}%</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Immersion</span>
                  <Slider
                    value={immersionLevel}
                    onValueChange={setImmersionLevel}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">{immersionLevel[0]}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scene Selection */}
        <Tabs defaultValue="scenes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-purple-900/50">
            <TabsTrigger value="scenes" className="data-[state=active]:bg-purple-700">Scènes</TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-700">Progression</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-700">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="scenes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(scenes).map(([key, scene]) => (
                <Card 
                  key={key} 
                  className={`bg-purple-900/30 border-purple-700 hover:bg-purple-800/40 transition-colors cursor-pointer ${
                    currentScene === key ? 'ring-2 ring-purple-400' : ''
                  }`}
                  onClick={() => setCurrentScene(key)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <span className="flex items-center gap-3">
                        <span className="text-3xl">{scene.image}</span>
                        {scene.name}
                      </span>
                      <Badge className={getDifficultyColor(scene.difficulty)}>
                        {scene.difficulty}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{scene.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {scene.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        4.8/5
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Bienfaits :</h4>
                      <div className="flex flex-wrap gap-1">
                        {scene.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-purple-500 text-purple-200">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentScene(key);
                        setIsPlaying(true);
                        setSessionTime(0);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Commencer l'expérience
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-purple-900/30 border-purple-700">
              <CardHeader>
                <CardTitle className="text-white">Votre Progression Cosmique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sessions complétées</span>
                    <span className="text-2xl font-bold text-purple-400">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Temps total de méditation</span>
                    <span className="text-2xl font-bold text-blue-400">7h 45min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Niveau d'explorateur</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">Voyageur Cosmique</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium">Prochains objectifs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Maître de la Nébuleuse</span>
                      <span className="text-purple-400">7/10 sessions</span>
                    </div>
                    <Progress value={70} className="h-2 bg-purple-900" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Explorateur Galactique</span>
                      <span className="text-blue-400">12/20 sessions</span>
                    </div>
                    <Progress value={60} className="h-2 bg-blue-900" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-purple-900/30 border-purple-700">
              <CardHeader>
                <CardTitle className="text-white">Paramètres VR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Qualité graphique</label>
                    <select className="w-full p-2 rounded bg-purple-800 border border-purple-600 text-white">
                      <option>Ultra (recommandé)</option>
                      <option>Élevé</option>
                      <option>Moyen</option>
                      <option>Faible</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Mode de contrôle</label>
                    <select className="w-full p-2 rounded bg-purple-800 border border-purple-600 text-white">
                      <option>Contrôleurs VR</option>
                      <option>Suivi des yeux</option>
                      <option>Commandes vocales</option>
                      <option>Mode automatique</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Confort de mouvement</label>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Réaliste</span>
                      <span>Confortable</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VRGalactiquePage;
