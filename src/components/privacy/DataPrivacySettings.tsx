// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { Shield, Database, Target, Eye, Download } from 'lucide-react';
import { useEthics } from '@/contexts/EthicsContext';
import { toast } from 'sonner';

const DataPrivacySettings: React.FC = () => {
  const { privacySettings, updatePrivacySettings, loading } = useEthics();

  const handleToggle = async (key: keyof typeof privacySettings, value: boolean) => {
    await updatePrivacySettings({ [key]: value });
  };

  const handleRetentionChange = async (value: number[]) => {
    await updatePrivacySettings({ dataRetention: value[0] });
  };

  const handleFormatChange = async (format: 'json' | 'csv' | 'xml') => {
    await updatePrivacySettings({ exportFormat: format });
  };

  const settings = [
    {
      id: 'dataSharing',
      title: 'Partage des données',
      description: 'Autoriser le partage des données avec des partenaires de confiance',
      icon: Database,
      value: privacySettings.dataSharing,
      color: 'blue'
    },
    {
      id: 'analytics',
      title: 'Analyses et statistiques',
      description: 'Utiliser vos données pour améliorer l\'expérience utilisateur',
      icon: Eye,
      value: privacySettings.analytics,
      color: 'green'
    },
    {
      id: 'marketing',
      title: 'Communications marketing',
      description: 'Recevoir des offres personnalisées et des newsletters',
      icon: Target,
      value: privacySettings.marketing,
      color: 'purple'
    },
    {
      id: 'anonymization',
      title: 'Anonymisation automatique',
      description: 'Anonymiser automatiquement vos données après la période de rétention',
      icon: Shield,
      value: privacySettings.anonymization,
      color: 'emerald'
    }
  ] as const;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Paramètres de Confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paramètres de consentement */}
          <div className="grid gap-4">
            {settings.map((setting, index) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg bg-${setting.color}-100`}>
                    <setting.icon className={`h-4 w-4 text-${setting.color}-600`} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-base font-medium">{setting.title}</Label>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  checked={setting.value}
                  onCheckedChange={(checked) => handleToggle(setting.id, checked)}
                  disabled={loading}
                />
              </motion.div>
            ))}
          </div>

          {/* Rétention des données */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <Label className="text-base font-medium">Période de rétention des données</Label>
            <div className="space-y-2">
              <Slider
                value={[privacySettings.dataRetention]}
                onValueChange={handleRetentionChange}
                max={120}
                min={1}
                step={1}
                className="flex-1"
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 mois</span>
                <span className="font-medium">
                  {privacySettings.dataRetention} mois
                </span>
                <span>10 ans</span>
              </div>
            </div>
          </motion.div>

          {/* Format d'export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <Label className="text-base font-medium">Format d'export par défaut</Label>
            <Select
              value={privacySettings.exportFormat}
              onValueChange={handleFormatChange}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON (recommandé)</SelectItem>
                <SelectItem value="csv">CSV (tableur)</SelectItem>
                <SelectItem value="xml">XML (technique)</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Paramètres sauvegardés automatiquement')}
              >
                <Download className="h-4 w-4 mr-2" />
                Sauvegarder les préférences
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  updatePrivacySettings({
                    dataSharing: false,
                    analytics: true,
                    marketing: false,
                    anonymization: true
                  });
                  toast.success('Paramètres restaurés par défaut');
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Réinitialiser par défaut
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DataPrivacySettings;
