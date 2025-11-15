import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, Activity, Target, Brain, Zap, Heart, Clock,
  ChevronRight, Filter, Download, Share2, Settings
} from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmotionStat {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

interface TrendData {
  timestamp: string;
  valence: number;
  arousal: number;
  emotion: string;
}

const EmotionStatsCard: React.FC<{ stat: EmotionStat }> = ({ stat }) => (
  <div className="rounded-lg border bg-card p-4 hover:bg-accent/5 transition-colors">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{stat.label}</p>
        <p className="text-2xl font-semibold mt-1">{stat.value}</p>
        {stat.change !== undefined && (
          <p className={`text-xs mt-2 ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}% vs hier
          </p>
        )}
      </div>
      <div className={`p-2.5 rounded-lg ${stat.color}`}>
        {stat.icon}
      </div>
    </div>
  </div>
);

const EmotionTimeline: React.FC<{ scans: any[] }> = ({ scans }) => {
  const trends = useMemo(() => {
    return scans.slice(0, 10).reverse().map((scan) => ({
      timestamp: new Date(scan.created_at).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      valence: scan.valence,
      arousal: scan.arousal,
      emotion: scan.summary || 'Neutre'
    }));
  }, [scans]);

  if (scans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {trends.map((trend, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-12 text-xs text-muted-foreground text-right">
            {trend.timestamp}
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{
                width: `${(trend.valence + 100) / 2}%`,
                opacity: 0.6 + (trend.arousal / 100) * 0.4
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {trend.emotion}
          </div>
        </div>
      ))}
    </div>
  );
};

const InsightCard: React.FC<{ title: string; description: string; type: 'tip' | 'pattern' | 'trend' }> =
  ({ title, description, type }) => {
    const bgColors = {
      tip: 'bg-blue-50 border-blue-200',
      pattern: 'bg-purple-50 border-purple-200',
      trend: 'bg-green-50 border-green-200'
    };
    const iconColors = {
      tip: 'text-blue-600',
      pattern: 'text-purple-600',
      trend: 'text-green-600'
    };

    return (
      <div className={`rounded-lg border p-3 ${bgColors[type]}`}>
        <h4 className={`font-medium text-sm ${iconColors[type]} flex items-center gap-2`}>
          {type === 'tip' && <Zap className="w-4 h-4" />}
          {type === 'pattern' && <Brain className="w-4 h-4" />}
          {type === 'trend' && <TrendingUp className="w-4 h-4" />}
          {title}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    );
  };

export const EnhancedScanDashboard: React.FC = () => {
  const { data: history = [], isLoading } = useScanHistory(30);
  const [activeTab, setActiveTab] = useState('overview');

  const stats: EmotionStat[] = useMemo(() => {
    if (history.length === 0) {
      return [
        { label: 'Scans aujourd\'hui', value: 0, icon: <Activity className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
        { label: 'Moyenne valence', value: '-', icon: <Heart className="w-4 h-4" />, color: 'bg-red-100 text-red-600' },
        { label: 'Tendance arousal', value: '-', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-600' },
        { label: 'État actuel', value: 'Neutre', icon: <Target className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' }
      ];
    }

    const today = new Date().toDateString();
    const todayScans = history.filter(s => new Date(s.created_at).toDateString() === today);
    const yesterdayScans = history.filter(s => {
      const d = new Date(s.created_at);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return d.toDateString() === yesterday.toDateString();
    });

    const avgValenceToday = todayScans.length > 0
      ? Math.round(todayScans.reduce((a, s) => a + s.valence, 0) / todayScans.length)
      : 0;
    const avgValenceYesterday = yesterdayScans.length > 0
      ? Math.round(yesterdayScans.reduce((a, s) => a + s.valence, 0) / yesterdayScans.length)
      : 0;

    const avgArousalToday = todayScans.length > 0
      ? Math.round(todayScans.reduce((a, s) => a + s.arousal, 0) / todayScans.length)
      : 0;

    const currentState = history[0];
    const currentEmotion = currentState?.summary || 'Neutre';

    return [
      {
        label: 'Scans aujourd\'hui',
        value: todayScans.length,
        change: yesterdayScans.length > 0 ? Math.round(((todayScans.length - yesterdayScans.length) / yesterdayScans.length) * 100) : 0,
        icon: <Activity className="w-4 h-4" />,
        color: 'bg-blue-100 text-blue-600'
      },
      {
        label: 'Valence moyenne',
        value: avgValenceToday,
        change: avgValenceYesterday > 0 ? Math.round((avgValenceToday - avgValenceYesterday) * 100) / 100 : undefined,
        icon: <Heart className="w-4 h-4" />,
        color: 'bg-red-100 text-red-600'
      },
      {
        label: 'Arousal moyen',
        value: avgArousalToday,
        icon: <Zap className="w-4 h-4" />,
        color: 'bg-yellow-100 text-yellow-600'
      },
      {
        label: 'État actuel',
        value: currentEmotion,
        icon: <Target className="w-4 h-4" />,
        color: 'bg-purple-100 text-purple-600'
      }
    ];
  }, [history]);

  const insights = useMemo(() => {
    const tips = [
      {
        title: 'Routine matinale',
        description: 'Vos scans du matin montrent généralement une arousal plus faible. C\'est normal !',
        type: 'tip' as const
      },
      {
        title: 'Stabilité émotionnelle',
        description: 'Votre valence reste stable. Excellent pour le bien-être général.',
        type: 'trend' as const
      },
      {
        title: 'Pattern détecté',
        description: 'Vous tendez à être plus énergique l\'après-midi.',
        type: 'pattern' as const
      }
    ];
    return tips;
  }, [history]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <EmotionStatsCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Onglets avancés */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Dashboard Avancé
              </CardTitle>
              <CardDescription>Analyse approfondie de vos états émotionnels</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="w-4 h-4" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="w-4 h-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="timeline">Chronologie</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Distribution des émotions</h3>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((scan, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(scan.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{scan.summary || 'Neutre'}</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${(scan.valence + 100) / 2}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Variabilité émotionnelle</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span>Stabilité</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-green-500 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span>Réactivité</span>
                        <span className="font-semibold">42%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-5/12 bg-yellow-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Chronologie du jour</h3>
                <EmotionTimeline scans={history} />
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-4 space-y-3">
              {insights.map((insight, idx) => (
                <InsightCard
                  key={idx}
                  title={insight.title}
                  description={insight.description}
                  type={insight.type}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedScanDashboard;
