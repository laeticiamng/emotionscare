import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ConfigSectionProps, FeaturesConfig } from './config-types';

export const FeaturesConfigSection: React.FC<ConfigSectionProps<FeaturesConfig>> = ({
  config,
  onChange,
}) => {
  const updateField = <K extends keyof FeaturesConfig>(field: K, value: FeaturesConfig[K]) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fonctionnalités</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Inscription des utilisateurs</Label>
            <p className="text-sm text-gray-600">Permettre l'inscription de nouveaux utilisateurs</p>
          </div>
          <Switch
            checked={config.userRegistration}
            onCheckedChange={(checked) => updateField('userRegistration', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Connexion sociale</Label>
            <p className="text-sm text-gray-600">Activer la connexion via réseaux sociaux</p>
          </div>
          <Switch
            checked={config.socialLogin}
            onCheckedChange={(checked) => updateField('socialLogin', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Upload de fichiers</Label>
            <p className="text-sm text-gray-600">Permettre l'upload de fichiers</p>
          </div>
          <Switch
            checked={config.fileUpload}
            onCheckedChange={(checked) => updateField('fileUpload', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Appels vidéo</Label>
            <p className="text-sm text-gray-600">Activer les fonctionnalités d'appel vidéo</p>
          </div>
          <Switch
            checked={config.videoCall}
            onCheckedChange={(checked) => updateField('videoCall', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Fonctionnalités IA</Label>
            <p className="text-sm text-gray-600">Activer les fonctionnalités d'intelligence artificielle</p>
          </div>
          <Switch
            checked={config.aiFeatures}
            onCheckedChange={(checked) => updateField('aiFeatures', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Fonctionnalités premium</Label>
            <p className="text-sm text-gray-600">Activer les fonctionnalités premium</p>
          </div>
          <Switch
            checked={config.premiumFeatures}
            onCheckedChange={(checked) => updateField('premiumFeatures', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
