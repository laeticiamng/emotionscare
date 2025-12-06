import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ConfigSectionProps, BrandingConfig } from './config-types';

export const BrandingConfigSection: React.FC<ConfigSectionProps<BrandingConfig>> = ({
  config,
  onChange,
}) => {
  const updateField = <K extends keyof BrandingConfig>(field: K, value: BrandingConfig[K]) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration de Branding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryColor">Couleur primaire</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="w-20"
              />
              <Input
                type="text"
                value={config.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                placeholder="#3b82f6"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="secondaryColor">Couleur secondaire</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={config.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="w-20"
              />
              <Input
                type="text"
                value={config.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
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
              value={config.logoUrl}
              onChange={(e) => updateField('logoUrl', e.target.value)}
              placeholder="/logo.svg"
            />
          </div>
          <div>
            <Label htmlFor="faviconUrl">URL du favicon</Label>
            <Input
              id="faviconUrl"
              type="url"
              value={config.faviconUrl}
              onChange={(e) => updateField('faviconUrl', e.target.value)}
              placeholder="/favicon.ico"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="footerText">Texte du footer</Label>
          <Input
            id="footerText"
            value={config.footerText}
            onChange={(e) => updateField('footerText', e.target.value)}
            placeholder="© 2024 EmotionsCare. Tous droits réservés."
          />
        </div>

        <div>
          <Label htmlFor="customCss">CSS personnalisé</Label>
          <Textarea
            id="customCss"
            value={config.customCss}
            onChange={(e) => updateField('customCss', e.target.value)}
            rows={6}
            placeholder="/* CSS personnalisé */"
            className="font-mono text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};
