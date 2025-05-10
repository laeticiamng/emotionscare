
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { UserPreferences, ThemeName, FontSize } from '@/types';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ 
  preferences, 
  onSave 
}) => {
  const [formData, setFormData] = useState<UserPreferences>({
    ...preferences
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (key: keyof UserPreferences, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Ensure type safety for theme and fontSize
      const safeFormData = {
        ...formData,
        theme: formData.theme as ThemeName,
        fontSize: formData.fontSize as FontSize,
      };
      
      // Setup notifications object with correct types
      const notifications = {
        email: formData.email_notifications || false,
        push: formData.push_notifications || false,
        sms: false
      };
      
      await onSave(safeFormData);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSave}>
      <Card className="mb-4">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium">Thème</label>
              <select
                className="w-full border rounded p-2"
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="system">Système</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block font-medium">Taille de police</label>
              <select
                className="w-full border rounded p-2"
                value={formData.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
              >
                <option value="small">Petite</option>
                <option value="medium">Moyenne</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <Switch
                checked={formData.notifications_enabled || false}
                onCheckedChange={(checked) => handleChange('notifications_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Notifications par email</span>
              <Switch
                checked={formData.email_notifications || false}
                onCheckedChange={(checked) => handleChange('email_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Notifications push</span>
              <Switch
                checked={formData.push_notifications || false}
                onCheckedChange={(checked) => handleChange('push_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Autoplay des vidéos</span>
              <Switch
                checked={formData.autoplayVideos}
                onCheckedChange={(checked) => handleChange('autoplayVideos', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Collecte de données</span>
              <Switch
                checked={formData.dataCollection}
                onCheckedChange={(checked) => handleChange('dataCollection', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer les préférences'}
        </Button>
      </div>
    </form>
  );
};

export default PreferencesForm;
