import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw,
  Heart,
  Brain,
  Waves,
  Timer,
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  Award,
  TrendingUp,
  Moon,
  Sun,
  Zap,
  Flower2,
  Mountain,
  Compass,
  Target,
  BarChart3
} from 'lucide-react';

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold1?: number;
    exhale: number;
    hold2?: number;
  };
  cycles: number;
  benefits: string[];
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  icon: React.ComponentType<any>;
  color: string;
  purpose: 'relaxation' | 'énergie' | 'focus' | 'sommeil';
}

interface BiometricData {
  heartRate: number;
  heartRateVariability: number;
  stressLevel: number;
  oxygenSaturation: number;
  coherenceLevel: number;
  calmness: number;
}

interface SessionStats {
  duration: number;
  cyclesCompleted: number;
  avgHeartRate: number;
  stressReduction: number;
  coherenceImprovement: number;
  technique: string;
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Respiration Carrée',
    description: 'Technique équilibrante pour réduire le stress et améliorer la concentration',
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    cycles: 8,
    benefits: ['Réduction du stress', 'Amélioration de la concentration', 'Équilibrage du système nerveux'],
    difficulty: 'débutant',
    icon: Target,
    color: 'from-blue-400 to-blue-600',
    purpose: 'focus'
  },
  {
    id: 'calm',
    name: '4-7-8 Relaxation',
    description: 'Technique puissante pour l\'apaisement et l\'endormissement',
    pattern: { inhale: 4, hold1: 7, exhale: 8 },
    cycles: 6,
    benefits: ['Endormissement rapide', 'Apaisement profond', 'Réduction de l\'anxiété'],
    difficulty: 'intermédiaire',
    icon: Moon,
    color: 'from-purple-400 to-indigo-600',
    purpose: 'sommeil'
  },
  {
    id: 'energy',
    name: 'Respiration Énergisante',
    description: 'Technique dynamique pour augmenter l\'énergie et la vitalité',
    pattern: { inhale: 2, exhale: 2 },
    cycles: 20,
    benefits: ['Boost d\'énergie', 'Amélioration de l\'humeur', 'Revitalisation'],
    difficulty: 'avancé',
    icon: Sun,
    color: 'from-orange-400 to-red-500',
    purpose: 'énergie'
  },
  {
    id: 'coherence',
    name: 'Cohérence Cardiaque',
    description: 'Technique de régulation pour optimiser la variabilité cardiaque',
    pattern: { inhale: 5, exhale: 5 },
    cycles: 12,
    benefits: ['Cohérence cardiaque', 'Équilibre émotionnel', 'Résilience au stress'],
    difficulty: 'débutant',
    icon: Heart,
    color: 'from-pink-400 to-rose-600',
    purpose: 'relaxation'
  },
  {
    id: 'mountain',
    name: 'Respiration des Sommets',
    description: 'Technique d\'altitude pour développer la capacité pulmonaire',
    pattern: { inhale: 6, hold1: 2, exhale: 8, hold2: 2 },
    cycles: 10,
    benefits: ['Capacité pulmonaire', 'Endurance', 'Clarté mentale'],
    difficulty: 'avancé',
    icon: Mountain,
    color: 'from-slate-400 to-gray-600',
    purpose: 'focus'
  },
  {
    id: 'ocean',
    name: 'Vague Océanique',
    description: 'Technique fluide inspirée du mouvement des vagues',
    pattern: { inhale: 3, hold1: 1, exhale: 6, hold2: 1 },
    cycles: 15,
    benefits: ['Fluidité mentale', 'Lâcher-prise', 'Connexion naturelle'],
    difficulty: 'intermédiaire',
    icon: Waves,
    color: 'from-cyan-400 to-blue-500',
    purpose: 'relaxation'
  }
];

