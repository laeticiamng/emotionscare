import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MessageSquare, Award, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchReports } from '@/lib/dashboardService';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timePeriod, setTimePeriod] = useState<string>('7');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Load reports data
        const reportsData = await fetchReports(['absenteeism', 'productivity'], parseInt(timePeriod));
        
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [timePeriod]);
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section with Period Selector */}
      <div className="mb-10 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <h1 className="text-4xl font-light">Tableau de bord <span className="font-semibold">Direction</span></h1>
            <h2 className="text-xl text-muted-foreground mt-2">
              Métriques globales et anonymisées
            </h2>
          </div>
          <div className="mt-4 md:mt-0">
            <Tabs value={timePeriod} onValueChange={setTimePeriod} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="7">7 jours</TabsTrigger>
                <TabsTrigger value="30">30 jours</TabsTrigger>
                <TabsTrigger value="90">90 jours</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Absenteeism Trends */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Tendance Absentéisme
            </CardTitle>
            <CardDescription>Taux d'absentéisme global anonymisé</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={absenteeismData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Taux d'absentéisme (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Productivity Metrics */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Indicateurs de Productivité
            </CardTitle>
            <CardDescription>Tendance de productivité agrégée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Indice de productivité" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Emotional Climate Overview */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Ambiance Générale
            </CardTitle>
            <CardDescription>Score émotionnel moyen et volume de check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-3xl font-bold text-primary">78<span className="text-base">/100</span></p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Check-ins total</p>
                <p className="text-3xl font-bold text-primary">143</p>
              </div>
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm font-medium mb-2">Notes et observations</p>
              <textarea 
                className="w-full h-[120px] border rounded-lg p-2 text-sm" 
                placeholder="Ajoutez vos observations sur l'ambiance générale ici..."
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Social Cocoon Analytics */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Social Cocoon Agressif
            </CardTitle>
            <CardDescription>Statistiques du réseau social interne</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Publications totales</p>
                <p className="text-3xl font-bold text-primary">87</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Taux de modération</p>
                <p className="text-3xl font-bold text-orange-500">5<span className="text-base">%</span></p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm font-medium mb-2">Tags les plus utilisés</p>
              <div className="flex flex-wrap gap-2">
                {['#bienetre', '#entraide', '#pause', '#conseil', '#equipe', '#relaxation', '#motivation']
                  .map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-white px-3 py-1 rounded-full text-sm" 
                      style={{ fontSize: `${Math.max(0.8, Math.random() * 0.3 + 0.8)}rem` }}
                    >
                      {tag}
                    </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Gamification Summary */}
        <Card className="md:col-span-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Synthèse Gamification
            </CardTitle>
            <CardDescription>Engagement et récompenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                <p className="text-3xl font-bold text-primary">87<span className="text-base">%</span></p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Badges distribués</p>
                <p className="text-3xl font-bold text-primary">214</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Défis complétés</p>
                <p className="text-3xl font-bold text-primary">532</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Streak moyen</p>
                <p className="text-3xl font-bold text-primary">4.7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <DashboardFooter isAdmin={true} />
    </div>
  );
};

export default AdminDashboard;
