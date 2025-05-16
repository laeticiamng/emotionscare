
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserPreferences, FontSize, FontFamily, ThemeName, NotificationPreferences } from '@/types/types';

const FONT_SIZES: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' },
  { value: 'x-large', label: 'Très Grand' },
  { value: 'sm', label: 'SM' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' }
];

const FONT_FAMILIES: { value: FontFamily; label: string }[] = [
  { value: 'sans-serif', label: 'Sans-serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'system', label: 'Système' },
  { value: 'sans', label: 'Sans' }
];

const PreferencesForm: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const { toast } = useToast();
  
  const defaultPreferences: UserPreferences = {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
    soundEnabled: true,
    notifications: {
      enabled: true,
      emailEnabled: true,
      pushEnabled: false,
      email: true,
      push: false,
      types: {
        system: true,
        emotion: true,
        coach: true,
        journal: true,
        community: true,
        achievement: true
      },
      frequency: 'immediate'
    },
    privacy: {
      shareData: true,
      anonymizeReports: false,
      profileVisibility: 'public'
    }
  };

  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || defaultPreferences
  );
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updatePreferences(preferences);
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences ont été enregistrées avec succès.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleThemeChange = (theme: ThemeName) => {
    setPreferences(prev => ({ ...prev, theme }));
  };
  
  const handleFontSizeChange = (fontSize: FontSize) => {
    setPreferences(prev => ({ ...prev, fontSize }));
  };
  
  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    setPreferences(prev => ({ ...prev, fontFamily }));
  };
  
  const handleToggleChange = (key: keyof UserPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  const handleNotificationToggle = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };
  
  const handleNotificationTypeToggle = (type: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        types: {
          ...prev.notifications.types,
          [type]: value
        }
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Apparence</h3>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Thème</Label>
            <Select 
              value={preferences.theme} 
              onValueChange={(value) => handleThemeChange(value as ThemeName)}
            >
              <SelectTrigger>
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
            <Select 
              value={preferences.fontSize} 
              onValueChange={(value) => handleFontSizeChange(value as FontSize)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une taille" />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZES.map(size => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Police</Label>
            <Select 
              value={preferences.fontFamily} 
              onValueChange={(value) => handleFontFamilyChange(value as FontFamily)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une police" />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Accessibilité</h3>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="reduceMotion">Réduire les animations</Label>
            <Switch
              id="reduceMotion"
              checked={preferences.reduceMotion}
              onCheckedChange={(checked) => handleToggleChange('reduceMotion', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="colorBlindMode">Mode daltonisme</Label>
            <Switch
              id="colorBlindMode"
              checked={preferences.colorBlindMode}
              onCheckedChange={(checked) => handleToggleChange('colorBlindMode', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Médias</h3>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoplayMedia">Lecture automatique des médias</Label>
            <Switch
              id="autoplayMedia"
              checked={preferences.autoplayMedia}
              onCheckedChange={(checked) => handleToggleChange('autoplayMedia', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="soundEnabled">Sons activés</Label>
            <Switch
              id="soundEnabled"
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => handleToggleChange('soundEnabled', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="notificationsEnabled">Notifications activées</Label>
            <Switch
              id="notificationsEnabled"
              checked={preferences.notifications.enabled || false}
              onCheckedChange={(checked) => handleNotificationToggle('enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="emailEnabled">Notifications par email</Label>
            <Switch
              id="emailEnabled"
              checked={preferences.notifications.emailEnabled || false}
              onCheckedChange={(checked) => handleNotificationToggle('emailEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="pushEnabled">Notifications push</Label>
            <Switch
              id="pushEnabled"
              checked={preferences.notifications.pushEnabled || false}
              onCheckedChange={(checked) => handleNotificationToggle('pushEnabled', checked)}
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <h4 className="text-sm font-medium">Types de notifications</h4>
          
          {Object.entries(preferences.notifications.types || {}).map(([type, enabled]) => (
            <div key={type} className="flex items-center justify-between">
              <Label htmlFor={`notification-${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
              <Switch
                id={`notification-${type}`}
                checked={enabled || false}
                onCheckedChange={(checked) => handleNotificationTypeToggle(type, checked)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Confidentialité</h3>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="shareData">Partager les données anonymisées</Label>
            <Switch
              id="shareData"
              checked={preferences.privacy.shareData}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, shareData: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="anonymizeReports">Anonymiser les rapports</Label>
            <Switch
              id="anonymizeReports"
              checked={preferences.privacy.anonymizeReports || false}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, anonymizeReports: checked }
                }))
              }
            />
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Enregistrement..." : "Enregistrer les préférences"}
      </Button>
    </form>
  );
};

export default PreferencesForm;
