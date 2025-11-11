import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useChallengesHistory } from '@/hooks/useChallengesHistory';
import { Loader2, Trophy, TrendingUp, Calendar as CalendarIcon, Target, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChallengesHistory = () => {
  const { history, stats, loading } = useChallengesHistory();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prepare calendar markers for completed challenges
  const completedDates = history
    .filter(h => h.completed && h.completed_at)
    .map(h => new Date(h.completed_at!).toDateString());

  const modifiers = {
    completed: (date: Date) => completedDates.includes(date.toDateString()),
  };

  const modifiersStyles = {
    completed: {
      fontWeight: 'bold',
      backgroundColor: 'hsl(var(--primary))',
      color: 'white',
      borderRadius: '50%',
    },
  };

  // Chart data - Completion by type
  const typeChartData = stats
    ? {
        labels: Object.keys(stats.completionByType),
        datasets: [
          {
            label: 'Complétés',
            data: Object.values(stats.completionByType).map(v => v.completed),
            backgroundColor: 'hsl(var(--primary) / 0.8)',
          },
          {
            label: 'Non complétés',
            data: Object.values(stats.completionByType).map(v => v.total - v.completed),
            backgroundColor: 'hsl(var(--muted) / 0.5)',
          },
        ],
      }
    : null;

  // Chart data - Completion rate by profile
  const profileChartData = stats
    ? {
        labels: Object.keys(stats.completionByProfile),
        datasets: [
          {
            label: 'Taux de complétion (%)',
            data: Object.entries(stats.completionByProfile).map(
              ([_, v]) => (v.completed / v.total) * 100
            ),
            backgroundColor: [
              'hsl(var(--chart-1))',
              'hsl(var(--chart-2))',
              'hsl(var(--chart-3))',
              'hsl(var(--chart-4))',
              'hsl(var(--chart-5))',
            ],
          },
        ],
      }
    : null;

  // Chart data - Weekly trend (last 8 weeks)
  const weeksData = () => {
    const weeks = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const completedInWeek = history.filter(h => {
        if (!h.completed || !h.completed_at) return false;
        const completedDate = new Date(h.completed_at);
        return completedDate >= weekStart && completedDate <= weekEnd;
      }).length;

      weeks.push({
        label: `S${i === 0 ? '' : '-' + i}`,
        value: completedInWeek,
      });
    }
    return weeks;
  };

  const weeklyTrendData = {
    labels: weeksData().map(w => w.label),
    datasets: [
      {
        label: 'Défis complétés',
        data: weeksData().map(w => w.value),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Historique des Défis</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Trophy className="h-5 w-5 mr-2" />
          {stats?.totalCompleted || 0} complétés
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de complétion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.totalCompleted} / {history.length} défis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Flame className="h-4 w-4 mr-2 text-orange-500" />
              Série actuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.currentStreak || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">jours consécutifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
              Meilleur streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.bestStreak || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">record personnel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Moyenne hebdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.weeklyAverage.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">sur 4 semaines</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="charts">
            <Target className="h-4 w-4 mr-2" />
            Graphiques
          </TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier mensuel des défis</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {selectedDate && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>
                  Défis du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history
                  .filter(h => {
                    if (!h.completed || !h.completed_at) return false;
                    const completedDate = new Date(h.completed_at);
                    return completedDate.toDateString() === selectedDate.toDateString();
                  })
                  .map(h => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{h.challenge.objective}</p>
                        <p className="text-sm text-muted-foreground">
                          Type: {h.challenge.type} • Profil: {h.challenge.emotional_profile}
                        </p>
                      </div>
                      <Badge variant="default">✓ Complété</Badge>
                    </div>
                  ))}
                {history.filter(h => {
                  if (!h.completed || !h.completed_at) return false;
                  const completedDate = new Date(h.completed_at);
                  return completedDate.toDateString() === selectedDate.toDateString();
                }).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucun défi complété ce jour
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Complétion par type de défi</CardTitle>
              </CardHeader>
              <CardContent>
                {typeChartData && <Bar data={typeChartData} options={{ responsive: true }} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux par profil émotionnel</CardTitle>
              </CardHeader>
              <CardContent>
                {profileChartData && <Doughnut data={profileChartData} options={{ responsive: true }} />}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution sur 8 semaines</CardTitle>
            </CardHeader>
            <CardContent>
              <Line data={weeklyTrendData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Tous les défis ({history.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.map(h => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{h.challenge.objective}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(h.challenge.challenge_date), 'dd MMM yyyy', {
                          locale: fr,
                        })}{' '}
                        • Type: {h.challenge.type} • Profil: {h.challenge.emotional_profile}
                      </p>
                    </div>
                    {h.completed ? (
                      <Badge variant="default">✓ Complété</Badge>
                    ) : (
                      <Badge variant="outline">En cours</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengesHistory;
