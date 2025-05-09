
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPreferences, ThemeName } from '@/types';
import ThemeSelectionField from './ThemeSelectionField';

interface FormPreferences {
  theme: ThemeName;
  notifications_enabled: boolean;
  font_size: 'small' | 'medium' | 'large';
  language: string;
  accent_color?: string;
  background_color?: string;
  marketing_emails?: boolean;
  feature_announcements?: boolean;
  reminder_time?: string;
}

const PreferencesForm: React.FC<{
  onSave: (preferences: UserPreferences) => void;
  preferences: UserPreferences;
}> = ({ onSave, preferences }) => {
  const [saving, setSaving] = useState(false);

  // Adapter les préférences de base pour le formulaire
  const formPreferences: FormPreferences = {
    ...preferences,
    marketing_emails: preferences.notifications?.email || false,
    feature_announcements: preferences.notifications?.push || false,
    language: preferences.language || 'fr' // Valeur par défaut pour résoudre l'erreur
  };

  const { register, handleSubmit, setValue, watch } = useForm<FormPreferences>({
    defaultValues: formPreferences
  });

  const onSubmit = async (data: FormPreferences) => {
    setSaving(true);
    
    // Convert the form data to the UserPreferences format
    const standardPreferences: UserPreferences = {
      theme: data.theme as 'light' | 'dark' | 'pastel', // Gestion du système
      notifications_enabled: data.notifications_enabled,
      font_size: data.font_size,
      language: data.language,
      accent_color: data.accent_color,
      background_color: data.background_color,
      notifications: {
        email: !!data.marketing_emails,
        push: !!data.feature_announcements,
        sms: preferences.notifications?.sms || false
      },
      reminder_time: data.reminder_time
    };
    
    try {
      await onSave(standardPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Préférences</CardTitle>
        <CardDescription>
          Personnalisez votre expérience Wellbeing
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Thème</label>
            <Select
              defaultValue={preferences.theme}
              onValueChange={(value) => setValue('theme', value as ThemeName)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="pastel">Pastel</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Modifiez l'apparence visuelle globale de l'application
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Langue</label>
            <Select
              defaultValue={preferences.language || 'fr'}
              onValueChange={(value) => setValue('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Taille de police</label>
            <Select
              defaultValue={preferences.font_size || 'medium'}
              onValueChange={(value) => setValue('font_size', value as 'small' | 'medium' | 'large')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une taille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petite</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Notifications</label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications-email"
                checked={watch('marketing_emails')}
                onCheckedChange={(checked) => setValue('marketing_emails', !!checked)}
              />
              <label htmlFor="notifications-email" className="text-sm">
                Recevoir des emails marketing
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications-push"
                checked={watch('feature_announcements')}
                onCheckedChange={(checked) => setValue('feature_announcements', !!checked)}
              />
              <label htmlFor="notifications-push" className="text-sm">
                Recevoir des annonces de nouvelles fonctionnalités
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reminder-time" className="text-sm font-medium">Heure de rappel quotidien</label>
            <Input
              id="reminder-time"
              type="time"
              {...register('reminder_time')}
              defaultValue={preferences.reminder_time || '09:00'}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Couleur d'accent</label>
            <div className="grid grid-cols-5 gap-2">
              {['#6E59A5', '#FF5A5F', '#2ecc71', '#3498db', '#f1c40f'].map((color) => (
                <div 
                  key={color}
                  onClick={() => setValue('accent_color', color)}
                  className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                    watch('accent_color') === color ? 'border-primary' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Sauvegarder les préférences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PreferencesForm;
