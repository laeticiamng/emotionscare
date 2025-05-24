
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Heart, 
  Calendar,
  Download,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BAdminAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('week');

  const analyticsData = {
    overview: {
      totalScans: 1247,
      avgScore: 74.2,
      participation: 86,
      improvement: 12.5
    },
    departments: [
      { name: 'Marketing', users: 23, avgScore: 78, trend: +5 },
      { name: 'Développement', users: 31, avgScore: 72, trend: +8 },
      { name: 'Commercial', users: 19, avgScore: 76, trend: -2 },
      { name: 'RH', users: 12, avgScore: 81, trend: +15 },
      { name: 'Support', users: 18, avgScore: 69, trend: +3 }
    ],
    weeklyTrends: [
      { day: 'Lun', score: 72 },
      { day: 'Mar', score: 74 },
      { day: 'Mer', score: 71 },
      { day: 'Jeu', score: 76 },
      { day: 'Ven', score: 78 },
      { day: 'Sam', score: 75 },
      { day: 'Dim', score: 73 }
    ]
  };

  const timeframeOptions = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/b2b/admin/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Analytics Bien-être</h1>
              <p className="text-muted-foreground">
                Analyses détaillées du bien-être organisationnel
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {timeframeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeframe === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Métriques globales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total des scans</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalScans}</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+23% vs période précédente</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.avgScore}%</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+{analyticsData.overview.improvement}% d'amélioration</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Participation</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.participation}%</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>Excellent taux</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Tendance</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Positive</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>Amélioration continue</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendances par jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Évolution hebdomadaire</CardTitle>
              <CardDescription>
                Score de bien-être moyen par jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.weeklyTrends.map((day, index) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{day.day}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${day.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-8">{day.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance par département */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Performance par département</CardTitle>
              <CardDescription>
                Scores et tendances par équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.departments.map((dept, index) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.users} collaborateurs</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{dept.avgScore}%</p>
                      <div className={`flex items-center text-xs ${
                        dept.trend > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dept.trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {dept.trend > 0 ? '+' : ''}{dept.trend}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights et recommandations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Insights et recommandations</CardTitle>
            <CardDescription>
              Analyses automatiques basées sur les données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100">Positif</Badge>
                </div>
                <h4 className="font-medium mb-1">Amélioration générale</h4>
                <p className="text-sm text-muted-foreground">
                  Le score moyen de l'équipe RH a augmenté de 15% cette semaine.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <Badge variant="secondary" className="bg-blue-100">Participation</Badge>
                </div>
                <h4 className="font-medium mb-1">Engagement élevé</h4>
                <p className="text-sm text-muted-foreground">
                  86% de participation, le plus haut taux depuis 3 mois.
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  <Badge variant="secondary" className="bg-orange-100">Attention</Badge>
                </div>
                <h4 className="font-medium mb-1">Équipe commerciale</h4>
                <p className="text-sm text-muted-foreground">
                  Légère baisse de 2% - pourrait nécessiter un accompagnement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
