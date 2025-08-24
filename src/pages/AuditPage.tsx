
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Download,
  TrendingUp, 
  Users,
  Database,
  Server,
  Eye,
  Zap,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastChecked: Date;
  recommendation?: string;
}

const AuditPage: React.FC = () => {
  const [auditResults, setAuditResults] = useState<AuditItem[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const auditCategories = [
    { name: 'Sécurité', icon: Shield, color: 'text-red-600' },
    { name: 'Performance', icon: Zap, color: 'text-yellow-600' },
    { name: 'Données', icon: Database, color: 'text-blue-600' },
    { name: 'Infrastructure', icon: Server, color: 'text-green-600' },
    { name: 'Conformité', icon: FileText, color: 'text-purple-600' }
  ];

  const mockAuditResults: AuditItem[] = [
    {
      id: '1',
      category: 'Sécurité',
      title: 'Certificats SSL',
      description: 'Vérification de la validité des certificats SSL',
      status: 'pass',
      priority: 'high',
      lastChecked: new Date(),
      recommendation: 'Certificats valides jusqu\'en 2025'
    },
    {
      id: '2',
      category: 'Sécurité',
      title: 'Authentification forte',
      description: 'Vérification de l\'implémentation de l\'authentification à deux facteurs',
      status: 'warning',
      priority: 'medium',
      lastChecked: new Date(),
      recommendation: 'Encourager l\'adoption de l\'A2F pour tous les utilisateurs'
    },
    {
      id: '3',
      category: 'Performance',
      title: 'Temps de réponse API',
      description: 'Mesure des temps de réponse des endpoints critiques',
      status: 'pass',
      priority: 'medium',
      lastChecked: new Date(),
      recommendation: 'Performances optimales maintenues'
    },
    {
      id: '4',
      category: 'Données',
      title: 'Sauvegarde automatique',
      description: 'Vérification de l\'intégrité des sauvegardes',
      status: 'fail',
      priority: 'critical',
      lastChecked: new Date(),
      recommendation: 'Corriger immédiatement le processus de sauvegarde'
    },
    {
      id: '5',
      category: 'Infrastructure',
      title: 'Monitoring système',
      description: 'État des services de surveillance',
      status: 'pass',
      priority: 'high',
      lastChecked: new Date(),
      recommendation: 'Surveillance active et fonctionnelle'
    },
    {
      id: '6',
      category: 'Conformité',
      title: 'RGPD',
      description: 'Conformité aux réglementations de protection des données',
      status: 'warning',
      priority: 'high',
      lastChecked: new Date(),
      recommendation: 'Mettre à jour les politiques de confidentialité'
    }
  ];

  const runAudit = async () => {
    setIsRunningAudit(true);
    setAuditProgress(0);
    
    // Simulation du processus d'audit
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningAudit(false);
          setAuditResults(mockAuditResults);
          toast.success('Audit terminé avec succès !');
          return 100;
        }
        return prev + 12.5;
      });
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'fail': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'fail': return AlertTriangle;
      default: return Clock;
    }
  };

  const exportReport = () => {
    toast.success('Rapport d\'audit exporté avec succès !');
  };

  const auditStats = {
    total: auditResults.length,
    passed: auditResults.filter(item => item.status === 'pass').length,
    warnings: auditResults.filter(item => item.status === 'warning').length,
    failed: auditResults.filter(item => item.status === 'fail').length,
    score: auditResults.length > 0 ? Math.round(
      (auditResults.filter(item => item.status === 'pass').length / auditResults.length) * 100
    ) : 0
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Audit de Conformité
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Évaluation complète de la sécurité, performance et conformité du système EmotionsCare.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Control Panel */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Dernier audit</p>
                    <p className="font-medium">
                      {auditResults.length > 0 ? 'Maintenant' : 'Jamais'}
                    </p>
                  </div>
                  {auditResults.length > 0 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Score global</p>
                      <Badge className={auditStats.score >= 80 ? 'bg-green-100 text-green-800' : 
                                      auditStats.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                        {auditStats.score}%
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {auditResults.length > 0 && (
                    <Button variant="outline" onClick={exportReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter le rapport
                    </Button>
                  )}
                  <Button onClick={runAudit} disabled={isRunningAudit} className="bg-blue-600 hover:bg-blue-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {isRunningAudit ? 'Audit en cours...' : 'Lancer un audit'}
                  </Button>
                </div>
              </div>
              
              {isRunningAudit && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progression de l'audit</span>
                    <span className="text-sm font-medium">{auditProgress}%</span>
                  </div>
                  <Progress value={auditProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {auditResults.length > 0 && (
            <>
              {/* Statistics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{auditStats.passed}</div>
                    <p className="text-sm text-gray-600">Réussis</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">{auditStats.warnings}</div>
                    <p className="text-sm text-gray-600">Avertissements</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{auditStats.failed}</div>
                    <p className="text-sm text-gray-600">Échecs</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{auditStats.score}%</div>
                    <p className="text-sm text-gray-600">Score global</p>
                  </CardContent>
                </Card>
              </div>

              {/* Audit Results */}
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  {auditCategories.map((category) => (
                    <TabsTrigger key={category.name} value={category.name}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all">
                  <div className="space-y-4">
                    {auditResults.map((item) => {
                      const StatusIcon = getStatusIcon(item.status);
                      return (
                        <Card key={item.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                                  <StatusIcon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-medium text-lg">{item.title}</h3>
                                    <Badge variant="outline">{item.category}</Badge>
                                    <Badge className={getPriorityColor(item.priority)}>
                                      {item.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 mb-3">{item.description}</p>
                                  {item.recommendation && (
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                      <p className="text-sm text-blue-800">
                                        <strong>Recommandation:</strong> {item.recommendation}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  Vérifié il y a {Math.floor((Date.now() - item.lastChecked.getTime()) / 60000)} min
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {auditCategories.map((category) => (
                  <TabsContent key={category.name} value={category.name}>
                    <div className="space-y-4">
                      {auditResults
                        .filter(item => item.category === category.name)
                        .map((item) => {
                          const StatusIcon = getStatusIcon(item.status);
                          return (
                            <Card key={item.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                                      <StatusIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-medium text-lg">{item.title}</h3>
                                        <Badge className={getPriorityColor(item.priority)}>
                                          {item.priority}
                                        </Badge>
                                      </div>
                                      <p className="text-gray-600 mb-3">{item.description}</p>
                                      {item.recommendation && (
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                          <p className="text-sm text-blue-800">
                                            <strong>Recommandation:</strong> {item.recommendation}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditPage;
