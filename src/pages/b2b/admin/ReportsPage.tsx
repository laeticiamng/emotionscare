
import React, { useState } from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, Share, Calendar } from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  
  // Mock chart data
  const emotionData = [
    { name: 'Lun', joie: 65, calme: 45, stress: 20, total: 130 },
    { name: 'Mar', joie: 59, calme: 50, stress: 24, total: 133 },
    { name: 'Mer', joie: 80, calme: 40, stress: 28, total: 148 },
    { name: 'Jeu', joie: 81, calme: 39, stress: 40, total: 160 },
    { name: 'Ven', joie: 56, calme: 42, stress: 20, total: 118 },
    { name: 'Sam', joie: 55, calme: 48, stress: 10, total: 113 },
    { name: 'Dim', joie: 70, calme: 60, stress: 5, total: 135 }
  ];
  
  const engagementData = [
    { name: 'Lun', utilisateurs: 32 },
    { name: 'Mar', utilisateurs: 38 },
    { name: 'Mer', utilisateurs: 45 },
    { name: 'Jeu', utilisateurs: 50 },
    { name: 'Ven', utilisateurs: 48 },
    { name: 'Sam', utilisateurs: 30 },
    { name: 'Dim', utilisateurs: 25 }
  ];
  
  const sessionTypeData = [
    { name: 'Musicothérapie', value: 45 },
    { name: 'Journal', value: 25 },
    { name: 'Méditation', value: 20 },
    { name: 'Autre', value: 10 }
  ];
  
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Rapports & Analyses</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share className="h-4 w-4" />
              <span>Partager</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois-ci</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="emotions">Émotions</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* KPI summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">45/56</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">+12%</span> depuis le mois dernier
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sessions totales</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">356</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">+8%</span> depuis le mois dernier
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Taux de bien-être</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">72%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">+5%</span> depuis le mois dernier
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Temps moyen</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">18 min</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-amber-600">-2%</span> depuis le mois dernier
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Main charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances émotionnelles</CardTitle>
                  <CardDescription>Évolution des émotions sur les 7 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={emotionData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="joie" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="calme" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des sessions</CardTitle>
                  <CardDescription>Répartition par type d'activité</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sessionTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {sessionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* User engagement chart */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement des utilisateurs</CardTitle>
                <CardDescription>Nombre d'utilisateurs actifs par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="utilisateurs" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emotions">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des émotions</CardTitle>
                <CardDescription>Données détaillées sur les émotions de l'équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-8">Contenu détaillé de l'analyse des émotions...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Rapport d'engagement</CardTitle>
                <CardDescription>Statistiques d'utilisation et d'engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-8">Contenu détaillé du rapport d'engagement...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des sessions</CardTitle>
                <CardDescription>Détails sur les sessions et activités</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-8">Contenu détaillé de l'analyse des sessions...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default ReportsPage;
