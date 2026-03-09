// @ts-nocheck
/**
 * Team Wellbeing Dashboard for Ward Managers
 * Aggregate scores, heatmap, threshold alerts
 */
import React, { useState, useMemo } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, TrendingDown, TrendingUp, AlertTriangle, Users, Calendar,
  BarChart3, Activity, Bell, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoBanner } from '@/components/ui/DemoBanner';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area
} from 'recharts';

// Demo data - would come from Supabase aggregate queries in production
const generateWeeklyData = () => {
  const weeks = [];
  for (let i = 12; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const weekLabel = `S${d.getWeek?.() || Math.ceil(d.getDate() / 7)}`;
    weeks.push({
      week: `${d.toLocaleDateString('fr-FR', { month: 'short' })} ${weekLabel}`,
      score: Math.round(55 + Math.random() * 30),
      ee: Math.round(15 + Math.random() * 25),
      dp: Math.round(3 + Math.random() * 12),
      pa: Math.round(28 + Math.random() * 18),
      respondents: Math.round(12 + Math.random() * 20),
    });
  }
  return weeks;
};

const HEATMAP_DATA = (() => {
  const shifts = ['Matin', 'Après-midi', 'Nuit', 'Garde 24h'];
  const weeks = Array.from({ length: 8 }, (_, i) => `S${i + 1}`);
  return shifts.map((shift) => ({
    shift,
    weeks: weeks.map((w) => ({
      week: w,
      score: Math.round(40 + Math.random() * 50),
    })),
  }));
})();

const ALERTS = [
  { id: 1, type: 'warning' as const, message: 'Score équipe en baisse de 18% ce mois — Intervention recommandée', date: '2026-03-05', team: 'Service Réanimation' },
  { id: 2, type: 'critical' as const, message: 'Épuisement émotionnel élevé détecté (> seuil critique) — 3 semaines consécutives', date: '2026-03-03', team: 'Urgences' },
  { id: 3, type: 'info' as const, message: 'Amélioration de l\'accomplissement personnel (+12%) après programme de respiration', date: '2026-02-28', team: 'Soins Palliatifs' },
];

const getHeatColor = (score: number) => {
  if (score >= 70) return 'bg-green-500/80 dark:bg-green-600/70';
  if (score >= 50) return 'bg-yellow-400/80 dark:bg-yellow-500/70';
  return 'bg-red-500/80 dark:bg-red-600/70';
};

const TeamWellbeingDashboard: React.FC = () => {
  usePageSEO({
    title: 'Dashboard Bien-être Équipe | EmotionsCare B2B',
    description: 'Tableau de bord de suivi du bien-être des équipes soignantes avec alertes et heatmap.',
  });

  const [period, setPeriod] = useState('3m');
  const weeklyData = useMemo(generateWeeklyData, []);
  const latestScore = weeklyData[weeklyData.length - 1]?.score ?? 0;
  const previousScore = weeklyData[weeklyData.length - 2]?.score ?? 0;
  const trend = latestScore - previousScore;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <DemoBanner message="Ce dashboard affiche des données de démonstration générées aléatoirement. Les données réelles nécessitent l'intégration backend." />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/b2b/admin/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Bien-être Équipe
              </h1>
              <p className="text-sm text-muted-foreground">Suivi anonymisé • Seuil minimum : 5 répondants</p>
            </div>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 mois</SelectItem>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Score global</p>
              <p className="text-3xl font-bold text-primary">{latestScore}<span className="text-base text-muted-foreground">/100</span></p>
              <div className={`flex items-center justify-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {trend >= 0 ? '+' : ''}{trend} pts
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Répondants</p>
              <p className="text-3xl font-bold">{weeklyData[weeklyData.length - 1]?.respondents}</p>
              <p className="text-xs text-muted-foreground">cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Alertes actives</p>
              <p className="text-3xl font-bold text-destructive">{ALERTS.filter(a => a.type !== 'info').length}</p>
              <p className="text-xs text-muted-foreground">nécessitent attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Tendance</p>
              <p className="text-3xl font-bold">{trend >= 0 ? '↗' : '↘'}</p>
              <p className="text-xs text-muted-foreground">{trend >= 0 ? 'En amélioration' : 'En baisse'}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends" className="gap-2"><BarChart3 className="h-4 w-4" />Tendances</TabsTrigger>
            <TabsTrigger value="heatmap" className="gap-2"><Calendar className="h-4 w-4" />Heatmap</TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2"><Bell className="h-4 w-4" />Alertes</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution du score de bien-être</CardTitle>
                <CardDescription>Score agrégé anonymisé sur la période sélectionnée</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="hsl(142 71% 45%)" fill="url(#scoreGrad)" strokeWidth={2} name="Score bien-être" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Heatmap Shifts / Semaines</CardTitle>
                <CardDescription>Corrélation entre les créneaux et le bien-être collectif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="grid" aria-label="Heatmap bien-être par shift et semaine">
                    <thead>
                      <tr>
                        <th className="text-left p-2 text-muted-foreground">Shift</th>
                        {HEATMAP_DATA[0].weeks.map((w) => (
                          <th key={w.week} className="p-2 text-center text-muted-foreground">{w.week}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HEATMAP_DATA.map((row) => (
                        <tr key={row.shift}>
                          <td className="p-2 font-medium">{row.shift}</td>
                          {row.weeks.map((cell) => (
                            <td key={cell.week} className="p-1">
                              <div
                                className={`w-full h-10 rounded flex items-center justify-center text-xs font-bold text-white ${getHeatColor(cell.score)}`}
                                title={`${row.shift} ${cell.week}: ${cell.score}/100`}
                                aria-label={`${row.shift} semaine ${cell.week}: score ${cell.score}`}
                              >
                                {cell.score}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground justify-center">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> &lt;50</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400" /> 50-69</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500" /> ≥70</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertes de seuil</CardTitle>
                <CardDescription>Notifications automatiques basées sur les variations de score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border flex items-start gap-3 ${
                      alert.type === 'critical' ? 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800' :
                      alert.type === 'warning' ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800' :
                      'border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800'
                    }`}
                  >
                    {alert.type === 'critical' ? <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" /> :
                     alert.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" /> :
                     <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{alert.team}</Badge>
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                      </div>
                      <p className="text-sm font-medium">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-8 pt-4 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            Données anonymisées • Seuil de confidentialité : 5 répondants minimum • Aucune surveillance individuelle
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TeamWellbeingDashboard;
