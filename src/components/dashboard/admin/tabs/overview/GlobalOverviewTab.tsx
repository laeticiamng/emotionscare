
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart4, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { KpiMetric, TeamSummary } from '@/types';
import TeamEmotionDistribution from './TeamEmotionDistribution';
import { GlobalOverviewTabProps } from '@/types/dashboard';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ className = '' }) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  
  // Mock data for demonstration
  const kpiMetrics: KpiMetric[] = [
    { id: 'active-users', label: 'Utilisateurs actifs', value: 1243, trend: 'up' },
    { id: 'activities', label: 'Activités complétées', value: 8547, trend: 'stable' },
    { id: 'engagement', label: "Taux d'engagement", value: 68, trend: 'up' },
    { id: 'alerts', label: 'Alertes émotionnelles', value: 12, trend: 'down' }
  ];
  
  const activityData = [
    { date: '01/05', journal: 125, music: 85, scan: 45, coach: 30, vr: 60 },
    { date: '02/05', journal: 118, music: 90, scan: 49, coach: 32, vr: 65 },
    { date: '03/05', journal: 130, music: 95, scan: 52, coach: 28, vr: 70 },
    { date: '04/05', journal: 135, music: 88, scan: 55, coach: 35, vr: 68 },
    { date: '05/05', journal: 142, music: 92, scan: 58, coach: 37, vr: 72 },
    { date: '06/05', journal: 140, music: 98, scan: 60, coach: 40, vr: 75 },
    { date: '07/05', journal: 145, music: 105, scan: 62, coach: 42, vr: 78 }
  ];
  
  const emotionTrendData = [
    { date: '01/05', calm: 45, happy: 30, anxious: 15, sad: 10 },
    { date: '02/05', calm: 42, happy: 32, anxious: 18, sad: 8 },
    { date: '03/05', calm: 48, happy: 35, anxious: 12, sad: 5 },
    { date: '04/05', calm: 50, happy: 38, anxious: 8, sad: 4 },
    { date: '05/05', calm: 55, happy: 35, anxious: 7, sad: 3 },
    { date: '06/05', calm: 52, happy: 40, anxious: 5, sad: 3 },
    { date: '07/05', calm: 58, happy: 35, anxious: 4, sad: 3 }
  ];
  
  const emotionData = [
    { name: 'Calme', value: 45, color: '#0088FE' },
    { name: 'Heureux', value: 30, color: '#00C49F' },
    { name: 'Anxieux', value: 15, color: '#FFBB28' },
    { name: 'Triste', value: 10, color: '#FF8042' }
  ];
  
  const teamData: TeamSummary[] = [
    { teamId: 'Marketing', memberCount: 12, averageMood: 'calm', alertCount: 0, trendDirection: 'up' },
    { teamId: 'Développement', memberCount: 15, averageMood: 'focused', alertCount: 2, trendDirection: 'down' },
    { teamId: 'Design', memberCount: 8, averageMood: 'happy', alertCount: 0, trendDirection: 'stable' },
    { teamId: 'Support', memberCount: 10, averageMood: 'stressed', alertCount: 3, trendDirection: 'down' }
  ];

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-emerald-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-rose-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
      >
        {kpiMetrics.map((metric) => (
          <motion.div key={metric.id} variants={fadeInUp}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">
                    {metric.value}{metric.id === 'engagement' && '%'}
                  </div>
                  <div className="flex items-center text-sm">
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Charts */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={staggerContainer}>
        {/* Main Activity Chart */}
        <motion.div className="lg:col-span-2" variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Activité globale</CardTitle>
              <CardDescription>Répartition des activités par jour</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Tabs defaultValue={period} onValueChange={(val: any) => setPeriod(val)}>
                <div className="flex justify-between items-center">
                  <TabsList className="mb-4">
                    <TabsTrigger value="day">Jour</TabsTrigger>
                    <TabsTrigger value="week">Semaine</TabsTrigger>
                    <TabsTrigger value="month">Mois</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="journal" stackId="a" fill="#8884d8" />
                      <Bar dataKey="music" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="scan" stackId="a" fill="#ffc658" />
                      <Bar dataKey="coach" stackId="a" fill="#ff8042" />
                      <Bar dataKey="vr" stackId="a" fill="#0088fe" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Distribution émotionnelle</CardTitle>
              <CardDescription>Émotions collectives</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Emotion Trends and Team Status */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={staggerContainer}>
        {/* Emotion Trends */}
        <motion.div className="lg:col-span-2" variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Tendances émotionnelles</CardTitle>
              <CardDescription>Évolution des émotions sur la période</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={emotionTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="calm" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="happy" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="anxious" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="sad" stackId="1" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Status */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Statut des équipes</CardTitle>
              <CardDescription>Vue d'ensemble par équipe</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                {teamData.map((team) => (
                  <div key={team.teamId} className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-medium">{team.teamId}</p>
                      <p className="text-sm text-muted-foreground">{team.memberCount} membres</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20">
                        {team.averageMood}
                      </span>
                      {team.alertCount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
                          {team.alertCount} alerte{team.alertCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {getTrendIcon(team.trendDirection)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* RGPD Disclaimer */}
      <motion.div variants={fadeInUp}>
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <p>Conformément au RGPD, toutes les données sont anonymisées et aucune statistique n'est générée sur moins de 5 personnes.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default GlobalOverviewTab;
