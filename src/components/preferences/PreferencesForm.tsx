
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelectionField from './ThemeSelectionField';
import FontSizeField from './FontSizeField';
import ColorAccentField from './ColorAccentField';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '@/types';

const formSchema = z.object({
  fontSize: z.enum(['small', 'medium', 'large']),
  backgroundColor: z.enum(['default', 'blue', 'mint', 'coral']),
  theme: z.enum(['light', 'dark', 'pastel', 'system'])
});

type FormValues = z.infer<typeof formSchema>;

const PreferencesForm: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { themePreference, setThemePreference } = useTheme();
  const { toast } = useToast();
  
  // Initialize with default preferences
  const defaultPreferences: Partial<UserPreferences> = {
    fontSize: 'medium',
    backgroundColor: 'default',
    theme: themePreference || 'system',
    accentColor: 'blue',
    notifications: {
      email: false,
      push: true,
      sms: false
    }
  };
  
  // Merge with user preferences if available
  const preferences = user?.preferences ? user.preferences : defaultPreferences;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fontSize: preferences.fontSize || 'medium',
      backgroundColor: preferences.backgroundColor || 'default',
      theme: preferences.theme || themePreference || 'system',
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Apply theme immediately
      setThemePreference(data.theme);
      
      // Create complete preferences object
      const updatedPreferences: UserPreferences = {
        ...preferences,
        ...data,
        // Ensure required properties are present
        accentColor: preferences.accentColor || 'blue',
        notifications: preferences.notifications || {
          email: false,
          push: true,
          sms: false
        }
      };
      
      // Save preferences to user profile
      if (user) {
        await updateUserProfile({
          ...user,
          preferences: updatedPreferences
        });
      }
      
      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences ont été mises à jour avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ThemeSelectionField form={form} />
        <FontSizeField form={form} />
        <ColorAccentField form={form} />
        <Button type="submit" className="w-full md:w-auto">Enregistrer mes préférences</Button>
      </form>
    </Form>
  );
};

export default PreferencesForm;
