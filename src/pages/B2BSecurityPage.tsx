import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Download,
  Database,
  Settings,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const B2BSecurityPage: React.FC = () => {
  const [enterpriseSso, setEnterpriseSso] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);
  const [auditLogs, setAuditLogs] = useState(true);
  const [ipRestrictions, setIpRestrictions] = useState(false);
  const [dataRetention, setDataRetention] = useState(true);

  const securityMetrics = {
    overallScore: 94,
    compliance: 98,
    vulnerabilities: 0,
    incidents: 0,
    lastAudit: "2024-01-15",
    certificateExpiry: "2025-12-31"
  };

  const enterpriseSecurityFeatures = [
    {
      id: 'enterprise-sso',
      title: 'SSO Entreprise (SAML/OIDC)',
      description: 'Authentification unique avec votre infrastructure existante',
      enabled: enterpriseSso,
      onToggle: setEnterpriseSso,
      icon: <Key className="h-5 w-5" />,
      status: enterpriseSso ? 'active' : 'inactive',
      compliance: ['ISO 27001', 'SOC 2']
    },
    {
      id: 'data-encryption',
      title: 'Chiffrement AES-256',
      description: 'Toutes les données sont chiffrées en transit et au repos',
      enabled: dataEncryption,
      onToggle: setDataEncryption,
      icon: <Lock className="h-5 w-5" />,
      status: 'active',
      compliance: ['RGPD', 'HIPAA']
    },
    {
      id: 'audit-logs',
      title: 'Journaux d\'Audit Complets',
      description: 'Traçabilité complète de toutes les actions utilisateurs',
      enabled: auditLogs,
      onToggle: setAuditLogs,
      icon: <FileText className="h-5 w-5" />,
      status: auditLogs ? 'active' : 'inactive',
      compliance: ['SOC 2', 'ISO 27001']
    },
    {
      id: 'ip-restrictions',
      title: 'Restrictions IP',
      description: 'Limitez l\'accès depuis des adresses IP spécifiques',
      enabled: ipRestrictions,
      onToggle: setIpRestrictions,
      icon: <Globe className="h-5 w-5" />,
      status: ipRestrictions ? 'active' : 'inactive',
      compliance: ['Corporate Policy']
    },
    {
      id: 'data-retention',
      title: 'Politique de Rétention',
      description: 'Gestion automatique du cycle de vie des données',
      enabled: dataRetention,
      onToggle: setDataRetention,
      icon: <Database className="h-5 w-5" />,
      status: dataRetention ? 'active' : 'inactive',
      compliance: ['RGPD', 'CCPA']
    }
  ];

  const complianceStatus = [
    {
      standard: 'ISO 27001',
      status: 'certified',
      expiry: '2024-12-31',
      score: 98,
      description: 'Système de management de la sécurité de l\'information'
    },
    {
      standard: 'SOC 2 Type II',
      status: 'certified',
      expiry: '2024-10-15',
      score: 96,
      description: 'Contrôles de sécurité, disponibilité et confidentialité'
    },
    {
      standard: 'RGPD',
      status: 'compliant',
      expiry: 'Permanent',
      score: 100,
      description: 'Règlement Général sur la Protection des Données'
    },
    {
      standard: 'HIPAA',
      status: 'compliant',
      expiry: 'Permanent',
      score: 94,
      description: 'Protection des données de santé (secteur médical)'
    }
  ];

  const securityEvents = [
    {
      id: '1',
      event: 'Tentative d\'accès non autorisé bloquée',
      severity: 'medium',
      source: 'IP: 192.168.1.100',
      timestamp: '2024-01-15 14:30:22',
      status: 'resolved',
      action: 'Accès bloqué automatiquement'
    },
    {
      id: '2',
      event: 'Mise à jour certificat SSL réussie',
      severity: 'low',
      source: 'Système automatique',
      timestamp: '2024-01-15 02:00:00',
      status: 'success',
      action: 'Certificat renouvelé'
    },
    {
      id: '3',
      event: 'Analyse de vulnérabilité terminée',
      severity: 'info',
      source: 'Scanner de sécurité',
      timestamp: '2024-01-14 18:45:12',
      status: 'success',
      action: '0 vulnérabilité détectée'
    }
  ];

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    toast.success(`${enabled ? 'Activé' : 'Désactivé'}: ${featureId}`);
  };

  const exportSecurityReport = () => {
    toast.success('Rapport de sécurité B2B généré avec succès');
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
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sécurité Entreprise
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Sécurité de niveau entreprise avec conformité réglementaire et contrôles d'accès avancés.
          </p>
        </motion.div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{securityMetrics.overallScore}%</div>
              <p className="text-sm text-gray-600">Score Sécurité</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{securityMetrics.compliance}%</div>
              <p className="text-sm text-gray-600">Conformité</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{securityMetrics.vulnerabilities}</div>
              <p className="text-sm text-gray-600">Vulnérabilités</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{securityMetrics.incidents}</div>
              <p className="text-sm text-gray-600">Incidents</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="features" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="compliance">Conformité</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="policies">Politiques</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Fonctionnalités de Sécurité Entreprise</h2>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration Avancée
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {enterpriseSecurityFeatures.map((feature) => (
                  <Card key={feature.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${
                            feature.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">{feature.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                            <div className="flex gap-2">
                              {feature.compliance.map((comp) => (
                                <Badge key={comp} variant="outline" className="text-xs">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                            {feature.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={(checked) => {
                              feature.onToggle(checked);
                              handleFeatureToggle(feature.title, checked);
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <h2 className="text-2xl font-bold">État de Conformité Réglementaire</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complianceStatus.map((compliance) => (
                  <Card key={compliance.standard} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{compliance.standard}</span>
                        <Badge variant={
                          compliance.status === 'certified' ? 'default' : 
                          compliance.status === 'compliant' ? 'secondary' : 'destructive'
                        }>
                          {compliance.status === 'certified' ? 'Certifié' : 
                           compliance.status === 'compliant' ? 'Conforme' : 'Non conforme'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{compliance.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Score de conformité</span>
                          <span className="font-medium">{compliance.score}%</span>
                        </div>
                        <Progress value={compliance.score} className="h-2" />
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Expiration:</span>
                          <span className="font-medium">{compliance.expiry}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Monitoring de Sécurité en Temps Réel</h2>
                <Link to="/admin/gdpr">
                  <Button>
                    <Shield className="h-4 w-4 mr-2" />
                    Monitoring RGPD
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <Card key={event.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${
                            event.severity === 'high' ? 'bg-red-100' :
                            event.severity === 'medium' ? 'bg-yellow-100' :
                            event.severity === 'low' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {event.severity === 'high' || event.severity === 'medium' ? (
                              <AlertTriangle className={`h-4 w-4 ${
                                event.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                              }`} />
                            ) : (
                              <CheckCircle className={`h-4 w-4 ${
                                event.severity === 'low' ? 'text-blue-600' : 'text-green-600'
                              }`} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{event.event}</h4>
                            <p className="text-sm text-gray-600">{event.source}</p>
                            <p className="text-xs text-gray-500 mt-1">{event.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            event.status === 'resolved' ? 'default' :
                            event.status === 'success' ? 'secondary' : 'destructive'
                          }>
                            {event.status === 'resolved' ? 'Résolu' :
                             event.status === 'success' ? 'Succès' : 'En cours'}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{event.action}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6">
              <h2 className="text-2xl font-bold">Politiques de Sécurité</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Politique de Mot de Passe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Longueur minimale: 12 caractères</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Complexité requise</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Renouvellement tous les 90 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Historique des 12 derniers</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Politique d'Accès</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Principe du moindre privilège</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Révision trimestrielle des accès</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Déprovisioning automatique</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Authentification multi-facteurs</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Rapports de Sécurité</h2>
                <Button onClick={exportSecurityReport} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter Rapport Complet
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Rapport Mensuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Synthèse complète des événements de sécurité du mois
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Audit de Conformité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Rapport détaillé sur l'état de conformité réglementaire
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Analyse des Risques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Évaluation des risques et recommandations d'amélioration
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default B2BSecurityPage;