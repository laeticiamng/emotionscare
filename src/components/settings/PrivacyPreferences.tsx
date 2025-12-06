
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { PrivacyPreferences } from '@/types/preferences';

const PrivacyPreferencesComponent: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Assurer que les propriétés sont définies avec des valeurs par défaut
  const getPrivacySettings = (): PrivacyPreferences => {
    if (!preferences?.privacy) {
      return {
        shareData: false,
        shareEmotions: false,
        shareActivity: false,
        publicProfile: false,
        dataSharing: false,
        analytics: true,
        thirdParty: false,
        anonymizeReports: false,
        profileVisibility: 'public',
      };
    }
    
    if (typeof preferences.privacy === 'string') {
      return {
        shareData: preferences.privacy !== 'private',
        shareEmotions: preferences.privacy !== 'private',
        shareActivity: preferences.privacy !== 'private',
        publicProfile: preferences.privacy !== 'private',
        dataSharing: preferences.privacy !== 'private',
        analytics: preferences.privacy !== 'private',
        thirdParty: preferences.privacy !== 'private',
        anonymizeReports: false,
        profileVisibility: preferences.privacy,
      };
    }
    
    return preferences.privacy as PrivacyPreferences;
  };
  
  const privacySettings = getPrivacySettings();
  
  const handleShareDataChange = (checked: boolean) => {
    updatePreferences({
      privacy: {
        ...privacySettings,
        shareData: checked,
        dataSharing: checked, // Mise à jour des deux propriétés pour compatibilité
      },
    });
  };
  
  const handleAnonymizeReportsChange = (checked: boolean) => {
    updatePreferences({
      privacy: {
        ...privacySettings,
        anonymizeReports: checked,
      },
    });
  };
  
  const handleProfileVisibilityChange = (value: string) => {
    updatePreferences({
      privacy: {
        ...privacySettings,
        profileVisibility: value,
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
            <Label htmlFor="share-data">Partage de données</Label>
            <p className="text-sm text-muted-foreground">
              Autoriser le partage anonymisé de données pour améliorer le service
            </p>
          </div>
          <Switch
            id="share-data"
            checked={privacySettings.shareData || privacySettings.dataSharing || false}
            onCheckedChange={handleShareDataChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="anonymize-reports">Anonymiser les rapports</Label>
            <p className="text-sm text-muted-foreground">
              Masquer votre identité dans les rapports d'équipe
            </p>
          </div>
          <Switch
            id="anonymize-reports"
            checked={privacySettings.anonymizeReports || false}
            onCheckedChange={handleAnonymizeReportsChange}
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
              <SelectItem value="team">Équipe seulement</SelectItem>
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