export default function B2CBreathworkEnhanced() {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    heartRateVariability: 45,
    stressLevel: 60,
    oxygenSaturation: 98,
    coherenceLevel: 0,
    calmness: 50
  });
  const [sessionStats, setSessionStats] = useState<SessionStats[]>([]);
  const [showStats, setShowStats] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const sessionTimerRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation de respiration visuelle
  useEffect(() => {
    if (!canvasRef.current || !selectedTechnique || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Cercle de respiration principal
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 80;
      
      // Calcul de la taille basée sur la phase
      let sizeMultiplier = 1;
      if (currentPhase === 'inhale') {
        sizeMultiplier = 1 + 0.5 * (1 - phaseTimeLeft / (selectedTechnique.pattern.inhale * 1000));
      } else if (currentPhase === 'exhale') {
        sizeMultiplier = 1.5 - 0.5 * (1 - phaseTimeLeft / (selectedTechnique.pattern.exhale * 1000));
      } else {
        sizeMultiplier = currentPhase === 'hold1' ? 1.5 : 1;
      }
      
      const radius = baseRadius * sizeMultiplier;
      
      // Gradient basé sur la technique
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      if (selectedTechnique.purpose === 'relaxation') {
        gradient.addColorStop(0, 'rgba(147, 197, 253, 0.8)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
      } else if (selectedTechnique.purpose === 'énergie') {
        gradient.addColorStop(0, 'rgba(251, 146, 60, 0.8)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)');
      } else if (selectedTechnique.purpose === 'focus') {
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0.2)');
      } else {
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
        gradient.addColorStop(1, 'rgba(109, 40, 217, 0.2)');
      }
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Cercles d'onde concentriques
      for (let i = 1; i <= 3; i++) {
        const waveRadius = radius + i * 30 + Math.sin(time + i) * 10;
        const opacity = 0.3 - i * 0.1;
        
        ctx.strokeStyle = selectedTechnique.purpose === 'relaxation' 
          ? `rgba(59, 130, 246, ${opacity})`
          : selectedTechnique.purpose === 'énergie'
          ? `rgba(239, 68, 68, ${opacity})`
          : `rgba(147, 51, 234, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Texte de la phase
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let phaseText = '';
      switch (currentPhase) {
        case 'inhale': phaseText = 'INSPIREZ'; break;
        case 'hold1': phaseText = 'RETENEZ'; break;
        case 'exhale': phaseText = 'EXPIREZ'; break;
        case 'hold2': phaseText = 'PAUSE'; break;
      }
      
      ctx.fillText(phaseText, centerX, centerY - 10);
      
      // Compteur
      ctx.font = '16px system-ui';
      ctx.fillText(`${Math.ceil(phaseTimeLeft / 1000)}`, centerX, centerY + 20);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [selectedTechnique, isActive, currentPhase, phaseTimeLeft]);

  // Gestion du timer de respiration
  useEffect(() => {
    if (!isActive || !selectedTechnique) return;

    timerRef.current = setInterval(() => {
      setPhaseTimeLeft(prev => {
        if (prev <= 100) {
          // Passer à la phase suivante
          setCurrentPhase(currentPhase => {
            let nextPhase: typeof currentPhase = 'inhale';
            
            switch (currentPhase) {
              case 'inhale':
                nextPhase = selectedTechnique.pattern.hold1 ? 'hold1' : 'exhale';
                break;
              case 'hold1':
                nextPhase = 'exhale';
                break;
              case 'exhale':
                if (selectedTechnique.pattern.hold2) {
                  nextPhase = 'hold2';
                } else {
                  nextPhase = 'inhale';
                  setCurrentCycle(prev => prev + 1);
                }
                break;
              case 'hold2':
                nextPhase = 'inhale';
                setCurrentCycle(prev => prev + 1);
                break;
            }
            
            return nextPhase;
          });
          
          // Déterminer la durée de la prochaine phase
          const nextDuration = (() => {
            switch (currentPhase) {
              case 'inhale': return selectedTechnique.pattern.hold1 || selectedTechnique.pattern.exhale;
              case 'hold1': return selectedTechnique.pattern.exhale;
              case 'exhale': return selectedTechnique.pattern.hold2 || selectedTechnique.pattern.inhale;
              case 'hold2': return selectedTechnique.pattern.inhale;
              default: return selectedTechnique.pattern.inhale;
            }
          })();
          
          return nextDuration * 1000;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, selectedTechnique, currentPhase]);

  // Timer de session
  useEffect(() => {
    if (isActive) {
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }
    
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isActive]);

  // Simulation des données biométriques
  useEffect(() => {
    if (isActive && selectedTechnique) {
      const interval = setInterval(() => {
        setBiometrics(prev => {
          const improvement = Math.min(sessionTime / 60, 10) * 0.02; // Amélioration progressive
          
          return {
            heartRate: Math.max(60, prev.heartRate + (Math.random() - 0.6) * 1),
            heartRateVariability: Math.min(100, prev.heartRateVariability + improvement * 10),
            stressLevel: Math.max(0, prev.stressLevel - improvement * 5),
            oxygenSaturation: Math.min(100, prev.oxygenSaturation + improvement * 0.5),
            coherenceLevel: Math.min(100, prev.coherenceLevel + improvement * 8),
            calmness: Math.min(100, prev.calmness + improvement * 6)
          };
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive, selectedTechnique, sessionTime]);

  // Vérification de fin de session
  useEffect(() => {
    if (selectedTechnique && currentCycle >= selectedTechnique.cycles) {
      stopSession();
    }
  }, [currentCycle, selectedTechnique]);

  const startSession = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    setIsActive(true);
    setCurrentPhase('inhale');
    setCurrentCycle(0);
    setPhaseTimeLeft(technique.pattern.inhale * 1000);
    setSessionTime(0);
    setBiometrics({
      heartRate: 75,
      heartRateVariability: 45,
      stressLevel: 60,
      oxygenSaturation: 98,
      coherenceLevel: 0,
      calmness: 50
    });
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const stopSession = () => {
    setIsActive(false);
    
    if (selectedTechnique && sessionTime > 0) {
      const stats: SessionStats = {
        duration: sessionTime,
        cyclesCompleted: currentCycle,
        avgHeartRate: biometrics.heartRate,
        stressReduction: 60 - biometrics.stressLevel,
        coherenceImprovement: biometrics.coherenceLevel,
        technique: selectedTechnique.name
      };
      setSessionStats(prev => [...prev, stats]);
    }
    
    setSelectedTechnique(null);
    setCurrentCycle(0);
    setSessionTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'débutant': return 'bg-green-100 text-green-800';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'relaxation': return 'bg-blue-100 text-blue-800';
      case 'énergie': return 'bg-orange-100 text-orange-800';
      case 'focus': return 'bg-purple-100 text-purple-800';
      case 'sommeil': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-500">
              <Wind className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Breathwork Thérapeutique
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Maîtrisez l'art de la respiration consciente avec des techniques scientifiquement prouvées
          </p>
        </motion.div>

        {!selectedTechnique ? (
          /* Sélection des techniques */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breathingTechniques.map((technique, index) => {
              const Icon = technique.icon;
              return (
                <motion.div
                  key={technique.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-sky-300">
                    <div className={`h-48 bg-gradient-to-br ${technique.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={getDifficultyColor(technique.difficulty)}>
                          {technique.difficulty}
                        </Badge>
                        <Badge className={getPurposeColor(technique.purpose)}>
                          {technique.purpose}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Icon className="w-12 h-12 text-white/80" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => startSession(technique)}
                          className="bg-white/90 text-gray-800 hover:bg-white border-0 shadow-lg"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Commencer
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{technique.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{technique.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{technique.cycles} cycles</span>
                        <span>
                          {technique.pattern.inhale}
                          {technique.pattern.hold1 && `-${technique.pattern.hold1}`}
                          -{technique.pattern.exhale}
                          {technique.pattern.hold2 && `-${technique.pattern.hold2}`}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Bienfaits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {technique.benefits.slice(0, 2).map(benefit => (
                            <Badge key={benefit} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                          {technique.benefits.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{technique.benefits.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Interface de session */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Visualisation principale */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-sky-300 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">{selectedTechnique.name}</h2>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <span>Cycle {currentCycle} / {selectedTechnique.cycles}</span>
                        <span>{formatTime(sessionTime)}</span>
                      </div>
                    </div>
                    
                    <div className="relative mb-8">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={300}
                        className="w-full max-w-md mx-auto block"
                      />
                    </div>
                    
                    <div className="flex justify-center gap-4 mb-6">
                      {!isActive ? (
                        <Button
                          onClick={resumeSession}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {sessionTime === 0 ? 'Commencer' : 'Reprendre'}
                        </Button>
                      ) : (
                        <Button
                          onClick={pauseSession}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button variant="outline" onClick={stopSession}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Arrêter
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-blue-600">Inspir</div>
                          <div>{selectedTechnique.pattern.inhale}s</div>
                        </div>
                        {selectedTechnique.pattern.hold1 && (
                          <div>
                            <div className="font-bold text-purple-600">Retenir</div>
                            <div>{selectedTechnique.pattern.hold1}s</div>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-red-600">Expir</div>
                          <div>{selectedTechnique.pattern.exhale}s</div>
                        </div>
                        {selectedTechnique.pattern.hold2 && (
                          <div>
                            <div className="font-bold text-gray-600">Pause</div>
                            <div>{selectedTechnique.pattern.hold2}s</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Progression */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-sky-500" />
                      Progression de la Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Cycles complétés</span>
                          <span className="text-sm text-gray-600">
                            {currentCycle} / {selectedTechnique.cycles}
                          </span>
                        </div>
                        <Progress 
                          value={(currentCycle / selectedTechnique.cycles) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-sky-600">{formatTime(sessionTime)}</div>
                          <div className="text-xs text-gray-500">Durée totale</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(biometrics.coherenceLevel)}%
                          </div>
                          <div className="text-xs text-gray-500">Cohérence</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(biometrics.calmness)}%
                          </div>
                          <div className="text-xs text-gray-500">Sérénité</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Panneau de contrôle et statistiques */}
            <div className="space-y-6">
              {/* Données biométriques en temps réel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Biométrie Temps Réel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Rythme cardiaque', value: Math.round(biometrics.heartRate), unit: 'bpm', icon: Heart, color: 'red' },
                      { label: 'VRC', value: Math.round(biometrics.heartRateVariability), unit: 'pts', icon: BarChart3, color: 'blue' },
                      { label: 'Niveau de stress', value: Math.round(biometrics.stressLevel), unit: '%', icon: Brain, color: 'orange', inverted: true },
                      { label: 'Saturation O2', value: biometrics.oxygenSaturation.toFixed(1), unit: '%', icon: Wind, color: 'green' },
                      { label: 'Cohérence', value: Math.round(biometrics.coherenceLevel), unit: '%', icon: Waves, color: 'purple' },
                      { label: 'Sérénité', value: Math.round(biometrics.calmness), unit: '%', icon: Flower2, color: 'pink' }
                    ].map(({ label, value, unit, icon: Icon, color, inverted }) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 text-${color}-500`} />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <span className="text-sm font-bold">{value}{unit}</span>
                        </div>
                        <Progress 
                          value={inverted ? 100 - Number(value) : Number(value)} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Contrôles audio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-500" />
                    Contrôles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Son d'ambiance
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="flex-1 accent-sky-500"
                      />
                      <span className="text-sm text-gray-600 min-w-[3ch]">{isMuted ? 0 : volume}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Sons disponibles
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Océan', 'Forêt', 'Pluie', 'Bol tibétain'].map(sound => (
                        <Button key={sound} variant="outline" size="sm" className="text-xs">
                          {sound}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedTechnique(null)}
                    variant="outline"
                    className="w-full"
                  >
                    Changer de technique
                  </Button>
                </CardContent>
              </Card>
              
              {/* Dernières sessions */}
              {sessionStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Historique ({sessionStats.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sessionStats.slice(-3).reverse().map((stats, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{stats.technique}</span>
                            <Badge variant="outline" className="text-xs">
                              {formatTime(stats.duration)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>Cycles: {stats.cyclesCompleted}</div>
                            <div>RC moy: {Math.round(stats.avgHeartRate)}</div>
                            <div>Stress: -{Math.round(stats.stressReduction)}%</div>
                            <div>Cohérence: +{Math.round(stats.coherenceImprovement)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {sessionStats.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowStats(true)}
                        className="w-full mt-3"
                      >
                        Voir tout l'historique
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}