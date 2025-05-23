
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  Filter,
  Activity,
  AlertTriangle,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BAdminAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [department, setDepartment] = useState('all');

  const analyticsData = {
    summary: [
      {
        title: "Score moyen général",
        value: "78.5",
        change: "+5.2%",
        trend: "up",
        icon: Activity
      },
      {
        title: "Participation",
        value: "84%",
        change: "+12%",
        trend: "up", 
        icon: Users
      },
      {
        title: "Risques détectés",
        value: "7",
        change: "-3",
        trend: "down",
        icon: AlertTriangle
      },
      {
        title: "Objectifs atteints",
        value: "92%",
        change: "+8%",
        trend: "up",
        icon: Target
      }
    ],
    departments: [
      { name: 'IT', score: 85, participation: 95, risk: 'low' },
      { name: 'Marketing', score: 78, participation: 88, risk: 'medium' },
      { name: 'RH', score: 82, participation: 92, risk: 'low' },
      { name: 'Finance', score: 72, participation: 76, risk: 'high' },
      { name: 'Commercial', score: 80, participation: 84, risk: 'medium' }
    ],
    trends: [
      { week: 'S1', score: 72 },
      { week: 'S2', score: 74 },
      { week: 'S3', score: 76 },
      { week: 'S4', score: 78 }
    ]
  };

  const exportData = () => {
    console.log('Exporting analytics data...');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Avancées</h1>
          <p className="text-muted-foreground">
            Analyses détaillées du bien-être organisationnel
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">3 derniers mois</SelectItem>
                  <SelectItem value="1y">1 an</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Département</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">RH</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="sales">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.summary.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Évolution du bien-être
          </CardTitle>
          <CardDescription>
            Tendance du score moyen sur les 4 dernières semaines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Graphique de tendances</p>
              <p className="text-sm text-muted-foreground">
                Intégration Recharts en cours de développement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Analyse par département
          </CardTitle>
          <CardDescription>
            Performance et risques par équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="font-medium text-primary">{dept.name}</span>
                  </div>
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Participation: {dept.participation}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{dept.score}</p>
                    <p className="text-sm text-muted-foreground">Score moyen</p>
                  </div>
                  <Badge className={getRiskColor(dept.risk)}>
                    {dept.risk === 'low' ? 'Faible' : 
                     dept.risk === 'medium' ? 'Moyen' : 'Élevé'} risque
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommandations IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Action prioritaire</h4>
              <p className="text-sm text-blue-700 mt-1">
                Organiser une session de team building pour l'équipe Finance
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Succès à reproduire</h4>
              <p className="text-sm text-green-700 mt-1">
                Les pratiques de l'équipe IT montrent d'excellents résultats
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">Point d'attention</h4>
              <p className="text-sm text-orange-700 mt-1">
                Baisse de participation dans le département Marketing
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochaines actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Intervention d'urgence - Équipe Finance</p>
                <p className="text-xs text-muted-foreground">Dans 2 jours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Rapport mensuel de direction</p>
                <p className="text-xs text-muted-foreground">Dans 1 semaine</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Session de formation managers</p>
                <p className="text-xs text-muted-foreground">Dans 2 semaines</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
