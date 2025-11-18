import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { ConfigSectionProps, GeneralConfig } from './config-types';

export const GeneralConfigSection: React.FC<ConfigSectionProps<GeneralConfig>> = ({
  config,
  onChange,
  validationErrors = {}
}) => {
  const updateField = <K extends keyof GeneralConfig>(field: K, value: GeneralConfig[K]) => {
    onChange({ ...config, [field]: value });
  };

  const getFieldError = (field: string) => validationErrors[`general.${field}`];

  return (
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
              value={config.appName}
              onChange={(e) => updateField('appName', e.target.value)}
              className={getFieldError('appName') ? 'border-red-500' : ''}
            />
            {getFieldError('appName') && (
              <p className="text-sm text-red-500 mt-1">{getFieldError('appName')}</p>
            )}
          </div>
          <div>
            <Label htmlFor="supportEmail">Email de support</Label>
            <Input
              id="supportEmail"
              type="email"
              value={config.supportEmail}
              onChange={(e) => updateField('supportEmail', e.target.value)}
              className={getFieldError('supportEmail') ? 'border-red-500' : ''}
            />
            {getFieldError('supportEmail') && (
              <p className="text-sm text-red-500 mt-1">{getFieldError('supportEmail')}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="appDescription">Description de l'application</Label>
          <Textarea
            id="appDescription"
            value={config.appDescription}
            onChange={(e) => updateField('appDescription', e.target.value)}
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
              checked={config.maintenanceMode}
              onCheckedChange={(checked) => updateField('maintenanceMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Mode débogage</Label>
              <p className="text-sm text-gray-600">Afficher les logs de débogage</p>
            </div>
            <Switch
              checked={config.debugMode}
              onCheckedChange={(checked) => updateField('debugMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Analytiques</Label>
              <p className="text-sm text-gray-600">Activer le suivi analytique</p>
            </div>
            <Switch
              checked={config.analyticsEnabled}
              onCheckedChange={(checked) => updateField('analyticsEnabled', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
