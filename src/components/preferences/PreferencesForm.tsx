
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { UserPreferences } from '@/types';

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
  
  const handleChange = (key: keyof UserPreferences, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get notifications object or create default
  const notificationsObj = formData.notifications && typeof formData.notifications === 'object'
    ? formData.notifications
    : { enabled: !!formData.notifications, emailEnabled: false, pushEnabled: false };
  
  return (
    <form onSubmit={handleSave}>
      <Card className="mb-4">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium">Thème</label>
              <select
                className="w-full border rounded p-2"
                value={formData.theme as string}
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
                value={formData.fontSize as string}
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
                checked={notificationsObj.enabled}
                onCheckedChange={(checked) => {
                  handleChange('notifications', {
                    ...notificationsObj,
                    enabled: checked
                  });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Notifications par email</span>
              <Switch
                checked={notificationsObj.emailEnabled}
                onCheckedChange={(checked) => handleChange('notifications', {
                  ...notificationsObj,
                  emailEnabled: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Notifications push</span>
              <Switch
                checked={notificationsObj.pushEnabled}
                onCheckedChange={(checked) => handleChange('notifications', {
                  ...notificationsObj,
                  pushEnabled: checked
                })}
              />
            </div>
            
            {/* Add optional properties with type checking */}
            {formData.autoplayVideos !== undefined && (
              <div className="flex items-center justify-between">
                <span>Autoplay des vidéos</span>
                <Switch
                  checked={!!formData.autoplayVideos}
                  onCheckedChange={(checked) => handleChange('autoplayVideos', checked)}
                />
              </div>
            )}
            
            {formData.dataCollection !== undefined && (
              <div className="flex items-center justify-between">
                <span>Collecte de données</span>
                <Switch
                  checked={!!formData.dataCollection}
                  onCheckedChange={(checked) => handleChange('dataCollection', checked)}
                />
              </div>
            )}
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
