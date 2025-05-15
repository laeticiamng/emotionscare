
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
  notifications: z.object({
    enabled: z.boolean()
  }).or(z.boolean()),
  fontSize: z.enum(['small', 'medium', 'large']),
  language: z.string(),
  privacy: z.union([
    z.string(),
    z.object({
      profileVisibility: z.enum(['public', 'private', 'team'])
    })
  ]).optional()
});

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);

  // Format preferences for the form
  const getFormattedPreferences = () => {
    // Convert old notifications_enabled to the new structure if needed
    let notifications = preferences.notifications;
    
    if (typeof preferences.notifications_enabled !== 'undefined' && !notifications) {
      notifications = {
        enabled: preferences.notifications_enabled
      };
    } else if (!notifications) {
      notifications = {
        enabled: true
      };
    }

    return {
      ...preferences,
      notifications
    };
  };

  const form = useForm<UserPreferences>({
    // resolver: zodResolver(preferencesSchema),
    defaultValues: getFormattedPreferences(),
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
          name="notifications.enabled"
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
