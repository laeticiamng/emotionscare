import { useState } from 'react';
import { AlertCircle, Activity, TrendingUp, Database, RefreshCw, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMonitoringEvents, useMonitoringStats } from '@/hooks/useMonitoringEvents';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function MonitoringDashboard() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [contextFilter, setContextFilter] = useState<string>('all');

  const { stats, isLoading: statsLoading, refetch: refetchStats } = useMonitoringStats(timeRange);
  const { events, isLoading: eventsLoading, refetch: refetchEvents } = useMonitoringEvents({
    limit: 100,
    severity: severityFilter !== 'all' ? (severityFilter as any) : undefined,
    context: contextFilter !== 'all' ? (contextFilter as any) : undefined,
  });

  const handleRefresh = () => {
    refetchStats();
    refetchEvents();
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Type', 'Severity', 'Context', 'Message'].join(','),
      ...events.map(e => [
        e.timestamp,
        e.event_type,
        e.severity,
        e.context,
        `"${e.message.replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-events-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Prepare chart data
  const contextChartData = stats?.errorsByContext
    ? Object.entries(stats.errorsByContext).map(([name, value]) => ({ name, value }))
    : [];

  const eventTypeChartData = stats?.eventsByType
    ? Object.entries(stats.eventsByType).map(([name, value]) => ({ name, value }))
    : [];

  const trendChartData = stats?.recentTrend.map(t => ({
    time: format(new Date(t.timestamp), timeRange === '1h' ? 'HH:mm' : 'dd/MM HH:mm', { locale: fr }),
    count: t.count,
  })) || [];

  const criticalEvents = events.filter(e => e.severity === 'critical').slice(0, 10);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Surveillance temps réel des événements de l'application</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={statsLoading || eventsLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-4">
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Dernière heure</SelectItem>
            <SelectItem value="24h">Dernières 24h</SelectItem>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sévérité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes sévérités</SelectItem>
            <SelectItem value="critical">Critique</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="low">Basse</SelectItem>
          </SelectContent>
        </Select>

        <Select value={contextFilter} onValueChange={setContextFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Contexte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous contextes</SelectItem>
            <SelectItem value="AUTH">Authentification</SelectItem>
            <SelectItem value="API">API</SelectItem>
            <SelectItem value="UI">Interface</SelectItem>
            <SelectItem value="SCAN">Scan</SelectItem>
            <SelectItem value="VR">VR</SelectItem>
            <SelectItem value="SYSTEM">Système</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Événements</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">Sur la période sélectionnée</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.criticalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention immédiate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contextes Actifs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats?.errorsByContext || {}).length}</div>
            <p className="text-xs text-muted-foreground">Modules surveillés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.recentTrend && stats.recentTrend.length > 1
                ? `${((stats.recentTrend[stats.recentTrend.length - 1].count / Math.max(stats.recentTrend[0].count, 1) - 1) * 100).toFixed(1)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Variation sur la période</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">Tendance temporelle</TabsTrigger>
          <TabsTrigger value="context">Par contexte</TabsTrigger>
          <TabsTrigger value="type">Par type</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des événements</CardTitle>
              <CardDescription>Nombre d'événements au fil du temps</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Événements" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="context" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Événements par contexte</CardTitle>
                <CardDescription>Distribution par module</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contextChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contextChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Classement des contextes</CardTitle>
                <CardDescription>Les plus actifs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contextChartData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="type" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Événements par type</CardTitle>
              <CardDescription>Répartition des types d'événements</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventTypeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Nombre" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Critical Events Alert */}
      {criticalEvents.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Alertes Critiques Récentes
            </CardTitle>
            <CardDescription>Événements nécessitant une attention immédiate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalEvents.map((event) => (
                <div key={event.id} className="flex items-start justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{event.severity}</Badge>
                      <Badge variant="outline">{event.context}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.timestamp), 'dd MMM yyyy HH:mm:ss', { locale: fr })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{event.message}</p>
                    {event.metadata && (
                      <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Événements Récents</CardTitle>
          <CardDescription>100 derniers événements filtrés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {events.slice(0, 50).map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-4 rounded-lg border p-3 hover:bg-accent">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={event.severity === 'critical' || event.severity === 'high' ? 'destructive' : 'secondary'}
                      style={
                        event.severity === 'medium' || event.severity === 'low'
                          ? { backgroundColor: SEVERITY_COLORS[event.severity as keyof typeof SEVERITY_COLORS] }
                          : undefined
                      }
                    >
                      {event.severity}
                    </Badge>
                    <Badge variant="outline">{event.event_type}</Badge>
                    <Badge variant="outline">{event.context}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(event.timestamp), 'dd MMM HH:mm:ss', { locale: fr })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{event.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
