
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PrivacyPreferencesProps {
  preferences: any;
  onChange: (newPartialPreferences: any) => void;
}

const PrivacyPreferences: React.FC<PrivacyPreferencesProps> = ({
  preferences,
  onChange
}) => {
  const handlePrivacyChange = (key: string, value: any) => {
    onChange({
      privacy: {
        ...preferences.privacy,
        [key]: value
      }
    });
  };

  // Ensure privacy object exists
  const privacy = preferences.privacy || {
    shareData: true,
    anonymizeReports: false,
    profileVisibility: 'public',
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="share-data">Partager mes données pour améliorer le service</Label>
          <Switch
            id="share-data"
            checked={privacy.shareData}
            onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Nous utiliserons vos données de manière anonyme pour améliorer nos algorithmes d'IA
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="anonymize-reports">Anonymiser mes rapports</Label>
          <Switch
            id="anonymize-reports"
            checked={privacy.anonymizeReports}
            onCheckedChange={(checked) => handlePrivacyChange('anonymizeReports', checked)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Vos données seront anonymisées dans les rapports partagés avec votre organisation
        </p>
      </div>

      <div className="space-y-3">
        <Label>Visibilité du profil</Label>
        <RadioGroup
          value={privacy.profileVisibility}
          onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public - Visible par tous les utilisateurs</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="team" id="team" />
            <Label htmlFor="team">Équipe - Visible uniquement par mon équipe</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Privé - Visible uniquement par moi et les administrateurs</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default PrivacyPreferences;
