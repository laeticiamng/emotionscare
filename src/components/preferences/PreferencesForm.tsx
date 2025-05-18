
import React from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserPreferences } from '@/types/preferences';
import { toast } from '@/hooks/use-toast';
import NotificationsPreferences from './NotificationsPreferences';
import DataPrivacySettings from './DataPrivacySettings';
import IdentitySettings from './IdentitySettings';

const formSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  language: z.string().min(2),
  notificationsEnabled: z.boolean(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  newsletterEnabled: z.boolean(),
  activityTracking: z.boolean(),
  dataSharing: z.boolean(),
  audioEnabled: z.boolean(),
  musicEnabled: z.boolean(),
  autoScanEnabled: z.boolean(),
  timezone: z.string(),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  timeFormat: z.enum(['12h', '24h']),
  defaultDashboard: z.enum(['overview', 'analytics', 'emotions', 'coaching']),
  accessibilityMode: z.boolean(),
  highContrastMode: z.boolean(),
  fontSize: z.enum(['small', 'medium', 'large']),
  animationsEnabled: z.boolean(),
});

interface PreferencesFormProps {
  initialData?: Partial<UserPreferences>;
  onSubmit?: (data: UserPreferences) => void;
  isLoading?: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<UserPreferences>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: initialData.theme || 'system',
      language: initialData.language || 'fr',
      notificationsEnabled: initialData.notificationsEnabled ?? true,
      emailNotifications: initialData.emailNotifications ?? true,
      pushNotifications: initialData.pushNotifications ?? true,
      newsletterEnabled: initialData.newsletterEnabled ?? true,
      activityTracking: initialData.activityTracking ?? true,
      dataSharing: initialData.dataSharing ?? false,
      audioEnabled: initialData.audioEnabled ?? true,
      musicEnabled: initialData.musicEnabled ?? true,
      autoScanEnabled: initialData.autoScanEnabled ?? false,
      timezone: initialData.timezone || 'Europe/Paris',
      dateFormat: initialData.dateFormat || 'DD/MM/YYYY',
      timeFormat: initialData.timeFormat || '24h',
      defaultDashboard: initialData.defaultDashboard || 'overview',
      accessibilityMode: initialData.accessibilityMode ?? false,
      highContrastMode: initialData.highContrastMode ?? false,
      fontSize: initialData.fontSize || 'medium',
      animationsEnabled: initialData.animationsEnabled ?? true,
    },
  });

  const handleSubmit = (data: UserPreferences) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log('Form submitted:', data);
      toast({
        title: 'Préférences mises à jour',
        description: 'Vos préférences ont été enregistrées avec succès.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="identity">Identité</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thème</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un thème" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="system">Système</SelectItem>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Le thème visuel de l'application
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une langue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      La langue d'affichage de l'interface
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options sonores</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="audioEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">Sons d'interface</FormLabel>
                        <FormDescription>
                          Activer les sons lors des interactions avec l'interface
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
                  name="musicEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">Musique thématique</FormLabel>
                        <FormDescription>
                          Activer les musiques et ambiances en fonction des activités
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
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsPreferences 
              control={form.control} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="privacy">
            <DataPrivacySettings 
              control={form.control} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="identity">
            <IdentitySettings />
          </TabsContent>

          <TabsContent value="accessibility">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="accessibilityMode"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">Mode accessibilité</FormLabel>
                        <FormDescription>
                          Optimise l'interface pour l'accessibilité et les technologies d'assistance
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
                  name="highContrastMode"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">Mode contraste élevé</FormLabel>
                        <FormDescription>
                          Augmente le contraste des couleurs pour améliorer la lisibilité
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
                  name="fontSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taille du texte</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une taille de texte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Petite</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Ajuste la taille du texte dans l'application
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="animationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">Animations</FormLabel>
                        <FormDescription>
                          Activer les animations et transitions dans l'interface
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
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="outline" type="reset" disabled={isLoading}>
            Réinitialiser
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer les préférences'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PreferencesForm;
