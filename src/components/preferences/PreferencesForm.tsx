import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { User, UserPreferences } from '@/types';
import ThemeSelectionField from './ThemeSelectionField';
import FontSizeField from './FontSizeField';
import ColorAccentField from './ColorAccentField';
import { useAuth } from '@/contexts/AuthContext';

// Match the UserPreferences interface from the types file
interface ExtendedUserPreferences extends UserPreferences {
  theme: "light" | "dark" | "system" | "pastel";
}

const PreferencesForm = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Create a form with default values that match our UserPreferences type
  const form = useForm<ExtendedUserPreferences>({
    defaultValues: {
      theme: "light",
      notifications_enabled: true,
      language: "fr",
      privacy_level: "private",
      share_data_with_coach: false,
      daily_reminder: true,
      reminder_time: "09:00",
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  });
  
  // Load user preferences when user data is available
  useEffect(() => {
    if (user?.preferences) {
      const userPrefs = user.preferences;
      form.reset({
        theme: userPrefs.theme as "light" | "dark" | "system" | "pastel",
        notifications_enabled: userPrefs.notifications_enabled,
        language: userPrefs.language,
        privacy_level: userPrefs.privacy_level,
        share_data_with_coach: userPrefs.share_data_with_coach,
        daily_reminder: userPrefs.daily_reminder,
        reminder_time: userPrefs.reminder_time,
        notifications: userPrefs.notifications || {
          email: true,
          push: true,
          sms: false
        }
      });
    }
  }, [user, form]);
  
  const onSubmit = async (data: ExtendedUserPreferences) => {
    try {
      setIsSaving(true);
      
      // In a real app, save to backend
      // await updateUserPreferences(user.id, data);
      
      // Update local user state with new preferences
      if (user) {
        await updateUser({
          ...user,
          preferences: data as UserPreferences
        });
      }
      
      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences ont été mises à jour avec succès."
      });
      
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ThemeSelectionField />
        <FontSizeField />
        <ColorAccentField />
        
        <FormField
          control={form.control}
          name="notifications.email"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notifications par email</FormLabel>
              </div>
              <FormControl>
                <input
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={field.onChange}
                  className="toggle"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Sauvegarde en cours..." : "Sauvegarder les préférences"}
        </Button>
      </form>
    </Form>
  );
};

export default PreferencesForm;
