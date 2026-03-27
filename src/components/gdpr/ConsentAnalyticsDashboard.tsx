// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useConsentAnalytics } from '@/hooks/useConsentAnalytics';
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export const ConsentAnalyticsDashboard = () => {
  const { data: analytics, isLoading } = useConsentAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const totalConsents = analytics.conversionRates.reduce((sum, c) => sum + c.total, 0);
  const totalGranted = analytics.conversionRates.reduce((sum, c) => sum + c.granted, 0);
  const overallRate = totalConsents > 0 ? ((totalGranted / totalConsents) * 100).toFixed(1) : 0;

  const recentChanges = analytics.recentActivity.reduce((sum, day) => sum + day.changes, 0);
  const avgDailyChanges = (recentChanges / 7).toFixed(1);

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux global</p>
                <p className="text-3xl font-bold">{overallRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consentements</p>
                <p className="text-3xl font-bold">{totalGranted}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Changements/jour</p>
                <p className="text-3xl font-bold">{avgDailyChanges}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Canaux actifs</p>
                <p className="text-3xl font-bold">{analytics.channelPreferences.length}</p>
              </div>
              <PieChart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taux de conversion par canal */}
      <Card>
        <CardHeader>
          <CardTitle>Taux de conversion par canal</CardTitle>
          <CardDescription>Pourcentage d'acceptation pour chaque canal de communication</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.conversionRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rate" name="Taux (%)" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistiques par finalité */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par finalité</CardTitle>
            <CardDescription>Consentements accordés vs retirés par finalité</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.purposeStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="purpose" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="granted" name="Accordés" fill="#10b981" />
                <Bar dataKey="withdrawn" name="Retirés" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Canaux préférés */}
        <Card>
          <CardHeader>
            <CardTitle>Canaux préférés</CardTitle>
            <CardDescription>Distribution des consentements actifs par canal</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={analytics.channelPreferences}
                  dataKey="count"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.channel} (${entry.percentage.toFixed(0)}%)`}
                >
                  {analytics.channelPreferences.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Timeline des changements */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution sur 30 jours</CardTitle>
          <CardDescription>Tendances des consentements accordés et retirés</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="granted" name="Accordés" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="withdrawn" name="Retirés" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>Activité des 7 derniers jours</CardTitle>
          <CardDescription>Nombre de changements de consentement par jour</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.recentActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="changes" name="Changements" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
