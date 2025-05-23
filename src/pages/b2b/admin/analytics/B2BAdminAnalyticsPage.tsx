
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  Target,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const B2BAdminAnalyticsPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analyticsData = {
    overall: {
      avgWellbeing: 76,
      change: +5.2,
      totalUsers: 156,
      activeUsers: 142,
      engagementRate: 84,
      completionRate: 78
    },
    departments: [
      { name: 'Marketing', score: 82, users: 24, trend: 'up', change: +3.1 },
      { name: 'IT', score: 78, users: 18, trend: 'up', change: +1.8 },
      { name: 'Ventes', score: 74, users: 30, trend: 'down', change: -2.4 },
      { name: 'RH', score: 85, users: 12, trend: 'up', change: +4.2 },
      { name: 'Finance', score: 72, users: 15, trend: 'stable', change: +0.3 },
      { name: 'Production', score: 70, users: 35, trend: 'down', change: -1.2 },
      { name: 'R&D', score: 79, users: 22, trend: 'up', change: +2.7 }
    ],
    trends: {
      weekly: [65, 68, 72, 74, 76, 78, 76],
      monthly: [70, 72, 74, 76],
      engagement: [78, 80, 82, 84]
    },
    features: {
      emotionalScan: { usage: 85, satisfaction: 4.2 },
      socialNetwork: { usage: 72, satisfaction: 4.0 },
      challenges: { usage: 68, satisfaction: 4.3 },
      support: { usage: 45, satisfaction: 4.5 }
    }
  };

  const exportData = (type: string) => {
    console.log(`Exporting ${type} data...`);
    // Simulate export functionality
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-primary" />
            Analytics Avancées
          </h1>
          <p className="text-muted-foreground">
            Analyses détaillées du bien-être organisationnel
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sélectionner département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="sales">Ventes</SelectItem>
              <SelectItem value="hr">RH</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="rd">R&D</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score Bien-être Moyen</p>
                <p className="text-3xl font-bold">{analyticsData.overall.avgWellbeing}%</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{analyticsData.overall.change}%</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold">{analyticsData.overall.activeUsers}</p>
                <p className="text-sm text-muted-foreground">sur {analyticsData.overall.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'Engagement</p>
                <p className="text-3xl font-bold">{analyticsData.overall.engagementRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${analyticsData.overall.engagementRate}%` }}
                  ></div>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de Complétion</p>
                <p className="text-3xl font-bold">{analyticsData.overall.completionRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${analyticsData.overall.completionRate}%` }}
                  ></div>
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analyses Détaillées</CardTitle>
          <CardDescription>Vue approfondie des métriques organisationnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="departments" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="departments">Départements</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
              <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="departments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Performance par Département</h3>
                <Button variant="outline" size="sm" onClick={() => exportData('departments')}>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.departments.map((dept) => (
                  <Card key={dept.name} className="relative">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground">{dept.users} membres</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(dept.trend)}
                          <span className={`text-sm ${getTrendColor(dept.trend)}`}>
                            {dept.change > 0 ? '+' : ''}{dept.change}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Score bien-être</span>
                          <span className="font-semibold">{dept.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${dept.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Évolution Temporelle</h3>
                <Button variant="outline" size="sm" onClick={() => exportData('trends')}>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bien-être Hebdomadaire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.trends.weekly.map((value, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">Semaine {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Engagement Mensuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.trends.engagement.map((value, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">Mois {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Utilisation des Fonctionnalités</h3>
                <Button variant="outline" size="sm" onClick={() => exportData('features')}>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analyticsData.features).map(([key, data]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-medium capitalize">
                          {key === 'emotionalScan' ? 'Analyse Émotionnelle' :
                           key === 'socialNetwork' ? 'Réseau Social' :
                           key === 'challenges' ? 'Défis' : 'Support'}
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Utilisation</span>
                            <span className="font-semibold">{data.usage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${data.usage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Satisfaction</span>
                            <Badge variant="secondary">{data.satisfaction}/5</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Génération de Rapports</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rapports Automatiques</CardTitle>
                    <CardDescription>Génération programmée</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Rapport hebdomadaire - Vendredi 17h
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Rapport mensuel - 1er du mois
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Rapport trimestriel - Fin de trimestre
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rapports Personnalisés</CardTitle>
                    <CardDescription>Génération à la demande</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" onClick={() => exportData('custom-wellness')}>
                      Rapport Bien-être Global
                    </Button>
                    <Button className="w-full" onClick={() => exportData('custom-department')}>
                      Analyse par Département
                    </Button>
                    <Button className="w-full" onClick={() => exportData('custom-trends')}>
                      Rapport de Tendances
                    </Button>
                    <Button className="w-full" onClick={() => exportData('custom-recommendations')}>
                      Recommandations Stratégiques
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
