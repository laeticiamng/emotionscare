
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserPreferences } from '@/types';

interface DataPrivacySettingsProps {
  preferences: UserPreferences;
  onPreferenceChange: (key: string, value: any) => void;
  disabled?: boolean;
}

const DataPrivacySettings: React.FC<DataPrivacySettingsProps> = ({ 
  preferences, 
  onPreferenceChange,
  disabled = false
}) => {
  // Initialize privacy object if it doesn't exist
  const privacy = preferences.privacy || {
    shareActivity: false,
    shareJournal: false,
    publicProfile: false
  };
  
  const handlePrivacyChange = (key: string, value: boolean) => {
    const updatedPrivacy = { ...privacy, [key]: value };
    onPreferenceChange('privacy', updatedPrivacy);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidentialité des données</CardTitle>
        <CardDescription>
          Gérez la visibilité de vos informations et activités sur la plateforme.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Partage d'activité</FormLabel>
            <FormDescription>
              Autorise le partage anonymisé de vos activités pour améliorer les recommandations.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacy.shareActivity || false}
              onCheckedChange={(checked) => handlePrivacyChange('shareActivity', checked)}
              disabled={disabled}
              aria-label="Partage d'activité"
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Journal émotionnel</FormLabel>
            <FormDescription>
              Autorise le partage anonymisé des données de votre journal pour la recherche.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacy.shareJournal || false}
              onCheckedChange={(checked) => handlePrivacyChange('shareJournal', checked)}
              disabled={disabled}
              aria-label="Partage du journal émotionnel"
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Profil public</FormLabel>
            <FormDescription>
              Rend votre profil visible pour les autres utilisateurs de la plateforme.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacy.publicProfile || false}
              onCheckedChange={(checked) => handlePrivacyChange('publicProfile', checked)}
              disabled={disabled}
              aria-label="Profil public"
            />
          </FormControl>
        </FormItem>
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
