
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { HelpCircle, BarChart3, Activity, Users } from 'lucide-react';

// Mock data for dashboard
const usageData = [
  { day: 'Lun', count: 65, activeUsers: 32 },
  { day: 'Mar', count: 78, activeUsers: 40 },
  { day: 'Mer', count: 95, activeUsers: 45 },
  { day: 'Jeu', count: 72, activeUsers: 38 },
  { day: 'Ven', count: 83, activeUsers: 43 },
  { day: 'Sam', count: 41, activeUsers: 22 },
  { day: 'Dim', count: 38, activeUsers: 20 },
];

const topicsData = [
  { topic: 'Stress', value: 35 },
  { topic: 'Productivité', value: 25 },
  { topic: 'Équilibre', value: 20 },
  { topic: 'Communication', value: 15 },
  { topic: 'Autres', value: 5 },
];

const emotionTrendData = [
  { month: 'Jan', positivity: 65, negativity: 35 },
  { month: 'Fév', positivity: 60, negativity: 40 },
  { month: 'Mar', positivity: 70, negativity: 30 },
  { month: 'Avr', positivity: 75, negativity: 25 },
  { month: 'Mai', positivity: 72, negativity: 28 },
  { month: 'Jun', positivity: 78, negativity: 22 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const B2BAdminCoachAnalytics: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Coach IA</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des tendances et de l'utilisation du coach IA dans votre entreprise
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">3 derniers mois</SelectItem>
              <SelectItem value="365">Année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <HelpCircle className="h-4 w-4 mr-2" />
            Aide
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisation Total</p>
                <p className="text-3xl font-bold mt-2">472</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↑ 18%</span> vs mois précédent
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold mt-2">78%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↑ 5%</span> vs mois précédent
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Indice Bien-être</p>
                <p className="text-3xl font-bold mt-2">72/100</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↑ 3%</span> vs mois précédent
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="usage" className="space-y-8">
        <TabsList>
          <TabsTrigger value="usage">Utilisation</TabsTrigger>
          <TabsTrigger value="topics">Thématiques</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation du Coach IA</CardTitle>
              <CardDescription>
                Nombre total d'interactions et d'utilisateurs actifs par jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Interactions" fill="#8884d8" />
                    <Bar dataKey="activeUsers" name="Utilisateurs Actifs" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="topics">
          <Card>
            <CardHeader>
              <CardTitle>Thématiques abordées</CardTitle>
              <CardDescription>
                Distribution des sujets discutés avec le Coach IA
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-lg font-medium">Insights</h3>
                <ul className="space-y-3">
                  <li className="p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">35% des interactions</span> concernent la gestion du stress
                  </li>
                  <li className="p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">Hausse de 12%</span> des questions liées à l'équilibre travail-vie personnelle
                  </li>
                  <li className="p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">20% des utilisateurs</span> reviennent pour des conseils de productivité
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendance émotionnelle</CardTitle>
              <CardDescription>
                Évolution des sentiments positifs et négatifs exprimés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emotionTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="positivity" name="Sentiments Positifs" stroke="#82ca9d" activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line type="monotone" dataKey="negativity" name="Sentiments Négatifs" stroke="#ff8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-muted">
                <h3 className="font-medium mb-2">Analyse des tendances</h3>
                <p className="text-sm text-muted-foreground">
                  On observe une amélioration globale du bien-être avec une augmentation de 13% des sentiments positifs 
                  depuis janvier. Cette tendance coïncide avec l'introduction des ateliers de gestion du stress et 
                  l'adoption croissante du Coach IA par les équipes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>Toutes les données sont anonymisées et agrégées. Aucun contenu de message individuel n'est accessible.</p>
      </div>
    </div>
  );
};

export default B2BAdminCoachAnalytics;
