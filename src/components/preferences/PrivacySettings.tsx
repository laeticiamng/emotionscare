// @ts-nocheck

import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { PrivacyPreferences } from '@/types/preferences';

const PrivacySettings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const privacy = preferences.privacy as PrivacyPreferences;

  const updatePrivacySetting = (key: keyof PrivacyPreferences, value: boolean | string) => {
    updatePreferences({
      privacy: {
        ...privacy,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Visibilité du profil</h3>
        
        <div className="space-y-2">
          <Label htmlFor="profile-visibility">Qui peut voir votre profil</Label>
          <Select
            value={privacy.profileVisibility}
            onValueChange={(value) => updatePrivacySetting('profileVisibility', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Privé</SelectItem>
              <SelectItem value="friends">Amis uniquement</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Collecte de données</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="data-collection">Collecte de données</Label>
            <p className="text-sm text-muted-foreground">
              Autoriser la collecte de données pour améliorer l'expérience
            </p>
          </div>
          <Switch
            id="data-collection"
            checked={privacy.dataCollection}
            onCheckedChange={(checked) => updatePrivacySetting('dataCollection', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="analytics">Analytics</Label>
            <p className="text-sm text-muted-foreground">
              Participer aux analytics pour améliorer l'application
            </p>
          </div>
          <Switch
            id="analytics"
            checked={privacy.analytics}
            onCheckedChange={(checked) => updatePrivacySetting('analytics', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="marketing">Marketing</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir des communications marketing personnalisées
            </p>
          </div>
          <Switch
            id="marketing"
            checked={privacy.marketing}
            onCheckedChange={(checked) => updatePrivacySetting('marketing', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
