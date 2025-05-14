
import React, { useState } from 'react';
import { UserPreferences } from '@/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system', 'pastel']),
  notifications_enabled: z.boolean(),
  fontSize: z.enum(['small', 'medium', 'large']),
  language: z.string(),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'team'])
  }).optional()
});

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);

  // Ensure preferences has the correct structure
  const defaultValues = {
    ...preferences,
    privacy: preferences.privacy || { profileVisibility: 'public' }
  };

  const form = useForm<UserPreferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
  });

  const handleSubmit = async (data: UserPreferences) => {
    setIsSaving(true);
    try {
      await onSave(data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thème</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choisissez l'apparence de l'interface.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taille de police</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une taille de police" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="small">Petite</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Ajustez la taille du texte pour une meilleure lisibilité.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Langue</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Sélectionnez la langue de l'interface.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacy.profileVisibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibilité du profil</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || 'public'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la visibilité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                  <SelectItem value="team">Équipe</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choisissez qui peut voir votre profil.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notifications_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Notifications</FormLabel>
                <FormDescription>
                  Activer ou désactiver toutes les notifications.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer les préférences'}
        </Button>
      </form>
    </Form>
  );
};

export default PreferencesForm;
