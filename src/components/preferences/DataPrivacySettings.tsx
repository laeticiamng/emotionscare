
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UserPreferences } from '@/types/preferences';
import { DataPrivacyProps } from '@/types/music';

const DataPrivacySettings: React.FC<DataPrivacyProps> = ({
  control,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres de confidentialité</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Contrôlez comment vos données sont utilisées et partagées.
        </p>
      </div>

      <FormField
        control={control}
        name="activityTracking"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <FormLabel className="text-base">Suivi d'activité</FormLabel>
              <FormDescription>
                Permettre à l'application de suivre votre utilisation pour améliorer votre expérience
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
        name="dataSharing"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <FormLabel className="text-base">Partage de données anonymisées</FormLabel>
              <FormDescription>
                Permettre le partage de données anonymisées pour améliorer nos services
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

      <FormField
        control={control}
        name="autoScanEnabled"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <FormLabel className="text-base">Scan automatique des émotions</FormLabel>
              <FormDescription>
                Activer la détection automatique des émotions via la caméra ou le microphone
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

export default DataPrivacySettings;
