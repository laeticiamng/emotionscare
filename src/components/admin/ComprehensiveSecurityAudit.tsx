import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Key, 
  Database, 
  Network,
  FileText,
  Activity,
  Users,
  Lock,
  Zap,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SecurityIssue {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'authentication' | 'authorization' | 'data' | 'network' | 'configuration' | 'monitoring';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  status: 'open' | 'resolved' | 'in_progress' | 'false_positive';
  detectedAt: string;
  lastChecked: string;
  affectedResources?: string[];
  cveId?: string;
  score?: number;
}

interface SecurityMetrics {
  overallScore: number;
  totalIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
  lastScanDate: string;
  complianceScore: {
    gdpr: number;
    iso27001: number;
    owasp: number;
  };
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  score: number;
  requirements: string[];
  recommendations: string[];
}

export const ComprehensiveSecurityAudit: React.FC = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Données de tendance temporelle
  const [securityTrends, setSecurityTrends] = useState([
    { date: '2024-01', score: 85, issues: 15 },
    { date: '2024-02', score: 87, issues: 12 },
    { date: '2024-03', score: 89, issues: 10 },
    { date: '2024-04', score: 92, issues: 8 },
    { date: '2024-05', score: 94, issues: 6 },
    { date: '2024-06', score: 91, issues: 9 },
  ]);

  const severityColors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
    info: '#3b82f6'
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Simulation de données de sécurité complètes
      const mockMetrics: SecurityMetrics = {
        overallScore: 94,
        totalIssues: 23,
        criticalIssues: 2,
        resolvedIssues: 45,
        lastScanDate: new Date().toISOString(),
        complianceScore: {
          gdpr: 95,
          iso27001: 88,
          owasp: 92
        },
        threatLevel: 'medium'
      };

      const mockIssues: SecurityIssue[] = [
        {
          id: 'SEC-001',
          type: 'critical',
          category: 'authentication',
          title: 'Mots de passe faibles détectés',
          description: 'Plusieurs comptes utilisateurs ont des mots de passe ne respectant pas les critères de sécurité',
          impact: 'Risque élevé de compromission de comptes utilisateurs',
          recommendation: 'Forcer la mise à jour des mots de passe et implémenter une politique stricte',
          status: 'open',
          detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastChecked: new Date().toISOString(),
          affectedResources: ['user-accounts', 'admin-panel'],
          score: 9.1
        },
        {
          id: 'SEC-002',
          type: 'high',
          category: 'network',
          title: 'Trafic non chiffré détecté',
          description: 'Certaines communications internes ne sont pas chiffrées',
          impact: 'Possible interception de données sensibles',
          recommendation: 'Activer TLS 1.3 pour toutes les communications',
          status: 'in_progress',
          detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastChecked: new Date().toISOString(),
          affectedResources: ['api-gateway', 'database-connections'],
          score: 7.5
        },
        {
          id: 'SEC-003',
          type: 'medium',
          category: 'authorization',
          title: 'Permissions excessives',
          description: 'Certains utilisateurs ont des permissions supérieures à leurs besoins',
          impact: 'Risque d\'accès non autorisé à des ressources sensibles',
          recommendation: 'Réviser et appliquer le principe du moindre privilège',
          status: 'open',
          detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastChecked: new Date().toISOString(),
          affectedResources: ['user-roles', 'admin-permissions'],
          score: 5.8
        },
        {
          id: 'SEC-004',
          type: 'low',
          category: 'monitoring',
          title: 'Logs de sécurité incomplets',
          description: 'Certains événements de sécurité ne sont pas journalisés',
          impact: 'Difficultés à détecter et analyser les incidents de sécurité',
          recommendation: 'Améliorer la couverture des logs de sécurité',
          status: 'resolved',
          detectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          lastChecked: new Date().toISOString(),
          affectedResources: ['logging-system'],
          score: 3.2
        }
      ];

      const mockCompliance: ComplianceCheck[] = [
        {
          id: 'GDPR-001',
          name: 'Protection des données personnelles',
          description: 'Conformité RGPD pour la protection des données utilisateurs',
          status: 'compliant',
          score: 95,
          requirements: [
            'Consentement explicite',
            'Droit à l\'oubli',
            'Portabilité des données',
            'Notification de violation'
          ],
          recommendations: ['Améliorer la documentation des traitements']
        },
        {
          id: 'ISO-001',
          name: 'Gestion de la sécurité de l\'information',
          description: 'Conformité ISO 27001 pour la gestion de la sécurité',
          status: 'partial',
          score: 88,
          requirements: [
            'Politique de sécurité',
            'Gestion des risques',
            'Formation du personnel',
            'Audit interne'
          ],
          recommendations: [
            'Finaliser la documentation des procédures',
            'Programmer les audits internes réguliers'
          ]
        },
        {
          id: 'OWASP-001',
          name: 'Sécurité des applications web',
          description: 'Conformité OWASP Top 10 pour les vulnérabilités web',
          status: 'compliant',
          score: 92,
          requirements: [
            'Protection contre l\'injection',
            'Authentification robuste',
            'Chiffrement des données',
            'Configuration sécurisée'
          ],
          recommendations: ['Mettre à jour les dépendances régulièrement']
        }
      ];

      setSecurityMetrics(mockMetrics);
      setSecurityIssues(mockIssues);
      setComplianceChecks(mockCompliance);

    } catch (error) {
      console.error('Erreur lors du chargement des données de sécurité:', error);
    } finally {
      setLoading(false);
    }
  };

  const runSecurityScan = async () => {
    setScanning(true);
    
    // Simulation d'un scan de sécurité
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mise à jour des métriques après scan
    setSecurityMetrics(prev => prev ? {
      ...prev,
      lastScanDate: new Date().toISOString(),
      overallScore: Math.min(100, prev.overallScore + Math.floor(Math.random() * 3))
    } : null);
    
    setScanning(false);
  };

  const resolveIssue = (issueId: string) => {
    setSecurityIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, status: 'resolved' } : issue
      )
    );
  };

  const exportReport = async () => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics: securityMetrics,
      issues: securityIssues,
      compliance: complianceChecks,
      trends: securityTrends
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'non_compliant': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Eye className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredIssues = securityIssues.filter(issue => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && issue.type !== selectedSeverity) return false;
    return true;
  });

  const issuesByCategory = securityIssues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(issuesByCategory).map(([category, count], index) => ({
    name: category,
    value: count,
    color: ['#3b82f6', '#ef4444', '#f97316', '#eab308', '#22c55e', '#8b5cf6'][index % 6]
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit de Sécurité Complet</h1>
          <p className="text-gray-600 mt-1">Analyse avancée de la posture de sécurité</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter Rapport
          </Button>
          <Button onClick={runSecurityScan} disabled={scanning}>
            <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scan en cours...' : 'Nouveau Scan'}
          </Button>
        </div>
      </div>

      {/* Score global et métriques principales */}
      {securityMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score Global</p>
                  <p className="text-3xl font-bold text-green-600">{securityMetrics.overallScore}%</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={securityMetrics.overallScore} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problèmes Critiques</p>
                  <p className="text-3xl font-bold text-red-600">{securityMetrics.criticalIssues}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {securityMetrics.totalIssues} total, {securityMetrics.resolvedIssues} résolus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conformité RGPD</p>
                  <p className="text-3xl font-bold text-blue-600">{securityMetrics.complianceScore.gdpr}%</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={securityMetrics.complianceScore.gdpr} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Niveau de Menace</p>
                  <Badge 
                    className={`text-lg ${
                      securityMetrics.threatLevel === 'low' ? 'bg-green-100 text-green-800' :
                      securityMetrics.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      securityMetrics.threatLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {securityMetrics.threatLevel}
                  </Badge>
                </div>
                <Activity className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onglets principaux */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="dashboard">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="issues">Problèmes</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique des problèmes par catégorie */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Problèmes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conformité par standard */}
            <Card>
              <CardHeader>
                <CardTitle>Scores de Conformité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityMetrics && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">RGPD</span>
                      <span className="text-sm text-gray-600">{securityMetrics.complianceScore.gdpr}%</span>
                    </div>
                    <Progress value={securityMetrics.complianceScore.gdpr} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">ISO 27001</span>
                      <span className="text-sm text-gray-600">{securityMetrics.complianceScore.iso27001}%</span>
                    </div>
                    <Progress value={securityMetrics.complianceScore.iso27001} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">OWASP</span>
                      <span className="text-sm text-gray-600">{securityMetrics.complianceScore.owasp}%</span>
                    </div>
                    <Progress value={securityMetrics.complianceScore.owasp} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alertes récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Alertes de Sécurité Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityIssues.slice(0, 5).map((issue) => (
                  <Alert key={issue.id} className={`border-l-4 ${
                    issue.type === 'critical' ? 'border-l-red-500' :
                    issue.type === 'high' ? 'border-l-orange-500' :
                    issue.type === 'medium' ? 'border-l-yellow-500' :
                    'border-l-green-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(issue.type)}
                        <div>
                          <h4 className="font-medium">{issue.title}</h4>
                          <AlertDescription className="text-sm text-gray-600">
                            {issue.description}
                          </AlertDescription>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {issue.category}
                            </Badge>
                            <Badge className={`text-xs ${
                              issue.type === 'critical' ? 'bg-red-100 text-red-800' :
                              issue.type === 'high' ? 'bg-orange-100 text-orange-800' :
                              issue.type === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {issue.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveIssue(issue.id)}
                        disabled={issue.status === 'resolved'}
                      >
                        {issue.status === 'resolved' ? 'Résolu' : 'Résoudre'}
                      </Button>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          {/* Filtres pour les problèmes */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="authentication">Authentification</option>
                  <option value="authorization">Autorisation</option>
                  <option value="data">Données</option>
                  <option value="network">Réseau</option>
                  <option value="configuration">Configuration</option>
                  <option value="monitoring">Surveillance</option>
                </select>
                
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">Toutes les sévérités</option>
                  <option value="critical">Critique</option>
                  <option value="high">Élevée</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Faible</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Liste détaillée des problèmes */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-l-4 ${
                    issue.type === 'critical' ? 'border-l-red-500' :
                    issue.type === 'high' ? 'border-l-orange-500' :
                    issue.type === 'medium' ? 'border-l-yellow-500' :
                    'border-l-green-500'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getSeverityIcon(issue.type)}
                            <h3 className="text-lg font-semibold">{issue.title}</h3>
                            <Badge className={`${
                              issue.type === 'critical' ? 'bg-red-100 text-red-800' :
                              issue.type === 'high' ? 'bg-orange-100 text-orange-800' :
                              issue.type === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {issue.type}
                            </Badge>
                            <Badge variant="outline">{issue.category}</Badge>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{issue.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-sm text-gray-600 mb-1">Impact</h4>
                              <p className="text-sm text-gray-900">{issue.impact}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-600 mb-1">Recommandation</h4>
                              <p className="text-sm text-gray-900">{issue.recommendation}</p>
                            </div>
                          </div>
                          
                          {issue.affectedResources && (
                            <div className="mb-4">
                              <h4 className="font-medium text-sm text-gray-600 mb-2">Ressources affectées</h4>
                              <div className="flex flex-wrap gap-2">
                                {issue.affectedResources.map((resource) => (
                                  <Badge key={resource} variant="secondary" className="text-xs">
                                    {resource}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                              Détecté le {new Date(issue.detectedAt).toLocaleDateString('fr-FR')}
                            </span>
                            {issue.score && (
                              <span>Score CVSS: {issue.score}/10</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-6">
                          <Button
                            onClick={() => resolveIssue(issue.id)}
                            disabled={issue.status === 'resolved'}
                            className={issue.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {issue.status === 'resolved' ? 'Résolu' : 'Marquer comme résolu'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-6">
            {complianceChecks.map((check) => (
              <Card key={check.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getComplianceIcon(check.status)}
                      <div>
                        <h3 className="text-xl font-semibold">{check.name}</h3>
                        <p className="text-gray-600">{check.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{check.score}%</div>
                      <Progress value={check.score} className="w-24 mt-2" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Exigences</h4>
                      <ul className="space-y-1">
                        {check.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Recommandations</h4>
                      <ul className="space-y-1">
                        {check.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du Score de Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={securityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nombre de Problèmes par Mois</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={securityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="issues" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};