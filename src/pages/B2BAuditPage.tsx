import React, { useState } from 'react';
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
  Server,
  Zap,
  BarChart3,
  Building
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
  businessImpact?: string;
}

const B2BAuditPage: React.FC = () => {
  const [auditResults, setAuditResults] = useState<AuditItem[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const auditCategories = [
    { name: 'Sécurité Entreprise', icon: Shield, color: 'text-red-600' },
    { name: 'Conformité RGPD', icon: FileText, color: 'text-blue-600' },
    { name: 'Performance', icon: Zap, color: 'text-yellow-600' },
    { name: 'Infrastructure', icon: Server, color: 'text-green-600' },
    { name: 'Gouvernance', icon: Building, color: 'text-purple-600' }
  ];

  const enterpriseAuditResults: AuditItem[] = [
    {
      id: '1',
      category: 'Sécurité Entreprise',
      title: 'Authentification SSO',
      description: 'Vérification de l\'intégration SSO avec Active Directory',
      status: 'pass',
      priority: 'high',
      lastChecked: new Date(),
      recommendation: 'SSO fonctionnel, aucune action requise',
      businessImpact: 'Sécurité optimale pour 500+ utilisateurs'
    },
    {
      id: '2',
      category: 'Conformité RGPD',
      title: 'Consentement utilisateur',
      description: 'Vérification des mécanismes de consentement et retrait',
      status: 'warning',
      priority: 'high',
      lastChecked: new Date(),
      recommendation: 'Améliorer la granularité des consentements',
      businessImpact: 'Risque réglementaire de €4M d\'amende'
    },
    {
      id: '3',
      category: 'Performance',
      title: 'Temps de réponse Enterprise',
      description: 'Mesure des performances sous charge enterprise (1000+ utilisateurs)',
      status: 'pass',
      priority: 'medium',
      lastChecked: new Date(),
      recommendation: 'Performances optimales maintenues',
      businessImpact: 'Productivité équipes préservée'
    },
    {
      id: '4',
      category: 'Infrastructure',
      title: 'Haute Disponibilité',
      description: 'Vérification des systèmes de failover et redondance',
      status: 'pass',
      priority: 'critical',
      lastChecked: new Date(),
      recommendation: 'SLA 99.9% respecté',
      businessImpact: 'Continuité de service garantie'
    },
    {
      id: '5',
      category: 'Gouvernance',
      title: 'Traçabilité des actions',
      description: 'Audit trail de toutes les actions administrateur',
      status: 'pass',
      priority: 'high',
      lastChecked: new Date(),
      recommendation: 'Logs complets et conformes SOX',
      businessImpact: 'Conformité audit externe'
    },
    {
      id: '6',
      category: 'Sécurité Entreprise',
      title: 'Chiffrement données sensibles',
      description: 'Vérification du chiffrement AES-256 des données RH',
      status: 'pass',
      priority: 'critical',
      lastChecked: new Date(),
      recommendation: 'Chiffrement end-to-end opérationnel',
      businessImpact: 'Protection données confidentielles'
    },
    {
      id: '7',
      category: 'Conformité RGPD',
      title: 'Droit à l\'effacement',
      description: 'Processus de suppression des données personnelles',
      status: 'warning',
      priority: 'medium',
      lastChecked: new Date(),
      recommendation: 'Automatiser le processus de suppression',
      businessImpact: 'Réduction du risque de non-conformité'
    }
  ];

  const complianceFrameworks = [
    {
      name: 'ISO 27001',
      status: 'certified',
      score: 94,
      expiry: '2024-12-31',
      controls: 114,
      passed: 108
    },
    {
      name: 'SOC 2 Type II',
      status: 'certified', 
      score: 96,
      expiry: '2024-10-15',
      controls: 64,
      passed: 61
    },
    {
      name: 'RGPD/GDPR',
      status: 'compliant',
      score: 88,
      expiry: 'Permanent',
      controls: 32,
      passed: 28
    },
    {
      name: 'SOX (Sarbanes-Oxley)',
      status: 'compliant',
      score: 92,
      expiry: 'Annual',
      controls: 24,
      passed: 22
    }
  ];

  const runEnterpriseAudit = async () => {
    setIsRunningAudit(true);
    setAuditProgress(0);
    
    // Simulation d'un audit enterprise plus long et détaillé
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningAudit(false);
          setAuditResults(enterpriseAuditResults);
          toast.success('Audit Enterprise terminé avec succès !');
          return 100;
        }
        return prev + 8.33; // 12 étapes pour audit complet
      });
    }, 1200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'fail': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive/10 text-destructive';
      case 'high': return 'bg-warning/10 text-warning';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
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

  const exportEnterpriseReport = () => {
    toast.success('Rapport d\'audit Enterprise exporté avec succès !');
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
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-info/10 rounded-full">
              <Shield className="h-8 w-8 text-info" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Audit Enterprise B2B
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Évaluation complète de conformité, sécurité et gouvernance pour environnements Enterprise.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Control Panel */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Dernier audit</p>
                    <p className="font-medium">
                      {auditResults.length > 0 ? 'Maintenant' : 'Jamais'}
                    </p>
                  </div>
                  {auditResults.length > 0 && (
                    <>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Score Enterprise</p>
                        <Badge className={auditStats.score >= 90 ? 'bg-success/10 text-success' : 
                                        auditStats.score >= 75 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}>
                          {auditStats.score}%
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Conformité</p>
                        <Badge variant="outline">
                          {Math.round(complianceFrameworks.reduce((acc, fw) => acc + fw.score, 0) / complianceFrameworks.length)}%
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {auditResults.length > 0 && (
                    <Button variant="outline" onClick={exportEnterpriseReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter Rapport Enterprise
                    </Button>
                  )}
                  <Button onClick={runEnterpriseAudit} disabled={isRunningAudit} className="bg-info hover:bg-info/90">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {isRunningAudit ? 'Audit Enterprise en cours...' : 'Lancer Audit Enterprise'}
                  </Button>
                </div>
              </div>
              
              {isRunningAudit && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progression de l'audit Enterprise</span>
                    <span className="text-sm font-medium">{Math.round(auditProgress)}%</span>
                  </div>
                  <Progress value={auditProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Analyse approfondie: sécurité, conformité, performance, gouvernance...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {auditResults.length > 0 && (
            <>
              {/* Statistics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-success">{auditStats.passed}</div>
                    <p className="text-sm text-muted-foreground">Contrôles Réussis</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold text-warning">{auditStats.warnings}</div>
                    <p className="text-sm text-muted-foreground">À Améliorer</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <div className="text-2xl font-bold text-destructive">{auditStats.failed}</div>
                    <p className="text-sm text-muted-foreground">Non Conformes</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-info mx-auto mb-2" />
                    <div className="text-2xl font-bold text-info">{auditStats.score}%</div>
                    <p className="text-sm text-muted-foreground">Score Global</p>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Frameworks */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Frameworks de Conformité Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {complianceFrameworks.map((framework) => (
                      <div key={framework.name} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{framework.name}</h4>
                          <Badge variant={
                            framework.status === 'certified' ? 'default' : 'secondary'
                          }>
                            {framework.status === 'certified' ? 'Certifié' : 'Conforme'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Score:</span>
                            <span className="font-medium">{framework.score}%</span>
                          </div>
                          <Progress value={framework.score} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{framework.passed}/{framework.controls} contrôles</span>
                            <span>Exp: {framework.expiry}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                                    <div className="p-3 bg-info/10 rounded-lg mb-3">
                                      <p className="text-sm text-info">
                                        <strong>Recommandation:</strong> {item.recommendation}
                                      </p>
                                    </div>
                                  )}
                                  {item.businessImpact && (
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                      <p className="text-sm text-accent">
                                        <strong>Impact Business:</strong> {item.businessImpact}
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
                                        <div className="p-3 bg-blue-50 rounded-lg mb-3">
                                          <p className="text-sm text-blue-800">
                                            <strong>Recommandation:</strong> {item.recommendation}
                                          </p>
                                        </div>
                                      )}
                                      {item.businessImpact && (
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                          <p className="text-sm text-purple-800">
                                            <strong>Impact Business:</strong> {item.businessImpact}
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

export default B2BAuditPage;