
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { mockReports, mockUsers, mockVRTemplates } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Eye, Star, Users, Brain, CalendarDays, Trophy } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
  const vrSessionsLastMonth = 6; // This would come from real data
  
  // Count badges for current user (mock data)
  const userBadgesCount = user?.id === '1' ? 2 : 0; // This would come from real data
  
  return (
    <div className="cocoon-page">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">EmotionsCare</h1>
        <h2 className="text-xl text-muted-foreground">par ResiMax™ 4.0</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Brain size={18} className="mr-2 text-primary" />
              Score émotionnel moyen
            </CardTitle>
            <CardDescription>Tous les collaborateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {avgEmotionalScore.toFixed(1)}/100
            </div>
            <Progress value={avgEmotionalScore} className="h-2" />
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarDays size={18} className="mr-2 text-primary" />
              Sessions VR ce mois
            </CardTitle>
            <CardDescription>Toute l'équipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vrSessionsThisMonth}</div>
            <div className="text-sm text-muted-foreground">
              +{vrSessionsThisMonth - vrSessionsLastMonth} depuis le mois dernier
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Trophy size={18} className="mr-2 text-primary" />
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
              <ChartContainer
                config={{
                  value: { theme: { light: '#7ED321', dark: '#7ED321' } },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={absenteeismData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      name="value"
                      stroke="#7ED321" 
                      fill="#7ED321" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
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
              <ChartContainer
                config={{
                  value: { theme: { light: '#4A90E2', dark: '#4A90E2' } },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="value" 
                      name="value"
                      fill="#4A90E2" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#4A90E2] text-white transition-all duration-300 hover:shadow-lg mb-6">
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
              className="bg-white text-[#4A90E2] hover:bg-white/90"
            >
              Lancer VR <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/scan')}
          className="h-auto py-6 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
        >
          <div className="flex items-center w-full">
            <Eye className="h-5 w-5 mr-3 text-primary" />
            <div>
              <span className="font-medium mb-1 block">Scan émotionnel</span>
              <span className="text-xs text-muted-foreground">Analysez votre état</span>
            </div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/journal')}
          className="h-auto py-6 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
        >
          <div className="flex items-center w-full">
            <BookOpen className="h-5 w-5 mr-3 text-primary" />
            <div>
              <span className="font-medium mb-1 block">Journal</span>
              <span className="text-xs text-muted-foreground">Exprimez vos pensées</span>
            </div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/community')}
          className="h-auto py-6 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
        >
          <div className="flex items-center w-full">
            <Users className="h-5 w-5 mr-3 text-primary" />
            <div>
              <span className="font-medium mb-1 block">Communauté</span>
              <span className="text-xs text-muted-foreground">Échangez anonymement</span>
            </div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/gamification')}
          className="h-auto py-6 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
        >
          <div className="flex items-center w-full">
            <Star className="h-5 w-5 mr-3 text-primary" />
            <div>
              <span className="font-medium mb-1 block">Gamification</span>
              <span className="text-xs text-muted-foreground">Relevez des défis</span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
