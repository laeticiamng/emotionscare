import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings,
  Database,
  Shield,
  Bell,
  Palette,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface SystemConfig {
  general: {
    appName: string;
    appDescription: string;
    supportEmail: string;
    maintenanceMode: boolean;
    debugMode: boolean;
    analyticsEnabled: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireMFA: boolean;
    allowedDomains: string[];
    ipWhitelist: string[];
  };
  database: {
    connectionPool: number;
    queryTimeout: number;
    backupSchedule: string;
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
    slackWebhook: string;
    discordWebhook: string;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTtl: number;
    compressionLevel: number;
    cdnEnabled: boolean;
    rateLimitEnabled: boolean;
    rateLimit: number;
  };
  features: {
    userRegistration: boolean;
    socialLogin: boolean;
    fileUpload: boolean;
    videoCall: boolean;
    aiFeatures: boolean;
    premiumFeatures: boolean;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    customCss: string;
    footerText: string;
  };
}

interface ConfigurationHistory {
  id: string;
  timestamp: string;
  user: string;
  section: string;
  changes: Record<string, any>;
  reason: string;
}

export const GlobalConfigurationCenter: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [originalConfig, setOriginalConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [configHistory, setConfigHistory] = useState<ConfigurationHistory[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConfiguration();
    loadConfigurationHistory();
  }, []);

  useEffect(() => {
    if (config && originalConfig) {
      setHasChanges(JSON.stringify(config) !== JSON.stringify(originalConfig));
    }
  }, [config, originalConfig]);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      
      // Simulation de la configuration système
      const mockConfig: SystemConfig = {
        general: {
          appName: 'EmotionsCare',
          appDescription: 'Plateforme de bien-être émotionnel alimentée par l\'IA',
          supportEmail: 'support@emotionscare.com',
          maintenanceMode: false,
          debugMode: false,
          analyticsEnabled: true
        },
        security: {
          sessionTimeout: 3600,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          requireMFA: false,
          allowedDomains: ['emotionscare.com', 'example.com'],
          ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
        },
        database: {
          connectionPool: 20,
          queryTimeout: 30000,
          backupSchedule: '0 2 * * *',
          compressionEnabled: true,
          encryptionEnabled: true
        },
        notifications: {
          emailEnabled: true,
          pushEnabled: true,
          smsEnabled: false,
          slackWebhook: '',
          discordWebhook: ''
        },
        performance: {
          cacheEnabled: true,
          cacheTtl: 3600,
          compressionLevel: 6,
          cdnEnabled: true,
          rateLimitEnabled: true,
          rateLimit: 100
        },
        features: {
          userRegistration: true,
          socialLogin: true,
          fileUpload: true,
          videoCall: false,
          aiFeatures: true,
          premiumFeatures: true
        },
        branding: {
          primaryColor: '#3b82f6',
          secondaryColor: '#10b981',
          logoUrl: '/logo.svg',
          faviconUrl: '/favicon.ico',
          customCss: '',
          footerText: '© 2024 EmotionsCare. Tous droits réservés.'
        }
      };

      setConfig(mockConfig);
      setOriginalConfig(JSON.parse(JSON.stringify(mockConfig)));
    } catch (error) {
      logger.error('Erreur lors du chargement de la configuration', error, 'ADMIN');
      toast.error('Erreur lors du chargement de la configuration');
    } finally {
      setLoading(false);
    }
  };

  const loadConfigurationHistory = async () => {
    const mockHistory: ConfigurationHistory[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'admin@emotionscare.com',
        section: 'security',
        changes: { requireMFA: { from: false, to: true } },
        reason: 'Renforcement de la sécurité'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        user: 'admin@emotionscare.com',
        section: 'performance',
        changes: { rateLimit: { from: 50, to: 100 } },
        reason: 'Augmentation des limites pour le trafic élevé'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'developer@emotionscare.com',
        section: 'features',
        changes: { aiFeatures: { from: false, to: true } },
        reason: 'Activation des fonctionnalités IA'
      }
    ];

    setConfigHistory(mockHistory);
  };

  const validateConfiguration = (config: SystemConfig): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Validation générale
    if (!config.general.appName.trim()) {
      errors['general.appName'] = 'Le nom de l\'application est requis';
    }
    if (!config.general.supportEmail.includes('@')) {
      errors['general.supportEmail'] = 'Email de support invalide';
    }

    // Validation sécurité
    if (config.security.sessionTimeout < 300) {
      errors['security.sessionTimeout'] = 'Le timeout de session doit être d\'au moins 5 minutes';
    }
    if (config.security.passwordMinLength < 6) {
      errors['security.passwordMinLength'] = 'La longueur minimale du mot de passe doit être d\'au moins 6 caractères';
    }

    // Validation performance
    if (config.performance.rateLimit < 1) {
      errors['performance.rateLimit'] = 'La limite de taux doit être supérieure à 0';
    }
    if (config.performance.cacheTtl < 60) {
      errors['performance.cacheTtl'] = 'Le TTL du cache doit être d\'au moins 60 secondes';
    }

    return errors;
  };

  const saveConfiguration = async () => {
    if (!config) return;

    setSaving(true);
    try {
      // Validation
      const errors = validateConfiguration(config);
      setValidationErrors(errors);

      if (Object.keys(errors).length > 0) {
        toast.error('Veuillez corriger les erreurs de validation');
        return;
      }

      // Simulation de la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Ajouter à l'historique
      const historyEntry: ConfigurationHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: 'admin@emotionscare.com',
        section: activeTab,
        changes: getConfigChanges(originalConfig!, config),
        reason: 'Mise à jour de la configuration'
      };

      setConfigHistory(prev => [historyEntry, ...prev]);
      setOriginalConfig(JSON.parse(JSON.stringify(config)));
      setHasChanges(false);
      
      toast.success('Configuration sauvegardée avec succès');
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde', error, 'ADMIN');
      toast.error('Erreur lors de la sauvegarde de la configuration');
    } finally {
      setSaving(false);
    }
  };

  const getConfigChanges = (original: SystemConfig, current: SystemConfig): Record<string, any> => {
    const changes: Record<string, any> = {};
    
    // Compare les objets et trouve les différences
    const compareObjects = (obj1: any, obj2: any, path = '') => {
      for (const key in obj2) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
          compareObjects(obj1[key] || {}, obj2[key], currentPath);
        } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          changes[currentPath] = { from: obj1[key], to: obj2[key] };
        }
      }
    };

    compareObjects(original, current);
    return changes;
  };

  const resetConfiguration = () => {
    if (originalConfig) {
      setConfig(JSON.parse(JSON.stringify(originalConfig)));
      setValidationErrors({});
      toast.info('Configuration réinitialisée');
    }
  };

  const exportConfiguration = () => {
    if (!config) return;

    const configData = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      configuration: config
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotionscare-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData.configuration) {
          setConfig(importedData.configuration);
          toast.success('Configuration importée avec succès');
        } else {
          toast.error('Format de fichier invalide');
        }
      } catch (error) {
        toast.error('Erreur lors de l\'importation du fichier');
      }
    };
    reader.readAsText(file);
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return;

    setConfig(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));

    // Effacer les erreurs de validation pour ce champ
    const fieldPath = `${section}.${field}`;
    if (validationErrors[fieldPath]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldPath];
        return newErrors;
      });
    }
  };

  const getFieldError = (section: string, field: string): string | undefined => {
    return validationErrors[`${section}.${field}`];
  };

  if (loading || !config) {
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
          <h1 className="text-3xl font-bold text-gray-900">Centre de Configuration Globale</h1>
          <p className="text-gray-600 mt-1">Administration centralisée du système</p>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            accept=".json"
            onChange={importConfiguration}
            className="hidden"
            id="import-config"
          />
          <Button variant="outline" onClick={() => document.getElementById('import-config')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" onClick={exportConfiguration}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          {hasChanges && (
            <Button variant="outline" onClick={resetConfiguration}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          )}
          <Button 
            onClick={saveConfiguration} 
            disabled={saving || !hasChanges}
            className={hasChanges ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Indicateur de changements */}
      {hasChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Des modifications non sauvegardées sont en attente. N'oubliez pas de sauvegarder vos changements.
          </AlertDescription>
        </Alert>
      )}

      {/* Onglets de configuration */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Base de données
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="features">
            <Monitor className="w-4 h-4 mr-2" />
            Fonctionnalités
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="w-4 h-4 mr-2" />
            Branding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Générale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appName">Nom de l'application</Label>
                  <Input
                    id="appName"
                    value={config.general.appName}
                    onChange={(e) => updateConfig('general', 'appName', e.target.value)}
                    className={getFieldError('general', 'appName') ? 'border-red-500' : ''}
                  />
                  {getFieldError('general', 'appName') && (
                    <p className="text-sm text-red-500 mt-1">{getFieldError('general', 'appName')}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="supportEmail">Email de support</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={config.general.supportEmail}
                    onChange={(e) => updateConfig('general', 'supportEmail', e.target.value)}
                    className={getFieldError('general', 'supportEmail') ? 'border-red-500' : ''}
                  />
                  {getFieldError('general', 'supportEmail') && (
                    <p className="text-sm text-red-500 mt-1">{getFieldError('general', 'supportEmail')}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="appDescription">Description de l'application</Label>
                <Textarea
                  id="appDescription"
                  value={config.general.appDescription}
                  onChange={(e) => updateConfig('general', 'appDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode maintenance</Label>
                    <p className="text-sm text-gray-600">Activer le mode maintenance pour l'application</p>
                  </div>
                  <Switch
                    checked={config.general.maintenanceMode}
                    onCheckedChange={(checked) => updateConfig('general', 'maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode debug</Label>
                    <p className="text-sm text-gray-600">Activer les logs de débogage détaillés</p>
                  </div>
                  <Switch
                    checked={config.general.debugMode}
                    onCheckedChange={(checked) => updateConfig('general', 'debugMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics activées</Label>
                    <p className="text-sm text-gray-600">Collecter les données d'utilisation anonymes</p>
                  </div>
                  <Switch
                    checked={config.general.analyticsEnabled}
                    onCheckedChange={(checked) => updateConfig('general', 'analyticsEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Timeout de session (secondes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                    className={getFieldError('security', 'sessionTimeout') ? 'border-red-500' : ''}
                  />
                  {getFieldError('security', 'sessionTimeout') && (
                    <p className="text-sm text-red-500 mt-1">{getFieldError('security', 'sessionTimeout')}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Longueur min. mot de passe</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                    className={getFieldError('security', 'passwordMinLength') ? 'border-red-500' : ''}
                  />
                  {getFieldError('security', 'passwordMinLength') && (
                    <p className="text-sm text-red-500 mt-1">{getFieldError('security', 'passwordMinLength')}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Authentification multi-facteurs obligatoire</Label>
                  <p className="text-sm text-gray-600">Forcer l'activation de la MFA pour tous les utilisateurs</p>
                </div>
                <Switch
                  checked={config.security.requireMFA}
                  onCheckedChange={(checked) => updateConfig('security', 'requireMFA', checked)}
                />
              </div>

              <div>
                <Label htmlFor="allowedDomains">Domaines autorisés (un par ligne)</Label>
                <Textarea
                  id="allowedDomains"
                  value={config.security.allowedDomains.join('\n')}
                  onChange={(e) => updateConfig('security', 'allowedDomains', e.target.value.split('\n').filter(d => d.trim()))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="ipWhitelist">Liste blanche IP (un par ligne)</Label>
                <Textarea
                  id="ipWhitelist"
                  value={config.security.ipWhitelist.join('\n')}
                  onChange={(e) => updateConfig('security', 'ipWhitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Base de Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="connectionPool">Pool de connexions</Label>
                  <Input
                    id="connectionPool"
                    type="number"
                    value={config.database.connectionPool}
                    onChange={(e) => updateConfig('database', 'connectionPool', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="queryTimeout">Timeout requête (ms)</Label>
                  <Input
                    id="queryTimeout"
                    type="number"
                    value={config.database.queryTimeout}
                    onChange={(e) => updateConfig('database', 'queryTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="backupSchedule">Planification sauvegarde (cron)</Label>
                  <Input
                    id="backupSchedule"
                    value={config.database.backupSchedule}
                    onChange={(e) => updateConfig('database', 'backupSchedule', e.target.value)}
                    placeholder="0 2 * * *"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compression activée</Label>
                    <p className="text-sm text-gray-600">Compresser les données pour économiser l'espace</p>
                  </div>
                  <Switch
                    checked={config.database.compressionEnabled}
                    onCheckedChange={(checked) => updateConfig('database', 'compressionEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chiffrement activé</Label>
                    <p className="text-sm text-gray-600">Chiffrer les données sensibles en base</p>
                  </div>
                  <Switch
                    checked={config.database.encryptionEnabled}
                    onCheckedChange={(checked) => updateConfig('database', 'encryptionEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications email</Label>
                    <p className="text-sm text-gray-600">Envoyer les notifications par email</p>
                  </div>
                  <Switch
                    checked={config.notifications.emailEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', 'emailEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications push</Label>
                    <p className="text-sm text-gray-600">Envoyer les notifications push</p>
                  </div>
                  <Switch
                    checked={config.notifications.pushEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', 'pushEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-gray-600">Envoyer les notifications par SMS</p>
                  </div>
                  <Switch
                    checked={config.notifications.smsEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', 'smsEnabled', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slackWebhook">Webhook Slack</Label>
                  <Input
                    id="slackWebhook"
                    type="url"
                    value={config.notifications.slackWebhook}
                    onChange={(e) => updateConfig('notifications', 'slackWebhook', e.target.value)}
                    placeholder="https://hooks.slack.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="discordWebhook">Webhook Discord</Label>
                  <Input
                    id="discordWebhook"
                    type="url"
                    value={config.notifications.discordWebhook}
                    onChange={(e) => updateConfig('notifications', 'discordWebhook', e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cacheTtl">TTL Cache (secondes)</Label>
                  <Input
                    id="cacheTtl"
                    type="number"
                    value={config.performance.cacheTtl}
                    onChange={(e) => updateConfig('performance', 'cacheTtl', parseInt(e.target.value))}
                    className={getFieldError('performance', 'cacheTtl') ? 'border-red-500' : ''}
                  />
                  {getFieldError('performance', 'cacheTtl') && (
                    <p className="text-sm text-red-500 mt-1">{getFieldError('performance', 'cacheTtl')}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="compressionLevel">Niveau compression (1-9)</Label>
                  <Input
                    id="compressionLevel"
                    type="number"
                    min="1"
                    max="9"
                    value={config.performance.compressionLevel}
                    onChange={(e) => updateConfig('performance', 'compressionLevel', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="rateLimit">Limite de taux (req/min)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={config.performance.rateLimit}
                    onChange={(e) => updateConfig('performance', 'rateLimit', parseInt(e.target.value))}
                    className={getFieldError('performance', 'rateLimit') ? 'border-red-500' : ''}
                  />
                  {getFieldError('performance', 'rateLimit') && (
                    <p className="text-sm text-red-500 mt-1">{getFieldError('performance', 'rateLimit')}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache activé</Label>
                    <p className="text-sm text-gray-600">Activer la mise en cache des réponses</p>
                  </div>
                  <Switch
                    checked={config.performance.cacheEnabled}
                    onCheckedChange={(checked) => updateConfig('performance', 'cacheEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>CDN activé</Label>
                    <p className="text-sm text-gray-600">Utiliser un CDN pour les ressources statiques</p>
                  </div>
                  <Switch
                    checked={config.performance.cdnEnabled}
                    onCheckedChange={(checked) => updateConfig('performance', 'cdnEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Limitation de taux activée</Label>
                    <p className="text-sm text-gray-600">Limiter le nombre de requêtes par utilisateur</p>
                  </div>
                  <Switch
                    checked={config.performance.rateLimitEnabled}
                    onCheckedChange={(checked) => updateConfig('performance', 'rateLimitEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Activées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Inscription utilisateur</Label>
                      <p className="text-sm text-gray-600">Permettre l'inscription de nouveaux utilisateurs</p>
                    </div>
                    <Switch
                      checked={config.features.userRegistration}
                      onCheckedChange={(checked) => updateConfig('features', 'userRegistration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Connexion sociale</Label>
                      <p className="text-sm text-gray-600">Connexion via Google, Facebook, etc.</p>
                    </div>
                    <Switch
                      checked={config.features.socialLogin}
                      onCheckedChange={(checked) => updateConfig('features', 'socialLogin', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Upload de fichiers</Label>
                      <p className="text-sm text-gray-600">Permettre l'upload de fichiers par les utilisateurs</p>
                    </div>
                    <Switch
                      checked={config.features.fileUpload}
                      onCheckedChange={(checked) => updateConfig('features', 'fileUpload', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Appels vidéo</Label>
                      <p className="text-sm text-gray-600">Fonctionnalité d'appels vidéo intégrée</p>
                    </div>
                    <Switch
                      checked={config.features.videoCall}
                      onCheckedChange={(checked) => updateConfig('features', 'videoCall', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fonctionnalités IA</Label>
                      <p className="text-sm text-gray-600">Activar les fonctionnalités d'intelligence artificielle</p>
                    </div>
                    <Switch
                      checked={config.features.aiFeatures}
                      onCheckedChange={(checked) => updateConfig('features', 'aiFeatures', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fonctionnalités premium</Label>
                      <p className="text-sm text-gray-600">Activer les fonctionnalités payantes</p>
                    </div>
                    <Switch
                      checked={config.features.premiumFeatures}
                      onCheckedChange={(checked) => updateConfig('features', 'premiumFeatures', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Marque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Couleur primaire</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.branding.primaryColor}
                      onChange={(e) => updateConfig('branding', 'primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.branding.primaryColor}
                      onChange={(e) => updateConfig('branding', 'primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.branding.secondaryColor}
                      onChange={(e) => updateConfig('branding', 'secondaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.branding.secondaryColor}
                      onChange={(e) => updateConfig('branding', 'secondaryColor', e.target.value)}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoUrl">URL du logo</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    value={config.branding.logoUrl}
                    onChange={(e) => updateConfig('branding', 'logoUrl', e.target.value)}
                    placeholder="/logo.svg"
                  />
                </div>
                <div>
                  <Label htmlFor="faviconUrl">URL du favicon</Label>
                  <Input
                    id="faviconUrl"
                    type="url"
                    value={config.branding.faviconUrl}
                    onChange={(e) => updateConfig('branding', 'faviconUrl', e.target.value)}
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="footerText">Texte du pied de page</Label>
                <Input
                  id="footerText"
                  value={config.branding.footerText}
                  onChange={(e) => updateConfig('branding', 'footerText', e.target.value)}
                  placeholder="© 2024 EmotionsCare. Tous droits réservés."
                />
              </div>

              <div>
                <Label htmlFor="customCss">CSS personnalisé</Label>
                <Textarea
                  id="customCss"
                  value={config.branding.customCss}
                  onChange={(e) => updateConfig('branding', 'customCss', e.target.value)}
                  rows={6}
                  placeholder="/* CSS personnalisé pour l'application */"
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Historique des changements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Modifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {configHistory.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{entry.section}</Badge>
                    <span className="text-sm text-gray-600">
                      par {entry.user}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(entry.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">{entry.reason}</p>
                  <div className="text-xs text-gray-600">
                    {Object.entries(entry.changes).map(([key, change]) => (
                      <div key={key} className="mb-1">
                        <code className="bg-gray-100 px-1 rounded">{key}</code>: {
                          typeof change === 'object' && change.from !== undefined ? 
                          `${JSON.stringify(change.from)} → ${JSON.stringify(change.to)}` :
                          JSON.stringify(change)
                        }
                      </div>
                    ))}
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};