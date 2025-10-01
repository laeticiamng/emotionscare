// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Heart, 
  Music, 
  Zap, 
  Target,
  TrendingUp,
  Users,
  Eye,
  Mic,
  Gamepad2,
  Camera,
  HeadphonesIcon,
  Sparkles,
  Timer,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BiometricData {
  heartRate: number;
  stress: number;
  focus: number;
  energy: number;
}

interface EmotionalState {
  primary: string;
  confidence: number;
  mood: 'positive' | 'neutral' | 'negative';
  energy: 'high' | 'medium' | 'low';
}

const ImmersiveDashboard: React.FC = () => {
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    stress: 25,
    focus: 78,
    energy: 85
  });
  
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    primary: 'Sérénité',
    confidence: 84,
    mood: 'positive',
    energy: 'high'
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [weatherAdaptation, setWeatherAdaptation] = useState('sunny');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const { toast } = useToast();

  // Simulation biometric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        stress: Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.5) * 10)),
        focus: Math.max(0, Math.min(100, prev.focus + (Math.random() - 0.5) * 8)),
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.5) * 6))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Time and weather adaptation
  useEffect(() => {
    const updateEnvironment = () => {
      const hour = new Date().getHours();
      if (hour < 6) setTimeOfDay('night');
      else if (hour < 12) setTimeOfDay('morning');
      else if (hour < 18) setTimeOfDay('afternoon');
      else setTimeOfDay('evening');
    };

    updateEnvironment();
    const interval = setInterval(updateEnvironment, 60000);
    return () => clearInterval(interval);
  }, []);

  const quickScans = [
    {
      type: 'voice',
      title: 'Analyse Vocale',
      description: 'Scan émotionnel via votre voix',
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      duration: '15s'
    },
    {
      type: 'facial',
      title: 'Expression Faciale',
      description: 'Détection micro-expressions',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      duration: '10s'
    },
    {
      type: 'biometric',
      title: 'Biométrie',
      description: 'Analyse physiologique',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      duration: '30s'
    },
    {
      type: 'behavioral',
      title: 'Comportemental',
      description: 'Patterns d\'interaction',
      icon: Activity,
      color: 'from-purple-500 to-violet-500',
      duration: '45s'
    }
  ];

  const immersiveModules = [
    {
      id: 'vr-therapy',
      title: 'VR Thérapie',
      description: 'Environnements thérapeutiques immersifs',
      icon: Camera,
      gradient: 'from-indigo-500 to-blue-600',
      status: 'active',
      participants: 1247,
      effectiveness: 92
    },
    {
      id: 'ai-coach',
      title: 'Coach IA Émotionnel',
      description: 'Intelligence artificielle empathique',
      icon: Brain,
      gradient: 'from-violet-500 to-purple-600',
      status: 'learning',
      participants: 2134,
      effectiveness: 89
    },
    {
      id: 'music-therapy',
      title: 'Musicothérapie Adaptative',
      description: 'Compositions personnalisées en temps réel',
      icon: HeadphonesIcon,
      gradient: 'from-pink-500 to-red-600',
      status: 'generating',
      participants: 856,
      effectiveness: 94
    },
    {
      id: 'gamification',
      title: 'Bien-être Gamifié',
      description: 'Progression ludique et défis personnalisés',
      icon: Gamepad2,
      gradient: 'from-yellow-500 to-orange-600',
      status: 'active',
      participants: 3421,
      effectiveness: 87
    }
  ];

  const handleQuickScan = async (scanType: string) => {
    setIsScanning(true);
    toast({
      title: "Scan en cours...",
      description: `Analyse ${scanType} initiée`
    });

    // Simulate scan duration
    setTimeout(() => {
      setIsScanning(false);
      setEmotionalState({
        primary: ['Joie', 'Sérénité', 'Confiance', 'Inspiration'][Math.floor(Math.random() * 4)],
        confidence: 80 + Math.random() * 20,
        mood: 'positive',
        energy: 'high'
      });
      
      toast({
        title: "Scan terminé !",
        description: "Nouvelles recommandations disponibles"
      });
    }, 2000);
  };

  const getTimeBasedGradient = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'from-yellow-400/20 via-orange-300/10 to-blue-300/20';
      case 'afternoon':
        return 'from-blue-400/20 via-sky-300/10 to-cyan-300/20';
      case 'evening':
        return 'from-orange-400/20 via-purple-300/10 to-pink-300/20';
      case 'night':
        return 'from-indigo-400/20 via-purple-300/10 to-blue-900/20';
      default:
        return 'from-blue-400/20 to-purple-300/20';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getTimeBasedGradient()} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header avec état émotionnel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dashboard Immersif
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Badge className="px-4 py-2 text-lg" variant="outline">
              État: {emotionalState.primary}
            </Badge>
            <Badge className="px-4 py-2 text-lg" variant="secondary">
              Confiance: {emotionalState.confidence.toFixed(0)}%
            </Badge>
          </div>
        </motion.div>

        {/* Biométrie en temps réel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Biométrie Temps Réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <Heart className="h-8 w-8 text-red-500 mx-auto animate-pulse" />
                  <div className="text-2xl font-bold">{biometrics.heartRate.toFixed(0)}</div>
                  <p className="text-sm text-muted-foreground">BPM</p>
                </div>
                <div className="text-center space-y-2">
                  <Zap className="h-8 w-8 text-yellow-500 mx-auto" />
                  <div className="text-2xl font-bold">{biometrics.stress.toFixed(0)}%</div>
                  <p className="text-sm text-muted-foreground">Stress</p>
                </div>
                <div className="text-center space-y-2">
                  <Target className="h-8 w-8 text-blue-500 mx-auto" />
                  <div className="text-2xl font-bold">{biometrics.focus.toFixed(0)}%</div>
                  <p className="text-sm text-muted-foreground">Focus</p>
                </div>
                <div className="text-center space-y-2">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto" />
                  <div className="text-2xl font-bold">{biometrics.energy.toFixed(0)}%</div>
                  <p className="text-sm text-muted-foreground">Énergie</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scans rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Scans Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickScans.map((scan, index) => {
                  const Icon = scan.icon;
                  return (
                    <motion.div
                      key={scan.type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card className="cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all">
                        <CardContent className="p-4 text-center space-y-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${scan.color} flex items-center justify-center mx-auto`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{scan.title}</h3>
                            <p className="text-sm text-muted-foreground">{scan.description}</p>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Timer className="h-3 w-3" />
                            {scan.duration}
                          </div>
                          <Button
                            onClick={() => handleQuickScan(scan.type)}
                            disabled={isScanning}
                            size="sm"
                            className="w-full"
                          >
                            {isScanning ? 'Scan...' : 'Scanner'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modules immersifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Modules Immersifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {immersiveModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${module.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="text-lg font-semibold">{module.title}</h3>
                                <p className="text-sm text-muted-foreground">{module.description}</p>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {module.participants}
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {module.effectiveness}%
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Efficacité</span>
                                  <span>{module.effectiveness}%</span>
                                </div>
                                <Progress value={module.effectiveness} className="h-2" />
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={module.status === 'active' ? 'default' : 'secondary'}
                                  className="capitalize"
                                >
                                  {module.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Planning intelligent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Planning Intelligent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Session recommandée</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Méditation VR - Forêt (15 min) - Optimal pour votre état actuel
                      </p>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Démarrer
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border-2 border-dashed border-primary/30">
                    <div className="text-center space-y-2">
                      <Music className="h-6 w-6 text-primary mx-auto" />
                      <h4 className="font-medium">Musicothérapie</h4>
                      <p className="text-xs text-muted-foreground">Dans 2h</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border-2 border-dashed border-blue-300">
                    <div className="text-center space-y-2">
                      <Brain className="h-6 w-6 text-blue-500 mx-auto" />
                      <h4 className="font-medium">Coach IA</h4>
                      <p className="text-xs text-muted-foreground">Ce soir 19h</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border-2 border-dashed border-purple-300">
                    <div className="text-center space-y-2">
                      <Gamepad2 className="h-6 w-6 text-purple-500 mx-auto" />
                      <h4 className="font-medium">Défi bien-être</h4>
                      <p className="text-xs text-muted-foreground">Demain</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveDashboard;