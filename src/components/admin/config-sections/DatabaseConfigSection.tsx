import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ConfigSectionProps, DatabaseConfig } from './config-types';

export const DatabaseConfigSection: React.FC<ConfigSectionProps<DatabaseConfig>> = ({
  config,
  onChange,
}) => {
  const updateField = <K extends keyof DatabaseConfig>(field: K, value: DatabaseConfig[K]) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration de la Base de Données</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="connectionPool">Taille du pool de connexions</Label>
            <Input
              id="connectionPool"
              type="number"
              value={config.connectionPool}
              onChange={(e) => updateField('connectionPool', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="queryTimeout">Timeout de requête (ms)</Label>
            <Input
              id="queryTimeout"
              type="number"
              value={config.queryTimeout}
              onChange={(e) => updateField('queryTimeout', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="backupSchedule">Planning de sauvegarde (cron)</Label>
            <Input
              id="backupSchedule"
              value={config.backupSchedule}
              onChange={(e) => updateField('backupSchedule', e.target.value)}
              placeholder="0 2 * * *"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Compression des données</Label>
              <p className="text-sm text-gray-600">Compresser les données en base</p>
            </div>
            <Switch
              checked={config.compressionEnabled}
              onCheckedChange={(checked) => updateField('compressionEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Chiffrement des données</Label>
              <p className="text-sm text-gray-600">Chiffrer les données sensibles</p>
            </div>
            <Switch
              checked={config.encryptionEnabled}
              onCheckedChange={(checked) => updateField('encryptionEnabled', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
