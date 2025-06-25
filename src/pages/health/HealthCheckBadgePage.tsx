
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Heart, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Activity,
  Cpu,
  Database,
  Cloud,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { performanceMonitor } from '@/utils/pagePerformanceMonitor';

interface HealthMetric {
  id: string;
  name: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  score: number;
  description: string;
  lastCheck: string;
}

const HealthCheckBadgePage: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    { id: '1', name: 'État Émotionnel', status: 'good', score: 78, description: 'Équilibre émotionnel stable', lastCheck: '2024-01-15 10:30' },
    { id: '2', name: 'Activité Physique', status: 'excellent', score: 92, description: 'Objectifs d\'exercice atteints', lastCheck: '2024-01-15 09:15' },
    { id: '3', name: 'Qualité du Sommeil', status: 'warning', score: 64, description: 'Sommeil fragmenté détecté', lastCheck: '2024-01-15 07:00' },
    { id: '4', name: 'Stress Management', status: 'good', score: 81, description: 'Techniques de gestion appliquées', lastCheck: '2024-01-15 11:45' },
    { id: '5', name: 'Connexions Sociales', status: 'excellent', score: 89, description: 'Interactions positives régulières', lastCheck: '2024-01-15 12:00' }
  ]);

  const [systemHealth, setSystemHealth] = useState({
    api: 'operational',
    database: 'operational',
    security: 'secure',
    performance: 'optimal'
  });

  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const loadTime = Date.now() - startTime;
      performanceMonitor.recordPageLoad('/health-check-badge', loadTime);
    };
  }, []);

  const runHealthCheck = async () => {
    setIsChecking(true);
    
    // Simuler un scan de santé complet
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mettre à jour les métriques avec de nouvelles valeurs
    setHealthMetrics(prev => prev.map(metric => ({
      ...metric,
      score: Math.max(50, Math.min(100, metric.score + (Math.random() - 0.5) * 20)),
      lastCheck: new Date().toLocaleString('fr-FR'),
      status: metric.score > 85 ? 'excellent' : metric.score > 70 ? 'good' : metric.score > 50 ? 'warning' : 'critical'
    })));
    
    setIsChecking(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircle;
      case 'good': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return Activity;
    }
  };

  const overallScore = Math.round(healthMetrics.reduce((sum, metric) => sum + metric.score, 0) / healthMetrics.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold">Health Check Badge</h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Votre badge de santé personnalisé et certification bien-être
            </p>
          </div>

          {/* Score Global */}
          <Card className="mb-8 bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-16 w-16 mr-4" />
                <div>
                  <h2 className="text-4xl font-bold">{overallScore}%</h2>
                  <p className="text-xl">Score de Santé Global</p>
                </div>
              </div>
              <Badge className="bg-white text-blue-600 text-lg px-4 py-1">
                {overallScore > 85 ? 'Excellence' : overallScore > 70 ? 'Bon Niveau' : overallScore > 50 ? 'À Améliorer' : 'Critique'}
              </Badge>
            </CardContent>
          </Card>

          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="metrics">Métriques</TabsTrigger>
              <TabsTrigger value="badge">Badge</TabsTrigger>
              <TabsTrigger value="system">Système</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Métriques de Santé</h3>
                <Button 
                  onClick={runHealthCheck}
                  disabled={isChecking}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4 mr-2" />
                      Lancer Health Check
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthMetrics.map((metric, index) => {
                  const StatusIcon = getStatusIcon(metric.status);
                  
                  return (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{metric.name}</CardTitle>
                            <StatusIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">{metric.score}%</span>
                              <Badge className={getStatusColor(metric.status)}>
                                {metric.status}
                              </Badge>
                            </div>
                            <Progress value={metric.score} className="h-2" />
                            <p className="text-sm text-gray-600">{metric.description}</p>
                            <p className="text-xs text-gray-400">
                              Dernière vérification: {metric.lastCheck}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="badge" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Votre Badge de Certification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    <div className="bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-xl">
                      <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
                        <Heart className="h-16 w-16 text-white" />
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-xs font-bold">{overallScore}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold">Certification Bien-être</h3>
                      <p className="text-gray-600">EmotionsCare Health Badge</p>
                      <Badge className="mt-2 bg-blue-600 text-white">
                        Valide jusqu'au {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                      </Badge>
                    </div>
                    
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le Badge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <h3 className="text-2xl font-semibold">État du Système</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cpu className="h-5 w-5 mr-2" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span>Statut</span>
                      <Badge className="bg-green-100 text-green-800">Optimal</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Base de Données
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span>Statut</span>
                      <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Sécurité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span>Statut</span>
                      <Badge className="bg-green-100 text-green-800">Sécurisé</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cloud className="h-5 w-5 mr-2" />
                      API Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span>Statut</span>
                      <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <h3 className="text-2xl font-semibold">Historique des Checks</h3>
              
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                          <div>
                            <p className="font-medium">Health Check #{10 - i}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {Math.floor(Math.random() * 15) + 85}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthCheckBadgePage;
