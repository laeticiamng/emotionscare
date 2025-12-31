/**
 * VR Dashboard - Tableau de bord VR avec stats réelles
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { VRSessionTemplate } from '@/types/vr';
import { Play, Clock, BarChart3, Star, TrendingUp, Heart } from 'lucide-react';
import VRTemplateGrid from './VRTemplateGrid';
import { useVRStats, useVRHistory } from '@/hooks/useVRStats';
import { useVRSettings } from '@/hooks/useVRSettings';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VRDashboardProps {
  templates: VRSessionTemplate[];
  onStartSession: (template: VRSessionTemplate) => void;
}

const SCENE_LABELS: Record<string, string> = {
  galaxy: 'Galaxie',
  ocean: 'Océan',
  forest: 'Forêt',
  space: 'Espace',
  aurora: 'Aurore',
  cosmos: 'Cosmos',
};

const VRDashboard: React.FC<VRDashboardProps> = ({ templates, onStartSession }) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'history' | 'progress'>('featured');
  const { data: stats, isLoading: statsLoading } = useVRStats();
  const { data: history, isLoading: historyLoading } = useVRHistory(5);
  const { settings } = useVRSettings();

  const featuredTemplates = templates.filter(t => t.isFeatured || templates.indexOf(t) < 3);
  
  const weeklyProgress = stats 
    ? Math.min(100, Math.round((stats.total_minutes / settings.weeklyGoalMinutes) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions totales</p>
                {statsLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.total_sessions || 0}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Temps total</p>
                {statsLoading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.total_minutes || 0} min</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Streak actuel</p>
                {statsLoading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.current_streak_days || 0} jours</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Cohérence moy.</p>
                {statsLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.average_coherence || 0}%</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Objectif hebdomadaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{stats?.total_minutes || 0} min</span>
              <span>{settings.weeklyGoalMinutes} min</span>
            </div>
            <Progress value={weeklyProgress} />
            <p className="text-xs text-muted-foreground">
              {weeklyProgress < 100
                ? `Plus que ${settings.weeklyGoalMinutes - (stats?.total_minutes || 0)} minutes pour atteindre votre objectif !`
                : 'Objectif atteint ! 🎉'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === 'featured' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('featured')}
          className="flex-1"
        >
          Sessions recommandées
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          Historique
        </Button>
        <Button
          variant={activeTab === 'progress' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('progress')}
          className="flex-1"
        >
          Progression
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'featured' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sessions recommandées pour vous</h3>
            <Badge variant="secondary">Personnalisé</Badge>
          </div>
          <VRTemplateGrid templates={featuredTemplates} onSelectTemplate={onStartSession} />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sessions récentes</h3>
          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : history && history.length > 0 ? (
            <div className="grid gap-3">
              {history.map(session => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {SCENE_LABELS[session.scene] || session.scene}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(session.created_at), "d MMM yyyy", { locale: fr })} • {Math.round(session.duration_s / 60)} min
                        </p>
                      </div>
                      {session.coherence_score !== null && (
                        <Badge variant={session.coherence_score >= 70 ? 'default' : 'secondary'}>
                          {session.coherence_score}%
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                Aucune session récente. Commencez votre première expérience VR !
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyse de vos progrès</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistiques clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sessions cette semaine</span>
                  <span className="font-medium">{stats?.sessions_this_week || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sessions ce mois</span>
                  <span className="font-medium">{stats?.sessions_this_month || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Plus longue session</span>
                  <span className="font-medium">{stats?.longest_session_minutes || 0} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cycles de respiration</span>
                  <span className="font-medium">{stats?.total_breaths || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Préférences détectées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Scène favorite</span>
                  <Badge variant="outline">
                    {stats?.favorite_scene ? SCENE_LABELS[stats.favorite_scene] || stats.favorite_scene : 'Aucune'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pattern favori</span>
                  <Badge variant="outline">
                    {stats?.favorite_pattern || 'Aucun'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gain HRV moyen</span>
                  <span className="font-medium">
                    {stats?.average_hrv_gain ? `${stats.average_hrv_gain > 0 ? '+' : ''}${stats.average_hrv_gain} ms` : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default VRDashboard;
