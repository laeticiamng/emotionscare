import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Hash, MessageSquare } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalAnalyticsDashboardProps {
  notes: SanitizedNote[];
  className?: string;
}

/**
 * Dashboard d'analytics pour le journal
 * Affiche des statistiques et graphiques sur les notes
 */
export const JournalAnalyticsDashboard = memo<JournalAnalyticsDashboardProps>(({ notes, className = '' }) => {
  const analytics = useMemo(() => calculateAnalytics(notes), [notes]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de notes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.voiceNotes} vocales, {analytics.textNotes} texte
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne par semaine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgPerWeek.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.streak} jours consécutifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags utilisés</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueTags}</div>
            <p className="text-xs text-muted-foreground">
              Tag le plus utilisé : #{analytics.topTag}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.trend > 0 ? '+' : ''}{analytics.trend.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              vs. mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activité sur 30 jours</CardTitle>
          <CardDescription>Nombre de notes créées par jour</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags les plus utilisés</CardTitle>
          <CardDescription>Top 10 des tags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analytics.topTags.slice(0, 10).map(({ tag, count }) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                #{tag} <span className="ml-1 text-muted-foreground">({count})</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

JournalAnalyticsDashboard.displayName = 'JournalAnalyticsDashboard';

/**
 * Calcule les analytics à partir des notes
 */
function calculateAnalytics(notes: SanitizedNote[]) {
  const totalNotes = notes.length;
  const voiceNotes = notes.filter(n => n.mode === 'voice').length;
  const textNotes = notes.filter(n => n.mode === 'text').length;

  // Calcul moyenne par semaine
  const oldestDate = notes.length > 0 
    ? new Date(notes[notes.length - 1].created_at) 
    : new Date();
  const daysSinceFirst = Math.max(1, Math.ceil((Date.now() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)));
  const avgPerWeek = (totalNotes / daysSinceFirst) * 7;

  // Calcul streak (jours consécutifs)
  const streak = calculateStreak(notes);

  // Tags
  const tagCounts = new Map<string, number>();
  notes.forEach(note => {
    note.tags?.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  const topTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
  
  const topTag = topTags[0]?.tag || 'aucun';
  const uniqueTags = tagCounts.size;

  // Tendance (comparaison avec mois dernier)
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000);
  
  const lastMonthNotes = notes.filter(n => {
    const created = new Date(n.created_at).getTime();
    return created >= thirtyDaysAgo && created <= now;
  }).length;
  
  const previousMonthNotes = notes.filter(n => {
    const created = new Date(n.created_at).getTime();
    return created >= sixtyDaysAgo && created < thirtyDaysAgo;
  }).length;
  
  const trend = previousMonthNotes > 0 
    ? ((lastMonthNotes - previousMonthNotes) / previousMonthNotes) * 100 
    : 0;

  // Activité quotidienne (30 derniers jours)
  const dailyActivity = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now - (29 - i) * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    const count = notes.filter(note => {
      const noteDate = new Date(note.created_at);
      return noteDate.toDateString() === date.toDateString();
    }).length;
    return { date: dateStr, count };
  });

  return {
    totalNotes,
    voiceNotes,
    textNotes,
    avgPerWeek,
    streak,
    uniqueTags,
    topTag,
    topTags,
    trend,
    dailyActivity,
  };
}

/**
 * Calcule le nombre de jours consécutifs avec au moins une note
 */
function calculateStreak(notes: SanitizedNote[]): number {
  if (notes.length === 0) return 0;

  const sortedDates = notes
    .map(n => new Date(n.created_at).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  // Si pas de note aujourd'hui ni hier, streak = 0
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let currentDate = sortedDates[0] === today ? today : yesterday;
  
  for (const dateStr of sortedDates) {
    if (dateStr === currentDate) {
      streak++;
      currentDate = new Date(new Date(currentDate).getTime() - 24 * 60 * 60 * 1000).toDateString();
    } else {
      break;
    }
  }

  return streak;
}
