
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const CoachAnalyticsPage: React.FC = () => {
  const [period, setPeriod] = React.useState('month');
  
  // Dummy data for demonstration
  const usageData = [
    { name: 'Lun', value: 24 },
    { name: 'Mar', value: 32 },
    { name: 'Mer', value: 18 },
    { name: 'Jeu', value: 29 },
    { name: 'Ven', value: 43 },
    { name: 'Sam', value: 12 },
    { name: 'Dim', value: 9 },
  ];
  
  const topicsData = [
    { name: 'Stress', value: 40 },
    { name: 'Équilibre', value: 25 },
    { name: 'Organisation', value: 15 },
    { name: 'Relations', value: 12 },
    { name: 'Autres', value: 8 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Analytics Coach IA</h1>
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">30 derniers jours</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Alert variant="warning" className="bg-yellow-100 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription>
            Toutes les données sont anonymisées. Aucune conversation individuelle ou contenu précis n'est accessible.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">78%</h3>
                <p className="text-muted-foreground">Taux d'engagement</p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Utilisateurs actifs / utilisateurs totaux</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">12.3</h3>
                <p className="text-muted-foreground">Minutes/session en moyenne</p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">+15% vs mois précédent</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">243</h3>
                <p className="text-muted-foreground">Sessions totales</p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">+22% vs mois précédent</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="usage">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
            <TabsTrigger value="topics">Sujets abordés</TabsTrigger>
            <TabsTrigger value="feedback">Impact & Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Utilisation du Coach IA par jour</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={usageData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Heures d'utilisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div>
                      <span className="text-sm font-medium">Pic d'utilisation:</span>
                      <span className="ml-2">10h-12h & 14h-16h</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Plus faible:</span>
                      <span className="ml-2">19h-7h</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Durée moyenne:</span>
                      <span className="ml-2">12.3 minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div>
                      <span className="text-sm font-medium">Utilisateurs uniques:</span>
                      <span className="ml-2">87</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Utilisateurs récurrents:</span>
                      <span className="ml-2">62 (71%)</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Sessions/utilisateur:</span>
                      <span className="ml-2">2.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Principaux sujets abordés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topicsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {topicsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm">Les sujets liés à la <span className="font-medium">gestion du stress</span> sont les plus abordés, représentant 40% des conversations.</p>
                    <p className="text-sm">Les questions d'<span className="font-medium">équilibre vie pro/vie perso</span> sont en hausse de 15% par rapport au mois dernier.</p>
                    <p className="text-sm">Certains départements montrent des tendances spécifiques:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Marketing: plus de questions sur la créativité</li>
                      <li>Développement: focus sur la concentration</li>
                      <li>Service client: gestion des émotions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Impact & satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Satisfaction utilisateurs</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Très satisfait</span>
                          <span className="text-sm font-medium">67%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Satisfait</span>
                          <span className="text-sm font-medium">24%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Neutre</span>
                          <span className="text-sm font-medium">7%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '7%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Insatisfait</span>
                          <span className="text-sm font-medium">2%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-red-500 rounded-full" style={{ width: '2%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Impact mesuré</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Réduction stress perçu</span>
                          <span className="text-sm font-medium">-22%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Amélioration équilibre</span>
                          <span className="text-sm font-medium">+18%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Adoption techniques</span>
                          <span className="text-sm font-medium">54%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-purple-500 rounded-full" style={{ width: '54%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CoachAnalyticsPage;
