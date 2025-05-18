
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UserPreferences } from '@/types/preferences';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataPrivacySettingsProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  className?: string;
}

const DataPrivacySettings: React.FC<DataPrivacySettingsProps> = ({
  preferences,
  onUpdatePreferences,
  className,
}) => {
  // S'assurer que privacy existe
  const privacy = preferences.privacy || {
    shareActivity: false,
    shareJournal: false,
    publicProfile: false,
    shareData: false,
    anonymizeReports: false,
    profileVisibility: 'private'
  };

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    onUpdatePreferences({
      privacy: {
        ...(preferences.privacy || {}),
        [key]: value,
      },
    });
  };

  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          Confidentialité des données
        </CardTitle>
        <CardDescription>
          Configurez comment vos données sont partagées sur la plateforme.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Partage d'activité</h4>
              <p className="text-sm text-muted-foreground">
                Permettre aux autres utilisateurs de voir votre activité sur la plateforme
              </p>
            </div>
            <Switch 
              checked={privacy.shareActivity || false} 
              onCheckedChange={(value) => handlePrivacyChange('shareActivity', value)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Partage du journal émotionnel</h4>
              <p className="text-sm text-muted-foreground">
                Permettre le partage anonymisé de vos entrées de journal
              </p>
            </div>
            <Switch 
              checked={privacy.shareJournal || false} 
              onCheckedChange={(value) => handlePrivacyChange('shareJournal', value)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Profil public</h4>
              <p className="text-sm text-muted-foreground">
                Rendre votre profil visible pour les autres utilisateurs
              </p>
            </div>
            <Switch 
              checked={privacy.publicProfile || false} 
              onCheckedChange={(value) => handlePrivacyChange('publicProfile', value)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Partage de données pour amélioration</h4>
              <p className="text-sm text-muted-foreground">
                Autoriser l'utilisation anonyme de vos données pour améliorer nos services
              </p>
            </div>
            <Switch 
              checked={privacy.shareData || false} 
              onCheckedChange={(value) => handlePrivacyChange('shareData', value)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Anonymiser les rapports</h4>
              <p className="text-sm text-muted-foreground">
                Supprimer toutes les données d'identification des rapports
              </p>
            </div>
            <Switch 
              checked={privacy.anonymizeReports || false} 
              onCheckedChange={(value) => handlePrivacyChange('anonymizeReports', value)} 
            />
          </div>
        </div>
        
        <div className="space-y-3 pt-3 border-t">
          <h4 className="font-medium">Visibilité du profil</h4>
          <RadioGroup 
            value={privacy.profileVisibility || 'private'} 
            onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="flex items-center">
                <EyeOff className="mr-2 h-4 w-4" /> 
                Privé (visible uniquement par vous)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="contacts" id="contacts" />
              <Label htmlFor="contacts">Visible par vos contacts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Public (visible par tous)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
