// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings,
  TrendingUp,
  Award,
  Calendar,
  Heart,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  category: 'relaxation' | 'energy' | 'sleep' | 'focus';
  icon: any;
  color: string;
}

interface BreathingSession {
  id: string;
  pattern: string;
  started_at: string;
  duration_seconds: number;
  cycles_completed?: number;
  mood_before?: number;
  mood_after?: number;
}

interface BreathingStats {
  total_sessions: number;
  total_duration: number;
  avg_cycles: number;
  mood_improvement: number;
  favorite_pattern: string;
  streak_days: number;
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box-breathing',
    name: 'Respiration Carrée',
    description: 'Technique 4-4-4-4 pour la relaxation profonde',
    category: 'relaxation',
    icon: Square,
    color: 'blue'
  },
  {
    id: '4-7-8',
    name: 'Respiration 4-7-8',
    description: 'Favorise l\'endormissement et réduit l\'anxiété',
    category: 'sleep',
    icon: Moon,
    color: 'purple'
  },
  {
    id: 'wim-hof',
    name: 'Méthode Wim Hof',
    description: 'Respiration énergisante pour l\'immunité',
    category: 'energy',
    icon: Zap,
    color: 'red'
  },
  {
    id: 'coherence',
    name: 'Cohérence Cardiaque',
    description: 'Synchronisation cœur-cerveau 5-5',
    category: 'focus',
    icon: Heart,
    color: 'green'
  }
];

const ImmersiveBreathingEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [duration, setDuration] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Stats & History
  const [sessions, setSessions] = useState<BreathingSession[]>([]);
  const [stats, setStats] = useState<BreathingStats | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Canvas for visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Start breathing session
  const startSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('immersive-breathing', {
        body: {
          action: 'start-session',
          pattern: selectedPattern.id,
          duration,
          difficulty
        }
      });

      if (error) throw error;

      setSessionId(data.session.id);
      setIsActive(true);
      setIsPaused(false);
      setTimeLeft(duration * 60);
      setCycleCount(0);
      toast.success('Session de respiration démarrée');
      
      // Start animation
      startBreathingAnimation(data.session.visualization_config);
    } catch (error) {
      logger.error('Error starting session', error as Error, 'UI');
      toast.error('Erreur lors du démarrage de la session');
    }
  };

  // Stop session
  const stopSession = async () => {
    if (!sessionId) return;

    try {
      // Calculate adherence
      const totalTime = duration * 60;
      const timeSpent = totalTime - timeLeft;
      const adherenceScore = Math.round((timeSpent / totalTime) * 100);

      const { data, error } = await supabase.functions.invoke('immersive-breathing', {
        body: {
          action: 'complete-session',
          sessionId,
          cycles_completed: cycleCount,
          avg_heart_rate: 72, // Mock - would come from wearable
          mood_before: moodBefore,
          mood_after: moodAfter,
          adherence_score: adherenceScore
        }
      });

      if (error) throw error;

      // Show insights
      if (data.insights) {
        toast.success(`Session terminée ! ${data.insights.performance}`);
        
        // Show detailed insights in a modal or card
        logger.info('AI Insights', { insights: data.insights }, 'UI');
      }

      setIsActive(false);
      setIsPaused(false);
      setSessionId(null);
      stopBreathingAnimation();
      
      // Refresh history
      loadHistory();
    } catch (error) {
      logger.error('Error stopping session', error as Error, 'UI');
      toast.error('Erreur lors de l\'arrêt de la session');
    }
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Load history and stats
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase.functions.invoke('immersive-breathing', {
        body: {
          action: 'get-history',
          limit: 20
        }
      });

      if (error) throw error;

      setSessions(data.sessions || []);
      setStats(data.stats);
    } catch (error) {
      logger.error('Error loading history', error as Error, 'UI');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Load recommendations
  const loadRecommendations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('immersive-breathing', {
        body: {
          action: 'get-recommendations'
        }
      });

      if (error) throw error;
      setRecommendations(data.recommendations || []);
    } catch (error) {
      logger.error('Error loading recommendations', error as Error, 'UI');
    }
  };

  // Breathing animation on canvas
  const startBreathingAnimation = (config: any) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let phase = 0;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;

    const animate = () => {
      if (!isActive || isPaused) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate breathing cycle
      const cycleTime = 16; // 4 seconds per phase (4 phases)
      const progress = (Date.now() % (cycleTime * 1000)) / (cycleTime * 1000);
      
      // Determine current phase
      if (progress < 0.25) {
        setCurrentPhase('inhale');
        phase = progress * 4;
      } else if (progress < 0.5) {
        setCurrentPhase('hold');
        phase = 1;
      } else if (progress < 0.75) {
        setCurrentPhase('exhale');
        phase = 1 - ((progress - 0.5) * 4);
      } else {
        setCurrentPhase('rest');
        phase = 0;
      }

      // Smooth easing
      const easePhase = phase < 0.5 
        ? 2 * phase * phase 
        : 1 - Math.pow(-2 * phase + 2, 2) / 2;

      const radius = maxRadius * (0.3 + 0.7 * easePhase);

      // Draw main orb with gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, radius
      );
      
      const primaryColor = config?.colors?.primary || '#3B82F6';
      gradient.addColorStop(0, primaryColor + 'dd');
      gradient.addColorStop(0.5, primaryColor + '88');
      gradient.addColorStop(1, primaryColor + '22');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw particles
      for (let i = 0; i < (config?.particle_count || 30); i++) {
        const angle = (i / (config?.particle_count || 30)) * Math.PI * 2;
        const particleRadius = radius + 20 + Math.sin(Date.now() / 500 + i) * 10;
        const x = canvas.width / 2 + Math.cos(angle) * particleRadius;
        const y = canvas.height / 2 + Math.sin(angle) * particleRadius;
        
        ctx.fillStyle = primaryColor + '66';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopBreathingAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // Load data on mount
  useEffect(() => {
    loadHistory();
    loadRecommendations();
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Respiration Immersive</h1>
          <p className="text-muted-foreground">
            Techniques de respiration guidées par IA avec visualisations 3D
          </p>
        </div>
        {stats && (
          <div className="flex gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Calendar className="mr-2 h-4 w-4" />
              {stats.streak_days} jours
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Activity className="mr-2 h-4 w-4" />
              {stats.total_sessions} sessions
            </Badge>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="practice">Pratiquer</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Visualization Canvas */}
            <Card>
              <CardHeader>
                <CardTitle>Visualisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-[400px] rounded-lg bg-gradient-to-br from-background to-secondary/20"
                  />
                  {isActive && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                      <div className="text-3xl font-bold mb-2">
                        {currentPhase === 'inhale' && 'Inspirez'}
                        {currentPhase === 'hold' && 'Retenez'}
                        {currentPhase === 'exhale' && 'Expirez'}
                        {currentPhase === 'rest' && 'Repos'}
                      </div>
                      <div className="text-xl text-muted-foreground">
                        Cycle {cycleCount} • {formatTime(timeLeft)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  {!isActive ? (
                    <Button onClick={startSession} size="lg">
                      <Play className="mr-2 h-5 w-5" />
                      Commencer
                    </Button>
                  ) : (
                    <>
                      <Button onClick={togglePause} variant="outline" size="lg">
                        {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                      </Button>
                      <Button onClick={stopSession} variant="destructive" size="lg">
                        <Square className="mr-2 h-5 w-5" />
                        Terminer
                      </Button>
                    </>
                  )}
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-4 mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={(v) => setVolume(v[0] / 100)}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pattern Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Pattern de respiration</label>
                  <div className="grid grid-cols-2 gap-3">
                    {breathingPatterns.map((pattern) => (
                      <Button
                        key={pattern.id}
                        variant={selectedPattern.id === pattern.id ? 'default' : 'outline'}
                        className="h-auto flex-col items-start p-4"
                        onClick={() => setSelectedPattern(pattern)}
                        disabled={isActive}
                      >
                        <pattern.icon className="h-5 w-5 mb-2" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">{pattern.name}</div>
                          <div className="text-xs text-muted-foreground">{pattern.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Niveau</label>
                  <div className="flex gap-2">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <Button
                        key={level}
                        variant={difficulty === level ? 'default' : 'outline'}
                        onClick={() => setDifficulty(level as any)}
                        disabled={isActive}
                        className="flex-1"
                      >
                        {level === 'beginner' && 'Débutant'}
                        {level === 'intermediate' && 'Intermédiaire'}
                        {level === 'advanced' && 'Avancé'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Durée: {duration} minutes
                  </label>
                  <Slider
                    value={[duration]}
                    onValueChange={(v) => setDuration(v[0])}
                    min={1}
                    max={30}
                    step={1}
                    disabled={isActive}
                  />
                </div>

                {/* Mood Before/After */}
                {!isActive && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Humeur avant: {moodBefore}/10</label>
                    <Slider
                      value={[moodBefore]}
                      onValueChange={(v) => setMoodBefore(v[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                )}

                {isActive && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Humeur actuelle: {moodAfter}/10</label>
                    <Slider
                      value={[moodAfter]}
                      onValueChange={(v) => setMoodAfter(v[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Sessions totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_sessions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Temps total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.floor(stats.total_duration / 60)} min</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Amélioration d'humeur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.mood_improvement}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Pattern favori</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">{stats.favorite_pattern}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sessions History */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="text-center py-8 text-muted-foreground">Chargement...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune session enregistrée
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <Activity className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{session.pattern}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(session.started_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{Math.floor(session.duration_seconds / 60)} min</div>
                        {session.cycles_completed && (
                          <div className="text-sm text-muted-foreground">
                            {session.cycles_completed} cycles
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations personnalisées</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune recommandation disponible
                </div>
              ) : (
                <div className="grid gap-4">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        const pattern = breathingPatterns.find(p => p.id === rec.pattern);
                        if (pattern) {
                          setSelectedPattern(pattern);
                          setDifficulty(rec.difficulty);
                          setDuration(rec.duration);
                          setActiveTab('practice');
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{rec.pattern}</div>
                          <div className="text-sm text-muted-foreground">{rec.reason}</div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{rec.difficulty}</Badge>
                            <Badge variant="outline">{rec.duration} min</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Essayer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Moon icon component (simple)
const Moon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ImmersiveBreathingEnhanced;
