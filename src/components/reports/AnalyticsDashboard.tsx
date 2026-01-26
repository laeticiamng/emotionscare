// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Heart, Brain, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsDashboardProps {
  filters: Record<string, any>;
  userRole?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ filters, userRole }) => {
  const isAdmin = userRole === 'b2b_admin';

  const emotionalData = [
    { name: 'Lun', joie: 75, stress: 25, energie: 80, equilibre: 70 },
    { name: 'Mar', joie: 82, stress: 20, energie: 85, equilibre: 78 },
    { name: 'Mer', joie: 78, stress: 30, energie: 75, equilibre: 72 },
    { name: 'Jeu', joie: 85, stress: 15, energie: 90, equilibre: 82 },
    { name: 'Ven', joie: 90, stress: 10, energie: 95, equilibre: 88 },
    { name: 'Sam', joie: 95, stress: 5, energie: 85, equilibre: 92 },
    { name: 'Dim', joie: 88, stress: 12, energie: 80, equilibre: 85 }
  ];

  const distributionData = [
    { name: 'Joie', value: 35, color: '#22c55e' },
    { name: 'Calme', value: 25, color: '#3b82f6' },
    { name: 'Motivation', value: 20, color: '#f59e0b' },
    { name: 'Stress', value: 15, color: '#ef4444' },
    { name: 'Fatigue', value: 5, color: '#6b7280' }
  ];

  const activitiesData = [
    { name: 'Méditation', sessions: 24, duree: 180, efficacite: 92 },
    { name: 'Musique', sessions: 18, duree: 120, efficacite: 88 },
    { name: 'Journal', sessions: 15, duree: 90, efficacite: 85 },
    { name: 'VR', sessions: 8, duree: 60, efficacite: 95 },
    { name: 'Coach IA', sessions: 12, duree: 45, efficacite: 90 }
  ];

  const teamMetrics = isAdmin ? [
    { metric: 'Bien-être global', value: 82, change: +5, trend: 'up' },
    { metric: 'Engagement équipe', value: 78, change: +3, trend: 'up' },
    { metric: 'Productivité', value: 85, change: -2, trend: 'down' },
    { metric: 'Absentéisme', value: 12, change: -8, trend: 'up' }
  ] : [
    { metric: 'Score bien-être', value: 85, change: +7, trend: 'up' },
    { metric: 'Équilibre émotionnel', value: 78, change: +4, trend: 'up' },
    { metric: 'Niveau d\'énergie', value: 82, change: +2, trend: 'up' },
    { metric: 'Gestion du stress', value: 88, change: +6, trend: 'up' }
  ];

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.metric}
                  </p>
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? 
                      <TrendingUp className="h-3 w-3" /> : 
                      <TrendingDown className="h-3 w-3" />
                    }
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                </div>
                <Progress value={metric.value} className="mt-2" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution émotionnelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Évolution Émotionnelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="joie" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Joie"
                />
                <Line 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Stress"
                />
                <Line 
                  type="monotone" 
                  dataKey="equilibre" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Équilibre"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution émotionnelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Distribution Émotionnelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activités et performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Performance des Activités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={activitiesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar 
                yAxisId="left" 
                dataKey="sessions" 
                fill="#3b82f6" 
                name="Sessions"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right" 
                dataKey="efficacite" 
                fill="#22c55e" 
                name="Efficacité (%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              Analyse d'Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Participation Moyenne</p>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Score Bien-être Global</p>
                <div className="text-2xl font-bold text-blue-600">82/100</div>
                <Progress value={82} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Amélioration Mensuelle</p>
                <div className="text-2xl font-bold text-purple-600">+12%</div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
