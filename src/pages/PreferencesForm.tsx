
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPreferences, ThemeName } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onSave }) => {
  const [theme, setTheme] = useState<ThemeName>(preferences.theme || 'light');
  const [fontSize, setFontSize] = useState(preferences.font_size || 'medium');
  const [language, setLanguage] = useState(preferences.language || 'fr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.notifications_enabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPreferences: UserPreferences = {
      theme,
      font_size: fontSize as 'small' | 'medium' | 'large',
      notifications_enabled: notificationsEnabled,
      language,
    };
    
    onSave(updatedPreferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Thème</Label>
          <RadioGroup
            id="theme"
            value={theme}
            onValueChange={(value) => setTheme(value as ThemeName)}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Clair</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Sombre</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pastel" id="theme-pastel" />
              <Label htmlFor="theme-pastel">Pastel</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="font-size">Taille de police</Label>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger id="font-size">
              <SelectValue placeholder="Sélectionnez une taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language">Langue</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Sélectionnez une langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="cursor-pointer">Notifications</Label>
          <Switch 
            id="notifications" 
            checked={notificationsEnabled} 
            onCheckedChange={setNotificationsEnabled} 
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Enregistrer les préférences
      </Button>
    </form>
  );
};

export default PreferencesForm;
