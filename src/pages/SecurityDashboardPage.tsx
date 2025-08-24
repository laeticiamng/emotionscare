import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Users, 
  Database,
  Eye,
  Smartphone,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SecurityDashboardPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState('Il y a 2 heures');
  const { toast } = useToast();

  const securityMetrics = {
    overall: 87,
    authentication: 95,
    dataProtection: 82,
    networkSecurity: 90,
    userAccess: 85
  };

  const securityAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Tentative de connexion suspecte',
      description: 'Connexion depuis une nouvelle localisation détectée',
      time: 'Il y a 15 min',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Mise à jour de sécurité disponible',
      description: 'Nouvelle version avec correctifs de sécurité',
      time: 'Il y a 1h',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      title: 'Sauvegarde automatique réussie',
      description: 'Données utilisateur sauvegardées avec chiffrement',
      time: 'Il y a 3h',
      severity: 'low'
    }
  ];

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome - Windows',
      location: 'Paris, France',
      ip: '192.168.1.100',
      lastActive: 'Maintenant',
      current: true
    },
    {
      id: 2,
      device: 'Mobile App - iOS',
      location: 'Paris, France',
      ip: '192.168.1.101',
      lastActive: 'Il y a 2h',
      current: false
    },
    {
      id: 3,
      device: 'Firefox - MacOS',
      location: 'Lyon, France',
      ip: '192.168.1.102',
      lastActive: 'Il y a 1 jour',
      current: false
    }
  ];

  const runSecurityScan = async () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      setLastScan('Maintenant');
      toast({
        title: "Scan de sécurité terminé",
        description: "Aucune vulnérabilité critique détectée",
      });
    }, 3000);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Tableau de Bord Sécurité
          </h1>
          <p className="text-muted-foreground">
            Surveillance et gestion de la sécurité de la plateforme
          </p>
        </div>

        {/* Vue d'ensemble de la sécurité */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{securityMetrics.overall}%</p>
                  <p className="text-sm text-muted-foreground">Score global</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                  <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">156</p>
                  <p className="text-sm text-muted-foreground">Sessions actives</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                  <p className="text-sm text-muted-foreground">Alertes actives</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan de sécurité */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Scan de Sécurité
                    </CardTitle>
                    <CardDescription>
                      Dernière analyse: {lastScan}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={runSecurityScan}
                    disabled={isScanning}
                    variant="outline"
                  >
                    {isScanning ? 'Scan en cours...' : 'Lancer le scan'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Authentification</span>
                      <span className="font-medium">{securityMetrics.authentication}%</span>
                    </div>
                    <Progress value={securityMetrics.authentication} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Protection des données</span>
                      <span className="font-medium">{securityMetrics.dataProtection}%</span>
                    </div>
                    <Progress value={securityMetrics.dataProtection} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sécurité réseau</span>
                      <span className="font-medium">{securityMetrics.networkSecurity}%</span>
                    </div>
                    <Progress value={securityMetrics.networkSecurity} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Contrôle d'accès</span>
                      <span className="font-medium">{securityMetrics.userAccess}%</span>
                    </div>
                    <Progress value={securityMetrics.userAccess} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessions actives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Sessions Actives
                </CardTitle>
                <CardDescription>
                  Connexions utilisateur en temps réel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${session.current ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • {session.ip}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{session.lastActive}</p>
                        {session.current && (
                          <Badge variant="secondary">Session actuelle</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Alertes de sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                      <div className="flex items-start gap-2">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="mr-2 h-4 w-4" />
                  Forcer déconnexion toutes sessions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Key className="mr-2 h-4 w-4" />
                  Réinitialiser clés API
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Audit des accès données
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Consulter les logs
                </Button>
              </CardContent>
            </Card>

            {/* Statut des services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  État des Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'API Principale', status: 'operational', uptime: '99.9%' },
                    { name: 'Base de données', status: 'operational', uptime: '99.8%' },
                    { name: 'Authentification', status: 'operational', uptime: '100%' },
                    { name: 'Monitoring', status: 'degraded', uptime: '97.2%' },
                    { name: 'Sauvegardes', status: 'operational', uptime: '99.5%' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'operational' ? 'bg-green-500' : 
                          service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{service.uptime}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SecurityDashboardPage;