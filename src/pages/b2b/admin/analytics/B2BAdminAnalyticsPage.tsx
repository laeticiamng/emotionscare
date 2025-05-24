
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  Heart,
  Target,
  Clock,
  Award
} from 'lucide-react';

const B2BAdminAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const overviewStats = [
    {
      title: 'Engagement global',
      value: isDemoAccount ? '89%' : '--',
      change: '+5.2%',
      trend: 'up'
    },
    {
      title: 'Sessions moyennes/jour',
      value: isDemoAccount ? '2.4' : '--',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Score bien-être moyen',
      value: isDemoAccount ? '78.5' : '--',
      change: '+3.1%',
      trend: 'up'
    },
    {
      title: 'Taux de rétention',
      value: isDemoAccount ? '94%' : '--',
      change: '-1.2%',
      trend: 'down'
    }
  ];

  const departmentData = isDemoAccount ? [
    { name: 'Développement', users: 24, sessions: 187, avgScore: 85, engagement: 92 },
    { name: 'Marketing', users: 18, sessions: 134, avgScore: 79, engagement: 87 },
    { name: 'RH', users: 12, sessions: 98, avgScore: 88, engagement: 95 },
    { name: 'Commercial', users: 32, sessions: 201, avgScore: 74, engagement: 78 },
    { name: 'Support', users: 16, sessions: 112, avgScore: 82, engagement: 91 }
  ] : [];

  const wellbeingTrends = isDemoAccount ? [
    { week: 'Sem 1', stress: 65, happiness: 72, energy: 68 },
    { week: 'Sem 2', stress: 62, happiness: 75, energy: 71 },
    { week: 'Sem 3', stress: 59, happiness: 78, energy: 74 },
    { week: 'Sem 4', stress: 56, happiness: 81, energy: 77 }
  ] : [];

  const usagePatterns = isDemoAccount ? [
    { time: '8h', sessions: 23 },
    { time: '9h', sessions: 45 },
    { time: '10h', sessions: 67 },
    { time: '11h', sessions: 54 },
    { time: '12h', sessions: 89 },
    { time: '13h', sessions: 76 },
    { time: '14h', sessions: 92 },
    { time: '15h', sessions: 78 },
    { time: '16h', sessions: 65 },
    { time: '17h', sessions: 43 },
    { time: '18h', sessions: 32 }
  ] : [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Analyse détaillée du bien-être organisationnel
              {isDemoAccount && ' (Données de démonstration)'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">3 mois</SelectItem>
                <SelectItem value="1y">1 an</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {overviewStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <TrendingUp className={`h-4 w-4 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="departments">Départements</TabsTrigger>
            <TabsTrigger value="wellbeing">Bien-être</TabsTrigger>
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          {/* Departments Analytics */}
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Performance par département</span>
                </CardTitle>
                <CardDescription>
                  Analyse comparative des départements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {departmentData.length > 0 ? (
                  <div className="space-y-4">
                    {departmentData.map((dept, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{dept.name}</p>
                          <p className="text-sm text-muted-foreground">{dept.users} utilisateurs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">{dept.sessions}</p>
                          <p className="text-xs text-muted-foreground">Sessions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">{dept.avgScore}%</p>
                          <p className="text-xs text-muted-foreground">Score moyen</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">{dept.engagement}%</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                        <div className="flex justify-center">
                          <div className={`w-3 h-3 rounded-full ${
                            dept.engagement >= 90 ? 'bg-green-500' :
                            dept.engagement >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune donnée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wellbeing Trends */}
          <TabsContent value="wellbeing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Tendances bien-être</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wellbeingTrends.length > 0 ? (
                    <div className="space-y-4">
                      {wellbeingTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <span className="font-medium">{trend.week}</span>
                          <div className="flex space-x-4 text-sm">
                            <span className="text-red-600">Stress: {trend.stress}%</span>
                            <span className="text-green-600">Bonheur: {trend.happiness}%</span>
                            <span className="text-blue-600">Énergie: {trend.energy}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune donnée de tendance</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Objectifs atteints</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isDemoAccount ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Sessions hebdomadaires</span>
                        <span className="font-semibold text-green-600">87%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Participation équipe</span>
                        <span className="font-semibold text-green-600">94%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Score bien-être cible</span>
                        <span className="font-semibold text-yellow-600">78%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun objectif défini</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usage Patterns */}
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Patterns d'utilisation</span>
                </CardTitle>
                <CardDescription>
                  Analyse des heures d'utilisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usagePatterns.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2">
                    {usagePatterns.map((pattern, index) => (
                      <div key={index} className="text-center p-2 border rounded">
                        <p className="text-xs text-muted-foreground">{pattern.time}</p>
                        <p className="font-semibold">{pattern.sessions}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune donnée d'utilisation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Rapports personnalisés</span>
                </CardTitle>
                <CardDescription>
                  Générer et télécharger des rapports détaillés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2">
                    <Users className="h-8 w-8" />
                    <span>Rapport d'engagement</span>
                    <span className="text-xs text-muted-foreground">Données de participation</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2">
                    <Heart className="h-8 w-8" />
                    <span>Rapport bien-être</span>
                    <span className="text-xs text-muted-foreground">Scores et tendances</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2">
                    <Calendar className="h-8 w-8" />
                    <span>Rapport mensuel</span>
                    <span className="text-xs text-muted-foreground">Synthèse complète</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2">
                    <Award className="h-8 w-8" />
                    <span>Rapport de performance</span>
                    <span className="text-xs text-muted-foreground">ROI et objectifs</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
