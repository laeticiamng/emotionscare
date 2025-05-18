
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UserPreferences } from '@/types/preferences';

interface NotificationsPreferencesProps {
  control: Control<UserPreferences>;
  isLoading?: boolean;
}

const NotificationsPreferences: React.FC<NotificationsPreferencesProps> = ({
  control,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres des notifications</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Gérer comment et quand vous recevez des notifications de l'application.
        </p>
      </div>

      <FormField
        control={control}
        name="notificationsEnabled"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <FormLabel className="text-base">Notifications globales</FormLabel>
              <FormDescription>
                Activer ou désactiver toutes les notifications
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

      <Separator />

      <div className="space-y-4">
        <h4 className="text-md font-medium">Canaux de notification</h4>
        
        <FormField
          control={control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel className="text-base">Notifications par email</FormLabel>
                <FormDescription>
                  Recevoir des notifications par email
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
          control={control}
          name="pushNotifications"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel className="text-base">Notifications push</FormLabel>
                <FormDescription>
                  Recevoir des notifications push sur votre appareil
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

      <Separator />

      <div className="space-y-4">
        <h4 className="text-md font-medium">Types de communications</h4>
        
        <FormField
          control={control}
          name="newsletterEnabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel className="text-base">Newsletter</FormLabel>
                <FormDescription>
                  Recevoir notre newsletter avec des conseils et nouvelles fonctionnalités
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
  );
};

export default NotificationsPreferences;
