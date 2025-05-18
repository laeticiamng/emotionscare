
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPreferences } from '@/types/preferences';

interface DataPrivacySettingsProps {
  control: Control<UserPreferences, any>;
  isLoading: boolean;
}

const DataPrivacySettings: React.FC<DataPrivacySettingsProps> = ({
  control,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="privacy.shareData"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Partage de données</FormLabel>
              <FormDescription>
                Autoriser le partage anonyme de données pour améliorer nos services
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
        name="privacy.anonymizeReports"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Anonymiser les rapports</FormLabel>
              <FormDescription>
                Anonymiser vos données dans tous les rapports et analyses
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
        name="privacy.profileVisibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibilité du profil</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la visibilité" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Amis uniquement</SelectItem>
                <SelectItem value="private">Privé</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Qui peut voir votre profil et vos informations
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="privacy.anonymousMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Mode anonyme</FormLabel>
              <FormDescription>
                Masquer votre identité dans la communauté
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
      
      {/* Utilisez des noms de propriétés qui existent déjà dans l'interface PrivacyPreference */}
      {/* Nous utilisons l'approche des gestionnaires personnalisés pour shareActivity et shareJournal */}
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <FormLabel>Partage d'activités</FormLabel>
          <FormDescription>
            Autoriser le partage de vos activités avec la communauté
          </FormDescription>
        </div>
        <Switch
          checked={control._formValues.privacy?.shareActivity || false}
          onCheckedChange={(checked) => {
            const currentValues = control._formValues;
            const updatedPrivacy = {
              ...currentValues.privacy,
              shareActivity: checked
            };
            control._formState.dirtyFields.privacy = true;
            control._formValues.privacy = updatedPrivacy;
          }}
          disabled={isLoading}
        />
      </FormItem>
      
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <FormLabel>Partage du journal</FormLabel>
          <FormDescription>
            Autoriser le partage de certaines entrées de journal
          </FormDescription>
        </div>
        <Switch
          checked={control._formValues.privacy?.shareJournal || false}
          onCheckedChange={(checked) => {
            const currentValues = control._formValues;
            const updatedPrivacy = {
              ...currentValues.privacy,
              shareJournal: checked
            };
            control._formState.dirtyFields.privacy = true;
            control._formValues.privacy = updatedPrivacy;
          }}
          disabled={isLoading}
        />
      </FormItem>
    </div>
  );
};

export default DataPrivacySettings;
