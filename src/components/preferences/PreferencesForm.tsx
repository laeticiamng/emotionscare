
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { FontSize, FontFamily, UserPreferences } from '@/types/preferences';

interface PreferencesFormProps {
  className?: string;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ className }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [formValues, setFormValues] = useState<UserPreferences>(preferences);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system' | 'pastel') => {
    setFormValues(prev => ({ ...prev, theme }));
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    setFormValues(prev => ({ ...prev, fontSize }));
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    setFormValues(prev => ({ ...prev, fontFamily }));
  };

  const handleToggleChange = (key: keyof UserPreferences, value: boolean) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setFormValues(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    if (key === 'enabled' || key === 'emailEnabled' || key === 'pushEnabled' || key === 'inAppEnabled') {
      setFormValues(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: value
        }
      }));
    } else {
      setFormValues(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          types: {
            ...prev.notifications.types,
            [key]: value
          }
        }
      }));
    }
  };

  const handleSave = () => {
    updatePreferences(formValues);
    // Afficher une notification de succès
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Préférences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Préférences d'affichage */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Affichage</h3>
          
          <div className="space-y-2">
            <Label htmlFor="theme">Thème</Label>
            <Select value={formValues.theme} onValueChange={(value: any) => handleThemeChange(value)}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Sélectionner un thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="pastel">Pastel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontSize">Taille de police</Label>
            <Select value={formValues.fontSize} onValueChange={(value: any) => handleFontSizeChange(value)}>
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="Sélectionner une taille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petite</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Police</Label>
            <Select value={formValues.fontFamily} onValueChange={(value: any) => handleFontFamilyChange(value)}>
              <SelectTrigger id="fontFamily">
                <SelectValue placeholder="Sélectionner une police" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
                <SelectItem value="sans">Sans-serif</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="reduceMotion">Réduire les animations</Label>
            <Switch 
              id="reduceMotion" 
              checked={formValues.reduceMotion}
              onCheckedChange={(checked) => handleToggleChange('reduceMotion', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="colorBlindMode">Mode daltonien</Label>
            <Switch 
              id="colorBlindMode" 
              checked={formValues.colorBlindMode}
              onCheckedChange={(checked) => handleToggleChange('colorBlindMode', checked)} 
            />
          </div>
        </div>
        
        {/* Préférences de confidentialité */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confidentialité</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="shareData">Partager les données anonymisées</Label>
            <Switch 
              id="shareData" 
              checked={formValues.privacy.shareData}
              onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="anonymizeReports">Anonymiser les rapports</Label>
            <Switch 
              id="anonymizeReports" 
              checked={formValues.privacy.anonymizeReports}
              onCheckedChange={(checked) => handlePrivacyChange('anonymizeReports', checked)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profileVisibility">Visibilité du profil</Label>
            <Select 
              value={formValues.privacy.profileVisibility} 
              onValueChange={(value: any) => {
                setFormValues(prev => ({
                  ...prev,
                  privacy: {
                    ...prev.privacy,
                    profileVisibility: value
                  }
                }));
              }}
            >
              <SelectTrigger id="profileVisibility">
                <SelectValue placeholder="Sélectionner la visibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Équipe uniquement</SelectItem>
                <SelectItem value="private">Privé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="anonymousMode">Mode anonyme</Label>
            <Switch 
              id="anonymousMode" 
              checked={formValues.privacy.anonymousMode || false}
              onCheckedChange={(checked) => handlePrivacyChange('anonymousMode', checked)} 
            />
          </div>
        </div>
        
        {/* Préférences de notification */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notificationsEnabled">Activer les notifications</Label>
            <Switch 
              id="notificationsEnabled" 
              checked={formValues.notifications.enabled}
              onCheckedChange={(checked) => handleNotificationChange('enabled', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="emailEnabled">Notifications par email</Label>
            <Switch 
              id="emailEnabled" 
              checked={formValues.notifications.emailEnabled}
              onCheckedChange={(checked) => handleNotificationChange('emailEnabled', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="pushEnabled">Notifications push</Label>
            <Switch 
              id="pushEnabled" 
              checked={formValues.notifications.pushEnabled}
              onCheckedChange={(checked) => handleNotificationChange('pushEnabled', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="inAppEnabled">Notifications dans l'application</Label>
            <Switch 
              id="inAppEnabled" 
              checked={formValues.notifications.inAppEnabled}
              onCheckedChange={(checked) => handleNotificationChange('inAppEnabled', checked)} 
            />
          </div>
        </div>
        
        <Button onClick={handleSave} className="w-full">Enregistrer les préférences</Button>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
