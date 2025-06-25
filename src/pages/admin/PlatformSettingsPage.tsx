
import React, { useState } from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Server, Users, Shield, Database, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const PlatformSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    general: {
      platformName: 'EmotionsCare',
      maintenanceMode: false,
      registrationEnabled: true,
      guestAccess: false,
      defaultLanguage: 'fr',
      timezone: 'Europe/Paris'
    },
    features: {
      musicModule: true,
      vrModule: true,
      breathworkModule: true,
      journalModule: true,
      coachModule: true,
      gamificationModule: true,
      socialModule: false
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      passwordComplexity: true,
      ipWhitelist: '',
      auditLogging: true
    },
    integrations: {
      emailProvider: 'sendgrid',
      smsProvider: 'twilio',
      analyticsEnabled: true,
      webhooksEnabled: false,
      apiRateLimit: 1000
    }
  });

  const handleSaveSettings = () => {
    toast.success('Paramètres sauvegardés avec succès');
    console.log('Platform settings saved:', settings);
  };

  const updateGeneral = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [key]: value }
    }));
  };

  const updateFeature = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      features: { ...prev.features, [key]: value }
    }));
  };

  const updateSecurity = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value }
    }));
  };

  const updateIntegration = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      integrations: { ...prev.integrations, [key]: value }
    }));
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Settings className="w-8 h-8 text-primary" />
                Paramètres Plateforme
              </h1>
              <p className="text-muted-foreground">
                Configuration globale de la plateforme EmotionsCare
              </p>
            </div>
            <Button onClick={handleSaveSettings} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                Général
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Fonctionnalités
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Intégrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Configuration Générale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom de la plateforme</label>
                      <Input
                        value={settings.general.platformName}
                        onChange={(e) => updateGeneral('platformName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Langue par défaut</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={settings.general.defaultLanguage}
                        onChange={(e) => updateGeneral('defaultLanguage', e.target.value)}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fuseau horaire</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={settings.general.timezone}
                        onChange={(e) => updateGeneral('timezone', e.target.value)}
                      >
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-medium">Options d'accès</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-600">Mode maintenance</h4>
                        <p className="text-sm text-muted-foreground">
                          Désactive l'accès à la plateforme pour maintenance
                        </p>
                      </div>
                      <Switch
                        checked={settings.general.maintenanceMode}
                        onCheckedChange={(value) => updateGeneral('maintenanceMode', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Inscription ouverte</h4>
                        <p className="text-sm text-muted-foreground">
                          Permettre aux nouveaux utilisateurs de s'inscrire
                        </p>
                      </div>
                      <Switch
                        checked={settings.general.registrationEnabled}
                        onCheckedChange={(value) => updateGeneral('registrationEnabled', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Accès invité</h4>
                        <p className="text-sm text-muted-foreground">
                          Autoriser l'accès sans compte utilisateur
                        </p>
                      </div>
                      <Switch
                        checked={settings.general.guestAccess}
                        onCheckedChange={(value) => updateGeneral('guestAccess', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Activation des Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(settings.features).map(([module, enabled]) => (
                      <div key={module} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium capitalize">
                            {module.replace('Module', '').replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(value) => updateFeature(module, value)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {module === 'musicModule' && 'Thérapie musicale et recommandations'}
                          {module === 'vrModule' && 'Expériences de réalité virtuelle'}
                          {module === 'breathworkModule' && 'Exercices de respiration guidée'}
                          {module === 'journalModule' && 'Journal émotionnel quotidien'}
                          {module === 'coachModule' && 'Assistant IA personnalisé'}
                          {module === 'gamificationModule' && 'Système de récompenses et défis'}
                          {module === 'socialModule' && 'Fonctionnalités communautaires'}
                        </p>
                        {enabled && (
                          <Badge variant="secondary" className="mt-2">
                            Actif
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Paramètres de Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Authentification à deux facteurs obligatoire</h3>
                        <p className="text-sm text-muted-foreground">
                          Exiger 2FA pour tous les utilisateurs
                        </p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactorRequired}
                        onCheckedChange={(value) => updateSecurity('twoFactorRequired', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Journalisation des audits</h3>
                        <p className="text-sm text-muted-foreground">
                          Enregistrer toutes les actions sensibles
                        </p>
                      </div>
                      <Switch
                        checked={settings.security.auditLogging}
                        onCheckedChange={(value) => updateSecurity('auditLogging', value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timeout de session (minutes)</label>
                      <Input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Longueur minimale mot de passe</label>
                      <Input
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => updateSecurity('passwordMinLength', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Liste blanche IP (optionnel)</label>
                    <Textarea
                      placeholder="192.168.1.0/24&#10;10.0.0.1"
                      value={settings.security.ipWhitelist}
                      onChange={(e) => updateSecurity('ipWhitelist', e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Une adresse IP ou plage par ligne. Laissez vide pour autoriser toutes les IPs.
                    </p>
                  </div>

                  {settings.security.twoFactorRequired && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        L'activation de 2FA obligatoire nécessitera que tous les utilisateurs configurent 2FA lors de leur prochaine connexion.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Intégrations et APIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fournisseur d'email</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={settings.integrations.emailProvider}
                        onChange={(e) => updateIntegration('emailProvider', e.target.value)}
                      >
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailgun">Mailgun</option>
                        <option value="ses">Amazon SES</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fournisseur SMS</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={settings.integrations.smsProvider}
                        onChange={(e) => updateIntegration('smsProvider', e.target.value)}
                      >
                        <option value="twilio">Twilio</option>
                        <option value="vonage">Vonage</option>
                        <option value="aws-sns">AWS SNS</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Limite de taux API (requêtes/heure)</label>
                      <Input
                        type="number"
                        value={settings.integrations.apiRateLimit}
                        onChange={(e) => updateIntegration('apiRateLimit', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-medium">Services externes</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Analytics activés</h4>
                        <p className="text-sm text-muted-foreground">
                          Collecter des données d'usage anonymisées
                        </p>
                      </div>
                      <Switch
                        checked={settings.integrations.analyticsEnabled}
                        onCheckedChange={(value) => updateIntegration('analyticsEnabled', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Webhooks activés</h4>
                        <p className="text-sm text-muted-foreground">
                          Permettre les notifications en temps réel
                        </p>
                      </div>
                      <Switch
                        checked={settings.integrations.webhooksEnabled}
                        onCheckedChange={(value) => updateIntegration('webhooksEnabled', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default PlatformSettingsPage;
