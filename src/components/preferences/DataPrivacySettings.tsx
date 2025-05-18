
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPreferences } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface DataPrivacySettingsProps {
  control: Control<UserPreferences>;
  isLoading?: boolean;
}

const DataPrivacySettings: React.FC<DataPrivacySettingsProps> = ({ 
  control,
  isLoading = false
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Partage des données</h3>
            
            <FormField
              control={control}
              name="privacy.shareData"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Partager les données d'usage anonymisées</FormLabel>
                    <FormDescription>
                      Aider à améliorer l'application avec des données anonymes
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
                      Masquer les informations personnelles dans les rapports générés
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
              name="privacy.anonymousMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Mode anonyme</FormLabel>
                    <FormDescription>
                      Masquer votre identité aux autres utilisateurs
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
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Visibilité du profil</h3>
            
            <FormField
              control={control}
              name="privacy.profileVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibilité du profil</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir la visibilité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public (Tous les utilisateurs)</SelectItem>
                      <SelectItem value="connections">Mes connexions uniquement</SelectItem>
                      <SelectItem value="team">Mon équipe uniquement</SelectItem>
                      <SelectItem value="private">Privé (Moi uniquement)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Contrôler qui peut voir votre profil et vos informations
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="privacy.shareActivity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Partager mon activité</FormLabel>
                    <FormDescription>
                      Partager votre activité avec votre réseau
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
              name="privacy.shareJournal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Partager mon journal</FormLabel>
                    <FormDescription>
                      Permettre à votre coach de voir votre journal
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPrivacySettings;
