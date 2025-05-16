
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserPreferences, NotificationPreferences } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface PreferencesFormProps {
  preferences?: UserPreferences;
  onSave?: (preferences: UserPreferences) => void;
  loading?: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ 
  preferences: initialPreferences = {},
  onSave,
  loading = false 
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const { toast } = useToast();
  
  const handleToggle = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
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
  
  const handlePrivacyToggle = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(preferences);
    } else {
      // Mock save
      toast({
        title: 'Préférences enregistrées',
        description: 'Vos préférences ont été mises à jour.',
        variant: 'success'
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences</CardTitle>
        <CardDescription>
          Personnalisez votre expérience sur la plateforme selon vos besoins.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Affichage</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Mode sombre</Label>
            <Switch 
              id="darkMode" 
              checked={preferences.theme === 'dark'}
              onCheckedChange={(checked) => handleToggle('theme', checked ? 'dark' : 'light')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="reduceMotion">Réduire les animations</Label>
            <Switch 
              id="reduceMotion" 
              checked={preferences.reduceMotion}
              onCheckedChange={(checked) => handleToggle('reduceMotion', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="colorBlindMode">Mode daltonien</Label>
            <Switch 
              id="colorBlindMode" 
              checked={preferences.colorBlindMode}
              onCheckedChange={(checked) => handleToggle('colorBlindMode', checked)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Médias</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="autoplayMedia">Lecture automatique des médias</Label>
            <Switch 
              id="autoplayMedia" 
              checked={preferences.autoplayMedia}
              onCheckedChange={(checked) => handleToggle('autoplayMedia', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="soundEnabled">Sons activés</Label>
            <Switch 
              id="soundEnabled" 
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => handleToggle('soundEnabled', checked)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications_enabled">Activer les notifications</Label>
            <Switch 
              id="notifications_enabled" 
              checked={preferences.notifications_enabled}
              onCheckedChange={(checked) => handleToggle('notifications_enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Notifications par email</Label>
            <Switch 
              id="emailNotifications" 
              checked={preferences.notifications?.email}
              onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
              disabled={!preferences.notifications_enabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="pushNotifications">Notifications push</Label>
            <Switch 
              id="pushNotifications" 
              checked={preferences.notifications?.push}
              onCheckedChange={(checked) => handleNotificationToggle('push', checked)}
              disabled={!preferences.notifications_enabled}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confidentialité</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="shareData">Partager mes données anonymisées</Label>
            <Switch 
              id="shareData" 
              checked={preferences.privacy?.shareData}
              onCheckedChange={(checked) => handlePrivacyToggle('shareData', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="allowAnalytics">Autoriser les analytiques</Label>
            <Switch 
              id="allowAnalytics" 
              checked={preferences.privacy?.allowAnalytics}
              onCheckedChange={(checked) => handlePrivacyToggle('allowAnalytics', checked)}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer les préférences'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreferencesForm;
