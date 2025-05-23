
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Calendar,
  Download,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const B2BAdminAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadAnalytics();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/b2b/admin/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Analytics Avancées
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Analyses détaillées du bien-être en entreprise
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-2"
        >
          {[
            { key: '7d', label: '7 jours' },
            { key: '30d', label: '30 jours' },
            { key: '90d', label: '3 mois' },
            { key: '1y', label: '1 an' }
          ].map((period) => (
            <Button
              key={period.key}
              variant={selectedPeriod === period.key ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period.key)}
            >
              {period.label}
            </Button>
          ))}
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Global</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82.3%</div>
              <p className="text-xs text-green-600">+5.2% vs période précédente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">74.2</div>
              <p className="text-xs text-blue-600">+2.1 points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Totales</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-purple-600">+18.3%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">123</div>
              <p className="text-xs text-orange-600">78.8% de la base</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Évolution du Bien-être</CardTitle>
              <CardDescription>Tendances générales sur la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Graphique d'évolution du bien-être
                  </p>
                  <p className="text-sm text-slate-500">
                    Intégration Recharts en cours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Départements</CardTitle>
              <CardDescription>Meilleurs scores de bien-être</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Marketing', score: 87, users: 24 },
                { name: 'Développement', score: 82, users: 31 },
                { name: 'RH', score: 79, users: 12 },
                { name: 'Commercial', score: 76, users: 28 },
                { name: 'Support', score: 74, users: 18 }
              ].map((dept, index) => (
                <div key={dept.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">{dept.users} utilisateurs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{dept.score}</p>
                    <p className="text-xs text-muted-foreground">/100</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Utilisées</CardTitle>
              <CardDescription>Usage des outils</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Scanner émotionnel', usage: 89, sessions: 456 },
                { name: 'Musique adaptée', usage: 76, sessions: 234 },
                { name: 'Coach personnel', usage: 68, sessions: 189 },
                { name: 'Méditation', usage: 45, sessions: 123 },
                { name: 'Team building', usage: 32, sessions: 67 }
              ].map((feature) => (
                <div key={feature.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{feature.name}</span>
                    <span className="text-sm text-muted-foreground">{feature.usage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${feature.usage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.sessions} sessions</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertes & Tendances</CardTitle>
              <CardDescription>Points d'attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-400">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Score en baisse
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Équipe Finance: -5% cette semaine
                </p>
              </div>
              
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-400">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                  Engagement faible
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  12 utilisateurs inactifs depuis 7j
                </p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Amélioration notable
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Usage scanner +25% ce mois
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => toast('Rapport détaillé en cours de génération')}
              >
                Générer rapport complet
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
