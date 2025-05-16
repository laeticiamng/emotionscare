
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationPreference } from '@/types/notification';
import { UseFormReturn } from 'react-hook-form';

interface NotificationPreferencesProps {
  form: UseFormReturn<any>;
  defaultValue?: NotificationPreference;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  form,
  defaultValue = {
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    frequency: 'immediate',
    types: {
      system: true,
      emotion: true,
      coach: true,
      journal: true,
      community: true
    }
  }
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Surveillez les changements pour les notifications
  const notificationsEnabled = form.watch('notifications.enabled') !== false;
  
  return (
    <div className="space-y-6">
      {/* Notifications générales */}
      <FormField
        control={form.control}
        name="notifications.enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Notifications</FormLabel>
              <FormDescription>
                Activez ou désactivez toutes les notifications.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value === undefined ? defaultValue.enabled : field.value}
                onCheckedChange={(checked) => {
                  form.setValue('notifications', {
                    ...form.getValues().notifications,
                    enabled: checked,
                    emailEnabled: false,
                    frequency: 'immediate'
                  });
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {notificationsEnabled && (
        <>
          {/* Notifications par e-mail */}
          <FormField
            control={form.control}
            name="notifications.emailEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Notifications par e-mail</FormLabel>
                  <FormDescription>
                    Recevez des notifications par e-mail.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      form.setValue('notifications', {
                        ...form.getValues().notifications,
                        enabled: true,
                        emailEnabled: checked,
                        types: form.getValues().notifications?.types || defaultValue.types,
                        frequency: form.getValues().notifications?.frequency || 'daily',
                      });
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Fréquence des notifications */}
          <FormField
            control={form.control}
            name="notifications.frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fréquence des notifications</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || defaultValue.frequency}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une fréquence" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiate</SelectItem>
                    <SelectItem value="daily">Résumé quotidien</SelectItem>
                    <SelectItem value="weekly">Résumé hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choisissez à quelle fréquence vous recevez des notifications.
                </FormDescription>
              </FormItem>
            )}
          />
          
          {/* Types de notifications */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium mb-3">Types de notifications</h3>
              
              {['system', 'emotion', 'journal', 'coach', 'community'].map((type) => (
                <FormField
                  key={type}
                  control={form.control}
                  name={`notifications.types.${type}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between mb-2 last:mb-0">
                      <FormLabel className="flex-grow">{getNotificationTypeLabel(type)}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value !== false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>
          
          {/* Mode Ne pas déranger */}
          <FormField
            control={form.control}
            name="notifications.quietHours.enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Ne pas déranger</FormLabel>
                  <FormDescription>
                    Activez le mode Ne pas déranger pendant certaines heures.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={(checked) => {
                      form.setValue('notifications.quietHours.enabled', checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

// Fonction utilitaire pour obtenir le libellé du type de notification
const getNotificationTypeLabel = (type: string): string => {
  switch (type) {
    case 'system':
      return 'Notifications système';
    case 'emotion':
      return 'Analyses émotionnelles';
    case 'coach':
      return 'Messages du coach';
    case 'journal':
      return 'Journal émotionnel';
    case 'community':
      return 'Activités communautaires';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export default NotificationPreferences;
