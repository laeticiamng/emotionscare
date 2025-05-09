
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPreferences, ThemeName } from '@/types';

// Version étendue des préférences utilisateur avec des options supplémentaires
interface ExtendedUserPreferences extends Omit<UserPreferences, 'theme'> {
  theme: ThemeName | 'system';
  marketing_emails?: boolean;
  feature_announcements?: boolean;
}

const PreferencesForm: React.FC<{
  onSave: (preferences: UserPreferences) => void;
  preferences: UserPreferences;
}> = ({ onSave, preferences }) => {
  const [saving, setSaving] = useState(false);

  // Adapter les préférences de base pour le formulaire
  const extendedPreferences: ExtendedUserPreferences = {
    ...preferences,
    marketing_emails: preferences.notifications?.email || false,
    feature_announcements: preferences.notifications?.push || false
  };

  const { register, handleSubmit, setValue, watch } = useForm<ExtendedUserPreferences>({
    defaultValues: extendedPreferences
  });

  const onSubmit = async (data: ExtendedUserPreferences) => {
    setSaving(true);
    
    // Convertir les préférences étendues en préférences standard
    const standardPreferences: UserPreferences = {
      ...data,
      theme: data.theme as ThemeName, // Conversion sécurisée car ThemeName accepte maintenant 'system'
      notifications: {
        email: !!data.marketing_emails,
        push: !!data.feature_announcements,
        sms: preferences.notifications?.sms || false
      }
    };
    
    // Retirer les champs non standard
    delete (standardPreferences as any).marketing_emails;
    delete (standardPreferences as any).feature_announcements;
    
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
