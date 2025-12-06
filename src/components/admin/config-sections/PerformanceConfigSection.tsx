import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ConfigSectionProps, PerformanceConfig } from './config-types';

export const PerformanceConfigSection: React.FC<ConfigSectionProps<PerformanceConfig>> = ({
  config,
  onChange,
}) => {
  const updateField = <K extends keyof PerformanceConfig>(field: K, value: PerformanceConfig[K]) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration de Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Cache</Label>
              <p className="text-sm text-gray-600">Activer le système de cache</p>
            </div>
            <Switch
              checked={config.cacheEnabled}
              onCheckedChange={(checked) => updateField('cacheEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>CDN</Label>
              <p className="text-sm text-gray-600">Utiliser un CDN pour les assets</p>
            </div>
            <Switch
              checked={config.cdnEnabled}
              onCheckedChange={(checked) => updateField('cdnEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Rate limiting</Label>
              <p className="text-sm text-gray-600">Activer la limitation de débit</p>
            </div>
            <Switch
              checked={config.rateLimitEnabled}
              onCheckedChange={(checked) => updateField('rateLimitEnabled', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="cacheTtl">TTL du cache (secondes)</Label>
            <Input
              id="cacheTtl"
              type="number"
              value={config.cacheTtl}
              onChange={(e) => updateField('cacheTtl', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="compressionLevel">Niveau de compression (1-9)</Label>
            <Input
              id="compressionLevel"
              type="number"
              min={1}
              max={9}
              value={config.compressionLevel}
              onChange={(e) => updateField('compressionLevel', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="rateLimit">Limite de débit (req/min)</Label>
            <Input
              id="rateLimit"
              type="number"
              value={config.rateLimit}
              onChange={(e) => updateField('rateLimit', parseInt(e.target.value))}
              disabled={!config.rateLimitEnabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
