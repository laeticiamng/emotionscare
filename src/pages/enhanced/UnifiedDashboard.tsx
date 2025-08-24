import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Calendar,
  Bell,
  Settings,
  Plus,
  ChevronRight,
  BarChart3,
  BookOpen,
  Sun,
  Moon,
  Cloud,
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Volume2,
  Vibrate,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import ResponsiveWrapper from '@/components/responsive/ResponsiveWrapper';
import { Link } from 'react-router-dom';

interface DashboardStat {
  id: string;
  label: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  path: string;
  deviceOptimized?: 'mobile' | 'tablet' | 'desktop' | 'all';
  requiresPermission?: string[];
}

interface BiometricReading {
  timestamp: number;
  heartRate: number;
  stress: number;
  focus: number;
  energy: number;
  mood: string;
}

const UnifiedDashboard: React.FC = () => {
  const device = useDeviceDetection();
  const { toast } = useToast();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [biometrics, setBiometrics] = useState<BiometricReading>({
    timestamp: Date.now(),
    heartRate: 72,
    stress: 28,
    focus: 85,
    energy: 78,
    mood: 'Positif'
  });
  const [notifications, setNotifications] = useState(3);
  const [weeklyProgress, setWeeklyProgress] = useState(68);

  // Mise à jour temps réel
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulation données biométriques
    const biometricInterval = setInterval(() => {
      setBiometrics(prev => ({
        ...prev,
        timestamp: Date.now(),
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        stress: Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.6) * 5)),
        focus: Math.max(0, Math.min(100, prev.focus + (Math.random() - 0.3) * 3)),
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.4) * 2))
      }));
    }, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(biometricInterval);
    };
  }, []);

  // Statistiques adaptées à l'appareil
  const getDashboardStats = (): DashboardStat[] => {
    const baseStats = [
      {
        id: 'wellness',
        label: 'Score Bien-être',
        value: 87,
        change: '+12%',
        icon: Heart,
        color: 'text-red-500',
        trend: 'up' as const
      },
      {
        id: 'sessions',
        label: device.type === 'mobile' ? 'Sessions' : 'Sessions cette semaine',
        value: 24,
        change: '+8',
        icon: Timer,
        color: 'text-blue-500',
        trend: 'up' as const
      },
      {
        id: 'streak',
        label: 'Série active',
        value: '12j',
        change: 'Record!',
        icon: Zap,
        color: 'text-yellow-500',
        trend: 'stable' as const
      },
      {
        id: 'community',
        label: device.type === 'mobile' ? 'Communauté' : 'Rang communauté',
        value: '#3',
        change: '+2',
        icon: Users,
        color: 'text-green-500',
        trend: 'up' as const
      }
    ];

    // Ajuster selon l'appareil
    if (device.type === 'mobile') {
      return baseStats.slice(0, 2); // Moins d'éléments sur mobile
    } else if (device.type === 'tablet') {
      return baseStats.slice(0, 3);
    }
    return baseStats;
  };

  // Actions rapides adaptées à l'appareil
  const getQuickActions = (): QuickAction[] => {
    const allActions = [
      {
        id: 'scan',
        title: 'Scan Émotionnel',
        description: device.type === 'mobile' ? 'Analyser maintenant' : 'Analysez votre état émotionnel instantanément',
        icon: Brain,
        color: 'from-blue-500 to-cyan-500',
        path: '/scan',
        deviceOptimized: 'all' as const,
        requiresPermission: device.capabilities.hasCamera ? ['camera'] : []
      },
      {
        id: 'voice-note',
        title: device.type === 'mobile' ? 'Note Vocale' : 'Journal Vocal',
        description: device.type === 'mobile' ? 'Parler maintenant' : 'Enregistrez vos pensées instantanément',
        icon: Mic,
        color: 'from-green-500 to-emerald-500',
        path: '/journal',
        deviceOptimized: 'mobile' as const,
        requiresPermission: ['microphone']
      },
      {
        id: 'vr-session',
        title: 'Session VR',
        description: device.type === 'desktop' ? 'Immersion thérapeutique complète' : 'Expérience immersive',
        icon: Camera,
        color: 'from-purple-500 to-violet-500',
        path: '/vr',
        deviceOptimized: 'desktop' as const
      },
      {
        id: 'music-therapy',
        title: 'Musicothérapie',
        description: device.type === 'mobile' ? 'Écouter maintenant' : 'Musique adaptative personnalisée',
        icon: HeadphonesIcon,
        color: 'from-pink-500 to-rose-500',
        path: '/music',
        deviceOptimized: 'all' as const
      },
      {
        id: 'ai-coach',
        title: 'Coach IA',
        description: device.type === 'mobile' ? 'Chat rapide' : 'Conversation avec votre coach virtuel',
        icon: Sparkles,
        color: 'from-orange-500 to-amber-500',
        path: '/coach',
        deviceOptimized: 'all' as const
      },
      {
        id: 'gamification',
        title: device.type === 'mobile' ? 'Défis' : 'Défis Bien-être',
        description: device.type === 'mobile' ? 'Voir défis' : 'Relevez vos défis quotidiens',
        icon: Gamepad2,
        color: 'from-indigo-500 to-blue-500',
        path: '/gamification',
        deviceOptimized: 'all' as const
      }
    ];

    // Filtrer selon l'appareil et les capacités
    return allActions.filter(action => {
      if (action.deviceOptimized !== 'all' && action.deviceOptimized !== device.type) {
        return false;
      }
      if (action.requiresPermission?.includes('camera') && !device.capabilities.hasCamera) {
        return false;
      }
      if (action.requiresPermission?.includes('microphone') && !device.capabilities.hasMicrophone) {
        return false;
      }
      return true;
    });
  };

  // Layout mobile optimisé
  const MobileLayout: React.FC = () => (
    <div className="space-y-4">
      {/* Header mobile avec statut */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">Bonjour ! 👋</h1>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!device.isOnline && <WifiOff className="h-4 w-4 text-red-500" />}
            <Bell className="h-5 w-5 text-primary" />
            {notifications > 0 && (
              <Badge className="absolute -mt-2 -ml-3 px-1.5 py-0.5 text-xs">
                {notifications}
              </Badge>
            )}
          </div>
        </div>

        {/* Biométrie rapide mobile */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-white/50 rounded-lg">
            <Heart className="h-4 w-4 text-red-500 mx-auto mb-1" />
            <div className="text-sm font-bold">{biometrics.heartRate.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">BPM</p>
          </div>
          <div className="text-center p-2 bg-white/50 rounded-lg">
            <Zap className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
            <div className="text-sm font-bold">{biometrics.stress.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Stress</p>
          </div>
          <div className="text-center p-2 bg-white/50 rounded-lg">
            <Target className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <div className="text-sm font-bold">{biometrics.focus.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Focus</p>
          </div>
        </div>
      </motion.div>

      {/* Actions rapides mobile */}
      <div className="grid grid-cols-2 gap-3">
        {getQuickActions().slice(0, 6).map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={action.path}>
                <Card className="h-full hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Progression rapide */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Progression Hebdomadaire</h3>
            <span className="text-sm font-bold">{weeklyProgress}%</span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Excellent ! Vous êtes sur la bonne voie 🎯
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // Layout tablette optimisé
  const TabletLayout: React.FC = () => (
    <div className="space-y-6">
      {/* Header tablette */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Dashboard Personnel
        </h1>
        <p className="text-lg text-muted-foreground">
          {currentTime.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>

      {/* Stats tablette */}
      <div className="grid grid-cols-3 gap-4">
        {getDashboardStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="p-4">
                  <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="mt-1 text-xs">
                    {stat.change}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Biométrie détaillée tablette */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              État Actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Rythme cardiaque
                </span>
                <span className="font-bold">{biometrics.heartRate.toFixed(0)} BPM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Niveau de stress
                </span>
                <span className="font-bold">{biometrics.stress.toFixed(0)}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Focus</span>
                  <span>{biometrics.focus.toFixed(0)}%</span>
                </div>
                <Progress value={biometrics.focus} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Énergie</span>
                  <span>{biometrics.energy.toFixed(0)}%</span>
                </div>
                <Progress value={biometrics.energy} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Recommandées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getQuickActions().slice(0, 4).map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.id} to={action.path}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Layout desktop complet
  const DesktopLayout: React.FC = () => (
    <div className="space-y-8">
      {/* Header desktop */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Dashboard Immersif
          </h1>
          <p className="text-lg text-muted-foreground">
            Bienvenue dans votre espace de bien-être personnalisé - {currentTime.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="px-3 py-1">
            <Monitor className="h-4 w-4 mr-1" />
            Mode Desktop
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Personnaliser
          </Button>
        </div>
      </motion.div>

      {/* Stats desktop */}
      <div className="grid grid-cols-4 gap-6">
        {getDashboardStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'}>
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Contenu principal desktop */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Actions principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {getQuickActions().map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to={action.path}>
                        <Card className="h-full group cursor-pointer hover:shadow-lg transition-all">
                          <CardContent className="p-6">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Biométrie avancée */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Monitoring Biométrique Temps Réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Rythme cardiaque
                    </span>
                    <span className="text-xl font-bold">{biometrics.heartRate.toFixed(0)} BPM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Niveau de stress
                    </span>
                    <span className="text-xl font-bold">{biometrics.stress.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        Focus
                      </span>
                      <span>{biometrics.focus.toFixed(0)}%</span>
                    </div>
                    <Progress value={biometrics.focus} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Énergie
                      </span>
                      <span>{biometrics.energy.toFixed(0)}%</span>
                    </div>
                    <Progress value={biometrics.energy} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* Recommandations IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                IA Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium">Méditation suggérée</p>
                  <p className="text-xs text-muted-foreground">Votre stress est légèrement élevé. 10 min de méditation recommandées.</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium">Objectif atteint</p>
                  <p className="text-xs text-muted-foreground">Félicitations ! Vous avez maintenu votre série de 12 jours.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progression */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objectifs hebdomadaires</span>
                    <span>{weeklyProgress}%</span>
                  </div>
                  <Progress value={weeklyProgress} className="h-3" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+12%</div>
                  <p className="text-xs text-muted-foreground">vs semaine dernière</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infos appareil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {device.type === 'mobile' ? <Smartphone className="h-5 w-5" /> :
                 device.type === 'tablet' ? <Tablet className="h-5 w-5" /> :
                 <Monitor className="h-5 w-5" />}
                Informations Appareil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Type</span>
                  <Badge variant="secondary" className="capitalize">{device.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Plateforme</span>
                  <Badge variant="outline" className="capitalize">{device.platform}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Connexion</span>
                  <div className="flex items-center gap-1">
                    {device.isOnline ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
                    <span className={device.isOnline ? 'text-green-600' : 'text-red-600'}>
                      {device.isOnline ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Écran</span>
                  <span>{device.screenSize.width}×{device.screenSize.height}</span>
                </div>
                <div className="flex justify-between">
                  <span>Orientation</span>
                  <Badge variant="outline" className="capitalize">{device.orientation}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20">
      <ResponsiveWrapper
        mobileLayout={<MobileLayout />}
        tabletLayout={<TabletLayout />}
        desktopLayout={<DesktopLayout />}
        enableGestures={device.isTouchDevice}
        enableVibration={device.type === 'mobile'}
        className="container mx-auto"
      />
    </div>
  );
};

export default UnifiedDashboard;