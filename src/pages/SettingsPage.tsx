
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Users, 
  Key, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Lock,
  Globe,
  Smartphone,
  Mail,
  HardDrive,
  Wifi,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  const handleTest = () => {
    toast({
      title: "Test de connexion",
      description: "Tous les services sont opérationnels.",
    });
  };

  const handleBackup = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    toast({
      title: "Sauvegarde créée",
      description: "Une sauvegarde complète a été générée avec succès.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Paramètres Système
          </h1>
          <p className="text-muted-foreground mt-2">
            Configuration avancée et administration de la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleTest} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Test Connexion
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="database">Base de Données</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuration Générale
                </CardTitle>
                <CardDescription>
                  Paramètres principaux de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Nom de l'application</Label>
                  <Input id="app-name" defaultValue="EmotionsCare Pro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-version">Version</Label>
                  <Input id="app-version" defaultValue="3.2.1" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Input id="timezone" defaultValue="Europe/Paris" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-mode">Mode maintenance</Label>
                  <Switch id="maintenance-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="debug-mode">Mode debug</Label>
                  <Switch id="debug-mode" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestion des Utilisateurs
                </CardTitle>
                <CardDescription>
                  Paramètres d'inscription et d'accès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="registration">Inscription ouverte</Label>
                  <Switch id="registration" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-verification">Vérification email</Label>
                  <Switch id="email-verification" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-users">Nombre max d'utilisateurs</Label>
                  <Input id="max-users" type="number" defaultValue="10000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Timeout de session (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Performances Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Utilisation CPU</Label>
                  <Progress value={45} className="h-2" />
                  <p className="text-sm text-muted-foreground">45% utilisé</p>
                </div>
                <div className="space-y-2">
                  <Label>Utilisation RAM</Label>
                  <Progress value={62} className="h-2" />
                  <p className="text-sm text-muted-foreground">6.2 GB / 10 GB</p>
                </div>
                <div className="space-y-2">
                  <Label>Stockage</Label>
                  <Progress value={78} className="h-2" />
                  <p className="text-sm text-muted-foreground">156 GB / 200 GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sécurité et Authentification
                </CardTitle>
                <CardDescription>
                  Configuration des paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="2fa">Authentification à deux facteurs</Label>
                  <Switch id="2fa" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-policy">Politique de mot de passe stricte</Label>
                  <Switch id="password-policy" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-attempts">Tentatives de connexion max</Label>
                  <Input id="login-attempts" type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Durée de verrouillage (minutes)</Label>
                  <Input id="lockout-duration" type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Clés API et Tokens
                </CardTitle>
                <CardDescription>
                  Gestion des accès et intégrations externes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Clé API principale</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      type={showApiKey ? "text" : "password"}
                      defaultValue="sk-**********************8f9a" 
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Secret Webhook</Label>
                  <Input id="webhook-secret" type="password" defaultValue="whsec_******************" />
                </div>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Régénérer les clés
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertes de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-900">Certificat SSL valide</p>
                    <p className="text-sm text-green-700">Expire le 15/03/2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-900">Mise à jour de sécurité disponible</p>
                    <p className="text-sm text-yellow-700">Version 3.2.2 corrige 3 vulnérabilités</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configuration Base de Données
                </CardTitle>
                <CardDescription>
                  Paramètres de connexion et optimisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Hôte</Label>
                  <Input id="db-host" defaultValue="prod-db.emotionscare.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Port</Label>
                  <Input id="db-port" defaultValue="5432" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Nom de la base</Label>
                  <Input id="db-name" defaultValue="emotionscare_prod" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-connections">Connexions max</Label>
                  <Input id="max-connections" type="number" defaultValue="100" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="connection-pooling">Pool de connexions</Label>
                  <Switch id="connection-pooling" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Sauvegarde et Restauration
                </CardTitle>
                <CardDescription>
                  Gestion des sauvegardes automatiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Sauvegarde automatique</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Fréquence</Label>
                  <Input id="backup-frequency" defaultValue="Quotidienne à 2h00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention-days">Rétention (jours)</Label>
                  <Input id="retention-days" type="number" defaultValue="30" />
                </div>
                <Button onClick={handleBackup} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Créer une sauvegarde maintenant
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                État de la Base de Données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-900 mb-2">✅ Statut de la Base de Données</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Performance: Optimale (temps de réponse &lt; 100ms)</li>
                    <li>• Intégrité: 100% des vérifications passées</li>
                    <li>• Sauvegarde: Automatique quotidienne à 2h du matin</li>
                    <li>• Espace disque: 78% utilisé (156 GB / 200 GB)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium mb-2">📊 Statistiques</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tables: 47 tables actives</li>
                    <li>• Enregistrements: 2,847,392 total</li>
                    <li>• Index: 128 index optimisés</li>
                    <li>• Dernière optimisation: Il y a 2 jours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configuration Email
                </CardTitle>
                <CardDescription>
                  Paramètres SMTP et notifications email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Serveur SMTP</Label>
                  <Input id="smtp-host" defaultValue="smtp.emotionscare.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port SMTP</Label>
                  <Input id="smtp-port" defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">Email expéditeur</Label>
                  <Input id="from-email" defaultValue="noreply@emotionscare.com" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-auth">Authentification SMTP</Label>
                  <Switch id="email-auth" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-tls">Chiffrement TLS</Label>
                  <Switch id="email-tls" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Notifications Push
                </CardTitle>
                <CardDescription>
                  Configuration des notifications mobiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-enabled">Notifications push activées</Label>
                  <Switch id="push-enabled" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fcm-key">Clé Firebase (FCM)</Label>
                  <Input id="fcm-key" type="password" defaultValue="AAAA**********************" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apns-cert">Certificat APNS (iOS)</Label>
                  <Input id="apns-cert" type="file" />
                </div>
                <Button variant="outline" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Tester les notifications
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Templates d'Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  { name: "Email de bienvenue", status: "Actif", lastModified: "Il y a 3 jours" },
                  { name: "Réinitialisation mot de passe", status: "Actif", lastModified: "Il y a 1 semaine" },
                  { name: "Rappel d'activité", status: "Inactif", lastModified: "Il y a 2 semaines" },
                  { name: "Rapport hebdomadaire", status: "Actif", lastModified: "Il y a 5 jours" }
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">Modifié {template.lastModified}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.status === "Actif" ? "default" : "secondary"}>
                        {template.status}
                      </Badge>
                      <Button variant="outline" size="sm">Éditer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Services Cloud
                </CardTitle>
                <CardDescription>
                  Intégrations avec les services externes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "AWS S3", status: "Connecté", icon: "☁️" },
                    { name: "Google Analytics", status: "Connecté", icon: "📊" },
                    { name: "Stripe", status: "Connecté", icon: "💳" },
                    { name: "Mailchimp", status: "Déconnecté", icon: "📧" }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.status}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {service.status === "Connecté" ? "Configurer" : "Connecter"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  APIs Externes
                </CardTitle>
                <CardDescription>
                  Configuration des APIs tierces
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input id="openai-key" type="password" defaultValue="sk-**********************" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hume-key">Hume AI API Key</Label>
                  <Input id="hume-key" type="password" defaultValue="hume_**********************" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spotify-key">Spotify API Key</Label>
                  <Input id="spotify-key" type="password" defaultValue="sp_**********************" />
                </div>
                <div className="space-y-2">
                  <Label>Limites de taux</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Requêtes/min" defaultValue="60" />
                    <Input placeholder="Requêtes/jour" defaultValue="10000" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Métriques en Temps Réel
                </CardTitle>
                <CardDescription>
                  Surveillance des performances système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Utilisateurs actifs</p>
                    <p className="text-2xl font-bold text-green-900">1,247</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Requêtes/min</p>
                    <p className="text-2xl font-bold text-blue-900">892</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-700">Temps réponse</p>
                    <p className="text-2xl font-bold text-orange-900">45ms</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">Uptime</p>
                    <p className="text-2xl font-bold text-purple-900">99.9%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes et Logs
                </CardTitle>
                <CardDescription>
                  Configuration des alertes système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="error-alerts">Alertes d'erreur</Label>
                  <Switch id="error-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="performance-alerts">Alertes de performance</Label>
                  <Switch id="performance-alerts" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-email">Email pour les alertes</Label>
                  <Input id="alert-email" defaultValue="admin@emotionscare.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="log-level">Niveau de log</Label>
                  <Input id="log-level" defaultValue="INFO" />
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger les logs
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Incidents Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    type: "Résolu", 
                    message: "Latence élevée sur l'API d'analyse", 
                    time: "Il y a 2h",
                    severity: "Moyen"
                  },
                  { 
                    type: "En cours", 
                    message: "Maintenance programmée base de données", 
                    time: "Il y a 30min",
                    severity: "Info"
                  },
                  { 
                    type: "Résolu", 
                    message: "Erreur 500 sur endpoint /scan", 
                    time: "Il y a 1 jour",
                    severity: "Élevé"
                  }
                ].map((incident, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={incident.type === "Résolu" ? "secondary" : "default"}>
                        {incident.type}
                      </Badge>
                      <div>
                        <p className="font-medium">{incident.message}</p>
                        <p className="text-sm text-muted-foreground">{incident.time}</p>
                      </div>
                    </div>
                    <Badge variant={
                      incident.severity === "Élevé" ? "destructive" : 
                      incident.severity === "Moyen" ? "default" : "secondary"
                    }>
                      {incident.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
