
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const B2BAdminAnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('wellness');
  const [isLoading, setIsLoading] = useState(true);

  // Données mockées pour les graphiques
  const wellnessData = [
    { name: 'Sem 1', value: 65 },
    { name: 'Sem 2', value: 68 },
    { name: 'Sem 3', value: 72 },
    { name: 'Sem 4', value: 78 },
    { name: 'Sem 5', value: 75 },
    { name: 'Sem 6', value: 82 },
  ];

  const engagementData = [
    { name: 'Lun', sessions: 24, utilisateurs: 18 },
    { name: 'Mar', sessions: 32, utilisateurs: 25 },
    { name: 'Mer', sessions: 28, utilisateurs: 22 },
    { name: 'Jeu', sessions: 35, utilisateurs: 28 },
    { name: 'Ven', sessions: 30, utilisateurs: 24 },
    { name: 'Sam', sessions: 15, utilisateurs: 12 },
    { name: 'Dim', sessions: 18, utilisateurs: 14 },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleExportData = () => {
    // Ici, vous implémenteriez l'export des données
    console.log('Exporting analytics data...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
        <div className="container mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="container mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analyses et rapports
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Statistiques détaillées de votre organisation
            </p>
          </div>
          <div className="flex gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">90 jours</SelectItem>
                <SelectItem value="1y">1 an</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-green-600 mt-2">+12% vs période précédente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions totales</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-green-600 mt-2">+8% vs période précédente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <Progress value={78} className="mt-2" />
              <p className="text-xs text-green-600 mt-2">+5% vs période précédente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'engagement</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <Progress value={82} className="mt-2" />
              <p className="text-xs text-green-600 mt-2">+3% vs période précédente</p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du bien-être</CardTitle>
              <CardDescription>Score moyen de bien-être sur les 6 dernières semaines</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={wellnessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement hebdomadaire</CardTitle>
              <CardDescription>Sessions et utilisateurs actifs par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#8884d8" />
                  <Bar dataKey="utilisateurs" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Détails par département */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par département</CardTitle>
            <CardDescription>Analyse détaillée des métriques par équipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Département</th>
                    <th className="text-left p-4">Utilisateurs</th>
                    <th className="text-left p-4">Score moyen</th>
                    <th className="text-left p-4">Sessions/semaine</th>
                    <th className="text-left p-4">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">IT</td>
                    <td className="p-4">32</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>82%</span>
                        <Progress value={82} className="w-16 h-2" />
                      </div>
                    </td>
                    <td className="p-4">4.2</td>
                    <td className="p-4 text-green-600">Excellent</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Marketing</td>
                    <td className="p-4">28</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>76%</span>
                        <Progress value={76} className="w-16 h-2" />
                      </div>
                    </td>
                    <td className="p-4">3.8</td>
                    <td className="p-4 text-blue-600">Bon</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Finance</td>
                    <td className="p-4">24</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>79%</span>
                        <Progress value={79} className="w-16 h-2" />
                      </div>
                    </td>
                    <td className="p-4">3.5</td>
                    <td className="p-4 text-blue-600">Bon</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">RH</td>
                    <td className="p-4">18</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>85%</span>
                        <Progress value={85} className="w-16 h-2" />
                      </div>
                    </td>
                    <td className="p-4">4.8</td>
                    <td className="p-4 text-green-600">Excellent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
