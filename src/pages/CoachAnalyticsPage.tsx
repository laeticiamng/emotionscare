import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  Clock,
  Target,
  Heart,
  BarChart3,
  Calendar,
  Award,
  Zap,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

interface CoachStats {
  totalSessions: number;
  totalMessages: number;
  totalDuration: number;
  averageSessionDuration: number;
  emotionsDetected: Record<string, number>;
  techniquesUsed: string[];
  streak: number;
  lastSessionDate: string | null;
}

export default function CoachAnalyticsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<CoachStats>({
    totalSessions: 0,
    totalMessages: 0,
    totalDuration: 0,
    averageSessionDuration: 0,
    emotionsDetected: {},
    techniquesUsed: [],
    streak: 0,
    lastSessionDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Récupérer les sessions du coach
      const { data: sessions, error } = await supabase
        .from('ai_coach_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (sessions && sessions.length > 0) {
        // Calculer les statistiques
        const totalSessions = sessions.length;
        const totalMessages = sessions.reduce((sum, s) => sum + (s.messages_count || 0), 0);
        const totalDuration = sessions.reduce((sum, s) => sum + (s.session_duration || 0), 0);
        const averageSessionDuration = totalDuration / totalSessions;

        // Analyser les émotions détectées
        const emotionsMap: Record<string, number> = {};
        sessions.forEach(session => {
          if (session.emotions_detected?.dominant) {
            const emotion = session.emotions_detected.dominant;
            emotionsMap[emotion] = (emotionsMap[emotion] || 0) + 1;
          }
        });

        // Collecter les techniques suggérées
        const techniquesSet = new Set<string>();
        sessions.forEach(session => {
          if (Array.isArray(session.techniques_suggested)) {
            session.techniques_suggested.forEach((tech: string) => techniquesSet.add(tech));
          }
        });

        // Calculer le streak (jours consécutifs)
        const streak = calculateStreak(sessions.map(s => s.created_at));

        setStats({
          totalSessions,
          totalMessages,
          totalDuration: Math.round(totalDuration),
          averageSessionDuration: Math.round(averageSessionDuration),
          emotionsDetected: emotionsMap,
          techniquesUsed: Array.from(techniquesSet),
          streak,
          lastSessionDate: sessions[0]?.created_at || null,
        });
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des analytics', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les statistiques',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;

    const sortedDates = dates
      .map(d => new Date(d).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 1;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0;
    }

    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / 86400000);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joie: 'bg-yellow-500/10 text-yellow-600',
      tristesse: 'bg-blue-500/10 text-blue-600',
      colere: 'bg-red-500/10 text-red-600',
      peur: 'bg-purple-500/10 text-purple-600',
      neutre: 'bg-gray-500/10 text-gray-600',
    };
    return colors[emotion] || 'bg-gray-500/10 text-gray-600';
  };

  const topEmotions = Object.entries(stats.emotionsDetected)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user: user?.email,
      stats,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coach-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export réussi',
      description: 'Vos statistiques ont été téléchargées',
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/coach')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au coach
          </Button>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Analytics Coach</h1>
                  <p className="text-muted-foreground">
                    Suivez vos progrès et votre parcours de développement personnel
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter les données
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions totales</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalMessages} messages échangés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</div>
              <p className="text-xs text-muted-foreground">
                Moy: {formatDuration(stats.averageSessionDuration)}/session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Série actuelle</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streak} jours</div>
              <p className="text-xs text-muted-foreground">
                {stats.streak > 0 ? 'Continuez comme ça !' : 'Commencez une série'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Techniques</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.techniquesUsed.length}</div>
              <p className="text-xs text-muted-foreground">
                Techniques découvertes
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="emotions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="emotions">Émotions</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
          </TabsList>

          {/* Emotions Tab */}
          <TabsContent value="emotions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Émotions détectées</CardTitle>
                <CardDescription>
                  Répartition des émotions identifiées lors de vos sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topEmotions.length > 0 ? (
                  topEmotions.map(([emotion, count]) => {
                    const percentage = Math.round((count / stats.totalSessions) * 100);
                    return (
                      <div key={emotion} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium capitalize">{emotion}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {count} fois
                            </span>
                            <Badge className={getEmotionColor(emotion)}>{percentage}%</Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Aucune émotion détectée pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Techniques Tab */}
          <TabsContent value="techniques" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Techniques suggérées</CardTitle>
                <CardDescription>
                  Outils et exercices recommandés par votre coach
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.techniquesUsed.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {stats.techniquesUsed.map((technique, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Aucune technique suggérée pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Votre progression</CardTitle>
                <CardDescription>
                  Votre engagement et votre développement personnel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Novice du coaching</p>
                        <p className="text-sm text-muted-foreground">0-10 sessions</p>
                      </div>
                    </div>
                    {stats.totalSessions >= 10 && (
                      <Badge className="bg-green-500/10 text-green-600">Débloqué</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Pratiquant régulier</p>
                        <p className="text-sm text-muted-foreground">10-30 sessions</p>
                      </div>
                    </div>
                    {stats.totalSessions >= 30 && (
                      <Badge className="bg-green-500/10 text-green-600">Débloqué</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                        <Award className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">Expert en développement</p>
                        <p className="text-sm text-muted-foreground">30+ sessions</p>
                      </div>
                    </div>
                    {stats.totalSessions >= 50 && (
                      <Badge className="bg-green-500/10 text-green-600">Débloqué</Badge>
                    )}
                  </div>
                </div>

                {stats.lastSessionDate && (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Dernière session :</span>
                      <span className="font-medium">
                        {new Date(stats.lastSessionDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
