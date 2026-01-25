/**
 * VR Page - Page principale du module VR
 * Unifie l'accès à VR Galaxy, VR Breath, historique et paramètres
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Wind, 
  History, 
  Settings, 
  TrendingUp, 
  Clock, 
  Target,
  Download,
  ChevronRight,
  Play,
  Heart,
  Activity,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useVRStats, useVRHistory, useVRWeeklyProgress } from '@/hooks/useVRStats';
import { useVRSettings } from '@/hooks/useVRSettings';
import { useVRExport } from '@/hooks/useVRExport';
import { VRSettingsModal } from '@/components/vr/VRSettingsModal';
import { VRRecommendationWidget } from '@/components/vr/VRRecommendationWidget';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SCENE_LABELS: Record<string, string> = {
  galaxy: 'Galaxie',
  ocean: 'Océan',
  forest: 'Forêt',
  space: 'Espace',
  aurora: 'Aurore',
  cosmos: 'Cosmos',
};

const PATTERN_LABELS: Record<string, string> = {
  box: 'Box Breathing',
  coherence: 'Cohérence',
  relax: 'Relaxation',
  energize: 'Énergie',
  calm: 'Calme',
};

export default function VRPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useVRStats();
  const { data: history, isLoading: historyLoading } = useVRHistory(10);
  const { data: weeklyProgress } = useVRWeeklyProgress();
  const { settings } = useVRSettings();
  const { exportJSON, exportCSV } = useVRExport();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'progress'>('overview');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const weeklyGoalProgress = stats 
    ? Math.min(100, Math.round((stats.total_minutes / settings.weeklyGoalMinutes) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/app')}
                aria-label="Retour"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Réalité Virtuelle</h1>
                <p className="text-sm text-muted-foreground">Expériences immersives de bien-être</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                aria-label="Paramètres VR"
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportJSON}>
                    Export JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportCSV}>
                    Export CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                    {statsLoading ? (
                      <Skeleton className="h-6 w-12" />
                    ) : (
                      <p className="text-xl font-bold">{stats?.total_sessions || 0}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-info" />
                  <div>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                    {statsLoading ? (
                      <Skeleton className="h-6 w-16" />
                    ) : (
                      <p className="text-xl font-bold">{stats?.total_minutes || 0}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Streak</p>
                    {statsLoading ? (
                      <Skeleton className="h-6 w-16" />
                    ) : (
                      <p className="text-xl font-bold">{stats?.current_streak_days || 0} j</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cohérence</p>
                    {statsLoading ? (
                      <Skeleton className="h-6 w-12" />
                    ) : (
                      <p className="text-xl font-bold">{stats?.average_coherence || 0}%</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.header>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Expériences VR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="group cursor-pointer hover:shadow-lg transition-all border-primary/20 hover:border-primary/40">
              <Link to="/app/vr-galaxy">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">VR Galaxy</h3>
                        <p className="text-sm text-muted-foreground">Cathédrale cosmique sous les étoiles</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="secondary" className="text-xs">Immersif</Badge>
                    <Badge variant="outline" className="text-xs">Constellations</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all border-info/20 hover:border-info/40">
              <Link to="/app/vr-breath-guide">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-info/10 group-hover:bg-info/20 transition-colors">
                        <Wind className="h-6 w-6 text-info" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">VR Breath</h3>
                        <p className="text-sm text-muted-foreground">Respiration guidée immersive</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-info transition-colors" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="secondary" className="text-xs">Cohérence cardiaque</Badge>
                    <Badge variant="outline" className="text-xs">Guidé</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
          
          {/* Recommendations */}
          <VRRecommendationWidget />
        </motion.section>

        {/* Weekly Goal */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Objectif hebdomadaire
                </CardTitle>
                <Badge variant={weeklyGoalProgress >= 100 ? 'default' : 'secondary'}>
                  {weeklyGoalProgress}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={weeklyGoalProgress} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                {stats?.sessions_this_week || 0} sessions cette semaine
                {weeklyGoalProgress < 100 && stats && (
                  <> • Plus que {settings.weeklyGoalMinutes - stats.total_minutes} min pour atteindre votre objectif</>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Tabs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="overview" className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                <History className="h-4 w-4 mr-2" />
                Historique
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex-1">
                <Activity className="h-4 w-4 mr-2" />
                Progression
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Favorites */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vos préférences</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Scène favorite</p>
                    <p className="font-medium">
                      {stats?.favorite_scene ? SCENE_LABELS[stats.favorite_scene] || stats.favorite_scene : 'Aucune'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pattern favori</p>
                    <p className="font-medium">
                      {stats?.favorite_pattern ? PATTERN_LABELS[stats.favorite_pattern] || stats.favorite_pattern : 'Aucun'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Session la plus longue</p>
                    <p className="font-medium">{stats?.longest_session_minutes || 0} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gain HRV moyen</p>
                    <p className="font-medium">
                      {stats?.average_hrv_gain ? `${stats.average_hrv_gain > 0 ? '+' : ''}${stats.average_hrv_gain} ms` : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Chart */}
              {weeklyProgress && weeklyProgress.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Cette semaine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2 h-32">
                      {weeklyProgress.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-primary/20 rounded-t transition-all"
                            style={{ 
                              height: `${Math.max(4, (day.minutes / Math.max(...weeklyProgress.map(d => d.minutes), 1)) * 100)}%`,
                              minHeight: day.minutes > 0 ? 8 : 4,
                            }}
                          />
                          <span className="text-xs text-muted-foreground">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-3">
              {historyLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))
              ) : history && history.length > 0 ? (
                history.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {SCENE_LABELS[session.scene] || session.scene}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {PATTERN_LABELS[session.breathing_pattern] || session.breathing_pattern}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(session.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                            {' • '}{Math.round(session.duration_s / 60)} min
                            {' • '}{session.cycles_completed} cycles
                          </p>
                        </div>
                        {session.coherence_score !== null && (
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">{session.coherence_score}%</p>
                            <p className="text-xs text-muted-foreground">Cohérence</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Aucune session</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Commencez votre première expérience VR
                    </p>
                    <Button asChild>
                      <Link to="/app/vr-galaxy">
                        <Play className="h-4 w-4 mr-2" />
                        Commencer
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statistiques globales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total respirations</span>
                    <span className="font-medium">{stats?.total_breaths || 0} cycles</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sessions ce mois</span>
                    <span className="font-medium">{stats?.sessions_this_month || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cohérence moyenne</span>
                    <span className="font-medium">{stats?.average_coherence || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Streak actuel</span>
                    <span className="font-medium">{stats?.current_streak_days || 0} jours</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-info/5">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">🎯 Conseil</h3>
                  <p className="text-sm text-muted-foreground">
                    Pour maximiser les bienfaits de la cohérence cardiaque, 
                    pratiquez 5 minutes par jour pendant 30 jours.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.section>
      </div>
      
      {/* Settings Modal */}
      <VRSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
