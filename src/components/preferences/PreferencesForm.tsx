
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { UserPreferences, Theme, FontSize } from '@/types/types';
import ThemeSettingsForm from './ThemeSettingsForm';

const PreferencesForm = () => {
  const { user, setPreferences } = useAuth();
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const { toast } = useToast();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(
    user?.preferences || {
      privacy: 'private',
      profileVisibility: 'private',
      notifications_enabled: true,
      autoplayVideos: false,
      dataCollection: true,
      aiSuggestions: true,
      emotionalCamouflage: false
    }
  );

  const handleSwitchChange = (key: keyof UserPreferences) => {
    setUserPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key as keyof UserPreferences] };
      setPreferences(updated);
      
      // Notify change
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences ont été mises à jour avec succès."
      });
      
      return updated;
    });
  };

  const handlePrivacyChange = (value: UserPreferences['privacy']) => {
    const updated = { ...userPreferences, privacy: value };
    setUserPreferences(updated);
    setPreferences(updated);
    
    // Notify change
    toast({
      title: "Préférences de confidentialité mises à jour",
      description: "Vos paramètres de confidentialité ont été mis à jour avec succès."
    });
  };

  // When theme is changed in ThemeContext, update the user preferences
  React.useEffect(() => {
    if (theme && userPreferences.theme !== theme) {
      const updatedPrefs = {
        ...userPreferences,
        theme: theme as string
      };
      setUserPreferences(updatedPrefs);
      setPreferences(updatedPrefs);
    }
  }, [theme]);

  // When fontSize is changed in ThemeContext, update the user preferences
  React.useEffect(() => {
    if (fontSize && userPreferences.fontSize !== fontSize) {
      const updatedPrefs = {
        ...userPreferences,
        fontSize: fontSize as string
      };
      setUserPreferences(updatedPrefs);
      setPreferences(updatedPrefs);
    }
  }, [fontSize]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Préférences de confidentialité</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={userPreferences.privacy || 'private'} 
            onValueChange={(value) => handlePrivacyChange(value as UserPreferences['privacy'])}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">Public - Tout le monde peut voir mon profil</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="team" id="team" />
              <Label htmlFor="team">Équipe - Seulement mon équipe peut voir mon profil</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">Privé - Mon profil est visible uniquement par moi</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres d'application</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="notifications">Activer les notifications</Label>
              <Switch 
                id="notifications" 
                checked={!!userPreferences.notifications_enabled}
                onCheckedChange={() => handleSwitchChange('notifications_enabled')}
              />
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="autoplay">Lecture automatique des vidéos</Label>
              <Switch 
                id="autoplay" 
                checked={!!userPreferences.autoplayVideos}
                onCheckedChange={() => handleSwitchChange('autoplayVideos')}
              />
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="data">Collecte de données pour amélioration</Label>
              <Switch 
                id="data" 
                checked={!!userPreferences.dataCollection}
                onCheckedChange={() => handleSwitchChange('dataCollection')}
              />
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="ai">Suggestions IA personnalisées</Label>
              <Switch 
                id="ai" 
                checked={!!userPreferences.aiSuggestions}
                onCheckedChange={() => handleSwitchChange('aiSuggestions')}
              />
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="camouflage">Camouflage émotionnel</Label>
              <Switch 
                id="camouflage" 
                checked={!!userPreferences.emotionalCamouflage}
                onCheckedChange={() => handleSwitchChange('emotionalCamouflage')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesForm;
