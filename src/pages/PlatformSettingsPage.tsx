import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Server, 
  Mail, 
  Shield, 
  Database, 
  Webhook,
  Key,
  Globe,
  Save,
  RotateCcw,
  TestTube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PlatformSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    platformName: 'EmotionsCare',
    platformDescription: 'Plateforme de bien-être émotionnel',
    maintenanceMode: false,
    debugMode: false,
    
    // Base de données
    dbHost: 'localhost',
    dbPort: '5432',
    dbName: 'emotionscare',
    backupFrequency: 'daily',
    
    // Authentification
    sessionTimeout: '24',
    passwordComplexity: 'medium',
    twoFactorRequired: false,
    maxLoginAttempts: '5',
    
    // Email
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    emailFromName: 'EmotionsCare',
    emailFromAddress: 'noreply@emotionscare.com',
    
    // API
    apiRateLimit: '1000',
    apiTimeout: '30',
    webhookRetries: '3',
    
    // Sécurité
    sslEnabled: true,
    corsEnabled: true,
    rateLimitingEnabled: true,
    auditLogsEnabled: true
  });

  const { toast } = useToast();

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "La configuration de la plateforme a été mise à jour",
    });
  };

  const testConnection = (type: string) => {
    toast({
      title: `Test ${type}`,
      description: "Test de connexion réussi",
    });
  };

  const resetToDefaults = () => {
    toast({
      title: "Paramètres réinitialisés",
      description: "Configuration restaurée aux valeurs par défaut",
    });
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Paramètres de Plateforme
          </h1>
          <p className="text-muted-foreground">
            Configuration globale et administration du système
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Général</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Base de données</span>
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Authentification</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
          </TabsList>

          {/* Paramètres généraux */}
          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Générale</CardTitle>
                  <CardDescription>
                    Paramètres de base de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform-name">Nom de la plateforme</Label>
                      <Input
                        id="platform-name"
                        value={settings.platformName}
                        onChange={(e) => updateSetting('platformName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="platform-description">Description</Label>
                      <Input
                        id="platform-description"
                        value={settings.platformDescription}
                        onChange={(e) => updateSetting('platformDescription', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode">Mode maintenance</Label>
                        <p className="text-sm text-muted-foreground">
                          Désactive l'accès public à la plateforme
                        </p>
                      </div>
                      <Switch
                        id="maintenance-mode"
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="debug-mode">Mode debug</Label>
                        <p className="text-sm text-muted-foreground">
                          Active les logs détaillés (désactiver en production)
                        </p>
                      </div>
                      <Switch
                        id="debug-mode"
                        checked={settings.debugMode}
                        onCheckedChange={(checked) => updateSetting('debugMode', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Base de données */}
          <TabsContent value="database">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Configuration Base de Données
                  </CardTitle>
                  <CardDescription>
                    Paramètres de connexion et sauvegarde
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="db-host">Hôte</Label>
                      <Input
                        id="db-host"
                        value={settings.dbHost}
                        onChange={(e) => updateSetting('dbHost', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="db-port">Port</Label>
                      <Input
                        id="db-port"
                        value={settings.dbPort}
                        onChange={(e) => updateSetting('dbPort', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="db-name">Nom de la base</Label>
                      <Input
                        id="db-name"
                        value={settings.dbName}
                        onChange={(e) => updateSetting('dbName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Fréquence de sauvegarde</Label>
                      <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting('backupFrequency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Toutes les heures</SelectItem>
                          <SelectItem value="daily">Quotidienne</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => testConnection('base de données')} variant="outline">
                      <TestTube className="mr-2 h-4 w-4" />
                      Tester la connexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Authentification */}
          <TabsContent value="auth">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Paramètres d'Authentification
                  </CardTitle>
                  <CardDescription>
                    Configuration de la sécurité des comptes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Timeout de session (heures)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Complexité des mots de passe</Label>
                      <Select value={settings.passwordComplexity} onValueChange={(value) => updateSetting('passwordComplexity', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts">Tentatives de connexion max</Label>
                      <Input
                        id="max-login-attempts"
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => updateSetting('maxLoginAttempts', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Authentification à deux facteurs obligatoire</Label>
                      <p className="text-sm text-muted-foreground">
                        Exige 2FA pour tous les utilisateurs
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.twoFactorRequired}
                      onCheckedChange={(checked) => updateSetting('twoFactorRequired', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email */}
          <TabsContent value="email">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Configuration Email SMTP
                  </CardTitle>
                  <CardDescription>
                    Paramètres du serveur d'envoi d'emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">Serveur SMTP</Label>
                      <Input
                        id="smtp-host"
                        value={settings.smtpHost}
                        onChange={(e) => updateSetting('smtpHost', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Port</Label>
                      <Input
                        id="smtp-port"
                        value={settings.smtpPort}
                        onChange={(e) => updateSetting('smtpPort', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Nom d'utilisateur</Label>
                      <Input
                        id="smtp-username"
                        value={settings.smtpUsername}
                        onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Mot de passe</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-from-name">Nom expéditeur</Label>
                      <Input
                        id="email-from-name"
                        value={settings.emailFromName}
                        onChange={(e) => updateSetting('emailFromName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-from-address">Adresse expéditeur</Label>
                      <Input
                        id="email-from-address"
                        type="email"
                        value={settings.emailFromAddress}
                        onChange={(e) => updateSetting('emailFromAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => testConnection('SMTP')} variant="outline">
                      <TestTube className="mr-2 h-4 w-4" />
                      Tester l'envoi d'email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API */}
          <TabsContent value="api">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    Configuration API
                  </CardTitle>
                  <CardDescription>
                    Paramètres des services API et webhooks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-rate-limit">Limite de requêtes/heure</Label>
                      <Input
                        id="api-rate-limit"
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) => updateSetting('apiRateLimit', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-timeout">Timeout API (secondes)</Label>
                      <Input
                        id="api-timeout"
                        type="number"
                        value={settings.apiTimeout}
                        onChange={(e) => updateSetting('apiTimeout', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhook-retries">Tentatives webhook</Label>
                      <Input
                        id="webhook-retries"
                        type="number"
                        value={settings.webhookRetries}
                        onChange={(e) => updateSetting('webhookRetries', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Clés API actives</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'OpenAI GPT-4', status: 'active', usage: '234/1000' },
                        { name: 'Hume AI', status: 'active', usage: '89/500' },
                        { name: 'DALL-E', status: 'limited', usage: '450/500' },
                        { name: 'Whisper', status: 'active', usage: '12/200' }
                      ].map((api, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{api.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{api.usage}</span>
                            <Badge variant={api.status === 'active' ? 'default' : 'secondary'}>
                              {api.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Paramètres de Sécurité
                  </CardTitle>
                  <CardDescription>
                    Configuration avancée de la sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ssl-enabled">SSL/HTTPS activé</Label>
                        <p className="text-sm text-muted-foreground">
                          Chiffrement des communications
                        </p>
                      </div>
                      <Switch
                        id="ssl-enabled"
                        checked={settings.sslEnabled}
                        onCheckedChange={(checked) => updateSetting('sslEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="cors-enabled">CORS activé</Label>
                        <p className="text-sm text-muted-foreground">
                          Autorise les requêtes cross-origin
                        </p>
                      </div>
                      <Switch
                        id="cors-enabled"
                        checked={settings.corsEnabled}
                        onCheckedChange={(checked) => updateSetting('corsEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="rate-limiting">Limitation de débit</Label>
                        <p className="text-sm text-muted-foreground">
                          Protection contre les attaques DDoS
                        </p>
                      </div>
                      <Switch
                        id="rate-limiting"
                        checked={settings.rateLimitingEnabled}
                        onCheckedChange={(checked) => updateSetting('rateLimitingEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="audit-logs">Logs d'audit</Label>
                        <p className="text-sm text-muted-foreground">
                          Enregistrement des actions sensibles
                        </p>
                      </div>
                      <Switch
                        id="audit-logs"
                        checked={settings.auditLogsEnabled}
                        onCheckedChange={(checked) => updateSetting('auditLogsEnabled', checked)}
                      />
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Zone de danger</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Actions irréversibles qui affectent la sécurité globale
                    </p>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm">
                        Révoquer toutes les sessions
                      </Button>
                      <Button variant="destructive" size="sm">
                        Régénérer les clés système
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions globales */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={saveSettings} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder la configuration
          </Button>
        </div>
      </div>
    </main>
  );
};

export default PlatformSettingsPage;