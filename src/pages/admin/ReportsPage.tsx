
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Download, Calendar, Users, Activity, Heart, Brain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const usageData = [
    { name: 'Lun', scans: 45, musique: 32, journal: 28, vr: 15 },
    { name: 'Mar', scans: 52, musique: 38, journal: 31, vr: 18 },
    { name: 'Mer', scans: 48, musique: 42, journal: 35, vr: 22 },
    { name: 'Jeu', scans: 61, musique: 45, journal: 39, vr: 25 },
    { name: 'Ven', scans: 55, musique: 48, journal: 42, vr: 28 },
    { name: 'Sam', scans: 38, musique: 35, journal: 25, vr: 12 },
    { name: 'Dim', scans: 42, musique: 40, journal: 30, vr: 16 }
  ];

  const wellnessData = [
    { name: 'Semaine 1', score: 72 },
    { name: 'Semaine 2', score: 75 },
    { name: 'Semaine 3', score: 78 },
    { name: 'Semaine 4', score: 82 },
    { name: 'Semaine 5', score: 85 },
    { name: 'Semaine 6', score: 83 },
    { name: 'Semaine 7', score: 87 }
  ];

  const departmentData = [
    { name: 'Cardiologie', value: 35, color: '#8884d8' },
    { name: 'Urgences', value: 28, color: '#82ca9d' },
    { name: 'Pédiatrie', value: 20, color: '#ffc658' },
    { name: 'Neurologie', value: 17, color: '#ff7c7c' }
  ];

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" data-testid="page-root">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Rapports & Analytics
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Analysez l'utilisation et l'impact de la plateforme
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">3 derniers mois</SelectItem>
                  <SelectItem value="1y">Dernière année</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => exportReport('global')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* KPIs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> vs mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions Totales</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,532</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8.2%</span> vs mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Score Bien-être Moyen</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5.3%</span> vs mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> vs mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="usage" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="usage">Utilisation</TabsTrigger>
              <TabsTrigger value="wellness">Bien-être</TabsTrigger>
              <TabsTrigger value="departments">Départements</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des Fonctionnalités</CardTitle>
                  <CardDescription>
                    Sessions par fonctionnalité sur les 7 derniers jours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="scans" name="Scans émotionnels" fill="#8884d8" />
                      <Bar dataKey="musique" name="Musicothérapie" fill="#82ca9d" />
                      <Bar dataKey="journal" name="Journal" fill="#ffc658" />
                      <Bar dataKey="vr" name="VR" fill="#ff7c7c" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Fonctionnalités</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Scan émotionnel</span>
                      <Badge>1,847 sessions</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Musicothérapie</span>
                      <Badge variant="secondary">1,456 sessions</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Journal</span>
                      <Badge variant="secondary">1,234 sessions</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>VR</span>
                      <Badge variant="outline">892 sessions</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Temps d'Utilisation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Durée moyenne/session</span>
                      <Badge>12 min 34s</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sessions/utilisateur/jour</span>
                      <Badge variant="secondary">2.4</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Temps total cette semaine</span>
                      <Badge variant="secondary">847h</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pic d'utilisation</span>
                      <Badge variant="outline">14h-16h</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="wellness" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du Score de Bien-être</CardTitle>
                  <CardDescription>
                    Score moyen de bien-être de l'établissement sur les 7 dernières semaines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={wellnessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par Département</CardTitle>
                    <CardDescription>
                      Pourcentage d'utilisation par service
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance par Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {departmentData.map((dept, index) => (
                      <div key={dept.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{dept.name}</span>
                          <Badge style={{ backgroundColor: dept.color, color: 'white' }}>
                            {dept.value}% d'utilisation
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${dept.value}%`, 
                              backgroundColor: dept.color 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Tendances Positives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">+23% d'engagement</p>
                      <p className="text-xs text-green-600">Scan émotionnel</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">+18% de rétention</p>
                      <p className="text-xs text-green-600">Utilisateurs actifs</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">+15% satisfaction</p>
                      <p className="text-xs text-green-600">Score global</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Prédictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Pic d'utilisation prévu</p>
                      <p className="text-xs text-blue-600">Lundi 15h-17h</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Objectif bien-être</p>
                      <p className="text-xs text-blue-600">90% atteignable</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Croissance utilisateurs</p>
                      <p className="text-xs text-blue-600">+200 ce mois</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actions Recommandées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">Promouvoir VR</p>
                      <p className="text-xs text-orange-600">Faible adoption</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">Formation équipes</p>
                      <p className="text-xs text-orange-600">Optimiser usage</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">Contenu personnalisé</p>
                      <p className="text-xs text-orange-600">Augmenter engagement</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;
