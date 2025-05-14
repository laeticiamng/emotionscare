
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Define the interface for user preferences
interface UserPreferences {
  theme?: 'light' | 'dark' | 'pastel' | 'system';
  fontSize?: 'small' | 'medium' | 'large';
  language?: string;
  privacy?: 'public' | 'private' | 'friends';
  notifications?: boolean | {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency?: string;
    types?: Record<string, boolean>;
    tone?: string;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
}

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'pastel', 'system']).optional(),
  notifications: z.boolean().or(
    z.object({
      enabled: z.boolean().optional(),
      emailEnabled: z.boolean().optional(),
      pushEnabled: z.boolean().optional(),
      frequency: z.string().optional(),
      types: z.record(z.boolean()).optional(),
      tone: z.string().optional(),
      quietHours: z.object({
        enabled: z.boolean().optional(),
        start: z.string().optional(),
        end: z.string().optional()
      }).optional()
    })
  ).optional(),
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
  language: z.string().optional(),
  privacy: z.enum(['public', 'private', 'friends']).optional()
});

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<UserPreferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: preferences,
  });

  const handleSubmit = async (data: UserPreferences) => {
    setIsSaving(true);
    try {
      await onSave(data);
    } finally {
      setIsSaving(false);
    }
  };

  // Get notifications as an object
  const notificationsValue = form.watch('notifications');
  const notificationsObj = typeof notificationsValue === 'boolean' 
    ? { enabled: notificationsValue, emailEnabled: false, pushEnabled: false } 
    : notificationsValue || { enabled: false, emailEnabled: false, pushEnabled: false };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thème</FormLabel>
              <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value as string}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
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
              <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value as string}>
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
          name="privacy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confidentialité</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau de confidentialité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                  <SelectItem value="friends">Amis seulement</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Définissez qui peut voir votre profil et vos activités.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notifications"
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
                  checked={
                    typeof field.value === 'boolean' 
                      ? field.value 
                      : field.value?.enabled || false
                  }
                  onCheckedChange={(checked) => {
                    if (typeof field.value === 'boolean') {
                      field.onChange(checked);
                    } else {
                      field.onChange({
                        ...notificationsObj,
                        enabled: checked
                      });
                    }
                  }}
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
