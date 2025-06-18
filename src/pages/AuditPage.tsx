
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Database,
  Lock,
  Globe,
  Users,
  BarChart3
} from 'lucide-react';

interface AuditResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

const AuditPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AuditResult[]>([]);

  const mockAuditResults: AuditResult[] = [
    {
      category: 'Sécurité',
      status: 'success',
      message: 'Toutes les connexions sont sécurisées (HTTPS)',
      details: 'Certificats SSL valides, chiffrement TLS 1.3'
    },
    {
      category: 'Authentification',
      status: 'success',
      message: 'Système d\'authentification opérationnel',
      details: 'JWT valides, sessions sécurisées'
    },
    {
      category: 'Base de données',
      status: 'warning',
      message: 'Connexions multiples détectées',
      details: '12 connexions actives, limite recommandée: 10'
    },
    {
      category: 'Performance',
      status: 'success',
      message: 'Temps de réponse optimal',
      details: 'Moyenne: 245ms, seuil: 500ms'
    },
    {
      category: 'Confidentialité',
      status: 'success',
      message: 'Conformité RGPD respectée',
      details: 'Politiques de confidentialité à jour'
    },
    {
      category: 'Sauvegarde',
      status: 'error',
      message: 'Dernière sauvegarde ancienne',
      details: 'Dernière sauvegarde: il y a 25 heures'
    },
    {
      category: 'API',
      status: 'success',
      message: 'Tous les endpoints répondent',
      details: '24/24 services opérationnels'
    },
    {
      category: 'Logs',
      status: 'warning',
      message: 'Volume de logs élevé',
      details: '2.3GB générés dans les dernières 24h'
    }
  ];

  const runAudit = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    // Simulation de l'audit avec progression
    for (let i = 0; i <= 100; i += 12.5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
      
      if (i > 0 && i <= 100) {
        const resultIndex = Math.floor(i / 12.5) - 1;
        if (resultIndex < mockAuditResults.length) {
          setResults(prev => [...prev, mockAuditResults[resultIndex]]);
        }
      }
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-orange-200 bg-orange-50 dark:bg-orange-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-950 dark:to-blue-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Audit de sécurité et conformité
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Vérification complète de l'intégrité du système
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Niveau administrateur requis
          </Badge>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contrôle d'audit</CardTitle>
            <CardDescription>
              Lancez une vérification complète du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={runAudit} 
                  disabled={isRunning}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isRunning ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Audit en cours...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Lancer l'audit
                    </>
                  )}
                </Button>
                {results.length > 0 && (
                  <div className="flex space-x-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓ {successCount} Réussi
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      ⚠ {warningCount} Attention
                    </Badge>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      ✗ {errorCount} Erreur
                    </Badge>
                  </div>
                )}
              </div>
              {isRunning && (
                <div className="w-1/3">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}% terminé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audit Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sécurité</CardTitle>
              <Lock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">Score de sécurité</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245ms</div>
              <p className="text-xs text-muted-foreground">Temps de réponse moyen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">Sessions actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibilité</CardTitle>
              <Globe className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">Uptime 30 jours</p>
            </CardContent>
          </Card>
        </div>

        {/* Audit Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats de l'audit</CardTitle>
              <CardDescription>
                Détails des vérifications effectuées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{result.category}</h4>
                          <Badge 
                            variant={result.status === 'success' ? 'secondary' : 'outline'}
                            className={
                              result.status === 'success' ? 'bg-green-100 text-green-800' :
                              result.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {result.status === 'success' ? 'OK' : 
                             result.status === 'warning' ? 'Attention' : 'Erreur'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {result.message}
                        </p>
                        {result.details && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {result.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Health */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>État du système</CardTitle>
            <CardDescription>
              Monitoring en temps réel des services critiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Services</h4>
                <div className="space-y-2">
                  {[
                    { name: 'API Principal', status: 'online' },
                    { name: 'Base de données', status: 'online' },
                    { name: 'Service d\'authentification', status: 'online' },
                    { name: 'Système de fichiers', status: 'warning' },
                    { name: 'Service de notifications', status: 'online' }
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <span className="text-sm">{service.name}</span>
                      <Badge 
                        variant={service.status === 'online' ? 'secondary' : 'outline'}
                        className={
                          service.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {service.status === 'online' ? '● En ligne' : '⚠ Attention'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Ressources système</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">CPU</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Mémoire</span>
                      <span className="text-sm">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Stockage</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuditPage;
