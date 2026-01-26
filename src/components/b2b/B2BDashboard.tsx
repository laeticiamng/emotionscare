import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, TrendingUp, FileText, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface B2BDashboardProps {
  orgId: string;
}

const B2BDashboard: React.FC<B2BDashboardProps> = ({ orgId }) => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [period, setPeriod] = useState('7days');
  const [overview, setOverview] = useState<any>(null);
  const [teamAnalytics, setTeamAnalytics] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOrgOverview();
    loadTeamAnalytics();
  }, [orgId, period]);

  const loadOrgOverview = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('b2b-management', {
        body: { action: 'getOrgOverview', orgId, period },
      });

      if (error) throw error;
      setOverview(data);
    } catch (error) {
      logger.error('Error loading org overview', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTeamAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('b2b-management', {
        body: { action: 'getTeamAnalytics', orgId, period },
      });

      if (error) throw error;
      setTeamAnalytics(data);
    } catch (error) {
      logger.error('Error loading team analytics', error as Error, 'UI');
    }
  };

  const generateReport = async () => {
    try {
      setGenerating(true);
 const { error } = await supabase.functions.invoke('b2b-management', {
        body: { action: 'generateReport', orgId, period },
      });

      if (error) throw error;

      toast({
        title: 'Rapport généré',
        description: 'Le rapport de bien-être organisationnel est prêt',
      });
    } catch (error) {
      logger.error('Error generating report', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le rapport',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{overview?.organization?.name || 'Tableau de bord B2B'}</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble du bien-être organisationnel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="90days">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport} disabled={generating}>
            {generating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Générer rapport
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Membres actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.wellnessMetrics?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              sur {overview?.memberCount || 0} membres
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Bien-être moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.wellnessMetrics?.avgMoodScore?.toFixed(1) || '0'}/10
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Niveau de stress: {overview?.wellnessMetrics?.avgStressLevel?.toFixed(1) || '0'}/10
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Taux d'engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((overview?.wellnessMetrics?.engagementRate || 0) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En hausse de 5% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamAnalytics?.teams?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              équipes actives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du bien-être</CardTitle>
              <CardDescription>Tendance sur {period === '7days' ? '7 jours' : period === '30days' ? '30 jours' : '90 jours'}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={overview?.trends?.moodTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgMood" stroke="hsl(var(--primary))" name="Bien-être moyen" />
                  <Line type="monotone" dataKey="activeUsers" stroke="hsl(var(--chart-2))" name="Utilisateurs actifs" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance des équipes</CardTitle>
              <CardDescription>Métriques de bien-être par équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamAnalytics?.teams?.map((team: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{team.teamName}</h4>
                      <p className="text-sm text-muted-foreground">{team.memberCount} membres</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{team.avgWellness.toFixed(1)}/10</div>
                      <p className="text-xs text-muted-foreground">
                        Engagement: {(team.engagementRate * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des émotions</CardTitle>
              <CardDescription>États émotionnels dominants dans l'organisation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overview?.trends?.topEmotions || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="emotion" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" fill="hsl(var(--primary))" name="Pourcentage (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BDashboard;
