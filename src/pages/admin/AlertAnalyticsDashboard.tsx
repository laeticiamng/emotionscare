import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  Target,
  Timer
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ExportReportButtons } from '@/components/admin/ExportReportButtons';

interface AlertAnalytics {
  date: string;
  total_alerts: number;
  resolved_count: number;
  unresolved_count: number;
  critical_count: number;
  high_count: number;
  urgent_count: number;
  avg_resolution_time_minutes: number | null;
  category: string;
  category_count: number;
}

interface DashboardStats {
  total_errors_7d: number;
  total_errors_30d: number;
  avg_resolution_time: number;
  resolution_rate: number;
  critical_unresolved: number;
  trend_7d: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d084d0', '#8dd1e1'];

const AlertAnalyticsDashboard = () => {
  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['alert-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_analytics')
        .select('*')
        .gte('date', subDays(new Date(), 30).toISOString())
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as AlertAnalytics[];
    },
  });

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['alert-dashboard-stats'],
    queryFn: async () => {
      const now = new Date();
      const sevenDaysAgo = subDays(now, 7);
      const thirtyDaysAgo = subDays(now, 30);

      // Get 7 days data
      const { data: data7d, error: error7d } = await supabase
        .from('ai_monitoring_errors')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString());

      // Get 30 days data
      const { data: data30d, error: error30d } = await supabase
        .from('ai_monitoring_errors')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error7d || error30d) throw error7d || error30d;

      const resolved7d = data7d?.filter(e => e.resolved) || [];
      const critical = data7d?.filter(e => e.severity === 'critical' && !e.resolved) || [];

      const avgResolutionTime = resolved7d.length > 0
        ? resolved7d.reduce((acc, err) => {
            if (err.resolved_at) {
              const diff = new Date(err.resolved_at).getTime() - new Date(err.created_at).getTime();
              return acc + diff / (1000 * 60); // minutes
            }
            return acc;
          }, 0) / resolved7d.length
        : 0;

      const resolutionRate = data7d && data7d.length > 0
        ? (resolved7d.length / data7d.length) * 100
        : 0;

      // Calculate trend
      const fourteenDaysAgo = subDays(now, 14);
      const { data: data14d } = await supabase
        .from('ai_monitoring_errors')
        .select('created_at')
        .gte('created_at', fourteenDaysAgo.toISOString())
        .lt('created_at', sevenDaysAgo.toISOString());

      const prevWeekCount = data14d?.length || 0;
      const thisWeekCount = data7d?.length || 0;
      const trend = prevWeekCount > 0
        ? ((thisWeekCount - prevWeekCount) / prevWeekCount) * 100
        : 0;

      return {
        total_errors_7d: data7d?.length || 0,
        total_errors_30d: data30d?.length || 0,
        avg_resolution_time: avgResolutionTime,
        resolution_rate: resolutionRate,
        critical_unresolved: critical.length,
        trend_7d: trend,
      } as DashboardStats;
    },
  });

  // Prepare chart data
  const timelineData = analytics?.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing.total += item.total_alerts;
      existing.resolved += item.resolved_count;
      existing.unresolved += item.unresolved_count;
    } else {
      acc.push({
        date: format(new Date(item.date), 'dd MMM', { locale: fr }),
        total: item.total_alerts,
        resolved: item.resolved_count,
        unresolved: item.unresolved_count,
      });
    }
    return acc;
  }, [] as any[]);

  const categoryData = analytics?.reduce((acc, item) => {
    const existing = acc.find(c => c.category === item.category);
    if (existing) {
      existing.count += item.category_count;
    } else {
      acc.push({
        category: item.category,
        count: item.category_count,
      });
    }
    return acc;
  }, [] as any[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const severityData = analytics?.reduce((acc, item) => {
    acc.critical += item.critical_count;
    acc.high += item.high_count;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0 });

  const pieData = severityData ? [
    { name: 'Critique', value: severityData.critical },
    { name: 'Haute', value: severityData.high },
  ].filter(d => d.value > 0) : [];

  if (statsLoading || analyticsLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">Chargement des analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics des Alertes AI</h1>
          <p className="text-muted-foreground">
            Analyse des tendances, résolutions et catégories d'erreurs
          </p>
        </div>
        <ExportReportButtons dateRangeDays={7} />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes (7j)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_errors_7d || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {stats && stats.trend_7d !== 0 && (
                <>
                  {stats.trend_7d > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">+{stats.trend_7d.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">{stats.trend_7d.toFixed(1)}%</span>
                    </>
                  )}
                  <span>vs semaine précédente</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Résolution</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.resolution_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Erreurs résolues sur 7 jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.avg_resolution_time ? `${stats.avg_resolution_time.toFixed(0)}m` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Temps de résolution moyen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critiques Non Résolues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.critical_unresolved || 0}</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent attention immédiate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="severity">Gravité</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Alertes</CardTitle>
              <CardDescription>Tendances sur les 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Résolues"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="unresolved" 
                    stroke="#ff8042" 
                    strokeWidth={2}
                    name="Non résolues"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Catégories d'Erreurs</CardTitle>
              <CardDescription>Répartition par type d'erreur</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Nombre d'erreurs" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryData?.map((cat, idx) => (
                  <div key={cat.category} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{idx + 1}</Badge>
                      <span className="font-medium">{cat.category}</span>
                    </div>
                    <Badge>{cat.count} erreurs</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="severity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Gravité</CardTitle>
              <CardDescription>Distribution des niveaux de gravité</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertAnalyticsDashboard;
