
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2BAdminAnalyticsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement des analytics..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Analytics Avancées
            </h1>
            <p className="text-muted-foreground">
              Insights détaillés sur l'utilisation et le bien-être de votre organisation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Sélecteur de période */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range === '7d' ? '7 jours' : 
                   range === '30d' ? '30 jours' :
                   range === '90d' ? '3 mois' : '1 an'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métriques principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> vs période précédente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sessions moyennes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.8</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> vs période précédente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Score bien-être</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2/10</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.3</span> vs période précédente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">-2%</span> vs période précédente
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilisation par fonctionnalité */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Utilisation par fonctionnalité</CardTitle>
              <CardDescription>Répartition des sessions par type d'activité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scan émotionnel</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Coaching IA</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                    <span className="text-sm font-medium">48%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Musique thérapeutique</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '52%' }}></div>
                    </div>
                    <span className="text-sm font-medium">52%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Journal personnel</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tendances bien-être */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tendances bien-être</CardTitle>
              <CardDescription>Évolution du score de bien-être global</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm w-6"
                      style={{ height: `${Math.random() * 150 + 50}px` }}
                    ></div>
                    <span className="text-xs text-muted-foreground mt-2">
                      {new Date(2024, i).toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Données détaillées par équipe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance par équipe
            </CardTitle>
            <CardDescription>
              Comparaison des métriques entre départements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Équipe</th>
                    <th className="text-center p-2">Membres</th>
                    <th className="text-center p-2">Actifs (7j)</th>
                    <th className="text-center p-2">Score bien-être</th>
                    <th className="text-center p-2">Engagement</th>
                    <th className="text-center p-2">Évolution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Marketing</td>
                    <td className="text-center p-2">32</td>
                    <td className="text-center p-2">28</td>
                    <td className="text-center p-2">8.2/10</td>
                    <td className="text-center p-2">87%</td>
                    <td className="text-center p-2">
                      <span className="text-green-600">↗ +5%</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Développement</td>
                    <td className="text-center p-2">28</td>
                    <td className="text-center p-2">24</td>
                    <td className="text-center p-2">7.8/10</td>
                    <td className="text-center p-2">79%</td>
                    <td className="text-center p-2">
                      <span className="text-green-600">↗ +2%</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Commercial</td>
                    <td className="text-center p-2">24</td>
                    <td className="text-center p-2">18</td>
                    <td className="text-center p-2">6.9/10</td>
                    <td className="text-center p-2">68%</td>
                    <td className="text-center p-2">
                      <span className="text-red-600">↘ -3%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Support</td>
                    <td className="text-center p-2">18</td>
                    <td className="text-center p-2">16</td>
                    <td className="text-center p-2">7.5/10</td>
                    <td className="text-center p-2">82%</td>
                    <td className="text-center p-2">
                      <span className="text-green-600">↗ +1%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
