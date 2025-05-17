
import React, { useState } from 'react';
import { UserPreferences } from '@/types/preferences';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Shield } from 'lucide-react';

interface DataPrivacySettingsProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

const DataPrivacySettings: React.FC<DataPrivacySettingsProps> = ({
  preferences,
  onChange
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const handlePrivacyLevelChange = (level: string) => {
    switch (level) {
      case 'minimal':
        onChange({
          privacy: {
            shareData: true,
            anonymizeReports: false,
            profileVisibility: 'public',
            anonymousMode: false
          }
        });
        break;
      case 'balanced':
        onChange({
          privacy: {
            shareData: true,
            anonymizeReports: true,
            profileVisibility: 'team',
            anonymousMode: false
          }
        });
        break;
      case 'strict':
        onChange({
          privacy: {
            shareData: false,
            anonymizeReports: true,
            profileVisibility: 'private',
            anonymousMode: true
          }
        });
        break;
      default:
        break;
    }
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleToggleDataSharing = (enabled: boolean) => {
    onChange({
      privacy: {
        ...preferences.privacy,
        shareData: enabled
      }
    });
  };
  
  const handleToggleAnonymizeReports = (enabled: boolean) => {
    onChange({
      privacy: {
        ...preferences.privacy,
        anonymizeReports: enabled
      }
    });
  };
  
  const handleProfileVisibilityChange = (value: 'public' | 'team' | 'private') => {
    onChange({
      privacy: {
        ...preferences.privacy,
        profileVisibility: value
      }
    });
  };
  
  const handleToggleAnonymousMode = (enabled: boolean) => {
    const privacy = { ...preferences.privacy };
    
    // Si le type est valide, mettre à jour la propriété anonymousMode
    if ('anonymousMode' in privacy) {
      onChange({
        privacy: {
          ...privacy,
          anonymousMode: enabled
        }
      });
    } else {
      // Si la propriété n'existe pas dans le type, on l'ajoute
      const updatedPrivacy = {
        ...privacy,
        anonymousMode: enabled
      };
      
      onChange({
        privacy: updatedPrivacy
      });
    }
  };
  
  const privacyLevel = 
    !preferences.privacy.shareData && preferences.privacy.anonymizeReports && preferences.privacy.profileVisibility === 'private' ? 'strict' :
    preferences.privacy.shareData && preferences.privacy.anonymizeReports ? 'balanced' : 'minimal';
  
  return (
    <div className="space-y-6">
      {showSuccessMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Paramètres de confidentialité mis à jour</AlertTitle>
          <AlertDescription>
            Vos préférences de confidentialité ont été mises à jour avec succès.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Niveau de confidentialité</h3>
        <RadioGroup 
          value={privacyLevel}
          onValueChange={handlePrivacyLevelChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex flex-col p-4 border rounded-lg hover:border-primary cursor-pointer">
            <RadioGroupItem value="minimal" id="minimal" className="self-start" />
            <Label htmlFor="minimal" className="font-semibold mb-2">Minimal</Label>
            <p className="text-sm text-muted-foreground">
              Partage des données activé, profil public, aucune anonymisation.
            </p>
          </div>
          
          <div className="flex flex-col p-4 border rounded-lg hover:border-primary cursor-pointer">
            <RadioGroupItem value="balanced" id="balanced" className="self-start" />
            <Label htmlFor="balanced" className="font-semibold mb-2">Équilibré</Label>
            <p className="text-sm text-muted-foreground">
              Partage des données anonymisées, profil visible par l'équipe.
            </p>
          </div>
          
          <div className="flex flex-col p-4 border rounded-lg hover:border-primary cursor-pointer">
            <RadioGroupItem value="strict" id="strict" className="self-start" />
            <Label htmlFor="strict" className="font-semibold mb-2">Strict</Label>
            <p className="text-sm text-muted-foreground">
              Aucun partage de données, profil privé, anonymisation complète.
            </p>
          </div>
        </RadioGroup>
      </div>
      
      <div className="p-4 border rounded-md space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          Paramètres détaillés
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-data" className="font-medium">Partager les données anonymisées</Label>
              <p className="text-sm text-muted-foreground">
                Autoriser l'utilisation de données anonymisées pour améliorer le service
              </p>
            </div>
            <Switch
              id="share-data"
              checked={preferences.privacy.shareData}
              onCheckedChange={handleToggleDataSharing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymize-reports" className="font-medium">Anonymiser les rapports</Label>
              <p className="text-sm text-muted-foreground">
                Retirer toutes les informations personnelles des rapports
              </p>
            </div>
            <Switch
              id="anonymize-reports"
              checked={preferences.privacy.anonymizeReports}
              onCheckedChange={handleToggleAnonymizeReports}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="font-medium">Visibilité du profil</Label>
            <RadioGroup
              value={preferences.privacy.profileVisibility}
              onValueChange={handleProfileVisibilityChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="font-normal">
                  Public - Visible par tous
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team" className="font-normal">
                  Équipe - Visible par les membres de mon équipe
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="font-normal">
                  Privé - Visible uniquement par moi
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {preferences.privacy.profileVisibility === 'private' && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="anonymous-mode" className="font-medium">Mode anonyme renforcé</Label>
                <p className="text-sm text-muted-foreground">
                  Utiliser un pseudonyme et masquer toutes les informations personnelles
                </p>
              </div>
              <Switch
                id="anonymous-mode"
                checked={preferences.privacy.anonymousMode || false}
                onCheckedChange={handleToggleAnonymousMode}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-4">
        <Button variant="outline" className="w-full">
          Demander l'export de mes données
        </Button>
      </div>
    </div>
  );
};

export default DataPrivacySettings;
