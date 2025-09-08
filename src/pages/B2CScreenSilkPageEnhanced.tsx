import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Monitor, 
  Eye, 
  Clock, 
  Timer,
  Pause,
  Play,
  Settings,
  Smartphone,
  Laptop,
  Tablet,
  Tv,
  Sun,
  Moon,
  Lightbulb,
  Activity,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Zap,
  RefreshCw,
  Calendar,
  Target
} from 'lucide-react';

interface ScreenTimeData {
  device: string;
  todayMinutes: number;
  weeklyAverage: number;
  dailyLimit: number;
  eyeStrainLevel: number;
  breaksNeeded: number;
  lastBreak: string;
}

interface BreakSession {
  id: string;
  type: 'micro' | 'short' | 'long';
  duration: number;
  exercises: string[];
  completed: boolean;
  timestamp: string;
}

interface EyeCareSettings {
  autoBreakReminders: boolean;
  breakInterval: number; // minutes
  nightModeSchedule: boolean;
  bluelightFilter: number; // 0-100
  screenDistanceAlert: boolean;
  blinkReminder: boolean;
}

export default function B2CScreenSilkPageEnhanced() {
  const [isActive, setIsActive] = useState(false);
  const [timeUntilBreak, setTimeUntilBreak] = useState(1200); // 20 minutes in seconds
  const [currentSession, setCurrentSession] = useState<BreakSession | null>(null);
  const [eyeStrainLevel, setEyeStrainLevel] = useState(35);
  const [blinkRate, setBlinkRate] = useState(18); // blinks per minute
  const [settings, setSettings] = useState<EyeCareSettings>({
    autoBreakReminders: true,
    breakInterval: 20,
    nightModeSchedule: true,
    bluelightFilter: 60,
    screenDistanceAlert: true,
    blinkReminder: true
  });

  const [screenData] = useState<ScreenTimeData[]>([
    {
      device: 'Ordinateur Principal',
      todayMinutes: 340,
      weeklyAverage: 385,
      dailyLimit: 480,
      eyeStrainLevel: 65,
      breaksNeeded: 3,
      lastBreak: '14:30'
    },
    {
      device: 'Smartphone',
      todayMinutes: 125,
      weeklyAverage: 98,
      dailyLimit: 120,
      eyeStrainLevel: 40,
      breaksNeeded: 1,
      lastBreak: '16:45'
    },
    {
      device: 'Tablette',
      todayMinutes: 45,
      weeklyAverage: 52,
      dailyLimit: 90,
      eyeStrainLevel: 20,
      breaksNeeded: 0,
      lastBreak: '12:15'
    }
  ]);

  const breakTypes = [
    {
      type: 'micro' as const,
      name: 'Micro-pause',
      duration: 30,
      description: 'Pause rapide de 30 secondes',
      exercises: ['Clignement des yeux', 'Regard au loin', 'Étirement du cou'],
      icon: Zap,
      color: 'hsl(45 93% 47%)'
    },
    {
      type: 'short' as const,
      name: 'Pause courte',
      duration: 300,
      description: 'Pause de 5 minutes pour les yeux',
      exercises: ['Exercice 20-20-20', 'Massage oculaire', 'Hydratation', 'Étirements'],
      icon: Eye,
      color: 'hsl(221.2 83.2% 53.3%)'
    },
    {
      type: 'long' as const,
      name: 'Pause longue',
      duration: 900,
      description: 'Pause complète de 15 minutes',
      exercises: ['Marche', 'Exercices oculaires', 'Relaxation', 'Hydratation', 'Étirements complets'],
      icon: RefreshCw,
      color: 'hsl(142 76% 36%)'
    }
  ];

  // Timer countdown
  useEffect(() => {
    if (isActive && timeUntilBreak > 0) {
      const interval = setInterval(() => {
        setTimeUntilBreak(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, timeUntilBreak]);

  // Simulated eye strain monitoring
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setEyeStrainLevel(prev => Math.min(100, prev + Math.random() * 2));
        setBlinkRate(prev => Math.max(10, prev + (Math.random() - 0.5) * 2));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHoursMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getEyeStrainStatus = (level: number) => {
    if (level < 30) return { status: 'Excellent', color: 'hsl(142 76% 36%)', icon: CheckCircle };
    if (level < 60) return { status: 'Modéré', color: 'hsl(45 93% 47%)', icon: AlertTriangle };
    return { status: 'Élevé', color: 'hsl(0 84.2% 60.2%)', icon: AlertTriangle };
  };

  const startBreakSession = (type: 'micro' | 'short' | 'long') => {
    const breakType = breakTypes.find(b => b.type === type);
    if (!breakType) return;

    const session: BreakSession = {
      id: Date.now().toString(),
      type,
      duration: breakType.duration,
      exercises: breakType.exercises,
      completed: false,
      timestamp: new Date().toISOString()
    };

    setCurrentSession(session);
    setTimeUntilBreak(settings.breakInterval * 60);
  };

  const completeBreakSession = () => {
    setCurrentSession(null);
    setEyeStrainLevel(prev => Math.max(0, prev - 20));
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('Ordinateur')) return Laptop;
    if (device.includes('Smartphone')) return Smartphone;
    if (device.includes('Tablette')) return Tablet;
    return Monitor;
  };

  const strainStatus = getEyeStrainStatus(eyeStrainLevel);
  const StrainIcon = strainStatus.icon;

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-blue-950 dark:via-background dark:to-green-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 backdrop-blur-sm">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Screen Silk Break
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Protection intelligente des yeux avec rappels personnalisés et exercices guidés
          </p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-8 text-center"
        >
          {!currentSession ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className={`p-4 rounded-2xl ${isActive ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                  <StrainIcon className="h-12 w-12" style={{ color: strainStatus.color }} />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold">
                    {isActive ? formatTime(timeUntilBreak) : "Inactif"}
                  </div>
                  <div className="text-muted-foreground">
                    {isActive ? "Prochaine pause" : "Démarrer le monitoring"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: strainStatus.color }}>
                    {eyeStrainLevel}%
                  </div>
                  <div className="text-sm text-muted-foreground">Fatigue Oculaire</div>
                  <Badge style={{ backgroundColor: strainStatus.color, color: 'white' }}>
                    {strainStatus.status}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {blinkRate}
                  </div>
                  <div className="text-sm text-muted-foreground">Clignements/min</div>
                  <Badge variant={blinkRate < 15 ? "destructive" : "secondary"}>
                    {blinkRate < 15 ? "Faible" : "Normal"}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {screenData.reduce((acc, screen) => acc + screen.breaksNeeded, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Pauses recommandées</div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setIsActive(!isActive)}
                className={`px-8 py-4 ${
                  isActive 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Arrêter le monitoring
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Démarrer le monitoring
                  </>
                )}
              </Button>

              {timeUntilBreak === 0 && isActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 bg-orange-50 dark:bg-orange-950 rounded-2xl border-2 border-orange-200 dark:border-orange-800"
                >
                  <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-4">
                    ⏰ Il est temps de faire une pause !
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {breakTypes.map((breakType) => {
                      const Icon = breakType.icon;
                      return (
                        <Button
                          key={breakType.type}
                          onClick={() => startBreakSession(breakType.type)}
                          variant="outline"
                          className="flex-col h-auto py-4 gap-2"
                        >
                          <Icon className="h-6 w-6" style={{ color: breakType.color }} />
                          <span className="font-semibold">{breakType.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {breakType.duration < 60 ? `${breakType.duration}s` : `${breakType.duration / 60}min`}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <BreakSessionComponent
              session={currentSession}
              onComplete={completeBreakSession}
              onSkip={() => setCurrentSession(null)}
            />
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Screen Time Monitoring */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Temps d'écran par appareil</h3>
              <div className="space-y-4">
                {screenData.map((screen, index) => {
                  const DeviceIcon = getDeviceIcon(screen.device);
                  const usagePercentage = (screen.todayMinutes / screen.dailyLimit) * 100;
                  
                  return (
                    <motion.div
                      key={screen.device}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 rounded-xl bg-card border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <DeviceIcon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{screen.device}</span>
                        </div>
                        <Badge variant={usagePercentage > 90 ? "destructive" : "secondary"}>
                          {formatHoursMinutes(screen.todayMinutes)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilisation aujourd'hui</span>
                          <span>{Math.round(usagePercentage)}% de la limite</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              usagePercentage > 90 ? 'bg-red-500' : 
                              usagePercentage > 75 ? 'bg-orange-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, usagePercentage)}%` }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-muted-foreground">
                          <div>
                            Moyenne: {formatHoursMinutes(screen.weeklyAverage)}
                          </div>
                          <div>
                            Fatigue: {screen.eyeStrainLevel}%
                          </div>
                          <div>
                            Dernière pause: {screen.lastBreak}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Break Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Exercices recommandés</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Règle 20-20-20",
                    description: "Regardez un objet à 20 pieds pendant 20 secondes toutes les 20 minutes",
                    icon: Eye,
                    color: "hsl(221.2 83.2% 53.3%)"
                  },
                  {
                    title: "Clignements contrôlés",
                    description: "Clignez lentement 10 fois pour humidifier vos yeux",
                    icon: RefreshCw,
                    color: "hsl(142 76% 36%)"
                  },
                  {
                    title: "Étirements du cou",
                    description: "Bougez doucement votre tête de gauche à droite",
                    icon: Activity,
                    color: "hsl(45 93% 47%)"
                  }
                ].map((exercise, index) => {
                  const Icon = exercise.icon;
                  return (
                    <div key={index} className="p-4 rounded-xl bg-card border text-center">
                      <Icon className="h-8 w-8 mx-auto mb-3" style={{ color: exercise.color }} />
                      <h4 className="font-semibold mb-2">{exercise.title}</h4>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Settings & Controls */}
          <div className="space-y-6">
            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Paramètres</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rappels automatiques</span>
                  <Switch
                    checked={settings.autoBreakReminders}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, autoBreakReminders: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Intervalle de pause</span>
                    <span>{settings.breakInterval} min</span>
                  </div>
                  <Slider
                    value={[settings.breakInterval]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({ ...prev, breakInterval: value }))
                    }
                    min={10}
                    max={60}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Filtre lumière bleue</span>
                    <span>{settings.bluelightFilter}%</span>
                  </div>
                  <Slider
                    value={[settings.bluelightFilter]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({ ...prev, bluelightFilter: value }))
                    }
                    min={0}
                    max={100}
                    step={10}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Mode nuit programmé</span>
                  <Switch
                    checked={settings.nightModeSchedule}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, nightModeSchedule: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Alerte distance écran</span>
                  <Switch
                    checked={settings.screenDistanceAlert}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, screenDistanceAlert: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Rappel de clignement</span>
                  <Switch
                    checked={settings.blinkReminder}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, blinkReminder: checked }))
                    }
                  />
                </div>
              </div>
            </motion.div>

            {/* Daily Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Progrès Quotidien</h3>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">7</div>
                  <div className="text-sm text-muted-foreground">Pauses effectuées</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">-18%</div>
                    <div className="text-xs text-muted-foreground">Fatigue oculaire</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">+25%</div>
                    <div className="text-xs text-muted-foreground">Clignements</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objectif pauses</span>
                    <span>7/8</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '87.5%' }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-3">
                {breakTypes.map((breakType) => {
                  const Icon = breakType.icon;
                  return (
                    <Button
                      key={breakType.type}
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => startBreakSession(breakType.type)}
                    >
                      <Icon className="h-4 w-4" style={{ color: breakType.color }} />
                      <span>{breakType.name}</span>
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Break Session Component
function BreakSessionComponent({ 
  session, 
  onComplete, 
  onSkip 
}: { 
  session: BreakSession;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(session.duration);
  const [currentExercise, setCurrentExercise] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((session.duration - timeLeft) / session.duration) * 100;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {session.type === 'micro' ? 'Micro-pause' : 
           session.type === 'short' ? 'Pause courte' : 
           'Pause longue'}
        </h2>
        <div className="text-4xl font-bold text-primary mb-4">
          {formatTime(timeLeft)}
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Exercice en cours:</h3>
        <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-2xl">
          <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300">
            {session.exercises[currentExercise]}
          </h4>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            {currentExercise + 1} sur {session.exercises.length}
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => setCurrentExercise((prev) => 
            prev < session.exercises.length - 1 ? prev + 1 : 0
          )}
        >
          Exercice suivant
        </Button>
        
        <Button variant="destructive" onClick={onSkip}>
          Ignorer la pause
        </Button>
        
        <Button onClick={onComplete}>
          Terminer maintenant
        </Button>
      </div>
    </motion.div>
  );
}