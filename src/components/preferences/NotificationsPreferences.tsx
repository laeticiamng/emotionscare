
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPreferences } from '@/types';

interface NotificationsPreferencesProps {
  control: Control<UserPreferences, any>;
  isLoading: boolean;
}

const NotificationsPreferences: React.FC<NotificationsPreferencesProps> = ({
  control,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="notifications.enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Notifications</FormLabel>
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

      <FormField
        control={control}
        name="notifications.emailEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Notifications par email</FormLabel>
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
        name="notifications.pushEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Notifications push</FormLabel>
              <FormDescription>
                Recevoir des notifications push sur vos appareils
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
        name="notifications.inAppEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Notifications dans l'application</FormLabel>
              <FormDescription>
                Afficher les notifications à l'intérieur de l'application
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
        name="notifications.frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fréquence des notifications</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la fréquence" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="high">Haute (plusieurs fois par jour)</SelectItem>
                <SelectItem value="normal">Normale (quotidienne)</SelectItem>
                <SelectItem value="low">Basse (hebdomadaire)</SelectItem>
                <SelectItem value="minimal">Minimale (mensuelle)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choisissez à quelle fréquence vous souhaitez recevoir des notifications
            </FormDescription>
          </FormItem>
        )}
      />

      <h3 className="text-lg font-medium mt-6 mb-2">Types de notifications</h3>

      <FormField
        control={control}
        name="notifications.types.system"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Système</FormLabel>
              <FormDescription>
                Mises à jour importantes et messages système
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
        name="notifications.types.emotion"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Émotions</FormLabel>
              <FormDescription>
                Rappels et insights sur vos émotions
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
        name="notifications.types.coach"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Coach</FormLabel>
              <FormDescription>
                Messages et conseils de votre coach
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
        name="notifications.types.journal"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Journal</FormLabel>
              <FormDescription>
                Rappels d'écriture et insights de journal
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
        name="notifications.types.community"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Communauté</FormLabel>
              <FormDescription>
                Activités et interactions communautaires
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
        name="notifications.types.achievement"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Badges et succès</FormLabel>
              <FormDescription>
                Notifications de nouveaux badges et succès débloqués
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
};

export default NotificationsPreferences;
