
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp, Target, Award, Flame } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Données mock pour les statistiques
const weeklyData = [
  { day: 'Lun', minutes: 15 },
  { day: 'Mar', minutes: 20 },
  { day: 'Mer', minutes: 10 },
  { day: 'Jeu', minutes: 25 },
  { day: 'Ven', minutes: 30 },
  { day: 'Sam', minutes: 45 },
  { day: 'Dim', minutes: 35 }
];

const categoryData = [
  { name: 'Relaxation', value: 40, color: '#3b82f6' },
  { name: 'Concentration', value: 25, color: '#8b5cf6' },
  { name: 'Sommeil', value: 20, color: '#06b6d4' },
  { name: 'Stress', value: 15, color: '#10b981' }
];

const achievements = [
  { id: 1, name: 'Premier pas', description: 'Première session de méditation', earned: true },
  { id: 2, name: 'Régularité', description: '7 jours consécutifs', earned: true },
  { id: 3, name: 'Explorateur', description: 'Essayé 5 types différents', earned: true },
  { id: 4, name: 'Maître du temps', description: '100 minutes au total', earned: false },
  { id: 5, name: 'Zen master', description: '30 jours consécutifs', earned: false }
];

const MeditationStats: React.FC = () => {
  const totalMinutes = 180;
  const totalSessions = 24;
  const streakDays = 7;
  const averageSession = Math.round(totalMinutes / totalSessions);

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Minutes</p>
                <p className="text-2xl font-bold">{totalMinutes}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Série Actuelle</p>
                <p className="text-2xl font-bold">{streakDays} jours</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Moyenne</p>
                <p className="text-2xl font-bold">{averageSession} min</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Progression Hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Objectifs et badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectifs du mois */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs du Mois
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sessions (20/30)</span>
                <span className="text-sm font-medium">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Minutes (180/300)</span>
                <span className="text-sm font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Série de jours (7/14)</span>
                <span className="text-sm font-medium">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges et récompenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Badges & Récompenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                  }`}
                >
                  <Award 
                    className={`h-6 w-6 ${
                      achievement.earned ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${achievement.earned ? 'text-green-700 dark:text-green-300' : 'text-gray-500'}`}>
                      {achievement.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-green-500">
                      Obtenu
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Aujourd\'hui', type: 'Relaxation', duration: 15, time: '09:30' },
              { date: 'Hier', type: 'Concentration', duration: 20, time: '18:45' },
              { date: 'Il y a 2 jours', type: 'Sommeil', duration: 10, time: '22:15' },
              { date: 'Il y a 3 jours', type: 'Stress', duration: 25, time: '14:20' },
              { date: 'Il y a 4 jours', type: 'Relaxation', duration: 30, time: '08:00' }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="font-medium">{session.type}</p>
                    <p className="text-sm text-muted-foreground">{session.date} à {session.time}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {session.duration} min
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationStats;
