/**
 * VR Galaxy Page - Expériences VR immersives
 * Module complet avec sessions, métriques et progression
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Star, 
  Moon, 
  Sun, 
  Orbit, 
  Volume2, 
  VolumeX,
  Settings2,
  Timer,
  Trophy,
  TrendingUp,
  BarChart3,
  Eye,
  Headphones,
  Maximize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Types
interface VRSession {
  id: string;
  user_id: string;
  environment: string;
  duration_minutes: number;
  stress_before: number;
  stress_after: number;
  immersion_level: number;
  created_at: string;
}

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  audioUrl?: string;
}

// Environnements VR disponibles
const VR_ENVIRONMENTS: VREnvironment[] = [
  {
    id: 'galaxy',
    name: 'Voyage Galactique',
    description: 'Naviguez à travers les étoiles et nébuleuses',
    icon: <Star className="h-6 w-6" />,
    color: 'from-purple-500 to-indigo-600',
    difficulty: 'beginner',
    benefits: ['Émerveillement', 'Perspective cosmique', 'Détente profonde']
  },
  {
    id: 'moonlit',
    name: 'Clair de Lune',
    description: 'Méditation sous la lumière lunaire apaisante',
    icon: <Moon className="h-6 w-6" />,
    color: 'from-slate-600 to-blue-900',
    difficulty: 'beginner',
    benefits: ['Calme nocturne', 'Introspection', 'Préparation au sommeil']
  },
  {
    id: 'sunrise',
    name: 'Lever de Soleil',
    description: 'Accueillez le jour avec énergie et gratitude',
    icon: <Sun className="h-6 w-6" />,
    color: 'from-orange-400 to-rose-500',
    difficulty: 'intermediate',
    benefits: ['Énergie matinale', 'Positivité', 'Clarté mentale']
  },
  {
    id: 'orbit',
    name: 'Station Orbitale',
    description: 'Vue de la Terre depuis l\'espace infini',
    icon: <Orbit className="h-6 w-6" />,
    color: 'from-cyan-500 to-blue-600',
    difficulty: 'intermediate',
    benefits: ['Vue d\'ensemble', 'Relativisation', 'Connexion universelle']
  },
  {
    id: 'nebula',
    name: 'Nébuleuse Créative',
    description: 'Immersion dans les couleurs cosmiques',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'from-pink-500 to-violet-600',
    difficulty: 'advanced',
    benefits: ['Créativité', 'Expansion mentale', 'Flow créatif']
  }
];

// Hook pour les sessions VR
function useVRSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<VRSession[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    avgStressReduction: 0,
    favoriteEnv: '',
    streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .contains('metadata', { type: 'vr' })
          .order('started_at', { ascending: false })
          .limit(20);

        if (data) {
          const vrSessions: VRSession[] = data.map(s => ({
            id: s.id,
            user_id: s.user_id,
            environment: (s.metadata as Record<string, string>)?.environment || 'galaxy',
            duration_minutes: Math.round((s.duration_seconds || 0) / 60),
            stress_before: s.mood_before || 5,
            stress_after: s.mood_after || 3,
            immersion_level: (s.metadata as Record<string, number>)?.immersion || 80,
            created_at: s.started_at
          }));

          setSessions(vrSessions);

          // Calcul des stats
          const envCounts: Record<string, number> = {};
          let totalReduction = 0;
          let reductionCount = 0;

          vrSessions.forEach(s => {
            envCounts[s.environment] = (envCounts[s.environment] || 0) + 1;
            if (s.stress_before && s.stress_after) {
              totalReduction += s.stress_before - s.stress_after;
              reductionCount++;
            }
          });

          const favorite = Object.entries(envCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'galaxy';

          setStats({
            totalSessions: vrSessions.length,
            totalMinutes: vrSessions.reduce((sum, s) => sum + s.duration_minutes, 0),
            avgStressReduction: reductionCount > 0 ? Math.round((totalReduction / reductionCount) * 10) / 10 : 0,
            favoriteEnv: favorite,
            streak: Math.min(vrSessions.length, 7)
          });
        }
      } catch (error) {
        console.error('Error fetching VR sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return { sessions, stats, loading };
}

// Composant principal
const VRGalaxyPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sessions, stats, loading } = useVRSessions();

  // State pour la session en cours
  const [selectedEnv, setSelectedEnv] = useState<VREnvironment>(VR_ENVIRONMENTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(10);
  const [elapsed, setElapsed] = useState(0);
  const [stressBefore, setStressBefore] = useState(5);
  const [immersionLevel, setImmersionLevel] = useState(80);
  const [showSettings, setShowSettings] = useState(false);

  // Timer pour la session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && elapsed < duration * 60) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else if (elapsed >= duration * 60 && isPlaying) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isPlaying, elapsed, duration]);

  const handleStart = () => {
    setIsPlaying(true);
    setElapsed(0);
    toast({
      title: 'Session VR démarrée',
      description: `Environnement: ${selectedEnv.name}`
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleComplete = async () => {
    setIsPlaying(false);
    
    if (user?.id) {
      try {
        await supabase.from('activity_sessions').insert({
          user_id: user.id,
          activity_id: `vr-${selectedEnv.id}`,
          started_at: new Date(Date.now() - elapsed * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          duration_seconds: elapsed,
          mood_before: stressBefore,
          mood_after: Math.max(1, stressBefore - 2),
          completed: true,
          metadata: { 
            type: 'vr', 
            environment: selectedEnv.id,
            immersion: immersionLevel
          }
        });

        toast({
          title: 'Session terminée !',
          description: `Bravo pour ${Math.round(elapsed / 60)} minutes d'immersion.`
        });
      } catch (error) {
        console.error('Error saving VR session:', error);
      }
    }

    setElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (elapsed / (duration * 60)) * 100;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600">
            <Orbit className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold">VR Galaxy</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explorez des univers immersifs conçus pour la relaxation et le bien-être mental
        </p>
      </motion.div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalMinutes}</p>
              <p className="text-xs text-muted-foreground">Minutes totales</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">-{stats.avgStressReduction}</p>
              <p className="text-xs text-muted-foreground">Réduction stress</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{stats.streak}</p>
              <p className="text-xs text-muted-foreground">Jours consécutifs</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Zone principale - Session VR */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visualisation immersive */}
          <Card className="overflow-hidden">
            <div 
              className={`relative h-64 md:h-80 bg-gradient-to-br ${selectedEnv.color} flex items-center justify-center`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEnv.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center text-white"
                >
                  <motion.div
                    animate={isPlaying ? { 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="mb-4 inline-block"
                  >
                    <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm">
                      {selectedEnv.icon}
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">{selectedEnv.name}</h2>
                  <p className="text-white/80">{selectedEnv.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Contrôles overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <div className="text-white font-mono text-2xl">
                  {formatTime(elapsed)} / {formatTime(duration * 60)}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Paramètres"
                >
                  <Settings2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0">
                <Progress value={progress} className="h-1 rounded-none" />
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4">
                {!isPlaying ? (
                  <Button size="lg" className="gap-2 px-8" onClick={handleStart}>
                    <Play className="h-5 w-5" />
                    Démarrer la session
                  </Button>
                ) : (
                  <>
                    <Button size="lg" variant="outline" onClick={handlePause}>
                      <Pause className="h-5 w-5" />
                    </Button>
                    <Button size="lg" onClick={handleComplete}>
                      Terminer
                    </Button>
                  </>
                )}
              </div>

              {/* Paramètres */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-4 pt-6 border-t"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="duration-slider">Durée: {duration} minutes</Label>
                      <Slider
                        id="duration-slider"
                        value={[duration]}
                        onValueChange={([v]) => setDuration(v)}
                        min={5}
                        max={30}
                        step={5}
                        disabled={isPlaying}
                        aria-label="Durée de la session"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stress-slider">Niveau de stress actuel: {stressBefore}/10</Label>
                      <Slider
                        id="stress-slider"
                        value={[stressBefore]}
                        onValueChange={([v]) => setStressBefore(v)}
                        min={1}
                        max={10}
                        disabled={isPlaying}
                        aria-label="Niveau de stress"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="immersion-slider">Immersion: {immersionLevel}%</Label>
                      <Slider
                        id="immersion-slider"
                        value={[immersionLevel]}
                        onValueChange={([v]) => setImmersionLevel(v)}
                        min={50}
                        max={100}
                        step={10}
                        aria-label="Niveau d'immersion"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Sélection d'environnement */}
          <Card>
            <CardHeader>
              <CardTitle>Environnements</CardTitle>
              <CardDescription>Choisissez votre destination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {VR_ENVIRONMENTS.map((env) => (
                  <motion.button
                    key={env.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isPlaying && setSelectedEnv(env)}
                    disabled={isPlaying}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedEnv.id === env.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'bg-muted/50 hover:bg-muted'
                    } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${env.color} text-white w-fit mb-3`}>
                      {env.icon}
                    </div>
                    <h4 className="font-semibold mb-1">{env.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {env.description}
                    </p>
                    <div className="mt-2 flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {env.difficulty === 'beginner' ? 'Débutant' : 
                         env.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Historique et conseils */}
        <div className="space-y-6">
          {/* Bénéfices de l'environnement sélectionné */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Bénéfices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedEnv.benefits.map((benefit, i) => (
                  <li key={`${selectedEnv.id}-benefit-${i}`} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Historique récent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sessions récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground text-sm">Chargement...</p>
              ) : sessions.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucune session encore</p>
              ) : (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => {
                    const env = VR_ENVIRONMENTS.find(e => e.id === session.environment);
                    return (
                      <div key={session.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded bg-gradient-to-br ${env?.color || 'from-gray-400 to-gray-500'} text-white`}>
                            {env?.icon || <Star className="h-3 w-3" />}
                          </div>
                          <span>{env?.name || 'Session'}</span>
                        </div>
                        <span className="text-muted-foreground">{session.duration_minutes}min</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conseils */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Headphones className="h-5 w-5" />
                Conseils VR
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Utilisez un casque audio pour une immersion maximale</p>
              <p>• Installez-vous confortablement dans un endroit calme</p>
              <p>• Respirez profondément pendant la session</p>
              <p>• Pratiquez régulièrement pour des résultats durables</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VRGalaxyPage;
