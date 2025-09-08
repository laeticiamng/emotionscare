import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Glasses, 
  Wind, 
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  Eye,
  Heart,
  Waves,
  Mountain,
  Trees,
  Sunset,
  Star,
  Droplets,
  Flame,
  Snowflake,
  Compass,
  Timer,
  Target,
  TrendingUp,
  Activity,
  Brain
} from 'lucide-react';

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  ambientSound: string;
  effects: string[];
  breathingPattern: 'calm' | 'energizing' | 'balanced';
}

interface BreathingSession {
  id: string;
  pattern: string;
  duration: number; // in seconds
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
  isActive: boolean;
  startTime?: number;
}

interface BiometricData {
  heartRate: number;
  stressLevel: number;
  oxygenLevel: number;
  calmScore: number;
}

export default function B2CVRBreathPageEnhanced() {
  const [isVRConnected, setIsVRConnected] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('forest');
  const [currentSession, setCurrentSession] = useState<BreathingSession | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [cycleCount, setCycleCount] = useState(0);
  const [volume, setVolume] = useState(70);
  const [immersionLevel, setImmersionLevel] = useState(85);
  const [guidanceLevel, setGuidanceLevel] = useState(60);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    stressLevel: 35,
    oxygenLevel: 98,
    calmScore: 75
  });

  const vrEnvironments: VREnvironment[] = [
    {
      id: 'forest',
      name: 'Forêt Enchantée',
      description: 'Immersion dans une forêt luxuriante avec des sons d\'oiseaux',
      icon: Trees,
      color: 'hsl(142 76% 36%)',
      ambientSound: 'forest-birds',
      effects: ['Rayons de soleil', 'Feuilles dansantes', 'Brouillard matinal'],
      breathingPattern: 'calm'
    },
    {
      id: 'ocean',
      name: 'Plage Tropicale',
      description: 'Respiration au rythme des vagues sur une plage paradisiaque',
      icon: Waves,
      color: 'hsl(199 89% 48%)',
      ambientSound: 'ocean-waves',
      effects: ['Vagues rythmiques', 'Mouettes', 'Brise marine'],
      breathingPattern: 'balanced'
    },
    {
      id: 'mountain',
      name: 'Sommet Himalaya',
      description: 'Air pur et méditation en altitude avec vue panoramique',
      icon: Mountain,
      color: 'hsl(221.2 83.2% 53.3%)',
      ambientSound: 'mountain-wind',
      effects: ['Nuages flottants', 'Aigle royal', 'Écho des montagnes'],
      breathingPattern: 'energizing'
    },
    {
      id: 'space',
      name: 'Station Spatiale',
      description: 'Respiration en apesanteur avec vue sur la Terre',
      icon: Star,
      color: 'hsl(250 100% 60%)',
      ambientSound: 'space-ambient',
      effects: ['Aurores boréales', 'Satellites', 'Lever de Terre'],
      breathingPattern: 'calm'
    },
    {
      id: 'desert',
      name: 'Désert de Feu',
      description: 'Respiration énergisante dans un désert au coucher du soleil',
      icon: Sunset,
      color: 'hsl(15 100% 60%)',
      ambientSound: 'desert-wind',
      effects: ['Dunes mouvantes', 'Mirage', 'Étoiles filantes'],
      breathingPattern: 'energizing'
    },
    {
      id: 'arctic',
      name: 'Toundra Arctique',
      description: 'Respiration revitalisante dans un paysage glacé immaculé',
      icon: Snowflake,
      color: 'hsl(180 100% 70%)',
      ambientSound: 'arctic-wind',
      effects: ['Aurores boréales', 'Cristaux de glace', 'Renard arctique'],
      breathingPattern: 'balanced'
    }
  ];

  const breathingPatterns = [
    {
      id: 'box',
      name: 'Respiration Carrée',
      description: '4-4-4-4 - Équilibrage du système nerveux',
      inhale: 4,
      hold: 4,
      exhale: 4,
      rest: 4,
      cycles: 10,
      difficulty: 'Facile'
    },
    {
      id: 'calm',
      name: 'Respiration Calmante',
      description: '4-7-8 - Relaxation profonde et réduction du stress',
      inhale: 4,
      hold: 7,
      exhale: 8,
      rest: 0,
      cycles: 8,
      difficulty: 'Moyen'
    },
    {
      id: 'energizing',
      name: 'Respiration Énergisante',
      description: '6-2-6-2 - Boost d\'énergie et de concentration',
      inhale: 6,
      hold: 2,
      exhale: 6,
      rest: 2,
      cycles: 12,
      difficulty: 'Avancé'
    },
    {
      id: 'coherence',
      name: 'Cohérence Cardiaque',
      description: '5-5-5-5 - Synchronisation cœur-cerveau',
      inhale: 5,
      hold: 0,
      exhale: 5,
      rest: 0,
      cycles: 15,
      difficulty: 'Moyen'
    }
  ];

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentSession?.isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSession?.isActive]);

  // Breathing cycle management
  useEffect(() => {
    if (!currentSession?.isActive) return;

    const pattern = breathingPatterns.find(p => p.id === currentSession.pattern);
    if (!pattern) return;

    const totalCycleTime = (pattern.inhale + pattern.hold + pattern.exhale + pattern.rest) * 1000;
    let phaseTimer: NodeJS.Timeout;

    const runCycle = () => {
      let timeElapsed = 0;

      // Inhale phase
      setBreathPhase('inhale');
      setTimeout(() => {
        // Hold phase
        if (pattern.hold > 0) {
          setBreathPhase('hold');
          setTimeout(() => {
            // Exhale phase
            setBreathPhase('exhale');
            setTimeout(() => {
              // Rest phase
              if (pattern.rest > 0) {
                setBreathPhase('rest');
                setTimeout(() => {
                  setCycleCount(prev => {
                    const newCount = prev + 1;
                    if (newCount >= pattern.cycles) {
                      endSession();
                      return 0;
                    }
                    return newCount;
                  });
                }, pattern.rest * 1000);
              } else {
                setCycleCount(prev => {
                  const newCount = prev + 1;
                  if (newCount >= pattern.cycles) {
                    endSession();
                    return 0;
                  }
                  return newCount;
                });
              }
            }, pattern.exhale * 1000);
          }, pattern.hold * 1000);
        } else {
          // No hold phase
          setBreathPhase('exhale');
          setTimeout(() => {
            if (pattern.rest > 0) {
              setBreathPhase('rest');
              setTimeout(() => {
                setCycleCount(prev => prev + 1);
              }, pattern.rest * 1000);
            } else {
              setCycleCount(prev => prev + 1);
            }
          }, pattern.exhale * 1000);
        }
      }, pattern.inhale * 1000);
    };

    phaseTimer = setInterval(runCycle, totalCycleTime);
    runCycle(); // Start immediately

    return () => clearInterval(phaseTimer);
  }, [currentSession, cycleCount]);

  // Biometric simulation
  useEffect(() => {
    if (currentSession?.isActive) {
      const interval = setInterval(() => {
        setBiometrics(prev => ({
          heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.6) * 3)),
          stressLevel: Math.max(0, Math.min(100, prev.stressLevel - Math.random() * 2)),
          oxygenLevel: Math.max(95, Math.min(100, prev.oxygenLevel + (Math.random() - 0.3) * 1)),
          calmScore: Math.max(0, Math.min(100, prev.calmScore + Math.random() * 2))
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentSession?.isActive]);

  // VR visualization
  useEffect(() => {
    if (canvasRef.current && isVRConnected) {
      animateVREnvironment();
    }
  }, [selectedEnvironment, breathPhase, isVRConnected]);

  const startSession = (patternId: string) => {
    const pattern = breathingPatterns.find(p => p.id === patternId);
    if (!pattern) return;

    const session: BreathingSession = {
      id: Date.now().toString(),
      pattern: patternId,
      duration: pattern.cycles * (pattern.inhale + pattern.hold + pattern.exhale + pattern.rest),
      inhaleTime: pattern.inhale,
      holdTime: pattern.hold,
      exhaleTime: pattern.exhale,
      cycles: pattern.cycles,
      isActive: true,
      startTime: Date.now()
    };

    setCurrentSession(session);
    setSessionTime(0);
    setCycleCount(0);
    setBreathPhase('rest');
  };

  const pauseSession = () => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
    }
  };

  const endSession = () => {
    setCurrentSession(null);
    setBreathPhase('rest');
    setCycleCount(0);
    setSessionTime(0);
  };

  const connectVR = async () => {
    setIsCalibrating(true);
    // Simulate VR connection
    setTimeout(() => {
      setIsVRConnected(true);
      setIsCalibrating(false);
    }, 2000);
  };

  const disconnectVR = () => {
    setIsVRConnected(false);
  };

  const animateVREnvironment = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const environment = vrEnvironments.find(env => env.id === selectedEnvironment);
    if (!environment) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient based on environment
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      if (selectedEnvironment === 'forest') {
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(1, '#166534');
      } else if (selectedEnvironment === 'ocean') {
        gradient.addColorStop(0, '#0ea5e9');
        gradient.addColorStop(1, '#0c4a6e');
      } else if (selectedEnvironment === 'mountain') {
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#475569');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Breathing visualization
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 50;
      
      let currentRadius = baseRadius;
      if (breathPhase === 'inhale') {
        currentRadius = baseRadius * 1.5;
      } else if (breathPhase === 'exhale') {
        currentRadius = baseRadius * 0.7;
      }
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 0.8, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (currentSession?.isActive) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (breathPhase) {
      case 'inhale': return 'Inspirez...';
      case 'hold': return 'Retenez...';
      case 'exhale': return 'Expirez...';
      case 'rest': return 'Pause...';
      default: return 'Prêt';
    }
  };

  const getPhaseColor = () => {
    switch (breathPhase) {
      case 'inhale': return 'hsl(142 76% 36%)';
      case 'hold': return 'hsl(45 93% 47%)';
      case 'exhale': return 'hsl(221.2 83.2% 53.3%)';
      case 'rest': return 'hsl(var(--muted-foreground))';
      default: return 'hsl(var(--foreground))';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950 dark:via-background dark:to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
              <Glasses className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              VR Breath Guide
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Respiration guidée en réalité virtuelle avec environnements immersifs thérapeutiques
          </p>
        </motion.div>

        {/* VR Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isVRConnected ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                <Glasses className={`h-6 w-6 ${isVRConnected ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold">
                  {isVRConnected ? 'Casque VR Connecté' : 'Casque VR Déconnecté'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isVRConnected ? 'Expérience immersive activée' : 'Mode 2D disponible'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isVRConnected ? (
                <Button onClick={connectVR} disabled={isCalibrating}>
                  {isCalibrating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Glasses className="h-4 w-4 mr-2" />
                      Connecter VR
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="outline" onClick={disconnectVR}>
                  <Glasses className="h-4 w-4 mr-2" />
                  Déconnecter
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Session Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* VR Environment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-8"
            >
              <div className="text-center space-y-6">
                {/* VR Canvas/Preview */}
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={300}
                    className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl"
                  />
                  {!isVRConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                      <div className="text-center text-white">
                        <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-lg font-semibold">Mode Visualisation 2D</p>
                        <p className="text-sm opacity-75">Connectez un casque VR pour l'expérience complète</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Breathing Guide */}
                {currentSession ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-6xl font-bold mb-2" style={{ color: getPhaseColor() }}>
                        {cycleCount + 1}
                      </div>
                      <div className="text-2xl font-semibold mb-1">
                        {getPhaseText()}
                      </div>
                      <div className="text-lg text-muted-foreground">
                        Cycle {cycleCount + 1} sur {currentSession.cycles}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <Button
                        size="lg"
                        onClick={pauseSession}
                        variant="outline"
                        className="rounded-full p-4"
                      >
                        {currentSession.isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      
                      <Button
                        size="lg"
                        onClick={endSession}
                        variant="destructive"
                        className="rounded-full p-4"
                      >
                        <RotateCcw className="h-6 w-6" />
                      </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      Temps de session: {formatTime(sessionTime)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Wind className="h-16 w-16 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Prêt pour votre session</h3>
                      <p className="text-muted-foreground">
                        Choisissez un environnement et un pattern de respiration pour commencer
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Environment Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Environnements VR</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {vrEnvironments.map((env) => {
                  const Icon = env.icon;
                  return (
                    <Button
                      key={env.id}
                      variant={selectedEnvironment === env.id ? "default" : "outline"}
                      onClick={() => setSelectedEnvironment(env.id)}
                      className="flex-col h-auto py-4 gap-2"
                    >
                      <Icon className="h-6 w-6" style={{ color: env.color }} />
                      <span className="font-semibold">{env.name}</span>
                      <span className="text-xs text-center">{env.description}</span>
                    </Button>
                  );
                })}
              </div>
            </motion.div>

            {/* Breathing Patterns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Patterns de Respiration</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {breathingPatterns.map((pattern) => (
                  <div key={pattern.id} className="p-4 rounded-xl border bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{pattern.name}</h4>
                      <Badge variant="outline">{pattern.difficulty}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pattern.description}
                    </p>
                    <div className="flex justify-between text-xs mb-3">
                      <span>Inspire: {pattern.inhale}s</span>
                      <span>Retient: {pattern.hold}s</span>
                      <span>Expire: {pattern.exhale}s</span>
                      <span>Cycles: {pattern.cycles}</span>
                    </div>
                    <Button
                      onClick={() => startSession(pattern.id)}
                      disabled={!!currentSession}
                      className="w-full"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Démarrer
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Biometric Monitoring */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Monitoring Biométrique</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fréquence Cardiaque</span>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-bold">{Math.round(biometrics.heartRate)} BPM</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Niveau de Stress</span>
                    <span>{Math.round(biometrics.stressLevel)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-red-500"
                      style={{ width: `${biometrics.stressLevel}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Saturation O₂</span>
                  <span className="font-bold text-blue-600">{Math.round(biometrics.oxygenLevel)}%</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score de Calme</span>
                    <span>{Math.round(biometrics.calmScore)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${biometrics.calmScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* VR Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Paramètres VR</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Volume Ambiant</span>
                    <span>{volume}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    onValueChange={([value]) => setVolume(value)}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Niveau d'Immersion</span>
                    <span>{immersionLevel}%</span>
                  </div>
                  <Slider
                    value={[immersionLevel]}
                    onValueChange={([value]) => setImmersionLevel(value)}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Guidage Vocal</span>
                    <span>{guidanceLevel}%</span>
                  </div>
                  <Slider
                    value={[guidanceLevel]}
                    onValueChange={([value]) => setGuidanceLevel(value)}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Retour Haptique</span>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Mode Suivi Oculaire</span>
                  <Switch />
                </div>
              </div>
            </motion.div>

            {/* Session Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Statistiques</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Sessions aujourd'hui</span>
                  <span className="font-medium">4</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Temps total</span>
                  <span className="font-medium">32 min</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Réduction de stress</span>
                  <span className="font-medium text-green-600">-23%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Amélioration calme</span>
                  <span className="font-medium text-blue-600">+18%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Environnement préféré</span>
                  <span className="font-medium">Forêt</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                Voir les progrès
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}