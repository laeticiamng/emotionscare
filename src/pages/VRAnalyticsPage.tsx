
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Heart, PlayCircle } from 'lucide-react';
import { fetchVRCount } from '@/lib/vrService';

const VRAnalyticsPage = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("7");
  const [vrCount, setVrCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Sample data for charts
  const sessionData = [
    { date: '1/5', count: 5, avgHrv: 8 },
    { date: '2/5', count: 12, avgHrv: 10 },
    { date: '3/5', count: 8, avgHrv: 7 },
    { date: '4/5', count: 15, avgHrv: 12 },
    { date: '5/5', count: 18, avgHrv: 9 },
    { date: '6/5', count: 10, avgHrv: 11 },
    { date: '7/5', count: 14, avgHrv: 10 },
  ];
  
  const serviceData = [
    { name: 'IT', userCount: 24, avgHrv: 8.5 },
    { name: 'Marketing', userCount: 18, avgHrv: 10.2 },
    { name: 'RH', userCount: 12, avgHrv: 7.8 },
    { name: 'Finance', userCount: 15, avgHrv: 9.0 },
    { name: 'Direction', userCount: 5, avgHrv: 6.5 },
  ];
  
  const themeData = [
    { name: 'Forêt', value: 45 },
    { name: 'Océan', value: 30 },
    { name: 'Montagne', value: 15 },
    { name: 'Espace', value: 5 },
    { name: 'Urbain Zen', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  useEffect(() => {
    document.title = 'Statistiques VR';
    
    const loadData = async () => {
      try {
        setLoading(true);
        const count = await fetchVRCount();
        setVrCount(count);
        setLoading(false);
      } catch (error) {
        console.error('Error loading VR analytics:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [period]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Statistiques Micro-pauses</h1>
          <p className="text-muted-foreground">
            Analysez l'impact des sessions VR sur le bien-être des utilisateurs
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="flex items-center"
          onClick={() => navigate('/dashboard')}
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Retour au tableau de bord
        </Button>
      </div>
      
      <Tabs defaultValue="7" className="mb-6" onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="7">7 jours</TabsTrigger>
          <TabsTrigger value="30">30 jours</TabsTrigger>
          <TabsTrigger value="90">90 jours</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <PlayCircle className="mr-2 h-5 w-5 text-primary" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vrCount}</div>
            <p className="text-sm text-muted-foreground">+14% vs période précédente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              ∆HRV moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-9.2%</div>
            <Progress className="h-2 mt-2" value={65} />
            <p className="text-sm text-muted-foreground mt-1">Réduction du stress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Taux d'engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68%</div>
            <p className="text-sm text-muted-foreground">Utilisateurs > 1 session/semaine</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sessions et impact HRV</CardTitle>
            <CardDescription>Nombre de sessions et ∆HRV moyen par jour</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sessionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Sessions" fill="#8884d8" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgHrv"
                  name="∆HRV moyen"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>∆HRV moyen par service</CardTitle>
            <CardDescription>Impact des micro-pauses par département</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgHrv" name="∆HRV moyen %" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des thèmes VR</CardTitle>
            <CardDescription>Préférences des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={themeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {themeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top 3 Sessions les Plus Efficaces</CardTitle>
            <CardDescription>Sessions avec le meilleur impact sur le bien-être</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-4">1</div>
                <div className="flex-1">
                  <p className="font-medium">Forêt Apaisante (5 min)</p>
                  <p className="text-sm text-muted-foreground">∆HRV moyen: -12.5%</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-4">2</div>
                <div className="flex-1">
                  <p className="font-medium">Méditation Guidée (10 min)</p>
                  <p className="text-sm text-muted-foreground">∆HRV moyen: -10.8%</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-4">3</div>
                <div className="flex-1">
                  <p className="font-medium">Plage Relaxante (7 min)</p>
                  <p className="text-sm text-muted-foreground">∆HRV moyen: -9.3%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-muted/50 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold mb-4">Suggestions de l'IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium">Pause méditation de groupe</h3>
              <p className="text-sm text-muted-foreground">10 min en début de journée pour le service IT</p>
              <Button size="sm" className="w-full mt-2">Planifier</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium">Atelier respiration</h3>
              <p className="text-sm text-muted-foreground">15 min à 14h pour le service Marketing</p>
              <Button size="sm" className="w-full mt-2">Planifier</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium">Session d'immersion guidée</h3>
              <p className="text-sm text-muted-foreground">Programme de 30 min pour les nouveaux utilisateurs</p>
              <Button size="sm" className="w-full mt-2">Planifier</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VRAnalyticsPage;
