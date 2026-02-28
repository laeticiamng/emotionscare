import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { PrivacyPreferences } from '@/types/preferences';

const PrivacyPreferencesComponent: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const getPrivacySettings = (): PrivacyPreferences => {
    if (!preferences?.privacy) {
      return {
        profileVisibility: 'public',
        dataCollection: false,
        analytics: true,
        marketing: false,
      };
    }
    
    if (typeof preferences.privacy === 'string') {
      return {
        profileVisibility: preferences.privacy as 'private' | 'friends' | 'public',
        dataCollection: preferences.privacy !== 'private',
        analytics: true,
        marketing: false,
      };
    }
    
    return preferences.privacy as PrivacyPreferences;
  };
  
  const privacySettings = getPrivacySettings();
  
  const handleDataCollectionChange = (checked: boolean) => {
    updatePreferences({
      privacy: {
        ...privacySettings,
        dataCollection: checked,
      },
    });
  };
  
  const handleAnalyticsChange = (checked: boolean) => {
    updatePreferences({
      privacy: {
        ...privacySettings,
        analytics: checked,
      },
    });
  };
  
  const handleProfileVisibilityChange = (value: string) => {
    updatePreferences({
      privacy: {
        ...privacySettings,
        profileVisibility: value as 'private' | 'friends' | 'public',
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de confidentialité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="data-collection">Collecte de données</Label>
            <p className="text-sm text-muted-foreground">
              Autoriser la collecte anonymisée de données pour améliorer le service
            </p>
          </div>
          <Switch
            id="data-collection"
            checked={privacySettings.dataCollection || false}
            onCheckedChange={handleDataCollectionChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">Analytics</Label>
            <p className="text-sm text-muted-foreground">
              Activer les statistiques d'utilisation anonymes
            </p>
          </div>
          <Switch
            id="analytics"
            checked={privacySettings.analytics || false}
            onCheckedChange={handleAnalyticsChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-visibility">Visibilité du profil</Label>
          <Select
            value={privacySettings.profileVisibility || 'public'}
            onValueChange={handleProfileVisibilityChange}
          >
            <SelectTrigger id="profile-visibility">
              <SelectValue placeholder="Choisir la visibilité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Amis seulement</SelectItem>
              <SelectItem value="private">Privé</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Détermine qui peut voir votre profil et vos statistiques
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyPreferencesComponent;
