
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { UserPreferences } from '@/types';
import DisplayPreferences from './DisplayPreferences';
import NotificationsPreferences from './NotificationsPreferences';
import DataPrivacySettings from './DataPrivacySettings';

interface PreferencesFormProps {
  onClose?: () => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onClose }) => {
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  
  // Make sure we have default values for all properties
  const defaultValues: UserPreferences = {
    ...preferences,
    notifications: {
      enabled: true,
      emailEnabled: false,
      pushEnabled: true,
      inAppEnabled: true,
      types: {
        system: true,
        emotion: true,
        coach: true,
        journal: true,
        community: true,
        achievement: true,
      },
      frequency: 'normal',
      email: false,
      push: true,
      sms: false,
    },
    privacy: {
      shareData: true,
      anonymizeReports: false,
      profileVisibility: 'public',
      shareActivity: true,
      shareJournal: false,
      publicProfile: true,
      anonymousMode: false,
    },
    theme: preferences.theme || 'system',
    fontSize: preferences.fontSize || 'medium',
    fontFamily: preferences.fontFamily || 'system',
    language: preferences.language || 'fr',
    soundEnabled: preferences.soundEnabled !== undefined ? preferences.soundEnabled : true,
    reduceMotion: preferences.reduceMotion || false,
    colorBlindMode: preferences.colorBlindMode || false,
  };
  
  const form = useForm<UserPreferences>({
    defaultValues,
  });

  const onSubmit = async (data: UserPreferences) => {
    try {
      await updatePreferences(data);
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  // Form sections
  const renderGeneralSection = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="soundEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Sons de l'application</FormLabel>
              <FormDescription>
                Activer les sons et effets sonores
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="reduceMotion"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Réduire les animations</FormLabel>
              <FormDescription>
                Désactiver ou réduire les animations de l'interface
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="colorBlindMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Mode daltonien</FormLabel>
              <FormDescription>
                Optimiser les couleurs pour différents types de daltonisme
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-10">
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="display">Affichage</TabsTrigger>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="display" className="space-y-4">
            <DisplayPreferences control={form.control} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4">
            {renderGeneralSection()}
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationsPreferences control={form.control} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <DataPrivacySettings control={form.control} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer les préférences'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PreferencesForm;
