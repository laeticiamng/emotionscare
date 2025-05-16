
import React from 'react';
import { UserPreferences } from '@/types/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PrivacyPreferencesProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

const PrivacyPreferences: React.FC<PrivacyPreferencesProps> = ({ preferences, onChange }) => {
  // Ensure we have the privacy object
  const privacy = preferences.privacy || {
    shareData: false,
    anonymizeReports: false,
    profileVisibility: 'private'
  };

  // Helper to update nested privacy preferences
  const handlePrivacyChange = (key: string, value: any) => {
    onChange({
      privacy: {
        ...privacy,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="shareData">Partage des données anonymisées</Label>
          <p className="text-sm text-muted-foreground">
            Autoriser le partage anonyme de vos données pour améliorer nos services
          </p>
        </div>
        <Switch
          id="shareData"
          checked={privacy.shareData}
          onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="anonymizeReports">Anonymiser les rapports</Label>
          <p className="text-sm text-muted-foreground">
            Masquer votre identité dans les rapports d'analyse
          </p>
        </div>
        <Switch
          id="anonymizeReports"
          checked={privacy.anonymizeReports}
          onCheckedChange={(checked) => handlePrivacyChange('anonymizeReports', checked)}
        />
      </div>

      <div>
        <Label htmlFor="profileVisibility">Visibilité du profil</Label>
        <Select
          value={privacy.profileVisibility}
          onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Sélectionner la visibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="friends">Amis uniquement</SelectItem>
            <SelectItem value="private">Privé</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          Définit qui peut voir votre profil et vos activités
        </p>
      </div>
    </div>
  );
};

export default PrivacyPreferences;
