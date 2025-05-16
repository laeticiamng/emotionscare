
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserPreferences } from '@/types/types';

interface PrivacyPreferencesProps {
  preferences: UserPreferences;
  onChange: (value: Partial<UserPreferences>) => void;
}

const PrivacyPreferences: React.FC<PrivacyPreferencesProps> = ({ preferences, onChange }) => {
  const privacy = preferences.privacy || {
    shareData: true,
    anonymizeReports: false,
    profileVisibility: 'public',
  };
  
  // Helper to update privacy settings
  const updatePrivacy = (updates: Partial<typeof privacy>) => {
    onChange({
      privacy: {
        ...privacy,
        ...updates,
      },
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base">Partage des données</Label>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="share-data"
              checked={privacy.shareData}
              onCheckedChange={(checked) => updatePrivacy({ shareData: checked === true })}
            />
            <Label htmlFor="share-data" className="font-normal">
              Autoriser l'utilisation anonyme des données pour améliorer le service
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymize-reports"
              checked={privacy.anonymizeReports}
              onCheckedChange={(checked) => updatePrivacy({ anonymizeReports: checked === true })}
            />
            <Label htmlFor="anonymize-reports" className="font-normal">
              Anonymiser mes données dans les rapports
            </Label>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label className="text-base">Visibilité du profil</Label>
        
        <RadioGroup
          value={privacy.profileVisibility}
          onValueChange={(value: "public" | "private" | "friends") => 
            updatePrivacy({ profileVisibility: value })
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public" className="font-normal">
              Public - Tout le monde peut voir mon profil
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="friends" id="friends" />
            <Label htmlFor="friends" className="font-normal">
              Amis - Seuls mes contacts peuvent voir mon profil
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private" className="font-normal">
              Privé - Personne ne peut voir mon profil
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default PrivacyPreferences;
