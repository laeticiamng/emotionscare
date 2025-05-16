
import React from 'react';
import { UserPreferences } from '@/types/preferences';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface DataPrivacySettingsProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

const DataPrivacySettings: React.FC<DataPrivacySettingsProps> = ({
  preferences,
  onChange,
}) => {
  // Ensure privacy object exists
  const privacy = preferences.privacy || {
    shareData: false,
    anonymizeReports: false,
    profileVisibility: 'private',
    anonymousMode: false,
  };
  
  // Helper for updating privacy settings
  const handlePrivacyChange = (key: string, value: any) => {
    onChange({
      privacy: {
        ...privacy,
        [key]: value
      }
    });
  };

  // Handle visibility change
  const handleVisibilityChange = (visibility: string) => {
    onChange({
      privacy: {
        ...privacy,
        profileVisibility: visibility
      }
    });
  };

  // Handle fullAnonymity toggle
  const handleFullAnonymityChange = (enabled: boolean) => {
    onChange({
      fullAnonymity: enabled
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Paramètres de confidentialité</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="shareData">Partage de données</Label>
              <p className="text-sm text-muted-foreground">
                Autoriser le partage de données anonymisées pour améliorer les services
              </p>
            </div>
            <Switch
              id="shareData"
              checked={privacy.shareData ?? false}
              onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymizeReports">Anonymiser les rapports</Label>
              <p className="text-sm text-muted-foreground">
                Masquer votre identité dans les rapports d'équipe
              </p>
            </div>
            <Switch
              id="anonymizeReports"
              checked={privacy.anonymizeReports ?? false}
              onCheckedChange={(checked) => handlePrivacyChange('anonymizeReports', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymousMode">Mode anonyme</Label>
              <p className="text-sm text-muted-foreground">
                Masquer votre identité lors des interactions avec la communauté
              </p>
            </div>
            <Switch
              id="anonymousMode"
              checked={privacy.anonymousMode ?? false}
              onCheckedChange={(checked) => handlePrivacyChange('anonymousMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fullAnonymity">Anonymat complet (Premium)</Label>
              <p className="text-sm text-muted-foreground">
                Anonymiser complètement votre utilisation (ne stocke aucune donnée identifiable)
              </p>
            </div>
            <Switch
              id="fullAnonymity"
              checked={preferences.fullAnonymity ?? false}
              onCheckedChange={handleFullAnonymityChange}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Visibilité du profil</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="profileVisibility">Visibilité de mon profil</Label>
            <Select
              value={privacy.profileVisibility}
              onValueChange={handleVisibilityChange}
            >
              <SelectTrigger className="w-full" id="profileVisibility">
                <SelectValue placeholder="Sélectionnez la visibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Équipe uniquement</SelectItem>
                <SelectItem value="private">Privé</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Définit qui peut voir votre profil et votre activité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacySettings;
