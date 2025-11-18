import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { ConfigSectionProps, SecurityConfig } from './config-types';

export const SecurityConfigSection: React.FC<ConfigSectionProps<SecurityConfig>> = ({
  config,
  onChange,
}) => {
  const updateField = <K extends keyof SecurityConfig>(field: K, value: SecurityConfig[K]) => {
    onChange({ ...config, [field]: value });
  };

  return (
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
              value={config.sessionTimeout}
              onChange={(e) => updateField('sessionTimeout', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              value={config.maxLoginAttempts}
              onChange={(e) => updateField('maxLoginAttempts', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="passwordMinLength">Longueur minimale du mot de passe</Label>
            <Input
              id="passwordMinLength"
              type="number"
              value={config.passwordMinLength}
              onChange={(e) => updateField('passwordMinLength', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Authentification multi-facteurs (MFA)</Label>
            <p className="text-sm text-gray-600">Exiger la MFA pour tous les utilisateurs</p>
          </div>
          <Switch
            checked={config.requireMFA}
            onCheckedChange={(checked) => updateField('requireMFA', checked)}
          />
        </div>

        <div>
          <Label htmlFor="allowedDomains">Domaines autorisés (un par ligne)</Label>
          <Textarea
            id="allowedDomains"
            value={config.allowedDomains.join('\n')}
            onChange={(e) => updateField('allowedDomains', e.target.value.split('\n').filter(d => d.trim()))}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="ipWhitelist">Whitelist IP (un par ligne)</Label>
          <Textarea
            id="ipWhitelist"
            value={config.ipWhitelist.join('\n')}
            onChange={(e) => updateField('ipWhitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
