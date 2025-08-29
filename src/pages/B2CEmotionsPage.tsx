import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Heart, Activity, Zap, Eye, Mic, Camera, 
  TrendingUp, BarChart3, Sparkles, Star, Target,
  PlayCircle, Music, Headphones, Waves, Circle,
  Timer, Award, Trophy, Gamepad2, Compass
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface EmotionMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface BiometricData {
  heartRate: number;
  hrv: number;
  stress: number;
  energy: number;
  focus: number;
  coherence: number;
}

interface EmotionModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'active' | 'completed';
  progress: number;
  xp: number;
  category: string;
  estimatedTime: number;
}

const B2CEmotionsPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<'dashboard' | 'scan' | 'training'>('dashboard');
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    hrv: 45,
    stress: 25,
    energy: 78,
    focus: 82,
    coherence: 89
  });
  const [emotionMetrics] = useState<EmotionMetric[]>([
    { name: 'Joie', value: 82, trend: 'up', icon: <Heart className="w-4 h-4" />, color: 'bg-green-500' },
    { name: 'Sérénité', value: 75, trend: 'stable', icon: <Circle className="w-4 h-4" />, color: 'bg-blue-500' },
    { name: 'Énergie', value: 68, trend: 'up', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-500' },
    { name: 'Concentration', value: 85, trend: 'up', icon: <Target className="w-4 h-4" />, color: 'bg-purple-500' }
  ]);
  
  const [modules] = useState<EmotionModule[]>([
    {
      id: 'scan-multimodal',
      title: 'Scan Émotionnel 360°',
      description: 'Analyse complète: facial, vocal, physiologique',
      icon: <Brain className="w-6 h-6" />,
      status: 'available',
      progress: 0,
      xp: 150,
      category: 'Analyse',
      estimatedTime: 5
    },
    {
      id: 'voice-emotion',
      title: 'Analyse Vocale Avancée',
      description: 'IA d\'analyse prosodique et émotionnelle',
      icon: <Mic className="w-6 h-6" />,
      status: 'available',
      progress: 0,
      xp: 100,
      category: 'Vocal',
      estimatedTime: 3
    },
    {
      id: 'facial-recognition',
      title: 'Reconnaissance Faciale',
      description: 'Détection micro-expressions et émotions',
      icon: <Camera className="w-6 h-6" />,
      status: 'available',
      progress: 0,
      xp: 120,
      category: 'Visuel',
      estimatedTime: 4
    },
    {
      id: 'biometric-flow',
      title: 'Flow Biométrique',
      description: 'Cohérence cardiaque et état de flow',
      icon: <Activity className="w-6 h-6" />,
      status: 'available',
      progress: 0,
      xp: 200,
      category: 'Physiologique',
      estimatedTime: 10
    },
    {
      id: 'emotion-training',
      title: 'Entraînement Émotionnel',
      description: 'Développement de l\'intelligence émotionnelle',
      icon: <Trophy className="w-6 h-6" />,
      status: 'available',
      progress: 35,
      xp: 250,
      category: 'Formation',
      estimatedTime: 15
    },
    {
      id: 'music-therapy',
      title: 'Thérapie Musicale Adaptative',
      description: 'Musique générée selon votre état émotionnel',
      icon: <Music className="w-6 h-6" />,
      status: 'available',
      progress: 0,
      xp: 180,
      category: 'Thérapie',
      estimatedTime: 20
    }
  ]);

  // Simulation de données biométriques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        hrv: Math.max(20, Math.min(80, prev.hrv + (Math.random() - 0.5) * 6)),
        stress: Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.5) * 8)),
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.5) * 3)),
        focus: Math.max(0, Math.min(100, prev.focus + (Math.random() - 0.5) * 5)),
        coherence: Math.max(0, Math.min(100, prev.coherence + (Math.random() - 0.5) * 4))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleModuleStart = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      toast({
        title: `${module.title} démarré`,
        description: `Durée estimée: ${module.estimatedTime} minutes`,
      });
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Métriques émotionnelles en temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {emotionMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${metric.color} bg-opacity-20`}>
                    {metric.icon}
                  </div>
                  <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm">{metric.name}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Données biométriques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            État Biométrique Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fréquence Cardiaque</span>
                <span className="text-lg font-bold text-red-500">{Math.round(biometrics.heartRate)} BPM</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(biometrics.heartRate / 120) * 100}%` }}
                  animate={{ width: `${(biometrics.heartRate / 120) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Variabilité Cardiaque</span>
                <span className="text-lg font-bold text-green-500">{Math.round(biometrics.hrv)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${biometrics.hrv}%` }}
                  animate={{ width: `${biometrics.hrv}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Niveau de Stress</span>
                <span className="text-lg font-bold text-orange-500">{Math.round(biometrics.stress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${biometrics.stress}%` }}
                  animate={{ width: `${biometrics.stress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Énergie</span>
                <span className="text-lg font-bold text-yellow-500">{Math.round(biometrics.energy)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${biometrics.energy}%` }}
                  animate={{ width: `${biometrics.energy}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Focus</span>
                <span className="text-lg font-bold text-purple-500">{Math.round(biometrics.focus)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${biometrics.focus}%` }}
                  animate={{ width: `${biometrics.focus}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cohérence</span>
                <span className="text-lg font-bold text-blue-500">{Math.round(biometrics.coherence)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${biometrics.coherence}%` }}
                  animate={{ width: `${biometrics.coherence}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules d'analyse émotionnelle */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Modules d'Analyse Émotionnelle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <Badge variant="outline">{module.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-yellow-600">
                        <Star className="w-4 h-4 mr-1" />
                        {module.xp} XP
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Timer className="w-4 h-4 mr-1" />
                        {module.estimatedTime}min
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                  
                  {module.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} />
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant={module.status === 'active' ? 'default' : 'outline'}
                    onClick={() => handleModuleStart(module.id)}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {module.status === 'active' ? 'Continuer' : 'Commencer'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Centre d'Analyse Émotionnelle
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez et développez votre intelligence émotionnelle avec des outils d'analyse avancés et de l'IA
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            {[
              { key: 'dashboard', label: 'Tableau de Bord', icon: <BarChart3 className="w-4 h-4" /> },
              { key: 'scan', label: 'Scan Rapide', icon: <Eye className="w-4 h-4" /> },
              { key: 'training', label: 'Entraînement', icon: <Gamepad2 className="w-4 h-4" /> }
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setSelectedMode(mode.key as any)}
                className={`px-6 py-3 rounded-md flex items-center space-x-2 transition-all ${
                  selectedMode === mode.key
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedMode === 'dashboard' && renderDashboard()}
            {selectedMode === 'scan' && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Scan Rapide Émotionnel</h2>
                <p className="text-muted-foreground mb-8">Fonctionnalité en cours de développement</p>
                <Button size="lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Lancer le Scan
                </Button>
              </div>
            )}
            {selectedMode === 'training' && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Entraînement Émotionnel</h2>
                <p className="text-muted-foreground mb-8">Développez vos compétences émotionnelles</p>
                <Button size="lg">
                  <Trophy className="w-5 h-5 mr-2" />
                  Commencer l'Entraînement
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default B2CEmotionsPage;