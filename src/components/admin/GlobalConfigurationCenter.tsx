/**
 * GLOBAL CONFIGURATION CENTER - Refactorisé
 * Centre de configuration système modulaire et maintenable
 *
 * Refactorisation: 1070 lignes → ~300 lignes
 * Structure: Composants modulaires par section de configuration
 */

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Monitor,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  type SystemConfig,
  type ConfigurationHistory,
  GeneralConfigSection,
  SecurityConfigSection,
  DatabaseConfigSection,
  NotificationsConfigSection,
  PerformanceConfigSection,
  FeaturesConfigSection,
  BrandingConfigSection,
} from './config-sections';

export const GlobalConfigurationCenter: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [originalConfig, setOriginalConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConfiguration();
  }, []);

  useEffect(() => {
    if (config && originalConfig) {
      setHasChanges(JSON.stringify(config) !== JSON.stringify(originalConfig));
    }
  }, [config, originalConfig]);

  const loadConfiguration = async () => {
    try {
      setLoading(true);

      // Configuration par défaut (remplacer par un appel API réel)
      const mockConfig: SystemConfig = {
        general: {
          appName: 'EmotionsCare',
          appDescription: 'Plateforme de bien-être émotionnel alimentée par l\'IA',
          supportEmail: 'contact@emotionscare.com',
          maintenanceMode: false,
          debugMode: false,
          analyticsEnabled: true
        },
        security: {
          sessionTimeout: 3600,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          requireMFA: false,
          allowedDomains: ['emotionscare.com'],
          ipWhitelist: []
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

  const validateConfiguration = (config: SystemConfig): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!config.general.appName.trim()) {
      errors['general.appName'] = 'Le nom de l\'application est requis';
    }
    if (!config.general.supportEmail.includes('@')) {
      errors['general.supportEmail'] = 'Email de support invalide';
    }
    if (config.security.sessionTimeout < 300) {
      errors['security.sessionTimeout'] = 'Minimum 5 minutes';
    }
    if (config.security.passwordMinLength < 6) {
      errors['security.passwordMinLength'] = 'Minimum 6 caractères';
    }
    if (config.performance.rateLimit < 1) {
      errors['performance.rateLimit'] = 'Doit être > 0';
    }

    return errors;
  };

  const saveConfiguration = async () => {
    if (!config) return;

    const errors = validateConfiguration(config);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Veuillez corriger les erreurs avant de sauvegarder');
      return;
    }

    try {
      setSaving(true);

      // Simuler la sauvegarde (remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOriginalConfig(JSON.parse(JSON.stringify(config)));
      toast.success('Configuration sauvegardée avec succès');
      logger.info('Configuration sauvegardée', null, 'ADMIN');
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde', error, 'ADMIN');
      toast.error('Erreur lors de la sauvegarde de la configuration');
    } finally {
      setSaving(false);
    }
  };

  const resetConfiguration = () => {
    if (originalConfig) {
      setConfig(JSON.parse(JSON.stringify(originalConfig)));
      setValidationErrors({});
      toast.info('Modifications annulées');
    }
  };

  const exportConfiguration = () => {
    if (!config) return;

    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `config-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Configuration exportée');
  };

  const importConfiguration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedConfig = JSON.parse(event.target?.result as string);
        setConfig(importedConfig);
        toast.success('Configuration importée');
      } catch (error) {
        toast.error('Fichier de configuration invalide');
      }
    };
    reader.readAsText(file);
  };

  if (loading || !config) {
    return <div className="container mx-auto p-6">Chargement...</div>;
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
          <Button
            variant="outline"
            onClick={() => document.getElementById('import-config')?.click()}
            aria-label="Importer la configuration"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" onClick={exportConfiguration} aria-label="Exporter la configuration">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          {hasChanges && (
            <Button variant="outline" onClick={resetConfiguration} aria-label="Réinitialiser les modifications">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          )}
          <Button
            onClick={saveConfiguration}
            disabled={saving || !hasChanges}
            className={hasChanges ? 'bg-blue-600 hover:bg-blue-700' : ''}
            aria-label="Sauvegarder la configuration"
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

        <TabsContent value="general">
          <GeneralConfigSection
            config={config.general}
            onChange={(newGeneral) => setConfig({ ...config, general: newGeneral })}
            validationErrors={validationErrors}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityConfigSection
            config={config.security}
            onChange={(newSecurity) => setConfig({ ...config, security: newSecurity })}
            validationErrors={validationErrors}
          />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseConfigSection
            config={config.database}
            onChange={(newDatabase) => setConfig({ ...config, database: newDatabase })}
            validationErrors={validationErrors}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsConfigSection
            config={config.notifications}
            onChange={(newNotifications) => setConfig({ ...config, notifications: newNotifications })}
            validationErrors={validationErrors}
          />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceConfigSection
            config={config.performance}
            onChange={(newPerformance) => setConfig({ ...config, performance: newPerformance })}
            validationErrors={validationErrors}
          />
        </TabsContent>

        <TabsContent value="features">
          <FeaturesConfigSection
            config={config.features}
            onChange={(newFeatures) => setConfig({ ...config, features: newFeatures })}
            validationErrors={validationErrors}
          />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingConfigSection
            config={config.branding}
            onChange={(newBranding) => setConfig({ ...config, branding: newBranding })}
            validationErrors={validationErrors}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
