
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  Activity,
  Heart,
  Brain,
  Music,
  Eye,
  Users,
  BarChart3,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Données de bien-être émotionnel
  const emotionalData = [
    { date: '2024-01-01', score: 65, mood: 'Neutre' },
    { date: '2024-01-02', score: 72, mood: 'Positif' },
    { date: '2024-01-03', score: 68, mood: 'Neutre' },
    { date: '2024-01-04', score: 85, mood: 'Très positif' },
    { date: '2024-01-05', score: 78, mood: 'Positif' },
    { date: '2024-01-06', score: 82, mood: 'Très positif' },
    { date: '2024-01-07', score: 75, mood: 'Positif' }
  ];

  // Données d'activité
  const activityData = [
    { name: 'Scan émotionnel', sessions: 42, temps: 85, icon: Eye, color: '#3B82F6' },
    { name: 'Sessions VR', sessions: 23, temps: 145, icon: Brain, color: '#8B5CF6' },
    { name: 'Journal', sessions: 67, temps: 234, icon: Calendar, color: '#10B981' },
    { name: 'Musicothérapie', sessions: 89, temps: 456, icon: Music, color: '#F59E0B' },
    { name: 'Coach IA', sessions: 34, temps: 178, icon: Users, color: '#EF4444' }
  ];

  // Données pour le graphique en secteurs
  const usageData = [
    { name: 'Musicothérapie', value: 35, color: '#F59E0B' },
    { name: 'Journal', value: 25, color: '#10B981' },
    { name: 'Sessions VR', value: 20, color: '#8B5CF6' },
    { name: 'Scan émotionnel', value: 12, color: '#3B82F6' },
    { name: 'Coach IA', value: 8, color: '#EF4444' }
  ];

  // Objectifs et progrès
  const goals = [
    { name: 'Sessions hebdomadaires', current: 8, target: 10, unit: 'sessions' },
    { name: 'Bien-être moyen', current: 78, target: 80, unit: '%' },
    { name: 'Jours consécutifs', current: 23, target: 30, unit: 'jours' },
    { name: 'Badges obtenus', current: 8, target: 12, unit: 'badges' }
  ];

  const achievements = [
    { name: 'Premier pas', description: 'Première connexion', date: '2024-01-15', rarity: 'Commun' },
    { name: 'Régulier', description: '30 jours consécutifs', date: '2024-02-14', rarity: 'Rare' },
    { name: 'Explorateur', description: 'Toutes les fonctionnalités', date: '2024-02-20', rarity: 'Épique' },
    { name: 'Mentor', description: 'Aide à la communauté', date: '2024-03-01', rarity: 'Légendaire' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Commun': return 'bg-gray-500';
      case 'Rare': return 'bg-blue-500';
      case 'Épique': return 'bg-purple-500';
      case 'Légendaire': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Mes Statistiques</h1>
              <p className="text-muted-foreground">Suivez vos progrès et analysez votre bien-être</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Sélecteur de période */}
        <div className="flex gap-2">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'week' && '7 jours'}
              {period === 'month' && '30 jours'}
              {period === 'quarter' && '3 mois'}
              {period === 'year' && '1 an'}
            </Button>
          ))}
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bien-être moyen</p>
                    <p className="text-3xl font-bold text-green-600">78%</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +5% ce mois
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sessions cette semaine</p>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-sm text-blue-600">Objectif: 10</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Série actuelle</p>
                    <p className="text-3xl font-bold">23</p>
                    <p className="text-sm text-orange-600">jours consécutifs</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Badges gagnés</p>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-sm text-purple-600">sur 12 disponibles</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="emotional">Émotionnel</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="goals">Objectifs</TabsTrigger>
            <TabsTrigger value="achievements">Réussites</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique de bien-être */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du bien-être</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={emotionalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value) => [`${value}%`, 'Score de bien-être']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Répartition d'utilisation */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition d'utilisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={usageData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                      >
                        {usageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {usageData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emotional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse émotionnelle détaillée</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={emotionalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value, name, props) => [
                        `${value}% (${props.payload.mood})`, 
                        'Score émotionnel'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité par fonctionnalité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData.map((activity, index) => (
                    <motion.div
                      key={activity.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${activity.color}20` }}
                      >
                        <activity.icon 
                          className="h-6 w-6" 
                          style={{ color: activity.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{activity.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{activity.sessions} sessions</span>
                          <span>{activity.temps} min total</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: activity.color }}>
                          {activity.sessions}
                        </p>
                        <p className="text-sm text-muted-foreground">sessions</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{goal.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            {goal.current}/{goal.target} {goal.unit}
                          </span>
                        </div>
                        <Progress 
                          value={(goal.current / goal.target) * 100} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-sm">
                          <span>Progression: {Math.round((goal.current / goal.target) * 100)}%</span>
                          <span className={
                            goal.current >= goal.target 
                              ? "text-green-600" 
                              : "text-muted-foreground"
                          }>
                            {goal.current >= goal.target ? "✓ Atteint" : "En cours"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full ${getRarityColor(achievement.rarity)} flex items-center justify-center`}>
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <Badge 
                              variant="secondary"
                              className={`${getRarityColor(achievement.rarity)} text-white`}
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Obtenu le {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default StatsPage;
