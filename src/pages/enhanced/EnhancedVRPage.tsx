import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  VrIcon,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Eye,
  Brain,
  Heart,
  Activity,
  TreePine,
  Waves,
  Mountain,
  Sun,
  Moon,
  Cloud,
  Sparkles,
  Users,
  Trophy,
  Target,
  Timer,
  Volume2,
  Thermometer,
  Wind,
  Droplets,
  Zap,
  Monitor,
  Headphones
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVRSessionTimer } from '@/hooks/useVRSessionTimer';

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  icon: any;
  gradient: string;
  category: 'therapy' | 'meditation' | 'adventure' | 'social';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  biometricImpact: {
    stressReduction: number;
    focusImprovement: number;
    moodBoost: number;
  };
  environmentalSettings: {
    weather: string[];
    timeOfDay: string[];
    intensity: number;
  };
}

interface VRSession {
  id: string;
  startTime: Date;
  environment: string;
  duration: number;
  biometricData: {
    initial: BiometricReading;
    current: BiometricReading;
  };
}

interface BiometricReading {
  heartRate: number;
  stress: number;
  focus: number;
  immersion: number;
  presence: number;
}

const EnhancedVRPage: React.FC = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<VREnvironment | null>(null);
  const [currentSession, setCurrentSession] = useState<VRSession | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionDuration, setSessionDuration] = useState([15]);
  const [biometrics, setBiometrics] = useState<BiometricReading>({
    heartRate: 72,
    stress: 35,
    focus: 60,
    immersion: 0,
    presence: 0
  });
  const [environmentSettings, setEnvironmentSettings] = useState({
    weather: 'clear',
    timeOfDay: 'day',
    intensity: 50,
    soundLevel: 70
  });
  const { toast } = useToast();

  const vrTimer = useVRSessionTimer({
    totalDurationSeconds: sessionDuration[0] * 60,
    isPaused,
    onComplete: () => {
      endSession();
      toast({
        title: "Session terminée !",
        description: "Félicitations, vous avez complété votre session VR"
      });
    }
  });

  const vrEnvironments: VREnvironment[] = [
    {
      id: 'zen_forest',
      name: 'Forêt Zen',
      description: 'Immersion dans une forêt mystique aux propriétés apaisantes',
      icon: TreePine,
      gradient: 'from-green-400 to-emerald-600',
      category: 'meditation',
      duration: 20,
      difficulty: 'beginner',
      benefits: ['Réduction du stress', 'Amélioration du focus', 'Connexion nature'],
      biometricImpact: {
        stressReduction: 45,
        focusImprovement: 35,
        moodBoost: 60
      },
      environmentalSettings: {
        weather: ['clear', 'light_rain', 'mist'],
        timeOfDay: ['dawn', 'day', 'dusk'],
        intensity: 30
      }
    },
    {
      id: 'cosmic_meditation',
      name: 'Méditation Cosmique',
      description: 'Voyage transcendant à travers l\'espace et les dimensions',
      icon: Sparkles,
      gradient: 'from-purple-400 to-indigo-600',
      category: 'meditation',
      duration: 25,
      difficulty: 'intermediate',
      benefits: ['Expansion de conscience', 'Paix intérieure', 'Perspective cosmique'],
      biometricImpact: {
        stressReduction: 55,
        focusImprovement: 70,
        moodBoost: 45
      },
      environmentalSettings: {
        weather: ['clear'],
        timeOfDay: ['night'],
        intensity: 60
      }
    },
    {
      id: 'healing_ocean',
      name: 'Océan Thérapeutique',
      description: 'Plage paradisiaque avec vagues biaurales thérapeutiques',
      icon: Waves,
      gradient: 'from-blue-400 to-cyan-600',
      category: 'therapy',
      duration: 30,
      difficulty: 'beginner',
      benefits: ['Relaxation profonde', 'Régénération', 'Apaisement émotionnel'],
      biometricImpact: {
        stressReduction: 65,
        focusImprovement: 25,
        moodBoost: 70
      },
      environmentalSettings: {
        weather: ['clear', 'light_clouds'],
        timeOfDay: ['sunrise', 'day', 'sunset'],
        intensity: 40
      }
    },
    {
      id: 'mountain_strength',
      name: 'Force de la Montagne',
      description: 'Sommet majestueux pour développer résilience et détermination',
      icon: Mountain,
      gradient: 'from-gray-400 to-slate-600',
      category: 'therapy',
      duration: 35,
      difficulty: 'advanced',
      benefits: ['Renforcement mental', 'Confiance en soi', 'Persévérance'],
      biometricImpact: {
        stressReduction: 30,
        focusImprovement: 80,
        moodBoost: 50
      },
      environmentalSettings: {
        weather: ['clear', 'wind', 'snow'],
        timeOfDay: ['dawn', 'day'],
        intensity: 70
      }
    },
    {
      id: 'social_garden',
      name: 'Jardin Social',
      description: 'Espace partagé pour thérapie de groupe et connexions',
      icon: Users,
      gradient: 'from-pink-400 to-rose-600',
      category: 'social',
      duration: 45,
      difficulty: 'intermediate',
      benefits: ['Connexion sociale', 'Empathie', 'Communication'],
      biometricImpact: {
        stressReduction: 40,
        focusImprovement: 45,
        moodBoost: 85
      },
      environmentalSettings: {
        weather: ['clear', 'light_clouds'],
        timeOfDay: ['day', 'evening'],
        intensity: 50
      }
    }
  ];

  // Simulation des données biométriques durant la session
  useEffect(() => {
    if (isInSession && !isPaused) {
      const interval = setInterval(() => {
        setBiometrics(prev => ({
          heartRate: Math.max(60, prev.heartRate + (Math.random() - 0.6) * 3),
          stress: Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.7) * 5)),
          focus: Math.min(100, prev.focus + (Math.random() - 0.3) * 4),
          immersion: Math.min(100, prev.immersion + Math.random() * 2),
          presence: Math.min(100, prev.presence + Math.random() * 1.5)
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isInSession, isPaused]);

  const startSession = () => {
    if (!selectedEnvironment) return;

    const newSession: VRSession = {
      id: `session_${Date.now()}`,
      startTime: new Date(),
      environment: selectedEnvironment.id,
      duration: sessionDuration[0],
      biometricData: {
        initial: { ...biometrics },
        current: { ...biometrics }
      }
    };

    setCurrentSession(newSession);
    setIsInSession(true);
    setIsPaused(false);
    setBiometrics(prev => ({ ...prev, immersion: 20, presence: 15 }));
    
    toast({
      title: "Session VR démarrée",
      description: `Bienvenue dans ${selectedEnvironment.name}`
    });
  };

  const endSession = () => {
    setIsInSession(false);
    setIsPaused(false);
    
    if (currentSession && selectedEnvironment) {
      const improvementStats = {
        stressReduction: Math.max(0, currentSession.biometricData.initial.stress - biometrics.stress),
        focusImprovement: Math.max(0, biometrics.focus - currentSession.biometricData.initial.focus),
        sessionRating: biometrics.immersion
      };
      
      toast({
        title: "Session terminée avec succès !",
        description: `Stress réduit de ${improvementStats.stressReduction.toFixed(0)}%`
      });
    }
    
    setCurrentSession(null);
  };

  const EnvironmentCard: React.FC<{ environment: VREnvironment }> = ({ environment }) => {
    const Icon = environment.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className={`cursor-pointer transition-all duration-300 ${
            selectedEnvironment?.id === environment.id 
              ? 'ring-2 ring-primary shadow-lg' 
              : 'hover:shadow-md'
          }`}
          onClick={() => setSelectedEnvironment(environment)}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${environment.gradient} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{environment.name}</h3>
                  <p className="text-sm text-muted-foreground">{environment.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {environment.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {environment.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {environment.duration} min
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Réduction stress</span>
                    <span className="font-medium">{environment.biometricImpact.stressReduction}%</span>
                  </div>
                  <Progress value={environment.biometricImpact.stressReduction} className="h-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const BiometricDisplay: React.FC = () => (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Biométrie Temps Réel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <Heart className="h-6 w-6 text-red-500 mx-auto" />
            <div className="text-xl font-bold">{biometrics.heartRate.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">BPM</p>
          </div>
          
          <div className="text-center space-y-2">
            <Zap className="h-6 w-6 text-yellow-500 mx-auto" />
            <div className="text-xl font-bold">{biometrics.stress.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Stress</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Focus
              </span>
              <span>{biometrics.focus.toFixed(0)}%</span>
            </div>
            <Progress value={biometrics.focus} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <VrIcon className="h-4 w-4" />
                Immersion
              </span>
              <span>{biometrics.immersion.toFixed(0)}%</span>
            </div>
            <Progress value={biometrics.immersion} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Présence
              </span>
              <span>{biometrics.presence.toFixed(0)}%</span>
            </div>
            <Progress value={biometrics.presence} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SessionControls: React.FC = () => (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          Contrôles de Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isInSession ? (
          <div className="space-y-4">
            {/* Timer */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold font-mono">
                {vrTimer.formatTimeRemaining()}
              </div>
              <Progress value={vrTimer.percentageComplete} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {selectedEnvironment?.name}
              </p>
            </div>

            {/* Contrôles session */}
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={endSession}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Paramètres environnementaux */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Paramètres Environnement</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Intensité
                  </span>
                  <span>{environmentSettings.intensity}%</span>
                </div>
                <Slider
                  value={[environmentSettings.intensity]}
                  onValueChange={(value) => setEnvironmentSettings(prev => ({ ...prev, intensity: value[0] }))}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Audio
                  </span>
                  <span>{environmentSettings.soundLevel}%</span>
                </div>
                <Slider
                  value={[environmentSettings.soundLevel]}
                  onValueChange={(value) => setEnvironmentSettings(prev => ({ ...prev, soundLevel: value[0] }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Configuration pré-session */}
            <div className="space-y-3">
              <h4 className="font-medium">Durée de Session</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{sessionDuration[0]} minutes</span>
                </div>
                <Slider
                  value={sessionDuration}
                  onValueChange={setSessionDuration}
                  min={5}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Bouton de démarrage */}
            <Button
              onClick={startSession}
              disabled={!selectedEnvironment}
              className="w-full h-12 text-lg"
            >
              {selectedEnvironment ? (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Démarrer Session VR
                </>
              ) : (
                'Sélectionnez un environnement'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <VrIcon className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Thérapie VR Immersive
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Environnements virtuels thérapeutiques avec biométrie temps réel et adaptation intelligente
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Environnements */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-6 w-6 text-primary" />
                  Environnements Thérapeutiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {vrEnvironments.map(environment => (
                    <EnvironmentCard key={environment.id} environment={environment} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Détails environnement sélectionné */}
            <AnimatePresence>
              {selectedEnvironment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <selectedEnvironment.icon className="h-6 w-6 text-primary" />
                        {selectedEnvironment.name} - Détails
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Bénéfices Thérapeutiques</h4>
                          <ul className="space-y-2">
                            {selectedEnvironment.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Impact Biométrique</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Réduction du stress</span>
                              <Badge variant="secondary">
                                -{selectedEnvironment.biometricImpact.stressReduction}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Amélioration focus</span>
                              <Badge variant="secondary">
                                +{selectedEnvironment.biometricImpact.focusImprovement}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Boost d'humeur</span>
                              <Badge variant="secondary">
                                +{selectedEnvironment.biometricImpact.moodBoost}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-6">
            <SessionControls />
            <BiometricDisplay />
            
            {/* Statistiques de session */}
            {isInSession && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Progression Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.max(0, currentSession?.biometricData.initial.stress! - biometrics.stress).toFixed(0)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Réduction de stress</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">
                            {Math.floor(vrTimer.elapsed / 60)} min
                          </div>
                          <p className="text-xs text-muted-foreground">Temps écoulé</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">
                            {biometrics.immersion.toFixed(0)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Immersion</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVRPage;