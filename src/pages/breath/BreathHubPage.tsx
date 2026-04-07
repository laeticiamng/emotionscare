// @ts-nocheck
/**
 * BreathHubPage - Hub unifié de respiration
 * Consolide : breath, breath-constellation, breathing-vr, bubble-beat, nyvee
 * 4 modes : Classique, Gamifié, Immersif, Nuit
 */
import React, { useState, lazy, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, Wind, Gamepad2, Eye, Moon, Play, Clock, Trophy,
  Heart, Sparkles, BarChart3, Star, Waves, Timer, Pause,
} from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';

// Lazy load mode-specific components
const ClassicMode = lazy(() => import('./modes/ClassicBreathMode'));
const GamifiedMode = lazy(() => import('./modes/GamifiedBreathMode'));
const ImmersiveMode = lazy(() => import('./modes/ImmersiveBreathMode'));
const NightMode = lazy(() => import('./modes/NightBreathMode'));

type BreathMode = 'classique' | 'gamifie' | 'immersif' | 'nuit';

const MODES = [
  {
    id: 'classique' as BreathMode,
    label: 'Classique',
    icon: Wind,
    description: 'Cohérence cardiaque, 4-7-8, box breathing',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
  {
    id: 'gamifie' as BreathMode,
    label: 'Gamifié',
    icon: Gamepad2,
    description: 'Éclater des bulles au rythme de votre souffle',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    id: 'immersif' as BreathMode,
    label: 'Immersif',
    icon: Eye,
    description: 'Constellation 3D et environnement VR',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'nuit' as BreathMode,
    label: 'Nuit',
    icon: Moon,
    description: 'Cocon d\'endormissement avec ambiance sonore',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
];

const PROTOCOLS = [
  { name: 'Cohérence cardiaque', pattern: '5-5', duration: '5 min', difficulty: 'Débutant' },
  { name: 'Technique 4-7-8', pattern: '4-7-8', duration: '4 min', difficulty: 'Intermédiaire' },
  { name: 'Box Breathing', pattern: '4-4-4-4', duration: '5 min', difficulty: 'Débutant' },
  { name: 'Respiration Wim Hof', pattern: '30x rapide + rétention', duration: '10 min', difficulty: 'Avancé' },
  { name: 'Respiration 2:1', pattern: 'Expire 2x plus long', duration: '6 min', difficulty: 'Intermédiaire' },
  { name: 'Souffle anti-panique', pattern: '3-6', duration: '3 min', difficulty: 'Urgence' },
];

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <Wind className="h-12 w-12 text-primary/50 animate-pulse mx-auto" />
      <p className="text-muted-foreground">Chargement du mode...</p>
    </div>
  </div>
);

export default function BreathHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as BreathMode) || 'classique';
  const [activeMode, setActiveMode] = useState<BreathMode>(initialMode);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [lastScan, setLastScan] = useState<{ urgency: string; protocol: string } | null>(null);

  usePageSEO({
    title: 'Respiration Guidée - EmotionsCare',
    description: 'Hub de respiration guidée avec 4 modes : classique, gamifié, immersif et nuit. Protocoles basés sur les neurosciences.',
    keywords: 'respiration, cohérence cardiaque, relaxation, stress, soignants',
  });

  // Load latest scan recommendation
  React.useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('emotion_scan_results')
          .select('results')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (data?.results) {
          setLastScan({
            urgency: (data.results as any).urgency || 'low',
            protocol: (data.results as any).recommendation || '',
          });
        }
      } catch {
        // No scan data
      }
    })();
  }, []);

  const handleModeChange = (mode: string) => {
    setActiveMode(mode as BreathMode);
    setSearchParams({ mode });
  };

  // Stats mock
  const stats = {
    totalSessions: 47,
    totalMinutes: 312,
    currentStreak: 5,
    longestStreak: 12,
    favoriteProtocol: 'Cohérence cardiaque',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/app/home">
            <Button variant="ghost" size="icon" aria-label="Retour">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Respiration Guidée</h1>
            <p className="text-sm text-muted-foreground">
              4 modes · {PROTOCOLS.length} protocoles · {stats.totalSessions} sessions
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3 w-3" /> Streak : {stats.currentStreak}j
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" /> {stats.totalMinutes} min
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Post-scan recommendation banner */}
        {lastScan && lastScan.urgency !== 'low' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              lastScan.urgency === 'high'
                ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
            }`}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Recommandation post-scan : <strong>{lastScan.protocol}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Basé sur votre dernier scanner émotionnel
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setLastScan(null)}>
              Compris
            </Button>
          </motion.div>
        )}

        {/* Mode Selector Tabs */}
        <Tabs value={activeMode} onValueChange={handleModeChange}>
          <TabsList className="grid w-full grid-cols-4 h-auto">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <TabsTrigger
                  key={mode.id}
                  value={mode.id}
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary/10"
                >
                  <Icon className={`h-5 w-5 ${activeMode === mode.id ? mode.color : ''}`} />
                  <span className="text-xs font-medium">{mode.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Mode Description */}
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            {MODES.filter(m => m.id === activeMode).map(mode => (
              <div key={mode.id} className={`rounded-lg p-4 ${mode.bg}`}>
                <p className={`text-sm font-medium ${mode.color}`}>
                  Mode {mode.label} — {mode.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Mode Content */}
          <Suspense fallback={<LoadingFallback />}>
            <TabsContent value="classique" className="mt-6">
              <ClassicMode protocols={PROTOCOLS} stats={stats} />
            </TabsContent>
            <TabsContent value="gamifie" className="mt-6">
              <GamifiedMode />
            </TabsContent>
            <TabsContent value="immersif" className="mt-6">
              <ImmersiveMode />
            </TabsContent>
            <TabsContent value="nuit" className="mt-6">
              <NightMode />
            </TabsContent>
          </Suspense>
        </Tabs>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <BarChart3 className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{stats.totalMinutes}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-amber-500" />
              <p className="text-2xl font-bold">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Streak actuel</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Star className="h-5 w-5 mx-auto mb-1 text-amber-500" />
              <p className="text-2xl font-bold">{stats.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Meilleur streak</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
