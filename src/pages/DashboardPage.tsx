
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { mockReports, mockUsers, mockVRTemplates } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, CalendarDays, Trophy } from 'lucide-react';

// Format date for charts
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// Convert reports to chart data
const prepareReportData = (metric: 'absenteeism' | 'productivity') => {
  return mockReports
    .filter(report => report.metric === metric)
    .map(report => ({
      date: formatDate(report.period_end),
      value: report.value
    }));
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Prepare chart data
  const absenteeismData = prepareReportData('absenteeism');
  const productivityData = prepareReportData('productivity');
  
  // Calculate average emotional score
  const avgEmotionalScore = mockUsers.reduce((sum, user) => sum + (user.emotional_score || 0), 0) / mockUsers.length;
  
  // Count VR sessions in the last 30 days (mock data)
  const vrSessionsThisMonth = 8; // This would come from real data
  
  // Count badges for current user (mock data)
  const userBadgesCount = user?.id === '1' ? 2 : 0; // This would come from real data
  
  return (
    <div className="cocoon-page">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Brain size={18} className="mr-2 text-cocoon-600" />
              Score émotionnel moyen
            </CardTitle>
            <CardDescription>Tous les collaborateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {avgEmotionalScore.toFixed(1)}/100
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${avgEmotionalScore}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarDays size={18} className="mr-2 text-cocoon-600" />
              Sessions VR ce mois
            </CardTitle>
            <CardDescription>Toute l'équipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vrSessionsThisMonth}</div>
            <div className="text-sm text-muted-foreground">+2 depuis la semaine dernière</div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Trophy size={18} className="mr-2 text-cocoon-600" />
              Badges gagnés
            </CardTitle>
            <CardDescription>Vos accomplissements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userBadgesCount}</div>
            <div className="text-sm text-muted-foreground">Félicitations!</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Tendance Absentéisme</CardTitle>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={absenteeismData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Tendance Productivité</CardTitle>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-cocoon-500/80 to-cocoon-600/90 text-white transition-all duration-300 hover:shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">
                Bonjour {user?.name}, pense à ta micro-pause VR !
              </h3>
              <p className="opacity-90">
                Des études montrent que 5 minutes de VR peuvent réduire le stress de 20%
              </p>
            </div>
            <Button 
              onClick={() => navigate('/vr')}
              className="bg-white text-primary hover:bg-white/90"
            >
              Lancer VR <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/scan')}
          className="h-auto py-4 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
        >
          <span className="font-medium mb-1">Scan émotionnel</span>
          <span className="text-xs text-muted-foreground">Analysez votre état</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/journal')}
          className="h-auto py-4 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
        >
          <span className="font-medium mb-1">Journal</span>
          <span className="text-xs text-muted-foreground">Exprimez vos pensées</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/community')}
          className="h-auto py-4 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
        >
          <span className="font-medium mb-1">Communauté</span>
          <span className="text-xs text-muted-foreground">Échangez anonymement</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/gamification')}
          className="h-auto py-4 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
        >
          <span className="font-medium mb-1">Gamification</span>
          <span className="text-xs text-muted-foreground">Relevez des défis</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
